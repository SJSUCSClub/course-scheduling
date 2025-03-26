from django.http import HttpResponse, HttpRequest
from django.shortcuts import redirect
import requests
import json
from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth import login, logout
import google_auth_oauthlib.flow
from django.http import JsonResponse
import time
from datetime import timezone
from rest_framework.decorators import api_view, permission_classes
from authentication.utils.refreshToken import refresh
from authentication.permissions import (
    AuthenticatedPermission,
    NotAuthenticatedPermission,
)
import sys
import os
from core.daos import users_insert

CLIENT_SECRETS_FILE = "client_secret.json"
SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
]


def credentials_to_dict(credentials):
    return {
        "token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": credentials.scopes,
    }


# add user to db
# send and create ID token from backend containing user's profile pic,name, etc httponly false so browser can access it
@api_view(["GET"])
@permission_classes([NotAuthenticatedPermission])
def GoogleAuthorize(request: HttpRequest):
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES
    )
    flow.redirect_uri = os.getenv("REDIRECT_URI")
    authorization_url, state = flow.authorization_url(
        access_type="offline", include_granted_scopes="true"
    )

    request.session["state"] = state
    return redirect(authorization_url)


@api_view(["GET"])
@permission_classes([NotAuthenticatedPermission])
def oauth2callback(request: HttpRequest):
    state = request.session["state"]
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES, state=state
    )
    flow.redirect_uri = os.getenv("REDIRECT_URI")
    authorization_response = request.build_absolute_uri()
    flow.fetch_token(authorization_response=authorization_response)
    credentials = flow.credentials
    request.session["credentials"] = credentials_to_dict(credentials)

    url = "https://www.googleapis.com/oauth2/v2/userinfo"
    headers = {
        "Authorization": f"Bearer {credentials.token}",
        "Content-Type": "application/json",
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return JsonResponse(
            {"error": "Failed to get user info"}, status=response.status_code
        )

    user_info = response.json()
    email: str = user_info.get("email")
    first_name = user_info.get("given_name")
    last_name = user_info.get("family_name")
    if not email.endswith("@sjsu.edu"):
        return redirect(os.getenv("FRONTEND_URL") + "/loginfailed")
    id = email.removesuffix("@sjsu.edu")

    user, created = User.objects.get_or_create(email=email, username=id)
    if created:
        users_insert(
            id=id,
            name=first_name + " " + last_name,
            email=email,
            is_professor=False,
        )

    user_data = {"email": email, "first_name": first_name, "last_name": last_name}
    expires_in = credentials.expiry

    # time since epoch
    expires_in_unix = expires_in.replace(tzinfo=timezone.utc).timestamp()

    login(request, user, backend="django.contrib.auth.backends.ModelBackend")
    response = redirect('/')
    domain = os.getenv("SESSION_COOKIE_DOMAIN", None)
    secure = domain is not None
    response.set_cookie(
        "idtoken", credentials.id_token, httponly=True, secure=secure
    )
    response.set_cookie(
        "access_token", credentials.token, httponly=True, secure=secure
    )
    response.set_cookie(
        "refresh_token",
        credentials.refresh_token,
        httponly=True,
        domain=domain,
        secure=secure,
    )
    response.set_cookie(
        "user_data", json.dumps(user_data), domain=domain, secure=secure
    )
    response.set_cookie(
        "token_expiration", expires_in_unix, domain=domain, secure=secure
    )
    response.status_code = 302
    return response


@api_view(["GET"])
@permission_classes([AuthenticatedPermission])
def Logout(request):
    response = redirect('/')
    delete_cookies = [
        "refresh_token",
        "access_token",
        "idtoken",
        "user_data",
        "token_expiration",
    ]
    domain = os.getenv("SESSION_COOKIE_DOMAIN", None)
    for cookie in delete_cookies:
        response.delete_cookie(cookie, path="/", domain=domain)

    return response


@api_view(["POST"])
@permission_classes([AuthenticatedPermission])
def RefreshToken(request):
    refresh_token = request.COOKIES.get("refresh_token")

    response_data = refresh(refresh_token)
    if response_data == None:
        return JsonResponse({"error": "Failed to refresh token"}, status=401)
    new_access_token = response_data.get("access_token")
    new_id_token = response_data.get("id_token")
    expires_in = time.time() + response_data.get("expires_in")

    response = JsonResponse({"message": "Refreshed Tokens"}, status=200)
    domain = os.getenv("SESSION_COOKIE_DOMAIN", None)
    secure = domain is not None
    response.set_cookie(
        "idtoken", new_id_token, httponly=True, domain=domain, secure=secure
    )
    response.set_cookie(
        "access_token", new_access_token, httponly=True, domain=domain, secure=secure
    )
    response.set_cookie("token_expiration", expires_in, domain=domain, secure=secure)
    return response

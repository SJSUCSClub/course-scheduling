import requests
import time
from django.http import JsonResponse
from django.urls import reverse
from authentication.utils.refreshToken import refresh
from django.shortcuts import redirect
import os
from django.http import HttpResponseRedirect


class TokenRefreshMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        # only user endpoints will refresh tokens when accessed
        if not request.path.startswith("/core/users/"):
            return self.get_response(request)
        access_token = request.COOKIES.get("access_token")
        if access_token:
            response = self.get_token_info(request, access_token)
            if not response:
                refresh_token = request.COOKIES.get("refresh_token")
                if not refresh_token:
                    return JsonResponse(
                        {
                            "error": "Invalid Access Token and no refresh token. Should Redirect to Login Screen."
                        },
                        status=401,
                    )
                response_data = refresh(refresh_token)
                if response_data == None:
                    return JsonResponse(
                        {
                            "error": "Invalid Access and Refresh Token. Should Redirect to Login Screen."
                        },
                        status=401,
                    )

                new_access_token = response_data.get("access_token")
                new_id_token = response_data.get("id_token")
                expires_in = time.time() + response_data.get("expires_in")

                self.get_token_info(request, new_access_token)

                response = self.get_response(request)
                domain = os.getenv("SESSION_COOKIE_DOMAIN", None)
                secure = domain is not None
                response.set_cookie(
                    "idtoken", new_id_token, httponly=True, domain=domain, secure=secure
                )
                response.set_cookie(
                    "access_token",
                    new_access_token,
                    httponly=True,
                    domain=domain,
                    secure=secure,
                )
                response.set_cookie(
                    "token_expiration", expires_in, domain=domain, secure=secure
                )
                return response
        return self.get_response(request)

    def get_token_info(self, request, access_token):
        try:
            response = requests.get(
                f"https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={access_token}"
            )
            if response.status_code == 200:
                response = response.json()
                request.token_res = response
                return response
            return None
        except Exception as e:
            print(f"Error fetching token info: {e}")
            return None

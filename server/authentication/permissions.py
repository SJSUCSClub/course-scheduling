from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed, NotFound, PermissionDenied
from authentication.exceptions import InternalServerError
from rest_framework.permissions import BasePermission
from django.db import connection
from core.daos import fetchone
import requests

User = get_user_model()


class AuthenticatedPermission(BasePermission):
    def has_permission(self, request, view):
        try:
            # so they cant just take the tokens and use them when not logged in (i dont have a good way to test this so i'm going to leave this commented for now)
            # if not request.user.is_authenticated:
            #     raise PermissionDenied('User is not logged in')
            if request.path.startswith("/google/") or request.path.startswith(
                "/admin/"
            ):
                token_info = checkToken(request.COOKIES.get("access_token"))
            else:
                if not hasattr(request, "token_res"):
                    raise AuthenticationFailed("No access token.")
                token_info = request.token_res
            email = token_info.get("email")
            if not email:
                raise AuthenticationFailed("Invalid token: email missing")
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                raise NotFound("User not found")
            request.user = user
            return True
        except (AuthenticationFailed, NotFound) as e:
            raise e
        except Exception as e:
            raise AuthenticationFailed("Authentication error.")


class NotAuthenticatedPermission(BasePermission):
    def has_permission(self, request, view):
        access_token = request.COOKIES.get("access_token")
        if not access_token:
            return True
        res = checkToken(access_token)
        return "error" in res or ""


class BaseAdminPermission(BasePermission):
    def get_user_id(self, request):
        if not request.user or not request.user.is_authenticated:
            return None
        return request.user.email.removesuffix("@sjsu.edu")

    def is_admin(self, user_id, role=None):
        query = "SELECT 1 FROM admins WHERE user_id = %s"
        params = (user_id,)

        if role:
            query += " AND admin_role = %s"
            params += (role,)
        result = fetchone(query, *params)
        return result is not None


class ModeratorPermission(BaseAdminPermission):
    def has_permission(self, request, view):
        user_id = self.get_user_id(request)
        return user_id and self.is_admin(user_id)


class AdminPermission(BaseAdminPermission):
    def has_permission(self, request, view):
        user_id = self.get_user_id(request)
        return user_id and self.is_admin(user_id, role="Administrator")


def checkToken(access_token):
    try:
        response = requests.get(
            f"https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={access_token}"
        )
        if response.status_code == 200:
            response = response.json()
            return response
        return None
    except:
        print(f"Error during token validation")
        return None

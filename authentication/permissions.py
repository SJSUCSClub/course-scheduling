from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.exceptions import NotAuthenticated, NotFound, PermissionDenied
from authentication.exceptions import InternalServerError
from rest_framework.permissions import BasePermission
from django.db import connection
from core.daos import fetchone
import requests
User = get_user_model()

class AuthenticatedPermission(BasePermission):
    def has_permission(self, request, view):
        try:
            #so they cant just take the tokens and use them when not logged in (i dont have a good way to test this so i'm going to leave this commented for now)
            # if not request.user.is_authenticated:
            #     raise PermissionDenied('User is not logged in')
            if request.path.startswith("/google/") or request.path.startswith("/admin/"):
                token_info = checkToken(request.COOKIES.get('access_token'))
            else:
                token_info = request.token_res
            email = token_info.get('email')
            if not email:
                raise InternalServerError()
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                raise NotFound('User not found')
            request.user = user
            return True
        except:
            raise InternalServerError()
        
class NotAuthenticatedPermission(BasePermission):
    def has_permission(self, request, view):
        access_token = request.COOKIES.get('access_token')
        if not access_token:
            return True
        res = checkToken(access_token)
        return 'error' in res
    
class AdminPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        user_id = request.user.email.removesuffix("@sjsu.edu")
        query = """
            SELECT 1 FROM admins WHERE user_id = %s AND admin_role = 'Administrator'
        """
        result = fetchone(query,(user_id,))
        return result is not None
    
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
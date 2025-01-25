from rest_framework.decorators import api_view, permission_classes
from authentication.permissions import AuthenticatedPermission, AdminPermission
from django.http import JsonResponse
from core.views.utils import validate_user, validate_body
from admin.services.admins import (
    is_admin,
    admin_manage_moderator
)


@api_view(["GET"])
@permission_classes([AuthenticatedPermission])
def verify_view(request):
    user_id = validate_user(request)
    response_data = {"isAdmin": is_admin(user_id)}
    return JsonResponse(response_data)

    
@api_view(["GET"])
@permission_classes([AuthenticatedPermission,AdminPermission])
def flagged_reviews_view(request):
    return

@api_view(["POST"])
@permission_classes([AuthenticatedPermission,AdminPermission])
def manage_review_view(request,review_id):
    return

@api_view(["POST"])
@permission_classes([AuthenticatedPermission,AdminPermission])
def manage_moderator_view(request):
    data = validate_body(request)
    results = admin_manage_moderator(data)
    return JsonResponse(results)
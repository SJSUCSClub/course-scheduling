from rest_framework.decorators import api_view, permission_classes
from authentication.permissions import AuthenticatedPermission, AdminPermission
from django.http import JsonResponse

@api_view(["GET"])
@permission_classes([AuthenticatedPermission])
def verify_view(request):
    return

@api_view(["GET"])
@permission_classes([AuthenticatedPermission,AdminPermission])
def flagged_reviews_view(request):
    return

@api_view(["POST"])
@permission_classes([AuthenticatedPermission,AdminPermission])
def manage_review_view(request):
    return

@api_view(["POST"])
@permission_classes([AuthenticatedPermission,AdminPermission])
def manage_moderator_view(request):
    return
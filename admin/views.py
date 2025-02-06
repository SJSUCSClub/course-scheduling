from rest_framework.decorators import api_view, permission_classes
from authentication.permissions import (
    AuthenticatedPermission,
    AdminPermission,
    ModeratorPermission,
)
from django.http import JsonResponse
from core.views.utils import validate_user, validate_body, validate_page_limit, try_response
from admin.services.admins import (
    check_admin,
    admin_manage_moderator,
    get_paginated_flagged_reviews,
    manage_flagged_review,
    get_admins_list,
)


@api_view(["GET"])
@permission_classes([AuthenticatedPermission])
@try_response
def verify_view(request):
    user_id = validate_user(request)
    return JsonResponse(check_admin(user_id))


@api_view(["GET"])
@permission_classes([AuthenticatedPermission, ModeratorPermission])
@try_response
def flagged_reviews_view(request):
    json_data = get_paginated_flagged_reviews(
        flag_status=request.GET.get("status") or "Pending",
        **validate_page_limit(request),
    )

    return JsonResponse(json_data)


@api_view(["POST"])
@permission_classes([AuthenticatedPermission, ModeratorPermission])
@try_response
def manage_review_view(request, review_id):
    results = manage_flagged_review(review_id=review_id, action=request.data["action"])
    return JsonResponse(results)


@api_view(["POST"])
@permission_classes([AuthenticatedPermission, AdminPermission])
@try_response
def manage_moderator_view(request):
    data = validate_body(request)
    results = admin_manage_moderator(data)
    return JsonResponse(results)


@api_view(["GET"])
@permission_classes([AuthenticatedPermission, AdminPermission])
@try_response
def list_view(request):
    # validate view-specific parameters
    sort_by = request.GET.get("sort_by", None)
    if sort_by is None or sort_by not in {"user_id", "created_at"}:
        sort_by = "user_id"  # default is sort by id
    sort_order = request.GET.get("sort_order", None)
    if sort_order is None or sort_order not in {"ASC", "DESC"}:
        sort_order = "ASC"

    json_data = get_admins_list(
        sort_by=sort_by,
        sort_order=sort_order,
        query=request.GET.get("query", None),
        **validate_page_limit(request),
    )

    return JsonResponse(json_data)

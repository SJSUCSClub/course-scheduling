from rest_framework.decorators import api_view, permission_classes
from authentication.permissions import AuthenticatedPermission
from django.http import JsonResponse
from core.daos.utils import delete, get
from .utils import try_response, validate_body, validate_user, check_flag_immunity
from core.decorators import check_profanity
from core.services.users import (
    get_user_profile,
    get_existing_review,
    insert_review,
    update_review,
    insert_comment,
    update_comment,
    insert_review_flag,
    update_review_flag,
    insert_vote,
    insert_comment_flag,
    update_comment_flag
)


@api_view(["GET"])
@permission_classes([AuthenticatedPermission])
@try_response
def user_profile(request):
    json_data = get_user_profile(
        user_id = validate_user(request)
    )
    return JsonResponse(json_data, safe=False)


@api_view(["POST"])
@permission_classes([AuthenticatedPermission])
@try_response
@check_profanity
def post_review(request):
    user_id = validate_user(request)
    data = validate_body(request)
    existing_review = get_existing_review(user_id, data)
    if existing_review:
        return JsonResponse({"message": "You have already posted a review for this course professor pair."}, status=400)
    results = insert_review(user_id, data)
    return JsonResponse(results, safe=False)

def put_review(request, review_id):
    user_id = validate_user(request)
    data = validate_body(request)
    results = update_review(user_id, review_id, **data)
    return JsonResponse(results, safe=False)


def delete_review(request, review_id):
    user_id = validate_user(request)
    results = delete("reviews", {"user_id": user_id, "id": review_id})
    return JsonResponse(results, safe=False)


@api_view(["PUT", "DELETE"])
@permission_classes([AuthenticatedPermission])
@try_response
@check_profanity
def review_query(request, review_id):
    if request.method == "PUT":
        return put_review(request, review_id)
    elif request.method == "DELETE":
        return delete_review(request, review_id)


@api_view(["POST"])
@permission_classes([AuthenticatedPermission])
@try_response
@check_profanity
def post_comment(request):
    user_id = validate_user(request)
    data = validate_body(request)
    review_id, content = data["review_id"], data["content"]
    results = insert_comment(user_id, review_id, content)
    return JsonResponse(results, safe=False)


def put_comment(request):
    review_id, comment_id = request.GET.get("review_id"), request.GET.get("comment_id")
    user_id = validate_user(request)
    data = validate_body(request)
    content = data["content"]
    results = update_comment(user_id,comment_id,review_id,content)
    return JsonResponse(results, safe=False)


def delete_comment(request):
    review_id, comment_id = request.GET.get("review_id"), request.GET.get("comment_id")
    user_id = validate_user(request)
    results = delete(
        "comments", {"user_id": user_id, "review_id": review_id, "id": comment_id}
    )
    return JsonResponse(results, safe=False)


@api_view(["PUT", "DELETE"])
@permission_classes([AuthenticatedPermission])
@try_response
@check_profanity
def comment_query(request):
    if request.method == "PUT":
        return put_comment(request)
    elif request.method == "DELETE":
        return delete_comment(request)


@api_view(["POST"])
@permission_classes([AuthenticatedPermission])
@try_response
@check_profanity
def post_flagged_review(request):
    user_id = validate_user(request)
    data = validate_body(request)
    review_id, reason = data['review_id'], data['reason']
    review = get("reviews", {"id": review_id})[0]
    flag_immunity = check_flag_immunity(review)
    if flag_immunity:
        return JsonResponse({"message": "This review has already been checked by the admins so it cannot be flagged at this time."}, status=409)
    results = insert_review_flag(user_id, review_id, reason)
    return JsonResponse(results, safe=False)


def put_review_flag(request):
    review_id, flag_id = request.GET.get("review_id"), request.GET.get("flag_id")
    user_id = validate_user(request)
    data = validate_body(request)
    reason = data['reason']
    results = update_review_flag(user_id, flag_id, review_id, reason)
    return JsonResponse(results, safe=False)


def delete_review_flag(request):
    review_id, flag_id = request.GET.get("review_id"), request.GET.get("flag_id")
    user_id = validate_user(request)
    results = delete(
        "flag_reviews", {"user_id": user_id, "review_id": review_id, "id": flag_id}
    )
    return JsonResponse(results, safe=False)


@api_view(["PUT", "DELETE"])
@permission_classes([AuthenticatedPermission])
@try_response
@check_profanity
def flagged_review_query(request):
    if request.method == "PUT":
        return put_review_flag(request)
    elif request.method == "DELETE":
        return delete_review_flag(request)


@api_view(["POST"])
@permission_classes([AuthenticatedPermission])
@try_response
def post_vote(request):
    user_id = validate_user(request)
    data = validate_body(request)
    review_id, vote = data["review_id"], data["vote"]
    results = insert_vote(user_id, review_id, vote)
    return JsonResponse(results, safe=False)

@api_view(["POST"])
@permission_classes([AuthenticatedPermission])
@try_response
@check_profanity
def post_flagged_comment(request):
    user_id = validate_user(request)
    data = validate_body(request)
    comment_id, reason = data['comment_id'], data['reason']
    comment = get("comments", {"id": comment_id})[0]
    flag_immunity = check_flag_immunity(comment)
    if flag_immunity:
        return JsonResponse({"message": "This comment has already been checked by the admins so it cannot be flagged at this time."}, status=409)
    results = insert_comment_flag(user_id, comment_id, reason)
    return JsonResponse(results, safe=False)

def put_comment_flag(request):
    comment_id, flag_id = request.GET.get("comment_id"), request.GET.get("flag_id")
    user_id = validate_user(request)
    data = validate_body(request)
    reason = data['reason']
    results = update_comment_flag(user_id, flag_id, comment_id, reason)
    return JsonResponse(results, safe=False)


def delete_comment_flag(request):
    comment_id, flag_id = request.GET.get("comment_id"), request.GET.get("flag_id")
    user_id = validate_user(request)
    results = delete(
        "flag_reviews", {"user_id": user_id, "comment_id": comment_id, "id": flag_id}
    )
    return JsonResponse(results, safe=False)

@api_view(["PUT", "DELETE"])
@permission_classes([AuthenticatedPermission])
@try_response
@check_profanity
def flagged_comments_query(request):
    if request.method == "PUT":
        return put_comment_flag(request)
    elif request.method == "DELETE":
        return delete_comment_flag(request)


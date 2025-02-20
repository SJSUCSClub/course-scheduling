from django.http.response import JsonResponse
from rest_framework.decorators import api_view
from core.services import get_review_comments, get_review
from .utils import try_response


@api_view(["GET"])
@try_response
def review_comments_view(request, review_id):
    json_data = get_review_comments(review_id=review_id)
    return JsonResponse(json_data, safe=False)


@api_view(["GET"])
@try_response
def get_review_view(request, review_id):
    results = get_review(review_id=review_id)
    return JsonResponse(results, safe=False)

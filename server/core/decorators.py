from functools import wraps
from django.http import JsonResponse
from core.views.utils import content_check


def check_profanity(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        data = request.data
        content = data.get("content")
        reason = data.get("reason")
        value_to_check = content or reason
        if value_to_check and content_check(value_to_check):
            return JsonResponse(
                {"message": "Content contains inappropriate language."}, status=400
            )
        return func(request, *args, **kwargs)

    return wrapper

from admin.daos.admins import (
    admin_select,
    admin_select_counts,
    add_moderator,
    remove_moderator,
    flagged_reviews_select_counts,
    flagged_reviews_select,
    flagged_comments_select_counts,
    flagged_comments_select,
    remove_flagged_review,
    keep__flagged_review,
    remove_flagged_comment,
    keep__flagged_comment,
)
import math


def check_admin(user_id: str):
    matches = admin_select(user_id=user_id)
    if len(matches) == 1:
        return {"isAdmin": True, "role": matches[0]["admin_role"]}
    return {"isAdmin": False}


def admin_manage_moderator(data):
    if data["action"]:
        return add_moderator(data["user_id"])
    else:
        return remove_moderator(data["user_id"])


def get_paginated_flagged_reviews(
    flag_status: str, limit: int = None, page: int = None
):
    total_results = flagged_reviews_select_counts(status=flag_status)
    return {
        "items": flagged_reviews_select(status=flag_status, page=page, limit=limit),
        "total_results": total_results,
        "page": page,
        "pages": total_results // limit + (1 if total_results % limit > 0 else 0),
    }


def get_paginated_flagged_comments(
    flag_status: str, limit: int = None, page: int = None
):
    total_results = flagged_comments_select_counts(status=flag_status)
    return {
        "items": flagged_comments_select(status=flag_status, page=page, limit=limit),
        "total_results": total_results,
        "page": page,
        "pages": total_results // limit + (1 if total_results % limit > 0 else 0),
    }


def manage_flagged_review(review_id: int, action: bool):
    if action:
        return remove_flagged_review(review_id)
    else:
        return keep__flagged_review(review_id)


def manage_flagged_comment(comment_id: int, action: bool):
    if action:
        return remove_flagged_comment(comment_id)
    else:
        return keep__flagged_comment(comment_id)


def get_admins_list(
    limit: int, page: int, sort_by: str, sort_order: str, query: str = None
):
    items = admin_select(sort_by, sort_order, query, limit=limit, page=page)
    total_results = admin_select_counts(query=query)[0]["count"]
    return {
        "total_results": total_results,
        "pages": math.ceil(total_results / limit),
        "page": page,
        "items": items,
    }

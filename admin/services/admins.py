from admin.daos.admins import (
    admin_select, 
    add_moderator, 
    remove_moderator,
    flagged_reviews_select_counts,
    flagged_reviews_select,
    remove_flagged_review,
    keep__flagged_review
)

def is_admin(user_id):
    return bool(admin_select(user_id))

def admin_manage_moderator(data):
    if data["action"]:
        return add_moderator(data["user_id"])
    else:
        return remove_moderator(data["user_id"])


def get_paginated_flagged_reviews(
    flag_status: str, limit: int = None, page: int = None
):
    total_results = flagged_reviews_select_counts(status= flag_status)
    return {
        "items": flagged_reviews_select(status= flag_status, page=page, limit=limit),
        "total_results": total_results,
        "page": page,
        "pages": total_results // limit + (1 if total_results % limit > 0 else 0),
    }

def manage_flagged_review(
    review_id: int, action: bool
):
    if action:
        return remove_flagged_review(review_id)
    else:
        return keep__flagged_review(review_id)
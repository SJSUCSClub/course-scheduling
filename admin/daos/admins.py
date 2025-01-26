from datetime import datetime, timedelta
from core.daos.utils import (
    fetchone, 
    fetchone_as_dict, 
    fetchall, 
    insert, 
    delete, 
    to_where,
    update
)
def admin_select(admin_id):
    query = "SELECT user_id FROM admins WHERE user_id = %s"
    return fetchone(query, admin_id)

def add_moderator(user_id):
    return insert(
        "admins",
        {
            "user_id": user_id,
            "admin_role":"Moderator"
        },
    )
def remove_moderator(user_id):
    return delete(
        "admins",
        {
            "user_id": user_id,
            "admin_role":"Moderator"
        },
    )

def flagged_reviews_select_counts(
    status: str = None,
) -> int:
    args = locals()
    query = "SELECT COUNT(*) FROM flag_reviews" + to_where(**args)
    return fetchone(query, *list(filter(lambda x: x is not None, args.values())))[0]

def flagged_reviews_select(
    status: str = None,
    limit: int = None, 
    page: int = None      
):
    args = locals()
    page = args.pop("page")
    limit = args.pop("limit")
    query_reviews = (
        "SELECT r.*, JSON_AGG(fr) AS flags "
        + "FROM reviews r "
        + "LEFT JOIN flag_reviews fr ON fr.review_id = r.id "
        + to_where(**args, table_name="fr")
        + " GROUP BY r.id"
    )

    if page and limit:
        query_reviews += f" LIMIT {limit} OFFSET {(page - 1 ) * limit}"
    return fetchall(query_reviews, *list(filter(lambda x: x is not None, args.values())))

def remove_flagged_review(review_id: int):
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    update(
        "flag_reviews",
        {
            "status": "Approved",
        },
        {"review_id": review_id},
    )
    return update(
        "reviews",
        {
            "deleted_at": current_time,
            "flag_immune_until": current_time
        },
        {"id": review_id},
    )

def keep__flagged_review(review_id: int):
    immune_until = (datetime.now() + timedelta(days=6*30)).strftime('%Y-%m-%d %H:%M:%S')
    update(
        "flag_reviews",
        {
            "status": "Declined",
        },
        {"review_id": review_id},
    )
    return update(
        "reviews",
        {
            "flag_immune_until": immune_until,
            "deleted_at": None
        },
        {"id": review_id},
    )

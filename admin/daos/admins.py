from datetime import datetime, timedelta
from core.daos.utils import fetchone, fetchall, insert, delete, to_where, update


def admin_select(
    sort_by: str,
    sort_order: str,
    query: str = None,
    user_id: str = None,
    limit: int = None,
    page: int = None,
):
    """
    Searches all administrators for a match, returning a list
    of matching administrators

    Args:
        query: Optional[str] - a string close to the user id to search for
        user_id: Optional[str] - the specific user id to search for
        limit: Optional[int] - how many results to return
        page: Optional[int] - the page to fetch
    """

    sql_query = "SELECT * FROM admins"
    if query is not None:
        sql_query += " WHERE similarity(user_id, %s) > 0.2 " + to_where(
            prefix=False, user_id=user_id
        )
    else:
        sql_query += to_where(user_id=user_id)
    sql_query += f" ORDER BY {sort_by} {sort_order}"
    if page and limit:
        sql_query += f" LIMIT {limit} OFFSET {(page-1)*limit}"
    return fetchall(sql_query, *[item for item in [user_id, query] if item is not None])


def admin_select_counts(
    query: str = None,
    user_id: str = None,
):
    """
    Searches all administrators for a match, returning a list
    of matching administrators

    Args:
        query: Optional[str] - a string close to the user id to search for
        user_id: Optional[str] - the specific user id to search for
    """

    sql_query = "SELECT COUNT(*) FROM admins"
    if query is not None:
        sql_query += " WHERE similarity(user_id, %s) > 0.2 " + to_where(
            prefix=False, user_id=user_id
        )
    else:
        sql_query += to_where(user_id=user_id)
    return fetchall(sql_query, *[item for item in [user_id, query] if item is not None])


def add_moderator(user_id):
    return insert(
        "admins",
        {"user_id": user_id, "admin_role": "Moderator"},
    )


def remove_moderator(user_id):
    return delete(
        "admins",
        {"user_id": user_id, "admin_role": "Moderator"},
    )


def flagged_reviews_select_counts(
    status: str = None,
) -> int:
    args = locals()
    query = "SELECT COUNT(*) FROM flag_reviews" + to_where(**args)
    return fetchone(query, *list(filter(lambda x: x is not None, args.values())))[0]


def flagged_reviews_select(status: str = None, limit: int = None, page: int = None):
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
    return fetchall(
        query_reviews, *list(filter(lambda x: x is not None, args.values()))
    )


def remove_flagged_review(review_id: int):
    return delete(
        "reviews",
        {
            "id": review_id,
        },
    )


def keep__flagged_review(review_id: int):
    immune_until = (datetime.now() + timedelta(days=6 * 30)).strftime(
        "%Y-%m-%d %H:%M:%S"
    )
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
        },
        {"id": review_id},
    )

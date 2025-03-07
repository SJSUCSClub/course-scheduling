from datetime import datetime, timedelta
from core.daos.utils import fetchone, fetchall, insert, delete, to_where, update
from core.daos.reviews import process_tags
from collections import defaultdict


def admin_select(
    sort_by: str = "user_id",
    sort_order: str = "ASC",
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
    if query:  # query is not None and len(query) > 0
        sql_query += " WHERE similarity(user_id, %s) > 0.2 " + to_where(
            prefix=False, user_id=user_id
        )
    else:
        sql_query += to_where(user_id=user_id)
    sql_query += f" ORDER BY {sort_by} {sort_order}"
    if page and limit:
        sql_query += f" LIMIT {limit} OFFSET {(page-1)*limit}"
    return fetchall(sql_query, *[item for item in [query, user_id] if item])


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
    query = "SELECT COUNT(DISTINCT review_id) FROM flag_reviews" + to_where(**args)
    return fetchone(query, *list(filter(lambda x: x is not None, args.values())))[0]


def flagged_reviews_select(status: str = None, limit: int = None, page: int = None):
    args = locals()
    page = args.pop("page")
    limit = args.pop("limit")
    # guaranteed unique id per review, thus guaranteed unique name, username, ...
    # for that review
    query_reviews = (
        "SELECT r.*, u.name AS reviewer_name, u.username AS reviewer_username, p.id AS professor_id, p.name AS professor_name, p.email AS professor_email, JSON_AGG(fr) AS flags "
        + "FROM reviews r "
        + "LEFT JOIN (SELECT * FROM flag_reviews inner_fr LEFT JOIN users inner_u ON inner_fr.user_id = inner_u.id) AS fr ON fr.review_id = r.id "
        + "LEFT JOIN users u ON r.user_id = u.id "
        + "LEFT JOIN users p ON r.professor_id = p.id "
        + to_where(**args, table_name="fr")
        + " GROUP BY (r.id, u.name, u.username, p.id, p.name, p.email)"
    )

    if page and limit:
        query_reviews += f" LIMIT {limit} OFFSET {(page - 1 ) * limit}"
    ret = fetchall(query_reviews, *list(filter(lambda x: x is not None, args.values())))

    for el in ret:
        el["tags"] = process_tags(el["tags"])
    return ret


def flagged_comments_select_counts(
    status: str = None,
) -> int:
    args = locals()
    query = "SELECT COUNT(DISTINCT comment_id) FROM flag_comments" + to_where(**args)
    return fetchone(query, *list(filter(lambda x: x is not None, args.values())))[0]


def flagged_comments_select(status: str = None, limit: int = None, page: int = None):
    args = locals()
    page = args.pop("page")
    limit = args.pop("limit")
    query_reviews = (
        "SELECT c.*, u.name AS commenter_name, u.username AS commenter_username, JSON_AGG(fc) AS flags "
        + "FROM comments c "
        + "LEFT JOIN (SELECT * FROM flag_comments inner_fc LEFT JOIN users inner_u ON inner_fc.user_id = inner_u.id) AS fc ON fc.comment_id = c.id "
        + "LEFT JOIN users u ON c.user_id = u.id "
        + to_where(**args, table_name="fc")
        + " GROUP BY (c.id, u.name, u.username)"
    )

    if page and limit:
        query_reviews += f" LIMIT {limit} OFFSET {(page - 1 ) * limit}"
    ret = fetchall(query_reviews, *list(filter(lambda x: x is not None, args.values())))
    grouped_by_review = defaultdict(list)
    for item in ret:
        grouped_by_review[item["review_id"]].append(item)
        del item["review_id"]
    result = [
        {"review_id": review_id, "comments": ids}
        for review_id, ids in grouped_by_review.items()
    ]
    return result


def remove_flagged_review(review_id: int):
    return delete("reviews", {"id": review_id})


def keep__flagged_review(review_id: int):
    immune_until = (datetime.now() + timedelta(days=6 * 30)).strftime(
        "%Y-%m-%d %H:%M:%S"
    )
    update("flag_reviews", {"status": "Declined"}, {"review_id": review_id})
    return update("reviews", {"flag_immune_until": immune_until}, {"id": review_id})


def remove_flagged_comment(comment_id: int):
    return delete("comments", {"id": comment_id})


def keep__flagged_comment(comment_id: int):
    immune_until = (datetime.now() + timedelta(days=6 * 30)).strftime(
        "%Y-%m-%d %H:%M:%S"
    )
    update("flag_comments", {"status": "Declined"}, {"comment_id": comment_id})
    return update("comments", {"flag_immune_until": immune_until}, {"id": comment_id})

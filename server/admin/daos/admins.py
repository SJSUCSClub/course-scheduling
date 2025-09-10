from datetime import datetime, timedelta
from core.daos.courses import course_search_by_filters
from core.daos.departments import departments_search_by_filters
from core.daos.professors import professor_search_by_id 
from core.daos.users import users_insert
from core.daos.utils import fetchone, fetchall, insert, delete, to_where, update, export_table_to_csv
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
        + "LEFT JOIN (SELECT inner_fc.*, inner_u.name AS name, inner_u.email AS email, inner_u.username AS username, inner_u.is_professor AS is_professor FROM flag_comments inner_fc LEFT JOIN users inner_u ON inner_fc.user_id = inner_u.id) AS fc ON fc.comment_id = c.id "
        + "LEFT JOIN users u ON c.user_id = u.id "
        + to_where(**args, table_name="fc")
        + " GROUP BY (c.id, u.name, u.username)"
    )

    if page and limit:
        query_reviews += f" LIMIT {limit} OFFSET {(page - 1 ) * limit}"
    ret = fetchall(query_reviews, *list(filter(lambda x: x is not None, args.values())))
    print(ret)
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

def remove_previous_schedules():
    return delete(table_name="schedules",where={"1":"1"})



def export_schedules_to_csv(export_path:str):
    return export_table_to_csv(table_name="schedules",export_path=export_path)


def insert_department(abbr_dept:str, name:str ):
    return insert(table_name="departments",data={"abbr_dept":abbr_dept,"name":name})


def insert_course(course_number:str,course_title:str,department:str,satisfies_area:str, units:str):
    return insert(table_name="courses",data={"course_number":course_number,"name":course_title,"department":department, "satisfies_area":satisfies_area,"units":units}) 


def insert_professor(name:str,id:str,email:str):
    return users_insert(name=name,id=id,email=email,is_professor=True)


def check_department_exists(abbr_dept:str):
    return departments_search_by_filters(abbr_dept=abbr_dept)


def check_course_exists(department:str,course_number:str):
    return course_search_by_filters(department=department,course_number=course_number)#checking if course exists


def check_professor_exists(professor_id:str):
    return professor_search_by_id(id=professor_id)


def update_schedule(
        term: str,
        year: int,
        class_number: int,
        course_number: str,
        section: str,
        days: str,
        dates: str,
        times: str,
        class_type: str,
        units: int,
        location: str,
        mode_of_instruction: str,
        satisfies_area:str,
        professor_id:str,
        department: str,
):
    args = locals()
    if args['professor_id'] == "":
        args.pop('professor_id')

    return insert(table_name="schedules",data=args)




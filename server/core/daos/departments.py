from .utils import fetchall, to_where


def departments_select_all():
    query = """
        SELECT d.abbr_dept, d.name, COUNT(*) FROM departments d
        LEFT JOIN courses c ON c.department = d.abbr_dept
        GROUP BY abbr_dept
        ORDER BY abbr_dept ASC
    """
    return fetchall(query)


def departments_search_by_filters(
    abbr_dept: str = None,
    name: str = None,
    limit: int = None,
    page: int = None,
):
    """
    Select departments from the database with any of the given filters

    Args:
        abbr_dept: string - the department abrivation 
        name: string - the department name
        limit: int - the number of results to return per page; only effective if page is also provided
        page: int - the 1-indexed page number; only effective if limit is also provided

    Returns:
        out: List[dict] - A list of departments
    """
    args = locals()
    page = args.pop("page")
    limit = args.pop("limit")
    query = "SELECT * FROM departments" + to_where(**args)

    if page and limit:
        query += f" LIMIT {limit} OFFSET {(page - 1 ) * limit}"

    return fetchall(query, *list(filter(lambda x: x is not None, args.values())))
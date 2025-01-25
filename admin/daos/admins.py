from core.daos.utils import fetchone, fetchone_as_dict, fetchall, insert, delete
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
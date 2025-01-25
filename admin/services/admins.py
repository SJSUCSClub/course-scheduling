from admin.daos.admins import admin_select, add_moderator, remove_moderator

def is_admin(user_id):
    return bool(admin_select(user_id))

def admin_manage_moderator(data):
    if data["action"]:
        return add_moderator(data["user_id"])
    else:
        return remove_moderator(data["user_id"])

from .s3 import upload_to_bucket 
from admin.helper import scrape_departments
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
    update_schedule,
    remove_previous_schedules,
    export_schedules_to_csv,
    check_department_exists,
    insert_department,
    check_course_exists,
    insert_course,
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

def update_schedules(schedules,file):
    try:
        update_schedules=[]
        for schedule in schedules:
            update_schedules.append(schedule.dict())
        file_path = "./"
        bucket_name='course-scheduling-previous-schedules'
        export_schedules_to_csv(export_path=file_path+file)
        upload_to_bucket(bucket_name=bucket_name,file_path=file_path,file=file)
        remove_previous_schedules()
        for data in update_schedules:
            if data['section'] == 'None':#this only happens for 3 classes class ID:  48997, 49390, 47712  
                continue
            abbr_dept = data['department']
            course_number = data['course']

            if not check_department_exists(abbr_dept=abbr_dept):
                department_name = scrape_departments(abbr_dept=abbr_dept)
                insert_department(abbr_dept=abbr_dept,name=department_name)

            if not check_course_exists(department=abbr_dept,course_number=course_number):
                print("COURSE_NUMBER:",course_number)
                insert_course(course_number=course_number,course_title=data['course_title'],department=abbr_dept, satisfies_area=data['satisfies'],units=data['units'])

            update_schedule(
                term=data['term'],
                year=data['year'],
                class_number=data['class_number'],
                course_number=data['course'],
                section=str(int(data['section'])),
                days=data['days'],
                dates=data['dates'],
                times=data['times'],
                class_type=data['class_type'],
                units=data['units'],
                location=data['location'],
                mode_of_instruction=data['mode_of_instruction'],
                satisfies_area=data['satisfies'],
                professor_email= data['instructorEmail'],
                department=data['department']
                )
        return {"message":"Successfully updated schedules"}
    except Exception as e:
        return {"message":f"Error while updating schedules: {str(e)}"}


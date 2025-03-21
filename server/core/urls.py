from django.urls import path
from . import views

urlpatterns = [
    ##### HEALTH ENDPOINT ####
    path("health", views.health_check, name="health"),
    ##### SEARCH ENDPOINTS ########
    path("courses/search", views.course_search_view),
    path(
        "courses/<str:department>-<str:course_number>/summary",
        views.course_summary_view,
    ),
    path(
        "courses/<str:department>-<str:course_number>/reviews-stats",
        views.course_reviews_stats_view,
    ),
    path(
        "courses/<str:department>-<str:course_number>/schedules",
        views.course_schedules_view,
    ),
    path(
        "courses/<str:department>-<str:course_number>/reviews",
        views.course_reviews_view,
    ),
    path("courses/highest_rated", views.course_highest_rated_view),
    #     path('courses/<str:course>/reviews/comments', views.review_comments),
    #     ############### professor paths ###################
    path("professors/<str:professor_id>/summary", views.professor_summary_view),
    path("professors/<str:professor_id>/schedules", views.professor_schedules_view),
    path(
        "professors/<str:professor_id>/reviews-stats",
        views.professor_reviews_stats_view,
    ),
    path("professors/<str:professor_id>/reviews", views.professor_reviews_view),
    path("professors/search", views.professor_search_view),
    path("professors/highest_rated", views.professor_highest_rated_view),
    #     ############## schedule search ####################
    path("schedules/search", views.schedule_search_view),
    #     ############## departments paths ####################
    path("departments", views.departments_view),
    #     ############## reviews paths ####################
    path("reviews/<str:review_id>", views.get_review_view),
    path("reviews/<str:review_id>/comments", views.review_comments_view),
    #     ############## users paths ####################
    path("users/profile", views.user_profile),
    path("users/reviews", views.post_review),
    path("users/comments", views.post_comment),
    path("users/flagged_reviews", views.post_flagged_review),
    path("users/flagged_comments", views.post_flagged_comment),
    path("users/vote", views.post_vote),
    path("users/reviews/<int:review_id>", views.review_query),
    path("users/reviews/comments", views.comment_query),
    path("users/reviews/flagged_reviews", views.flagged_review_query),
    path("users/comments/flagged_comments", views.flagged_comments_query),
]

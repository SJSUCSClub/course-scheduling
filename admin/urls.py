from django.urls import path
from . import views

urlpatterns = [
    path("verify", views.verify_view),
    path("flagged-reviews", views.flagged_reviews_view),
    path("flagged-comments", views.flagged_comments_view),
    path("reviews/<int:review_id>/manage", views.manage_review_view),
    path("comments/<int:comment_id>/manage", views.manage_comment_view),
    path("manage-moderator", views.manage_moderator_view),
    path("list", views.list_view),
]

from django.urls import path
from . import views

urlpatterns = [
    path("verify", views.verify_view),
    path("flagged-reviews", views.flagged_reviews_view),
    path("reviews/<str:review_id>/manage", views.manage_review_view),
    path("manageModerator", views.manage_moderator_view)
]

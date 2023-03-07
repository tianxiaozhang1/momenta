from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from moments import views

from profiles import views as ProfileViews

# from profiles.views import profile_detail_api_view
from .views import MyTokenObtainPairView
# from profiles.views import follow

from profiles.views import RegisterView#, FollowerView#, FollowingList

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'moments', views.MomentViewSet, basename="moment")
router.register(r'users', views.UserViewSet, basename="user")
router.register(r'profiles', ProfileViews.ProfileViewSet, basename="profile")

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),

    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("follow/<str:username>/", ProfileViews.follow, name="profile_follow"),
    path("register/", RegisterView.as_view(), name="register"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from profiles import views

# from .views import MyTokenObtainPairView
# from .views import profile_detail_api_view
from .views import RegisterView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'profiles', views.ProfileViewSet, basename="profile")
# router.register(r'profiles/<str:username>/', views.profile_detail_api_view, basename="follow")

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
    # path("register", RegisterView.as_view(), name="register")
    # path('<str:username>/', profile_detail_api_view),
    # path('<str:username>/follow', profile_detail_api_view),

    # path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# from django.urls import path

# from .views import profile_detail_view, profile_update_view

# urlpatterns = [
#     path('edit', profile_update_view),
#     path('<str:username>', profile_detail_view),
# ]
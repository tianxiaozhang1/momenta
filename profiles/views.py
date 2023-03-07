from .models import Profile#, UserFollowing#, FollowerRelation
from .serializers import ProfileSerializer
from rest_framework import generics

from django.contrib.auth.models import User
from moments.serializers import UserSerializer

from rest_framework.reverse import reverse

from rest_framework import viewsets

from rest_framework.decorators import action

from django.http import JsonResponse
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework.decorators import parser_classes
from rest_framework.parsers import MultiPartParser

import random

from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpResponse, Http404, JsonResponse
from django.shortcuts import render, redirect
# from django.utils.http import is_safe_url

# from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
# from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
# from .models import Profile
from .serializers import ProfileSerializer, RegisterSerializer#, FollowerSerializer#, FollowersSerializer, FollowingSerializer #, FollowerSerializer
# from .models import UserFollowing

User = get_user_model()
ALLOWED_HOSTS = settings.ALLOWED_HOSTS

@api_view(['GET', 'POST'])
def follow(request, username, *args, **kwargs):
    queryset = Profile.objects.filter(user__username=username)
    profile_id = queryset.first()
    # profile_id = "tian"
    data = request.data or {}
    if request.method == "POST":
        me = request.user
        action = data.get("action")

        if profile_id != me:
            if action == "follow":
                profile_id.followers.add(me)
            elif action == "unfollow":
                profile_id.followers.remove(me)
            else:
                pass
    serializer = ProfileSerializer(instance=profile_id, context={"request": request})
    return Response(serializer.data, status=200)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    # print("RegisterView queryset", queryset)

    # def perform_create(self, serializer):
    #     serializer.save(owner=self.request.user)

class ProfileFollowSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfileSerializer

    # profile_id = queryset.values()[0]["user_id"]
    ### TEMPORARY

class ProfileViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # serializer.save(owner=self.request.user)
        serializer.save()

class ProfileList(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

@parser_classes([MultiPartParser])
class ProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        # 'profiles': reverse('profile-list', request=request, format=format),
    })

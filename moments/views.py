from .models import Moment
from .serializers import MomentSerializer

from profiles.models import Profile
from profiles.serializers import ProfileSerializer

from rest_framework import generics

from django.contrib.auth.models import User
from .serializers import UserSerializer, RegisterSerializer

from rest_framework.reverse import reverse

from rest_framework import viewsets

from rest_framework.decorators import action

from django.http import JsonResponse
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework.decorators import parser_classes
from rest_framework.parsers import MultiPartParser

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
    ]

    return Response(routes)

class MomentViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Moment.objects.all()
    serializer_class = MomentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'users': reverse('user-list', request=request, format=format),
        'moments': reverse('moment-list', request=request, format=format),
    })

class UserViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list` and `retrieve` actions.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    # def get_queryset(self):
    #     return User.objects.all()#filter(username=self.request.user.pk)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class MomentList(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    queryset = Moment.objects.all()
    serializer_class = MomentSerializer

@parser_classes([MultiPartParser])
class MomentDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Moment.objects.all()
    serializer_class = MomentSerializer
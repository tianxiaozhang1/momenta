from rest_framework import serializers

from .models import Profile#, UserFollowing#, FollowerRelation#, UserFollowing #

# FOR REGISTRATION
from django.contrib.auth.models import User

from django.conf import settings
# User = settings.AUTH_USER_MODEL

from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password

class ProfileSerializer(serializers.ModelSerializer):
    is_following = serializers.SerializerMethodField(read_only=True)
    username = serializers.SerializerMethodField(read_only=True)
    follower_count = serializers.SerializerMethodField(read_only=True)
    following_count = serializers.SerializerMethodField(read_only=True)

    followers = serializers.SerializerMethodField(read_only=True)
    following = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Profile
        fields = [
            "first_name",
            "last_name",
            "id",
            "bio",
            "website",
            "email",
            "follower_count",
            "following_count",
            "is_following",
            "username",
            "profilepic",
            "following",
            "followers",
        ]
    
    def get_is_following(self, obj):
        is_following = False
        context = self.context
        request = context.get("request")
        if request:
            user = request.user
            is_following = user in obj.followers.all()
        return is_following
    
    def get_first_name(self, obj):
        return obj.user.first_name
    
    def get_last_name(self, obj):
        return obj.user.last_name

    def get_bio(self, obj):
        return obj.user.bio
    
    def get_website(self, obj):
        return obj.user.website

    def get_profilepic(self, obj):
         return obj.user.profilepic

    def get_username(self, obj):
        return obj.user.username
    
    def get_email(self, obj):
        return obj.user.email

    def get_following_count(self, obj):
        return obj.user.following.count()
    
    def get_follower_count(self, obj):
        return obj.followers.count()

    def get_following(self, obj):
        return obj.user.following.all().values('id')
    
    def get_followers(self, obj):
        return obj.followers.all().values('id', 'username')

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )

    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'bio': {'required': False},
            'website': {'required': False},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs


    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )

        user.set_password(validated_data['password'])
        user.save()

        return user

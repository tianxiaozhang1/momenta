from rest_framework import serializers

from .models import Profile#, UserFollowing#, FollowerRelation#, UserFollowing #

# FOR REGISTRATION
from django.contrib.auth.models import User

from django.conf import settings
# User = settings.AUTH_USER_MODEL

from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password

# from django.contrib.auth.models import UserManager

# class CustomUserManager(UserManager):
#     def create_user(self, username, email=None, password=None, **extra_fields):
#         return self._create_user(username, email, password, **extra_fields)

#     def create_superuser(self, username, email=None, password=None, **extra_fields):
#         return self._create_user(username, email, password, **extra_fields)

class ProfileSerializer(serializers.ModelSerializer):
    is_following = serializers.SerializerMethodField(read_only=True)
    username = serializers.SerializerMethodField(read_only=True)
    follower_count = serializers.SerializerMethodField(read_only=True)
    following_count = serializers.SerializerMethodField(read_only=True)

    followers = serializers.SerializerMethodField(read_only=True)
    following = serializers.SerializerMethodField(read_only=True)
    # following = serializers.SerializerMethodField()
    # followers = serializers.SerializerMethodField(read_only=True)

    # first_name = serializers.SerializerMethodField(read_only=True)
    # last_name = serializers.SerializerMethodField(read_only=True)
    # bio = serializers.SerializerMethodField(read_only=True) 
    # website = serializers.SerializerMethodField(read_only=True) 
    # email = serializers.SerializerMethodField(read_only=True) 
    # profilepic = serializers.SerializerMethodField(read_only=True) 
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
        # return obj.user.following.count()
        return 1
    
    def get_follower_count(self, obj):
        # print("obj.followers", obj.followers.values('id'))
        # print("obj.followers.count()", obj.followers.count())
        # print("obj.following", obj.user.following.all())
        # print("obj.following.count()", obj.user.following.count())
        return "8m"
        # return obj.followers.count()
    
    # def get_followers(self, obj):
    #     return obj.followers.all()
    #

    def get_following(self, obj):
        # return FollowingSerializer(obj.following.all(), many=True).data
        return obj.user.following.all().values('id')
    
    #https://stackoverflow.com/questions/7650448/how-to-serialize-django-queryset-values-into-json

    def get_followers(self, obj):
        # return FollowersSerializer(obj.followers.all(), many=True).data
        return obj.followers.all().values('id', 'username')

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )

    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    # bio = serializers.CharField(write_only=True, required=False)
    # website = serializers.URLField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email')  #, 'first_name', 'last_name' , 'bio', 'website'
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

    # print("*** email", email)

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            
            # first_name=validated_data['first_name'],
            # last_name=validated_data['last_name'],
            # bio=validated_data['bio'],
            # website=validated_data['website']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user

# class FollowingSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = UserFollowing
#         fields = ("id", "following_user_id", "created")
# class FollowersSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserFollowing
#         fields = ("id", "user_id", "created")

# class FollowerSerializer(serializers.ModelSerializer):
#     user = ProfileSerializer(many=False)
#     follower = serializers.SerializerMethodField()
#     class Meta:
#         model = FollowerRelation
#         fields = ('user', 'follower')

#     def get_follower(self, obj):
#         context = self.context
#         request = context.get("request")
#         return request.user.following_user.all().values()
#         # context = self.context
#         # request = context.get("request")
#         # qs = request.user.following_user.all()
#         # data = [{'id': obj.pk, 'user_id': obj.user_id, 'name': obj.req_field} for obj in qs]
#         # return data

# class FollowerSerializer(serializers.ModelSerializer):
#     user = User
#     follower = serializers.SerializerMethodField(read_only=True)
#     class Meta:
#         model = FollowerRelation
#         fields = ('user', 'follower')

#     def get_follower(self, obj):
#         context = self.context
#         request = context.get("request")
#         qs = request.user.following_user.all()
#         data = [{'id': obj.pk, 'user_id': obj.user_id, 'name': obj.req_field} for obj in qs]
#         return data

# class FollowingSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = UserFollowing
#         fields = ("id", "following_user_id", "created")


# class FollowersSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserFollowing
#         fields = ("id", "user_id", "created")

# class UserSerializer(serializers.ModelSerializer):

#     following = serializers.SerializerMethodField()
#     followers = serializers.SerializerMethodField()

#     # for validate user email
#     def validate_email(self, value):
#         lower_email = value.lower()
#         if User.objects.filter(email=lower_email).exists():
#             raise serializers.ValidationError("Email already exists")
#         return lower_email

#     class Meta:
#         model = User
#         fields = ['id', 'first_name', 'username', 'last_name', 'email', 'password', 'date_joined','following','followers']
#         # extra_kwargs for validation on some fields.
#         extra_kwargs = {'password': {'write_only': True, 'required': True},
#                         'first_name': {'required': True}, 'last_name': {'required': True},
#                         'email': {'required': True}
#                         }

#     def get_following(self, obj):
#         return FollowingSerializer(obj.following.all(), many=True).data

#     def get_followers(self, obj):
#         return FollowersSerializer(obj.followers.all(), many=True).data


#     def create(self, validated_data):
#         user = User.objects.create_user(**validated_data)  # create user
#         Token.objects.create(user=user)  # create token for particular user
#         return user
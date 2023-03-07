from django.db import models
from django.conf import settings
from django.db.models.signals import post_save

# Create your models here.
# User = settings.AUTH_USER_MODEL
from django.contrib.auth.models import User

# class UserFollowing(models.Model):
#     user_id = models.ForeignKey(User, related_name="following", on_delete=models.CASCADE)
#     following_user_id = models.ForeignKey(User, related_name="followers", on_delete=models.CASCADE)
#     created = models.DateTimeField(auto_now_add=True, db_index=True)

#     class Meta:
#         unique_together = (('user_id', 'following_user_id'),)
#         index_together = (('user_id', 'following_user_id'),)
#         ordering = ["-created"]

#     def __str__(self):
#         f"{self.user_id} follows {self.following_user_id}"

from django.contrib.auth import get_user_model
UserModel = get_user_model()

# class UserFollowing(models.Model):

#     user_id = models.ForeignKey(UserModel, related_name="following", on_delete=models.CASCADE)
#     following_user_id = models.ForeignKey(UserModel, related_name="followers", on_delete=models.CASCADE)
#     created = models.DateTimeField(auto_now_add=True, db_index=True)

#     class Meta:
#         constraints = [
#             models.UniqueConstraint(fields=['user_id', 'following_user_id'], name="unique_followers")
#         ]

#         ordering = ["-created"]

#     def __str__(self):
#         f"{self.user_id} follows {self.following_user_id}"

# class FollowerRelation(models.Model):
#     # user = models.ForeignKey(User, on_delete=models.CASCADE)
#     # profile = models.ForeignKey("Profile", on_delete=models.CASCADE)
#     # timestamp = models.DateTimeField(auto_now_add=True)

#     user = models.OneToOneField(User, related_name="user", on_delete=models.CASCADE) 
#     user = User.objects.get(id=1)
#     ''' to obtain user ' eeee = User.objects.first() , eeee.user'    '''          
#     following = models.ManyToManyField(User, related_name='following_user', blank=True)   
#     ''' to obtain followers   ' eeee.following_user.all()'   '''
#     ''' to obtain following   ' eeee.user.following.all()'   '''

#     def __str__(self):
#         return self.user.username

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.TextField(max_length=220, blank=True, null=True)
    last_name = models.TextField(max_length=220, blank=True, null=True)
    bio = models.TextField(max_length=220, blank=True, null=True, name="bio")
    website = models.URLField(max_length=80, null=True, blank=True)    
    timestamp = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    email = models.EmailField(null=True, blank=True)
    followers = models.ManyToManyField(User, related_name='following', blank=True)
    following = models.ManyToManyField(User, related_name='followers', blank=True)
    profilepic = models.ImageField(upload_to='profilepics/', blank=True, null=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
    # def __str__(self):
    #     return self.title

def user_did_save(sender, instance, created, *args, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance)

post_save.connect(user_did_save, sender=User)
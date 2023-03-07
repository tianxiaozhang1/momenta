from django.db import models
from django.conf import settings
from django.db.models.signals import post_save

# Create your models here.
# User = settings.AUTH_USER_MODEL
from django.contrib.auth.models import User

from django.contrib.auth import get_user_model
UserModel = get_user_model()

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
      
def user_did_save(sender, instance, created, *args, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance)

post_save.connect(user_did_save, sender=User)

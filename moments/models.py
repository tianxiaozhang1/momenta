from django.db import models

# Create your models here.

class Moment(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    content = models.TextField(blank=True, null=True)
    owner = models.ForeignKey('auth.User', related_name='moments', on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='photos/', blank=True, null=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created']
from django.db import models
from django.contrib.auth.models import User

class Friendship(models.Model):
    from_user = models.ForeignKey(User, related_name='friendship_from_user', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='friendship_to_user', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('from_user', 'to_user')

class Group(models.Model):
    name = models.CharField(max_length=255)
    members = models.ManyToManyField(User, related_name='membership_groups')
    created_at = models.DateTimeField(auto_now_add=True)

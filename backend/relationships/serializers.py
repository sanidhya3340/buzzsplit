from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Friendship, Group

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class FriendshipSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)

    class Meta:
        model = Friendship
        fields = ['id', 'from_user', 'to_user', 'created_at']

class CreateFriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = ['to_user']

class GroupSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ['id', 'name', 'members', 'created_at']

class CreateGroupSerializer(serializers.ModelSerializer):
    member_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True
    )

    class Meta:
        model = Group
        fields = ['name', 'member_ids']

    def validate_member_ids(self, value):
        members = User.objects.filter(id__in=value)
        if len(members) != len(value):
            raise serializers.ValidationError("Some user IDs are invalid.")
        return value

    def create(self, validated_data):
        member_ids = validated_data.pop('member_ids', [])
        group = Group.objects.create(**validated_data)
        group.members.set(User.objects.filter(id__in=member_ids))
        return group


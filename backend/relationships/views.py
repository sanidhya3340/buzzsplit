from rest_framework import viewsets, permissions
from django.contrib.auth.models import User
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from .models import Friendship, Group
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, FriendshipSerializer, CreateFriendshipSerializer, GroupSerializer, CreateGroupSerializer

class FriendshipViewSet(viewsets.ModelViewSet):
    queryset = Friendship.objects.all()
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return CreateFriendshipSerializer
        return FriendshipSerializer

    def perform_create(self, serializer):
        from_user = self.request.user
        to_user = serializer.validated_data['to_user']
        
        # Create the friendship from from_user to to_user
        serializer.save(from_user=from_user)

        # Create the reverse friendship from to_user to from_user
        Friendship.objects.create(from_user=to_user, to_user=from_user)

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return CreateGroupSerializer
        return GroupSerializer

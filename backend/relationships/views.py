from django.contrib.auth.models import User

from rest_framework import viewsets, permissions, filters, status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Friendship, Group
from .serializers import UserSerializer, FriendshipSerializer, CreateFriendshipSerializer, GroupSerializer, CreateGroupSerializer

class FriendshipViewSet(viewsets.ModelViewSet):
    queryset = Friendship.objects.all()
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return CreateFriendshipSerializer
        return FriendshipSerializer

    def create(self, request, *args, **kwargs):
        from_user = request.user
        to_user_id = request.data.get('to_user')
        
        try:
            to_user = User.objects.get(id=to_user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if friendship already exists
        if Friendship.objects.filter(from_user=from_user, to_user=to_user).exists() or \
           Friendship.objects.filter(from_user=to_user, to_user=from_user).exists():
            return Response({"detail": "Friendship already exists."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create the friendship from from_user to to_user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Create the reverse friendship from to_user to from_user
        Friendship.objects.create(from_user=to_user, to_user=from_user)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(from_user=self.request.user)

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return CreateGroupSerializer
        return GroupSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=['post'], url_path='add_member')
    def add_member(self, request, pk=None):
        group = self.get_object()
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'detail': 'User ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if group.members.filter(id=user_id).exists():
            return Response({'detail': 'User is already a member of the group.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.get(id=user_id)
        group.members.add(user)
        return Response({'detail': 'User added to the group successfully.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='members')
    def get_members(self, request, pk=None):
        group = self.get_object()
        members = group.members.all()
        serializer = UserSerializer(members, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='list')
    def list_groups(self, request):
        groups = Group.objects.all()
        serializer = self.get_serializer(groups, many=True)
        return Response(serializer.data)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email']

    def get_queryset(self):
        queryset = super().get_queryset()
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(username__icontains=search_query) | queryset.filter(email__icontains=search_query)
        return queryset

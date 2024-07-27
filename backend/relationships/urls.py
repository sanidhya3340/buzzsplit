from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FriendshipViewSet, GroupViewSet, UserViewSet

router = DefaultRouter()
router.register(r'friendships', FriendshipViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

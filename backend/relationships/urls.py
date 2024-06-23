from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FriendshipViewSet, GroupViewSet

router = DefaultRouter()
router.register(r'friendships', FriendshipViewSet)
router.register(r'groups', GroupViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

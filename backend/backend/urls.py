from django.contrib import admin
from django.urls import path
from .views import SignupView, LoginView, TestTokenView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('test-token/', TestTokenView.as_view(), name='test-token'),
]


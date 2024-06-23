from django.contrib import admin
from django.urls import path,include
from .views import SignupView, LoginView, TestTokenView, UserDetailView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('test-token/', TestTokenView.as_view(), name='test-token'),
    path('api/user/', UserDetailView.as_view(), name='user-detail'),
    path('api/relationships/', include('relationships.urls')),
    path('api/transactions/', include('transactions.urls')),
]

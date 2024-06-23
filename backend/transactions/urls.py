from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet, GroupTransactionView

router = DefaultRouter()
router.register(r'', TransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('transactions/<int:pk>/', TransactionViewSet.as_view({'patch': 'partial_update'}), name='transaction-detail'),
    path('transactions/group/<int:group_id>/', GroupTransactionView.as_view(), name='group-transactions'),
]


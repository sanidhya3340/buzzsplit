from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet, GroupTransactionView, PaymentViewSet

router = DefaultRouter()
router.register(r'', TransactionViewSet)
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = [
    path('', include(router.urls)),
    path('transactions/<int:pk>/', TransactionViewSet.as_view({'patch': 'partial_update'}), name='transaction-detail'),
    path('transactions/group/<int:group_id>/', GroupTransactionView.as_view(), name='group-transactions'),
    path('transactions/<int:pk>/deactivate/', TransactionViewSet.as_view({'post': 'deactivate'}), name='transaction-deactivate'),
    path('transactions/<int:pk>/delete/', TransactionViewSet.as_view({'post': 'delete'}), name='transaction-delete'),
    path('payments/record_payment/', PaymentViewSet.as_view({'post': 'create'}), name='record-payment'),
]

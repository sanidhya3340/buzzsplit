from django.contrib import admin
from .models import Transaction, TransactionSplit, Payment

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['id', 'description', 'amount', 'created_by', 'created_at', 'group']
    search_fields = ['description', 'created_by__username', 'group__name']
    list_filter = ['created_at', 'group']

@admin.register(TransactionSplit)
class TransactionSplitAdmin(admin.ModelAdmin):
    list_display = ['id', 'transaction', 'user', 'amount_owed', 'amount_paid']  # Updated field names
    search_fields = ['transaction__description', 'user__username']
    list_filter = ['transaction__created_at']

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'transaction', 'payer', 'amount', 'timestamp']
    search_fields = ['transaction__description', 'payer__username']
    list_filter = ['timestamp']

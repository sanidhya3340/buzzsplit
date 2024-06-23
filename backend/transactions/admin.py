from django.contrib import admin
from .models import Transaction, TransactionSplit

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['id', 'description', 'amount', 'created_by', 'created_at', 'group']
    search_fields = ['description', 'created_by__username', 'group__name']
    list_filter = ['created_at', 'group']

@admin.register(TransactionSplit)
class TransactionSplitAdmin(admin.ModelAdmin):
    list_display = ['id', 'transaction', 'user', 'amount']
    search_fields = ['transaction__description', 'user__username']
    list_filter = ['transaction__created_at']


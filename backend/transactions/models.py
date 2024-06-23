from django.db import models
from django.contrib.auth.models import User
from relationships.models import Group

class Transaction(models.Model):
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_by = models.ForeignKey(User, related_name='transactions', on_delete=models.CASCADE)
    group = models.ForeignKey(Group, related_name='transactions', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class TransactionSplit(models.Model):
    transaction = models.ForeignKey(Transaction, related_name='splits', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='transaction_splits', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

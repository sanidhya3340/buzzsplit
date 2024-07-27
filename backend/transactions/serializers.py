from rest_framework import serializers
from .models import Transaction, TransactionSplit, Payment
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class TransactionSplitSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = TransactionSplit
        fields = ['id', 'user', 'amount']

class CreateTransactionSplitSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionSplit
        fields = ['user', 'amount']

class TransactionSerializer(serializers.ModelSerializer):
    splits = TransactionSplitSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)
    paid_by = UserSerializer(read_only=True)

    class Meta:
        model = Transaction
        fields = ['id', 'description', 'amount', 'created_by', 'created_at', 'is_active', 'is_deleted', 'group', 'splits', 'paid_by']

class CreateTransactionSerializer(serializers.ModelSerializer):
    splits = CreateTransactionSplitSerializer(many=True, write_only=True)

    class Meta:
        model = Transaction
        fields = ['id', 'description', 'amount', 'group', 'splits', 'paid_by']

    def create(self, validated_data):
        splits_data = validated_data.pop('splits')
        transaction = Transaction.objects.create(**validated_data)
        for split_data in splits_data:
            TransactionSplit.objects.create(transaction=transaction, **split_data)
        return transaction

    def update(self, instance, validated_data):
        splits_data = validated_data.pop('splits', [])
        instance = super().update(instance, validated_data)
        for split_data in splits_data:
            split_id = split_data.get('id')
            if split_id:
                split_instance = TransactionSplit.objects.get(id=split_id, transaction=instance)
                split_instance.amount = split_data['amount']
                split_instance.save()
            else:
                TransactionSplit.objects.create(transaction=instance, **split_data)
        return instance

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'transaction', 'payer', 'recipient', 'amount', 'timestamp']

from rest_framework import serializers
from .models import Transaction, TransactionSplit
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

    class Meta:
        model = Transaction
        fields = ['id', 'description', 'amount', 'created_by', 'created_at', 'group', 'splits']

class CreateTransactionSerializer(serializers.ModelSerializer):
    splits = CreateTransactionSplitSerializer(many=True, write_only=True)

    class Meta:
        model = Transaction
        fields = ['description', 'amount', 'group', 'splits']

    def create(self, validated_data):
        splits_data = validated_data.pop('splits')
        transaction = Transaction.objects.create(**validated_data)
        for split_data in splits_data:
            TransactionSplit.objects.create(transaction=transaction, **split_data)
        return transaction

    def update(self, instance, validated_data):
        instance.description = validated_data.get('description', instance.description)
        instance.amount = validated_data.get('amount', instance.amount)
        instance.group = validated_data.get('group', instance.group)

        instance.splits.all().delete()
        splits_data = validated_data.get('splits')
        for split_data in splits_data:
            TransactionSplit.objects.create(transaction=instance, **split_data)

        instance.save()
        return instance

        # splits_data = validated_data.get('splits', [])
        # existing_splits = instance.splits.all()
        # instance.splits.clear()
        # for split_data in splits_data:
        #     user = split_data.get('user')
        #     amount = split_data.get('amount')
        #     TransactionSplit.objects.create(transaction=instance, user=user, amount=amount)

        # instance.save()
        # return instance


from decimal import Decimal
from django.contrib.auth.models import User
from rest_framework import viewsets, serializers, status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from .models import Transaction, TransactionSplit, Payment
from .serializers import TransactionSerializer, CreateTransactionSerializer, PaymentSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.filter(is_deleted=False)
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return CreateTransactionSerializer
        return TransactionSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.save()
        paid_by = self.request.data.get('payer')
        if paid_by:
            instance.paid_by_id = paid_by
            instance.save()

        splits_data = self.request.data.get('splits', [])
        existing_splits = {split.id: split for split in instance.splits.all()}

        for split_data in splits_data:
            user = split_data['user']
            user_id = user['id']
            amount_owed = split_data['amount_owed']
            amount_paid = split_data['amount_paid']

            split_id = split_data.get('id')
            if split_id:
                split_instance = existing_splits.get(split_id)
                if split_instance:
                    split_instance.amount_owed = amount_owed
                    split_instance.amount_paid = split_data.get('amount_paid', split_instance.amount_paid)
                    split_instance.save()
            else:
                TransactionSplit.objects.create(transaction=instance, user_id=user_id, amount_owed=amount_owed, amount_paid=amount_paid)

        request_split_ids = [split_data.get('id') for split_data in splits_data if split_data.get('id')]
        for split_id, split_instance in existing_splits.items():
            if split_id not in request_split_ids:
                split_instance.delete()

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        transaction = self.get_object()
        transaction.is_deleted = True
        transaction.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class GroupTransactionView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get(self, request, group_id):
        transactions = Transaction.objects.filter(group_id=group_id, is_active=True, is_deleted=False)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

class PaymentViewSet(viewsets.ViewSet):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request):
        payer = request.user
        recipient_id = request.data.get('recipient')
        amount = request.data.get('amount')
        transaction_id = request.data.get('transaction_id')

        if not recipient_id or not amount or not transaction_id:
            return Response({'error': 'Recipient, transaction, and amount are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            recipient = User.objects.get(id=recipient_id)
            transaction = Transaction.objects.get(id=transaction_id)
        except User.DoesNotExist:
            return Response({'error': 'Recipient not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Transaction.DoesNotExist:
            return Response({'error': 'Transaction not found.'}, status=status.HTTP_404_NOT_FOUND)

        payment = Payment.objects.create(
            payer=payer,
            recipient=recipient,
            amount=amount,
            transaction=transaction
        )

        # Update the amount_paid for the relevant splits
        splits = TransactionSplit.objects.filter(transaction=transaction, user=recipient)
        for split in splits:
            amount = Decimal(amount)
            if split.amount_owed >= amount:
                split.amount_paid += Decimal(amount)
                split.save()

        serializer = PaymentSerializer(payment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

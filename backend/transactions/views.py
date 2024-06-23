from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Transaction
from .serializers import TransactionSerializer, CreateTransactionSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return CreateTransactionSerializer
        return TransactionSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save()

    @action(detail=False, methods=['get'], url_path='group/(?P<group_id>[^/.]+)')
    def list_by_group(self, request, group_id=None):
        transactions = self.queryset.filter(group_id=group_id)
        serializer = self.get_serializer(transactions, many=True)
        return Response(serializer.data)

class GroupTransactionView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get(self, request, group_id):
        transactions = Transaction.objects.filter(group_id=group_id)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

"use client";

import { useEffect, useState } from "react";
import { getTransactionsByGroup, deleteTransaction, addTransaction } from "@/api/transactions";
import { getUser } from "@/api/auth";
import { getGroupUsers } from "@/api/relationships";
import EditTransactionForm from "@/components/groups/edit-transaction-form";
import AddTransactionForm from "@/components/groups/add-transaction-form";
import RecordPaymentForm from "@/components/groups/record-payment-form";

const GroupTransaction: React.FC<any> = ({ transaction, handleTransactionUpdated, onDelete, loggedInUserId, users }) => {
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [showRecordPaymentForm, setShowRecordPaymentForm] = useState<boolean>(false);

  const userOwes = transaction.splits.some((split: any) => split.user.id === loggedInUserId && parseFloat(split.amount_owed) > parseFloat(split.amount_paid));

  return (
    <li key={transaction.id} className="p-4 border-b border-gray-200 rounded-lg shadow-sm bg-white mb-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">{transaction.description}</p>
          <p>Amount: ₹{transaction.amount}</p>
          <p>Created By: {transaction.created_by.username}</p>
          <p>Paid by: {transaction.paid_by?.username || "NA"}</p>
        </div>
        <div>
          <button
            className="text-blue-500 hover:underline mr-2"
            onClick={() => setShowEditForm(!showEditForm)}
          >
            Edit
          </button>
          <button
            className="text-red-500 hover:underline mr-2"
            onClick={() => onDelete(transaction.id)}
          >
            Delete
          </button>
          {userOwes && (
            <button
              className="text-green-500 hover:underline"
              onClick={() => setShowRecordPaymentForm(true)}
            >
              Record Payment
            </button>
          )}
        </div>
      </div>
      {showEditForm && <EditTransactionForm onTransactionUpdated={handleTransactionUpdated} setShowEditForm={setShowEditForm} transaction={transaction} />}
      {showRecordPaymentForm && (
        <RecordPaymentForm
          transactionId={transaction.id}
          users={users}
          onRecordPayment={handleTransactionUpdated}
          setShowRecordPaymentForm={setShowRecordPaymentForm}
        />
      )}
    </li>
  );
};

const GroupDetails: React.FC<any> = ({ params }) => {
  const id = Number(params.groupId);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [balances, setBalances] = useState<Record<number, { gets: number, owes: number, paid: number, username: string, email: string }>>({});
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (groupId: number) => {
    try {
      const [transactionData, userData, loggedInUserData] = await Promise.all([
        getTransactionsByGroup(groupId),
        getGroupUsers(groupId),
        getUser()
      ]);

      setTransactions(transactionData);
      setUsers(userData);
      setLoggedInUserId(loggedInUserData.id);
      calculateBalances(transactionData, userData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const calculateBalances = (transactions: any[], users: any[]) => {
    console.log(transactions, "transactions");
    console.log(users, "users");
  
    const userOwesMap: Record<number, number> = {};
    const userGetsMap: Record<number, number> = {};
    const userPaidMap: Record<number, number> = {};
  
    // Initialize maps for all users
    users.forEach(user => {
      userOwesMap[user.id] = 0;
      userGetsMap[user.id] = 0;
      userPaidMap[user.id] = 0;
    });
  
    transactions.forEach(transaction => {
      const payerId = transaction.paid_by?.id;
  
      transaction.splits.forEach((split: any) => {
        const userId = split.user.id;
        const amountOwed = parseFloat(split.amount_owed); // Ensure amount_owed is a number
        const amountPaid = parseFloat(split.amount_paid); // Ensure amount_paid is a number
  
        if (payerId === userId) {
          userGetsMap[userId] += amountOwed;
        } else {
          userOwesMap[userId] += amountOwed;
        }
  
        // Track paid amounts
        userOwesMap[userId] -= amountPaid;
        userPaidMap[userId] += amountPaid;
      });
    });
  
    const balanceMap: Record<number, { gets: number, owes: number, paid: number, username: string, email: string }> = {};
  
    users.forEach(user => {
      balanceMap[user.id] = {
        gets: parseFloat(userGetsMap[user.id].toFixed(2)),
        owes: parseFloat(userOwesMap[user.id].toFixed(2)),
        paid: parseFloat(userPaidMap[user.id].toFixed(2)),
        username: user.username,
        email: user.email,
      };
    });
  
    console.log(balanceMap, "final");
  
    setBalances(balanceMap);
  };
  
  

  const handleDelete = async (transactionId: number) => {
    try {
      await deleteTransaction(transactionId);
      fetchData(id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleTransactionUpdated = async () => {
    fetchData(id);
  };

  const handleAddTransaction = async (newTransaction: Omit<any, 'id'>) => {
    try {
      await addTransaction(newTransaction);
      fetchData(id);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Group Details</h2>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Transactions</h3>
        <button
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setShowAddForm(true)}
        >
          Add Transaction
        </button>
      </div>
      {showAddForm && <AddTransactionForm groupId={id} onAddTransaction={handleAddTransaction} setShowAddForm={setShowAddForm} />}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Balance Summary</h3>
        <ul className="divide-y divide-gray-200">
          {Object.entries(balances).map(([userId, balance]) => (
            <li key={userId} className="py-2">
              <span className="font-medium">{balance.username} ({balance.email})</span>:
              <span className="text-green-600"> Gets ₹{balance.gets.toFixed(2)}</span> and
              <span className="text-red-600"> owes ₹{balance.owes.toFixed(2)}</span>
              {balance.gets > 0 && (
                <div className="text-sm text-gray-600">
                  {Object.entries(balances).filter(([id, b]) => id !== userId).map(([id, b]) => (
                    <span key={id}>
                      {balance.username} gets ₹{balance.gets.toFixed(2)} from {b.username} ({b.email})<br />
                    </span>
                  ))}
                </div>
              )}
              {balance.owes > 0 && (
                <div className="text-sm text-gray-600">
                  {Object.entries(balances).filter(([id, b]) => id !== userId).map(([id, b]) => (
                    <span key={id}>
                      {balance.username} owes ₹{balance.owes.toFixed(2)} to {b.username} ({b.email})<br />
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <ul>
        {transactions.map((transaction) => (
          <GroupTransaction
            key={transaction.id}
            handleTransactionUpdated={handleTransactionUpdated}
            transaction={transaction}
            onDelete={handleDelete}
            loggedInUserId={loggedInUserId ?? 0}
            users={users}
          />
        ))}
      </ul>
    </div>
  );
};

export default GroupDetails;

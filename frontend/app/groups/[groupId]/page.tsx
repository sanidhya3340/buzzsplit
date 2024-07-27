"use client";

import { useEffect, useState } from "react";
import { getTransactionsByGroup, deleteTransaction, addTransaction } from "@/api/transactions";
import { getUser } from "@/api/auth";
import { getGroupUsers } from "@/api/relationships";
import EditTransactionForm from "@/components/groups/edit-transaction-form";
import AddTransactionForm from "@/components/groups/add-transaction-form";
import RecordPaymentForm from "@/components/groups/record-payment-form";

const GroupTransaction: React.FC<{ 
  transaction: any; 
  handleTransactionUpdated: () => void; 
  onDelete: (id: number) => void;
  loggedInUserId: number | null;
  users: any[];
}> = ({ transaction, handleTransactionUpdated, onDelete, loggedInUserId, users }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showRecordPaymentForm, setShowRecordPaymentForm] = useState(false);

  const userOwes = transaction.splits.some((split: any) => split.user.id === loggedInUserId && split.amount > 0);

  return (
    <li key={transaction.id} className="p-2 border-b border-gray-200">
      <p>{transaction.description}</p>
      <p>Amount: ₹{transaction.amount}</p>
      <p>Created By: {transaction.created_by.username}</p>
      <p>Paid by: {transaction.paid_by?.username || "NA"}</p>
      <button
        className="text-blue-500 hover:underline"
        onClick={() => { setShowEditForm(!showEditForm); }}
      >
        Edit
      </button>
      <button
        className="text-red-500 hover:underline ml-4"
        onClick={() => onDelete(transaction.id)}
      >
        Delete
      </button>
      {showEditForm && <EditTransactionForm onTransactionUpdated={handleTransactionUpdated} showEditForm={showEditForm} setShowEditForm={setShowEditForm} transaction={transaction} />}
      
      {userOwes && (
        <button
          className="text-green-500 hover:underline ml-4"
          onClick={() => setShowRecordPaymentForm(true)}
        >
          Record Payment
        </button>
      )}
      {showRecordPaymentForm && (
        <RecordPaymentForm 
          transactionId={transaction.id} // Pass transactionId to RecordPaymentForm
          users={users}
          onRecordPayment={handleTransactionUpdated} // Update transactions after payment
          setShowRecordPaymentForm={setShowRecordPaymentForm}
        />
      )}
    </li>
  );
};

const GroupDetails: React.FC<{ params: any }> = ({ params }) => {
  const id = params.groupId;
  const [transactions, setTransactions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [balances, setBalances] = useState<{ [key: string]: { gets: number; owes: number; username: string; email: string } }>({});
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null); // Store loggedInUserId

  useEffect(() => {
    if (id) {
      fetchData(id as string);
    }
  }, [id]);

  const fetchData = async (groupId: string) => {
    try {
      const [transactionData, userData, loggedInUserData] = await Promise.all([
        getTransactionsByGroup(Number(groupId)),
        getGroupUsers(Number(groupId)),
        getUser()
      ]);
      
      setTransactions(transactionData);
      setUsers(userData);
      setLoggedInUserId(loggedInUserData.id); // Set loggedInUserId
      calculateBalances(transactionData, userData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const calculateBalances = (transactions: any[], users: any[]) => {
    const balanceMap: { [key: string]: { gets: number; owes: number; username: string; email: string } } = {};

    users.forEach(user => {
      balanceMap[user.id] = { gets: 0, owes: 0, username: user.username, email: user.email };
    });

    transactions.forEach(transaction => {
      const payerId = transaction.paid_by?.id;
      
      transaction.splits.forEach((split: any) => {
        const userId = split.user.id;
        
        if (!balanceMap[userId]) {
          balanceMap[userId] = { gets: 0, owes: 0, username: split.user.username, email: split.user.email };
        }

        if (payerId === userId) {
          balanceMap[userId].gets += parseFloat(split.amount);
        } else {
          balanceMap[userId].owes += parseFloat(split.amount);
        }
      });
    });

    setBalances(balanceMap);
  };

  const handleDelete = async (transactionId: number) => {
    try {
      await deleteTransaction(transactionId);
      fetchData(id as string);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleTransactionUpdated = async () => {
    fetchData(id as string);
  };

  const handleAddTransaction = async (newTransaction: any) => {
    try {
      await addTransaction(newTransaction);
      fetchData(id as string);
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
        <div>
          <button
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
            onClick={() => setShowAddForm(true)}
          >
            Add Transaction
          </button>
        </div>
      </div>
      {showAddForm && <AddTransactionForm groupId={id} onAddTransaction={handleAddTransaction} setShowAddForm={setShowAddForm} />}
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Balance Summary</h3>
        <ul className="divide-y divide-gray-200">
          {Object.entries(balances).map(([userId, balance]) => (
            <li key={userId} className="py-2">
              <span className="font-medium">{balance.username} ({balance.email})</span>: 
              <span className="text-green-600"> Gets ₹{balance.gets.toFixed(2)}</span> and 
              <span className="text-red-600"> owes ₹{balance.owes.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
      <ul>
        {transactions.map((transaction: any, index: number) => (
          <GroupTransaction 
            key={index} 
            handleTransactionUpdated={handleTransactionUpdated} 
            transaction={transaction} 
            onDelete={handleDelete} 
            loggedInUserId={loggedInUserId}
            users={users}
          />
        ))}
      </ul>
    </div>
  );
};

export default GroupDetails;

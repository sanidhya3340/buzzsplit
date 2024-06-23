"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTransactionsByGroup, deleteTransaction } from "@/api/transactions";
import EditTransactionForm from "@/components/groups/edit-transaction-form";

const GroupTransaction: React.FC = ({ transaction }:any) => {
  const router = useRouter();
  const [showEditForm, setShowEditForm] = useState(false);
  return (
    <li key={transaction.id} className="p-2 border-b border-gray-200">
      <p>{transaction.description}</p>
      <p>Amount: ${transaction.amount}</p>
      <p>Created By: {transaction.created_by.username}</p>
      <button
        className="text-blue-500 hover:underline"
        onClick={() => {setShowEditForm(!showEditForm)}}
      >
        Edit
      </button>
      <button
        className="text-red-500 hover:underline ml-4"
      >
        Delete
      </button>
      {showEditForm && <EditTransactionForm transaction = {transaction} />}
    </li>
  );
};

const GroupDetails: React.FC = ({ params }:any) => {
  const id = params.groupId;

  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchTransactions(id as string);
    }
  }, [id]);

  const fetchTransactions = async (groupId: string) => {
    try {
      const data = await getTransactionsByGroup(Number(groupId));
      console.log(data, "data");

      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleDelete = async (transactionId: number) => {
    try {
      await deleteTransaction(transactionId);
      fetchTransactions(id as string);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Group Details</h2>
      <h3 className="text-xl font-semibold mb-2">Transactions</h3>
      <ul>
        {transactions.map((transaction:any, key:any) => (
          <GroupTransaction key={key} transaction={transaction} />
        ))}
      </ul>
    </div>
  );
};

export default GroupDetails;

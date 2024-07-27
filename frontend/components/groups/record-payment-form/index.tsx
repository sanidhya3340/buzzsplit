import { useState } from "react";
import { recordPayment } from "@/api/transactions";

const RecordPaymentForm: React.FC<{ 
  users: any[];
  onRecordPayment: (paymentDetails: any) => void;
  setShowRecordPaymentForm: (value: boolean) => void;
  transactionId: number; // Add transactionId prop
}> = ({ users, onRecordPayment, setShowRecordPaymentForm, transactionId }) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await recordPayment({ recipient, amount, description, transaction_id: transactionId })
    onRecordPayment();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <h3 className="text-xl font-semibold mb-4">Record Payment</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Recipient</label>
        <select
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Select Recipient</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowRecordPaymentForm(false)}
          className="mr-4 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Record Payment
        </button>
      </div>
    </form>
  );
};

export default RecordPaymentForm;

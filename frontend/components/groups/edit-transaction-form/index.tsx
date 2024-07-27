import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { updateTransaction } from '@/api/transactions';
import { getGroupUsers } from '@/api/relationships';
import Modal from '@/components/Modal';

interface User {
  id: number;
  username: string;
  email: string;
}

interface TransactionSplit {
  id: number;
  user: User;
  amount: number;
}

interface Transaction {
  id: number;
  description: string;
  amount: number;
  group: string;
  splits: TransactionSplit[];
  payer?: number; // Added payer field
}

interface EditTransactionFormProps {
  onTransactionUpdated: () => void;
  showEditForm: boolean;
  setShowEditForm: (e: any) => void;
  transaction: Transaction;
}

interface FormData {
  description: string;
  amount: number | string;
  group: string;
  splits: { user: number; amount: number }[];
  payer?: number; // Added payer field
}

const EditTransactionForm: React.FC<EditTransactionFormProps> = ({
  onTransactionUpdated,
  showEditForm,
  setShowEditForm,
  transaction,
}) => {
  const [formData, setFormData] = useState<FormData>({
    description: transaction.description,
    amount: transaction.amount,
    group: transaction.group,
    splits: transaction.splits.map((split) => ({ id: split.id, user: split.user.id, amount: split.amount })),
    payer: transaction.payer,
  });

  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[] | undefined>();

  const populateGroupUsers = async () => {
    const data = await getGroupUsers(transaction.group);
    setUsers(data);
  };

  useEffect(() => {
    populateGroupUsers();
  }, [transaction.group]);

  const handleSplitChange = (e: ChangeEvent<HTMLInputElement>, user: User) => {
    const { value } = e.target;
    const updatedSplits = formData.splits.map((split) =>
      split.user === user.id ? { ...split, amount: parseFloat(value) } : split
    );
    setFormData({ ...formData, splits: updatedSplits });
  };

  const handleUserToggle = (user: User) => {
    const isUserSelected = formData.splits.some((split) => split.user === user.id);
    const updatedSplits = isUserSelected
      ? formData.splits.filter((split) => split.user !== user.id)
      : [...formData.splits, { id: null, user: user.id, amount: 0 }];
    setFormData({ ...formData, splits: updatedSplits });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePayerChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, payer: Number(e.target.value) });
  };

  const validateSplits = () => {
    const totalSplitsAmount = formData.splits.reduce((sum, split) => sum + parseFloat(split.amount as unknown as string) || 0, 0);
    return totalSplitsAmount === parseFloat(formData.amount as string);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateSplits()) {
      setError('The sum of split amounts must equal the total transaction amount.');
      return;
    }
    setError(null);
    try {
      await updateTransaction(transaction.id, formData);
      onTransactionUpdated();
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating transaction:', error);
      setError('Failed to update transaction. Please try again.');
    }
  };

  return (
    <Modal onClose={() => setShowEditForm(false)}>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-4">
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="payer" className="block text-sm font-medium text-gray-700">
            Payer
          </label>
          <select
            id="payer"
            name="payer"
            value={formData.payer || ''}
            onChange={handlePayerChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Payer</option>
            {users?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.email})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="splits" className="block text-sm font-medium text-gray-700">
            Splits
          </label>
          {users?.map((user) => (
            <div key={user.id} className="flex items-center mt-1">
              <input
                type="checkbox"
                checked={formData.splits.some((split) => split.user === user.id)}
                onChange={() => handleUserToggle(user)}
                className="mr-2"
              />
              <span className="flex-1">{user.username} ({user.email})</span>
              <input
                type="number"
                name="amount"
                value={formData.splits.find((split) => split.user === user.id)?.amount || ''}
                onChange={(e) => handleSplitChange(e, user)}
                className={`w-1/4 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${!formData.splits.some((split) => split.user === user.id) ? 'opacity-50' : ''}`}
                placeholder="Amount"
                disabled={!formData.splits.some((split) => split.user === user.id)}
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update Transaction
        </button>
      </form>
    </Modal>
  );
};

export default EditTransactionForm;


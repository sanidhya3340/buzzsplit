import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Modal from '@/components/Modal';
import { getGroupUsers } from '@/api/relationships';
import { updateTransaction } from '@/api/transactions';

interface User {
  id: number;
  username: string;
  email: string;
}

interface TransactionSplit {
  id: number;
  user: User;
  amount_owed: number;
  amount_paid: number;
}

interface FormData {
  description: string;
  amount: number | string;
  group: string;
  splits: TransactionSplit[];
  payer?: number;
}

interface EditTransactionFormProps {
  transaction: any;
  onTransactionUpdated: () => void;
  setShowEditForm: (value: boolean) => void;
}

const EditTransactionForm: React.FC<EditTransactionFormProps> = ({
  transaction,
  onTransactionUpdated,
  setShowEditForm,
}) => {
  const [formData, setFormData] = useState<FormData>({
    description: transaction.description,
    amount: transaction.amount,
    group: transaction.group,
    splits: transaction.splits.map((split: any) => ({
      id: split.id,
      user: split.user,
      amount_owed: parseFloat(split.amount_owed),
      amount_paid: parseFloat(split.amount_paid),
    })),
    payer: transaction.payer?.id,
  });

  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const populateGroupUsers = async () => {
    const data = await getGroupUsers(transaction.group);
    setUsers(data);
  };

  useEffect(() => {
    populateGroupUsers();
  }, [transaction.group]);

  const handleSplitChange = (e: ChangeEvent<HTMLInputElement>, user: User) => {
    const { name, value } = e.target;
    const updatedSplits = formData.splits.map((split) =>
      split.user.id === user.id ? { ...split, [name]: parseFloat(value) } : split
    );
    setFormData({ ...formData, splits: updatedSplits });
  };

  const handleUserToggle = (user: User) => {
    const isUserSelected = formData.splits.some((split) => split.user.id === user.id);
    const updatedSplits = isUserSelected
      ? formData.splits.filter((split) => split.user.id !== user.id)
      : [...formData.splits, { id: 0, user, amount_owed: 0, amount_paid: 0 }];
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
    const totalSplitsAmount = formData.splits.reduce((sum, split) => sum + split.amount_owed, 0);
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
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.email})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Splits
          </label>
          {users.map((user) => {
            const split = formData.splits.find((split) => split.user.id === user.id);
            return (
              <div key={user.id} className="flex items-center mt-1">
                <input
                  type="checkbox"
                  checked={!!split}
                  onChange={() => handleUserToggle(user)}
                  className="mr-2"
                />
                <span className="flex-1">{user.username} ({user.email})</span>
                <input
                  type="number"
                  name="amount_owed"
                  value={split?.amount_owed || ''}
                  onChange={(e) => handleSplitChange(e, user)}
                  className={`w-1/4 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${!split ? 'opacity-50' : ''}`}
                  placeholder="Amount Owed"
                  disabled={!split}
                />
                <input
                  type="number"
                  name="amount_paid"
                  value={split?.amount_paid || ''}
                  onChange={(e) => handleSplitChange(e, user)}
                  className={`w-1/4 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${!split ? 'opacity-50' : ''}`}
                  placeholder="Paid Amount"
                  disabled={!split}
                />
              </div>
            );
          })}
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

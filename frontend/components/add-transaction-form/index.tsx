"use client"

import { useState } from 'react';

interface AddTransactionFormProps {
  onSave: (transaction: { description: string, amount: number, group: number, splits: { user: number, amount: number }[] }) => void;
  onClose: () => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onSave, onClose }) => {
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [groupId, setGroupId] = useState<number>(0);
  const [splits, setSplits] = useState<{ user: number, amount: number }[]>([{ user: 0, amount: 0 }]);

  const handleAddSplit = () => {
    setSplits([...splits, { user: 0, amount: 0 }]);
  };

  const handleSave = () => {
    onSave({ description, amount, group: groupId, splits });
    onClose();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        className="border p-2 mb-4 w-full"
      />
      <input
        type="number"
        placeholder="Group ID"
        value={groupId}
        onChange={(e) => setGroupId(parseInt(e.target.value))}
        className="border p-2 mb-4 w-full"
      />
      <button
        onClick={handleAddSplit}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
      >
        Add Split
      </button>
      {splits.map((split, index) => (
        <div key={index} className="mb-4">
          <input
            type="number"
            placeholder="User ID"
            value={split.user}
            onChange={(e) => {
              const updatedSplits = [...splits];
              updatedSplits[index].user = parseInt(e.target.value);
              setSplits(updatedSplits);
            }}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="number"
            placeholder="Amount"
            value={split.amount}
            onChange={(e) => {
              const updatedSplits = [...splits];
              updatedSplits[index].amount = parseFloat(e.target.value);
              setSplits(updatedSplits);
            }}
            className="border p-2 mb-2 w-full"
          />
        </div>
      ))}
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Save
      </button>
      <button
        onClick={onClose}
        className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 ml-2"
      >
        Cancel
      </button>
    </div>
  );
};

export default AddTransactionForm;

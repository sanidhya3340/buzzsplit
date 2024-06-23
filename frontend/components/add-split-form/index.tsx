"use client"

import { useState } from 'react';

interface AddSplitFormProps {
  onSave: (split: { user: number, amount: number }) => void;
  onClose: () => void;
}

const AddSplitForm: React.FC<AddSplitFormProps> = ({ onSave, onClose }) => {
  const [userId, setUserId] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);

  const handleSave = () => {
    onSave({ user: userId, amount });
    onClose();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add Split</h2>
      <input
        type="number"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(parseInt(e.target.value))}
        className="border p-2 mb-4 w-full"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        className="border p-2 mb-4 w-full"
      />
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

export default AddSplitForm;

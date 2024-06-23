import React, { useState } from 'react';
// import { updateTransaction } from '@/api/transactions'; // Import your API function for updating transactions

export default function EditTransactionForm({ transaction }: any) {
  // State to manage form data
  console.log(transaction,"transactions");
  
  const [formData, setFormData] = useState({
    description: transaction.description,
    amount: transaction.amount,
    group: transaction.group,
    splits: transaction.splits.map((split:any) => ({ ...split })),
  });

  const handleSplitChange = (e:any, i:any) => {}

  // Handler for updating form data
  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler for submitting the form
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      // Call API function to update the transaction
      // const updatedTransaction = await updateTransaction(transaction.id, formData);
      // console.log('Updated transaction:', updatedTransaction);
      // Handle success, e.g., show a success message or redirect
    } catch (error) {
      console.error('Error updating transaction:', error);
      // Handle error, e.g., show an error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-4">
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
        <label htmlFor="group" className="block text-sm font-medium text-gray-700">
          Group
        </label>
        <input
          type="text"
          id="group"
          name="group"
          value={formData.group}
          onChange={handleInputChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="splits" className="block text-sm font-medium text-gray-700">
          Splits
        </label>
        {formData.splits.map((split:any, index:any) => (
          <div key={index} className="flex items-center mt-1">
            <input
              type="text"
              name={`splits[${index}].user.username`}
              value={split.user.username}
              onChange={(e) => handleSplitChange(e, index)}
              className="w-1/2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="User ID"
            />
            <input
              type="number"
              name={`splits[${index}].amount`}
              value={split.amount}
              onChange={(e) => handleSplitChange(e, index)}
              className="ml-2 w-1/2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Amount"
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
  );
}

"use client"
import { useState } from 'react';
import Modal from './Modal';
import AddSplitForm from '../add-split-form';
import AddTransactionForm from '../add-transaction-form';

const FloatingActionButton: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formType, setFormType] = useState<'split' | 'transaction'>('split');

  const openModal = (type: 'split' | 'transaction') => {
    setFormType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSaveSplit = (split: { user: number, amount: number }) => {
    console.log('Save Split:', split);
    // Add your save logic here
  };

  const handleSaveTransaction = (transaction: { description: string, amount: number, group: number, splits: { user: number, amount: number }[] }) => {
    console.log('Save Transaction:', transaction);
    // Add your save logic here
  };

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={() => openModal('split')}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-md focus:outline-none mb-2"
      >
        Add Split
      </button>
      <button
        onClick={() => openModal('transaction')}
        className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-md focus:outline-none"
      >
        Add Transaction
      </button>
      {modalOpen && (
        <Modal onClose={closeModal}>
          <>
          {formType === 'split' ? (
            <AddSplitForm onSave={handleSaveSplit} onClose={closeModal} />
          ) : (
            <AddTransactionForm onSave={handleSaveTransaction} onClose={closeModal} />
          )}
          </>
        </Modal>
      )}
    </div>
  );
};

export default FloatingActionButton;

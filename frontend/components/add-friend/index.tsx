import React, { useState } from 'react';

interface AddFriendProps {
  onAddFriend: (friendId: number) => void;
}

const AddFriend: React.FC<AddFriendProps> = ({ onAddFriend }) => {
  const [friendId, setFriendId] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAddFriend(Number(friendId));
    setFriendId('');
  };

  return (
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-2">Add Friend</h3>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={friendId}
          onChange={(e) => setFriendId(e.target.value)}
          placeholder="Enter friend ID"
          className="px-3 py-2 border border-gray-300 rounded"
          required
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add Friend
        </button>
      </form>
    </div>
  );
};

export default AddFriend;

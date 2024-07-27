import React, { useState } from 'react';
import Modal from '../Modal';

interface FriendListProps {
  friendships: any[];
  groups: any[];
  onAddToGroup: (friendId: number, groupId: number) => void;
  onCreateGroup: (friendId: number, groupName: string) => void;
}

const FriendList: React.FC<FriendListProps> = ({ friendships, groups, onAddToGroup, onCreateGroup }) => {
  const [selectedFriend, setSelectedFriend] = useState<any | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleOpenModal = (friend: any) => {
    setSelectedFriend(friend);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedFriend(null);
    setShowModal(false);
    setError(null);
  };

  const handleAddToGroup = async (groupId: number) => {
    if (selectedFriend) {
      try {
        await onAddToGroup(selectedFriend.id, groupId);
        handleCloseModal();
      } catch (err: any) {
        setError(err.response?.data?.detail || 'An error occurred while adding to the group.');
      }
    }
  };

  const handleCreateGroup = async () => {
    if (selectedFriend && newGroupName) {
      try {
        await onCreateGroup(selectedFriend.id, newGroupName);
        handleCloseModal();
      } catch (err: any) {
        setError(err.response?.data?.detail || 'An error occurred while creating the group.');
      }
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-4">Friend List</h3>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {friendships.map((friendship) => (
          <div key={friendship.id} className="relative p-4 border border-gray-300 rounded shadow-sm bg-white">
            <p><strong>Friend:</strong> {friendship.to_user.username}</p>
            <p><strong>Added On:</strong> {new Date(friendship.created_at).toLocaleDateString()}</p>
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => handleOpenModal(friendship)}
            >
              &#x22EE;
            </button>
          </div>
        ))}
      </div>
      {showModal && (
        <Modal onClose={handleCloseModal}>
          <h3 className="text-xl font-semibold mb-4">Add {selectedFriend?.to_user.username} to Group</h3>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <h4 className="text-lg font-semibold">Existing Groups</h4>
            <ul className="space-y-2">
              {groups.map((group) => (
                <li key={group.id}>
                  <button
                    className="px-3 py-2 border border-gray-300 rounded w-full text-left hover:bg-gray-200"
                    onClick={() => handleAddToGroup(group.id)}
                  >
                    {group.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold">Create New Group</h4>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Group Name"
              className="px-3 py-2 border border-gray-300 rounded w-full mb-2"
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleCreateGroup}
              disabled={!newGroupName}
            >
              Create Group
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FriendList;

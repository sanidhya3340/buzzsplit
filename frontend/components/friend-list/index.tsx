import React from 'react';

interface FriendListProps {
  friendships: any[];
}

const FriendList: React.FC<FriendListProps> = ({ friendships }) => {
  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-4">Friend List</h3>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {friendships.map((friendship) => (
          <div key={friendship.id} className="p-4 border border-gray-300 rounded shadow-sm bg-white">
            <p><strong>Friend:</strong> {friendship.to_user.username}</p>
            <p><strong>Added On:</strong> {new Date(friendship.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendList;

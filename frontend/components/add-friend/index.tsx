import React, { useState, useEffect, useCallback } from 'react';
import { fetchUsers } from '@/api/relationships';
import { debounce } from '@/utils/debounce';

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Friendship {
  id: number;
  to_user: User;
  created_at: string;
}

interface AddFriendProps {
  onAddFriend: (friendId: number) => void;
  friendships: Friendship[];
}

const AddFriend: React.FC<AddFriendProps> = ({ onAddFriend, friendships }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const debouncedFetchUsers = useCallback(
    debounce(async (query: string) => {
      if (query.length > 0) {
        try {
          const users = await fetchUsers(query);
          setSearchResults(users);
        } catch (error) {
          setError((error as Error).message);
        }
      } else {
        setSearchResults([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetchUsers(searchTerm);
  }, [searchTerm, debouncedFetchUsers]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFriend) {
      onAddFriend(selectedFriend.id);
      setSelectedFriend(null);
      setSearchTerm('');
      setSearchResults([]);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectFriend = (friend: User) => {
    if (!isAlreadyFriend(friend.id)) {
      setSelectedFriend(friend);
      setSearchTerm(friend.username);
      setSearchResults([]);
    }
  };

  const isAlreadyFriend = (userId: number) => {
    return friendships.some(friendship => friendship.to_user.id === userId);
  };

  return (
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-2">Add Friend</h3>
      <form onSubmit={handleSubmit} className="space-y-2">
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search for friends"
          className="px-3 py-2 border border-gray-300 rounded w-full"
          required
        />
        <ul className="border border-gray-300 rounded mt-2 max-h-40 overflow-y-auto">
          {searchResults.map((friend) => (
            <li
              key={friend.id}
              onClick={() => handleSelectFriend(friend)}
              className={`cursor-pointer p-2 ${isAlreadyFriend(friend.id) ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-200'}`}
              style={{ pointerEvents: isAlreadyFriend(friend.id) ? 'none' : 'auto' }}
            >
              {friend.username} ({friend.email}) {isAlreadyFriend(friend.id) && <span>(Already a friend)</span>}
            </li>
          ))}
        </ul>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={!selectedFriend}
        >
          Add Friend
        </button>
      </form>
    </div>
  );
};

export default AddFriend;

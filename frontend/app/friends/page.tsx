"use client"
import { useEffect, useState } from 'react';
import { getFriendships, addFriend } from '@/api/relationships';
import FriendList from '@/components/friend-list';
import AddFriend from '@/components/add-friend';

const Friends: React.FC = () => {
  const [friendships, setFriendships] = useState<any[]>([]);

  useEffect(() => {
    fetchFriendships();
  }, []);

  const fetchFriendships = async () => {
    try {
      const data = await getFriendships();
      setFriendships(data);
    } catch (error) {
      console.error('Error fetching friendships:', error);
    }
  };

  const handleAddFriend = async (friendId: number) => {
    try {
      await addFriend(friendId);
      fetchFriendships();
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Friends</h2>
      <AddFriend onAddFriend={handleAddFriend} />
      <FriendList friendships={friendships} />
    </div>
  );
};

export default Friends;

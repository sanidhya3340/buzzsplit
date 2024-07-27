"use client"
import { useEffect, useState } from 'react';
import { getFriendships, addFriend, fetchAllGroups, addMemberToGroup, createGroup } from '@/api/relationships';
import FriendList from '@/components/friend-list';
import AddFriend from '@/components/add-friend';

const Friends: React.FC = () => {
  const [friendships, setFriendships] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFriendships();
    fetchGroups();
  }, []);

  const fetchFriendships = async () => {
    try {
      const data = await getFriendships();
      setFriendships(data);
    } catch (error) {
      console.error('Error fetching friendships:', error);
    }
  };

  const fetchGroups = async () => {
    try {
      const data = await fetchAllGroups();
      console.log(data);
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
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

  const handleAddToGroup = async (userId: number, groupId: number) => {
    try {
      await addMemberToGroup(groupId, userId);
      fetchGroups();
    } catch (error: any) {
      setError(error.message || 'An error occurred while adding to the group.');
      console.error('Error adding to group:', error);
    }
  };

  const handleCreateGroup = async (userId: number, groupName: string) => {
    try {
      const data = await createGroup(groupName, userId);
      console.log('Created group:', data);
      fetchGroups();  
    } catch (error: any) {
      setError(error.message || 'An error occurred while creating the group.');
      console.error('Error creating group:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Friends</h2>
      <AddFriend onAddFriend={handleAddFriend} friendships={friendships} />
      {error && <div className="text-red-500">{error}</div>}
      <FriendList 
        friendships={friendships} 
        groups={groups} 
        onAddToGroup={handleAddToGroup} 
        onCreateGroup={handleCreateGroup} 
      />
    </div>
  );
};

export default Friends;

"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getFriendships } from '@/api/relationships';
import { getTransactionsByGroup } from '@/api/transactions';

const Home: React.FC = () => {
  const [friendships, setFriendships] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);

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
      const token = localStorage.getItem('csrftoken');
      const response = await fetch('http://127.0.0.1:8000/api/relationships/groups/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }

      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-grayGreen">Groups</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {groups.map((group) =>{ 
          
          return (
          <div key={group.id} className="p-4 border border-gray-300 rounded shadow-sm">
            
            <Link href={`/groups/${group.id}`}>
              <h3 className="text-xl font-semibold mb-2 cursor-pointer">{group.name}</h3>
            </Link>
          </div>
        )})}
      </div>
    </div>
  );
};

export default Home;

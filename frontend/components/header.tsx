"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUser } from '@/api/auth';

const Header: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem('csrftoken');
    // Redirect to login page
    router.push('/login');
  };

  return (
    <header className="bg-grayGreen text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link href="/">
          <h1 className="text-2xl font-bold cursor-pointer">BuzzSplit</h1>
        </Link>
        <div className="flex items-center space-x-4">
          {user && <span>Logged in as: {user.username}</span>}
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

const API_BASE_URL = 'http://127.0.0.1:8000/api/relationships';

export const getFriendships = async () => {
  const token = localStorage.getItem('csrftoken');
  const response = await fetch(`${API_BASE_URL}/friendships/`, {
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch friendships');
  }
  return response.json();
};

export const addFriend = async (friendId: number) => {
  const token = localStorage.getItem('csrftoken');
  const response = await fetch(`${API_BASE_URL}/friendships/`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ to_user: friendId })
  });
  if (!response.ok) {
    throw new Error('Failed to add friend');
  }
  return response.json();
};

export const getGroups = async () => {
  const token = localStorage.getItem('csrftoken');
  const response = await fetch(`${API_BASE_URL}/groups/`, {
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch groups');
  }
  return response.json();
};

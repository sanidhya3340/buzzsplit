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
  console.log(friendId, "friendId");
  
  const token = localStorage.getItem('csrftoken');
  const response = await fetch(`${API_BASE_URL}/friendships/`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ to_user: friendId })
  });
  console.log(response);
  
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

//fetches the all the users of the particular group
export const getGroupUsers = async (id:any) => {
  const token = localStorage.getItem('csrftoken');
  const response = await fetch(`${API_BASE_URL}/groups/${id}/members/`,{
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if(!response.ok){
    throw new Error('Failed to fetch users of group');
  }
  return response.json();
}

export const fetchUsers = async (query: any) => {
  const token = localStorage.getItem('csrftoken');
  const response = await fetch(`${API_BASE_URL}/users/?search=${query}`,{
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if(!response.ok){
    throw new Error('Failed to fetch users of group');
  }
  return response.json();
}

export const fetchAllGroups = async () => {
  const token = localStorage.getItem('csrftoken');
  const response = await fetch(`${API_BASE_URL}/groups/list/`, {
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch groups');
  }
  return response.json();
};

export const addMemberToGroup = async (groupId: number, userId: number) => {
  const token = localStorage.getItem('csrftoken');
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/add_member/`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to add member to group');
  }
  return response.json();
};

export const createGroup = async (groupName: string, userId: number) => {
  const token = localStorage.getItem('csrftoken');
  const response = await fetch(`${API_BASE_URL}/groups/`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: groupName, member_ids: [userId] }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create group');
  }

  return response.json();
};

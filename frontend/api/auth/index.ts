
const API_BASE_URL = 'http://127.0.0.1:8000'
const URL=  {
    LOGIN: `${API_BASE_URL}/login/`,
    REGISTER: `${API_BASE_URL}/signup/`,
    USER: `${API_BASE_URL}/api/user/`
} 

export const login = async (username: string, password: string) => {
  try {
    const response = await fetch(URL.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Login successful:', data);

    // Store token in local storage or cookies
    localStorage.setItem('csrftoken', data.token);

    return data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const register = async (username: string, email: string, password: string) => {
  try {
    console.log(URL.REGISTER);
    
    const response = await fetch(URL.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

export const getUser = async () => {
  const token = localStorage.getItem('csrftoken');
  const response = await fetch(URL.USER, {
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
};


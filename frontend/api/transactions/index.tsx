const API_BASE_URL = 'http://127.0.0.1:8000/api/transactions';

export const getTransactionsByGroup = async (groupId: number) => {
    const token = localStorage.getItem('csrftoken');
    const response = await fetch(`${API_BASE_URL}/transactions/group/${groupId}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
  
    const data = await response.json();
    return data;
  };
  
  export const deleteTransaction = async (transactionId: number) => {
    const token = localStorage.getItem('csrftoken');
    const response = await fetch(`${API_BASE_URL}/${transactionId}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to delete transaction');
    }
  };

  export const getGroupTransactions = async (groupId: string) => {
    const response = await fetch(`/api/transactions/group/${groupId}/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    return await response.json();
  };
  
  export const addTransaction = async (transactionData: any) => {
    const response = await fetch('/api/transactions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(transactionData),
    });
    if (!response.ok) {
      throw new Error('Failed to add transaction');
    }
    return await response.json();
  };
  
  
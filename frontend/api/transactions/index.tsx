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

export const addTransaction = async (transactionData: any) => {
    try {
      const formattedTransactionData = {
        description: transactionData.description,
        amount: parseFloat(transactionData.amount),
        group: transactionData.group,
        splits: transactionData.splits.map((split: any) => ({
          user: split.user.id,
          amount_owed: parseFloat(split.amount),
          amount_paid: 0
        })),
        paid_by: transactionData.payer
      };

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('csrftoken')}`,
        },
        body: JSON.stringify(formattedTransactionData)
      };

      const response = await fetch(`${API_BASE_URL}/`, requestOptions);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add transaction: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };


export const updateTransaction = async (transactionId: number, formData: any) => {
  
  const response = await fetch(`${API_BASE_URL}/${transactionId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${localStorage.getItem('csrftoken')}`,
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error('Failed to update transaction');
  }

  return response.json();
};

export const deleteTransaction = async (transactionId: number) => {
  const url = `${API_BASE_URL}/${transactionId}/deactivate/`;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${localStorage.getItem('csrftoken')}`,
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error('Failed to delete transaction.');
    }
  } catch (error) {
    console.error('Error deleting transaction:', error);
  }
};

export const recordPayment = async (data: any) => {
  console.log(data, "data");
  
  const url = `${API_BASE_URL}/payments/record_payment/`;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${localStorage.getItem('csrftoken')}`,
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error('Failed to record payment.');
    }
    const result = await response.json();
    console.log('Payment recorded:', result);
  } catch (error) {
    console.error('Error recording payment:', error);
  }
};
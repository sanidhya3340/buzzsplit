export async function postCall<T>(
    url: string,
    body: Record<string, any>,
    headers: HeadersInit = {}
  ): Promise<T> {
    try {
        const token = localStorage.getItem('csrftoken')
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
          ...headers,
        },
        body: JSON.stringify(body),
        credentials: 'include', // to include cookies in the request
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('Error in POST call:', error);
      throw error;
    }
  }
  
  export async function getCall<T>(url: string, headers: HeadersInit = {}): Promise<T> {
    try {
        const token = localStorage.getItem('csrftoken')
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,

          ...headers,
        },
        credentials: 'include', // to include cookies in the request
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('Error in GET call:', error);
      throw error;
    }
  }
  
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export default API_BASE_URL;
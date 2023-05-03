interface FetchOptions {
    headers?: Record<string, string>;
    body?: any;
  }
  
  export async function fetchApi(url: string, method: string, options: FetchOptions = {}) {
    const { headers = {}, body } = options;
  
    const response = await fetch(url, {
      method,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
  
    const data = await response.json();
    return data;
  }
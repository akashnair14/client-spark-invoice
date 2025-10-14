// API Configuration for .NET Core Backend
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7000/api';

// Get JWT token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Set JWT token in localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

// Remove JWT token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

// Get user from localStorage
export const getStoredUser = (): any | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Set user in localStorage
export const setStoredUser = (user: any): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove user from localStorage
export const removeStoredUser = (): void => {
  localStorage.removeItem('user');
};

// API request helper with JWT authentication
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    removeAuthToken();
    removeStoredUser();
    window.location.href = '/';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

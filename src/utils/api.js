import axios from 'axios';

const API_BASE_URL = 'http://localhost:8060';

// Function to get the Firebase ID token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token'); // Ensure the token is stored in localStorage
  if (!token) {
    throw new Error('No token found');
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/create`, userData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/email/${email}`, getAuthHeader());
    return response.data;
  } catch (error) {
    if (error.response && error.response.status !== 200) {
      console.log('Get user by email response:', error);
      return null;
    }
    console.error('Error fetching user by email:', error);
    throw error;
  }
};
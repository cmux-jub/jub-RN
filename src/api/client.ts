import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://example.invalid/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

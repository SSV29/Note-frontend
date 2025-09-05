import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const getErrorMessage = (error) => {
  if (!error) return 'Unexpected error';
  if (error.response?.data?.message) return error.response.data.message;
  if (typeof error.message === 'string') return error.message;
  return 'Something went wrong. Please try again.';
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize error for consumers
    error.normalizedMessage = getErrorMessage(error);
    return Promise.reject(error);
  }
);

export const notesAPI = {
  async getAllNotes() {
    const res = await api.get('/notes');
    return res;
  },
  async getNoteById(id) {
    const res = await api.get(`/notes/${id}`);
    return res;
  },
  async getSharedNote(id) {
    const res = await api.get(`/notes/share/${id}`);
    return res;
  },
  async createNote(noteData) {
    const res = await api.post('/notes', noteData);
    return res;
  },
  async updateNote(id, noteData) {
    const res = await api.put(`/notes/${id}`, noteData);
    return res;
  },
  async deleteNote(id) {
    const res = await api.delete(`/notes/${id}`);
    return res;
  },
  async shareNote(id) {
    const res = await api.post(`/notes/${id}/share`);
    return res;
  },
};

export default api;

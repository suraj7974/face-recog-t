import axios from 'axios';
import { StatsResponse, RebuildStatus } from '../types';

// Use relative path for API calls. This allows the app to work 
// regardless of the domain or IP it is served from.
// In development (Vite), the proxy in vite.config.ts handles the forwarding.
// In production, the backend serves the frontend from the same origin.
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getStats = async (): Promise<StatsResponse> => {
  const response = await api.get('/stats');
  return response.data;
};

export const getIdentities = async () => {
  const response = await api.get('/identities');
  return response.data;
};

export const getPerson = async (name: string) => {
  const response = await api.get(`/person/${name}`);
  return response.data;
};

export const enrollPerson = async (formData: FormData) => {
  const response = await api.post('/enroll', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const addImage = async (formData: FormData) => {
  const response = await api.post('/add_image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deletePerson = async (person: string) => {
  const formData = new FormData();
  formData.append('person', person);
  const response = await api.post('/delete_person', formData);
  return response.data;
};

export const deleteImage = async (person: string, filename: string) => {
  const formData = new FormData();
  formData.append('person', person);
  formData.append('filename', filename);
  const response = await api.post('/delete_image', formData);
  return response.data;
};

export const rebuildDatabase = async () => {
  const response = await api.post('/rebuild_db');
  return response.data;
};

export const getRebuildStatus = async (): Promise<RebuildStatus> => {
  const response = await api.get('/rebuild_status');
  return response.data;
};

export const getLatestLog = async () => {
  const response = await api.get('/latest_log');
  return response.data;
};


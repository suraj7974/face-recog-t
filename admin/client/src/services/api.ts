import axios from 'axios';
import type { 
  IdentitiesResponse, 
  PersonDetails, 
  ApiResponse, 
  LogResponse, 
  RebuildStatus, 
  StatsResponse 
} from '../types';

export type { PersonDetails } from '../types';

// Use relative path for API calls to avoid CORS issues
const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
});

export const getIdentities = async (): Promise<IdentitiesResponse> => {
  const response = await api.get<IdentitiesResponse>('/identities');
  return response.data;
};

export const getPerson = async (name: string): Promise<PersonDetails> => {
  const response = await api.get<PersonDetails>(`/person/${encodeURIComponent(name)}`);
  return response.data;
};

// Helper function to get the full image URL
export const getImageUrl = (person: string, filename: string): string => {
  // In production, images are served from root/images/...
  // In development (Vite), we proxy /images to the backend
  return `/images/${encodeURIComponent(person)}/${encodeURIComponent(filename)}`;
};

export const enrollPerson = async (
  name: string, 
  info: string, 
  images: FileList,
  autoRebuild: boolean = true
): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('info', info);
  formData.append('auto_rebuild', autoRebuild.toString());
  Array.from(images).forEach((file) => {
    formData.append('images', file);
  });
  const response = await api.post<ApiResponse>('/enroll', formData);
  return response.data;
};

export const addImage = async (
  person: string, 
  image: File,
  autoRebuild: boolean = true
): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('person', person);
  formData.append('image', image);
  formData.append('auto_rebuild', autoRebuild.toString());
  const response = await api.post<ApiResponse>('/add_image', formData);
  return response.data;
};

export const deletePerson = async (
  person: string,
  autoRebuild: boolean = true
): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('person', person);
  formData.append('auto_rebuild', autoRebuild.toString());
  const response = await api.post<ApiResponse>('/delete_person', formData);
  return response.data;
};

export const deleteImage = async (
  person: string,
  filename: string,
  autoRebuild: boolean = true
): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('person', person);
  formData.append('filename', filename);
  formData.append('auto_rebuild', autoRebuild.toString());
  const response = await api.post<ApiResponse>('/delete_image', formData);
  return response.data;
};

export const rebuildDatabase = async (): Promise<ApiResponse & { status?: RebuildStatus }> => {
  const response = await api.post<ApiResponse & { status?: RebuildStatus }>('/rebuild_db');
  return response.data;
};

export const getRebuildStatus = async (): Promise<RebuildStatus> => {
  const response = await api.get<RebuildStatus>('/rebuild_status');
  return response.data;
};

export const getStats = async (): Promise<StatsResponse> => {
  const response = await api.get<StatsResponse>('/stats');
  return response.data;
};

export const getLatestLog = async (): Promise<LogResponse> => {
  const response = await api.get<LogResponse>('/latest_log');
  return response.data;
};


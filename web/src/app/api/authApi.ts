import { httpClient } from './httpClient';

type BackendRole = 'OWNER' | 'ADMIN' | 'DOCTOR';

export interface BackendAuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: BackendRole;
  organizationId: string;
}

export interface AuthResponse {
  user: BackendAuthUser;
  token: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>('/auth/register', payload);
    return response.data;
  },

  async me() {
    const response = await httpClient.get<{ user: BackendAuthUser }>('/auth/me');
    return response.data;
  }
};

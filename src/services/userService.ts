import api from "../api/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  color: string;
  initials: string;
  status: string;
  phone?: string;
  avatar?: string;
}

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("/api/users");
  return response.data;
};

export const getCurrentUserFromAPI = async (): Promise<User> => {
  const response = await api.get("/api/users/me");
  return response.data;
};

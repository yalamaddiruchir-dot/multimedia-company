import api from "../api/api";

export interface Project {
  id: string;
  code: string;
  name: string;
  client: string;
  eventDate: string;
  status: string;
  currentStage: string;
  priority: string;
  managerName: string;
  managerId: string;
  team: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    color: string;
    initials: string;
    status: string;
  }>;
  quotation: number;
  progress: number;
  type: string;
  thumbnail?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const getProjects = async (status?: string, page = 0, size = 20): Promise<PaginatedResponse<Project>> => {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  params.append("page", page.toString());
  params.append("size", size.toString());

  const response = await api.get(`/api/projects?${params.toString()}`);
  return response.data;
};

export const getProject = async (id: string): Promise<Project> => {
  const response = await api.get(`/api/projects/${id}`);
  return response.data;
};

export const createProject = async (projectData: {
  name: string;
  client: string;
  eventDate: string;
  priority: string;
  type: string;
  quotation: number;
  teamIds?: string[];
}): Promise<Project> => {
  const response = await api.post("/api/projects", projectData);
  return response.data;
};

export const updateProjectStage = async (id: string, stage: string): Promise<Project> => {
  const response = await api.put(`/api/projects/${id}/stage?stage=${stage}`);
  return response.data;
};

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employee types
export interface Employee {
  id: number;
  name: string;
  position: string;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeInput {
  name: string;
  position: string;
}

// Shift types
export interface Shift {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  created_at?: string;
  updated_at?: string;
}

export interface ShiftInput {
  name: string;
  start_time: string;
  end_time: string;
}

// Assignment types
export interface Assignment {
  id: number;
  employee_id: number;
  shift_id: number;
  employee?: Employee;
  shift?: Shift;
  created_at?: string;
  updated_at?: string;
}

export interface AssignmentInput {
  employee_id: number;
  shift_id: number;
}

// Employee API calls
export const employeeAPI = {
  getAll: () => api.get<Employee[]>('/employees'),
  getOne: (id: number) => api.get<Employee>(`/employees/${id}`),
  create: (data: EmployeeInput) => api.post<Employee>('/employees', data),
  update: (id: number, data: EmployeeInput) => api.put<Employee>(`/employees/${id}`, data),
  delete: (id: number) => api.delete(`/employees/${id}`),
};

// Shift API calls
export const shiftAPI = {
  getAll: () => api.get<Shift[]>('/shifts'),
  getOne: (id: number) => api.get<Shift>(`/shifts/${id}`),
  create: (data: ShiftInput) => api.post<Shift>('/shifts', data),
  update: (id: number, data: ShiftInput) => api.put<Shift>(`/shifts/${id}`, data),
  delete: (id: number) => api.delete(`/shifts/${id}`),
};

// Assignment API calls
export const assignmentAPI = {
  getAll: () => api.get<Assignment[]>('/assignments'),
  getOne: (id: number) => api.get<Assignment>(`/assignments/${id}`),
  create: (data: AssignmentInput) => api.post<Assignment>('/assignments', data),
  delete: (id: number) => api.delete(`/assignments/${id}`),
};

import axios from "axios";
import { io, Socket } from "socket.io-client";

const API_URL = "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

//api.interceptors.request.use((config) => {
//  const token = localStorage.getItem("access_token");
//  if (token) {
//   config.headers.Authorization = `Bearer ${token}`;
//  }
//  return config;
//});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const createSocket = (userId: number, token: string): Socket => {
  return io(`${API_URL}/support`, {
    auth: { token },
    query: { userId: userId.toString() },
    transports: ["websocket"],
  });
};

export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post("/api/auth/login", data),
  register: (data: {
    email: string;
    password: string;
    name: string;
    contactPhone?: string;
  }) => api.post("/api/client/register", data),
  logout: () => api.post("/api/auth/logout"),
  profile: () => api.get("/api/auth/profile"),
};

export const userAPI = {
  getAll: (params?: {
    limit?: number;
    offset?: number;
    email?: string;
    name?: string;
    contactPhone?: string;
  }) => api.get("/api/admin/users", { params }),
  create: (data: {
    email: string;
    password: string;
    name: string;
    contactPhone?: string;
    role?: string;
  }) => api.post("/api/admin/users", data),
};

export const bookAPI = {
  search: (params?: {
    library?: number;
    author?: string;
    title?: string;
    availableOnly?: boolean;
  }) => api.get("/api/common/books", { params }),
  getById: (id: number) => api.get(`/api/common/books/${id}`),
  create: (data: FormData) =>
    api.post("/api/admin/books", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const libraryAPI = {
  create: (data: { name: string; address: string; description?: string }) =>
    api.post("/api/admin/libraries", data),
};

export const rentalAPI = {
  create: (data: {
    bookId: number;
    libraryId: number;
    dateStart: string;
    dateEnd: string;
  }) => api.post("/api/client/rentals", data),
};

export const supportAPI = {
  createRequest: (data: { text: string }) =>
    api.post("/api/client/support-requests", data),
  getClientRequests: (params?: { isActive?: boolean }) =>
    api.get("/api/client/support-requests", { params }),
  getManagerRequests: (params?: { isActive?: boolean }) =>
    api.get("/api/manager/support-requests", { params }),
  getMessages: (id: number) =>
    api.get(`/api/common/support-requests/${id}/messages`),
  sendMessage: (id: number, data: { text: string }) =>
    api.post(`/api/common/support-requests/${id}/messages`, data),
  markAsRead: (id: number, data: { createdBefore: string }) =>
    api.post(`/api/common/support-requests/${id}/messages/read`, data),
};

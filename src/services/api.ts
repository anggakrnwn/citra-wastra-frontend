import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Navigation callback for auth redirects
let authRedirectCallback: ((path: string) => void) | null = null;

export function setAuthRedirectCallback(callback: (path: string) => void) {
  authRedirectCallback = callback;
}

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (!error.config?.url?.includes("/auth/login")) {
        if (authRedirectCallback) {
          authRedirectCallback("/login");
        }
      }
    }
    return Promise.reject(error);
  }
);

// Prediction services
export const predictionService = {
  predict: (formData: FormData) => {
    return api.post("/api/predict", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 90000, // 90 seconds timeout for prediction (longer than backend timeout)
    });
  },

  getHistory: () => {
    return api.get("/api/predict/history");
  },
};

// Auth services
export const authService = {
  login: (email: string, password: string) => {
    return api.post("/api/auth/login", { email, password });
  },

  register: (name: string, email: string, password: string) => {
    return api.post("/api/auth/register", { name, email, password });
  },
};

export const motifService = {
  getAll: () => {
    return api.get("/api/motifs");
  },

  create: (formData: FormData) => {
    return api.post("/api/motifs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  update: (id: string, formData: FormData) => {
    return api.put(`/api/motifs/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  delete: (id: string) => {
    return api.delete(`/api/motifs/${id}`);
  },
};

export const userService = {
  getAll: () => {
    return api.get("/api/users");
  },

  updateRole: (id: string, role: string) => {
    return api.patch(`/api/users/${id}/role`, { role });
  },
};

export const uploadService = {
  upload: (formData: FormData) => {
    return api.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default api;
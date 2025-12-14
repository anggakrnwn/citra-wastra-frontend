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

const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 10000,
  onRetry?: (attempt: number, delay: number) => void
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error: any) {
      lastError = error;
      
      const shouldRetry = 
        error.response?.status === 503 ||
        error.response?.status === 504 ||
        error.code === "ECONNREFUSED" ||
        error.code === "ETIMEDOUT" ||
        error.code === "ECONNABORTED" ||
        error.message?.includes("Network Error") ||
        error.message?.includes("timeout");
      
      if (!shouldRetry || attempt === maxRetries) {
        throw error;
      }
      
      const delay = baseDelay + (attempt * 5000);
      console.log(`Service sedang memulai (attempt ${attempt + 1}/${maxRetries + 1}), menunggu ${delay/1000} detik...`);
      
      if (onRetry) {
        onRetry(attempt + 1, delay);
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Prediction services
export const predictionService = {
  predict: async (formData: FormData, retries: number = 3, onRetry?: (attempt: number, delay: number) => void) => {
    return retryRequest(
      () => api.post("/api/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000,
      }),
      retries,
      10000,
      onRetry
    );
  },

  getHistory: () => {
    return api.get("/api/predict/history");
  },

  warmUp: async () => {
    try {
      await api.get("/api/predict/history", {
        timeout: 5000,
      });
    } catch (error) {
      console.log("Warm-up request completed (errors are expected)");
    }
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

  googleAuth: (idToken: string, name: string, email: string, photoURL?: string) => {
    return api.post("/api/auth/google", { idToken, name, email, photoURL });
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

export const predictionHistoryService = {
  getAll: (params?: string) => {
    const url = params ? `/api/predict/admin/history?${params}` : "/api/predict/admin/history";
    return api.get(url);
  },

  getImageUrl: (id: string) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
    const token = localStorage.getItem("token");
    const tokenParam = token ? `?token=${encodeURIComponent(token)}` : "";
    return `${API_BASE_URL}/api/predict/admin/history/${id}/image${tokenParam}`;
  },

  delete: (id: string) => {
    return api.delete(`/api/predict/admin/history/${id}`);
  },

  bulkDelete: (ids: string[]) => {
    return api.delete("/api/predict/admin/history", { data: { ids } });
  },

  export: async (format: "json" | "csv") => {
    const response = await api.get(`/api/predict/admin/history/export?format=${format}`, {
      responseType: format === "csv" ? "blob" : "json",
    });
    
    if (format === "csv") {
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      const contentDisposition = response.headers["content-disposition"];
      let filename = `prediction-history-${Date.now()}.csv`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } else {
      const dataStr = JSON.stringify(response.data, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `prediction-history-${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }
    
    return response;
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
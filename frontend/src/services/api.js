import axios from "axios";
const api = axios.create({ baseURL: "/api", timeout: 15000 });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("expenseflow_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use((r) => r, (error) => {
  if (error.response?.status === 401 && !String(error.config?.url || "").includes("/auth/login")) {
    localStorage.removeItem("expenseflow_token");
    localStorage.removeItem("expenseflow_user");
    window.location.href = "/login";
  }
  return Promise.reject(error);
});
export const authApi = {
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me")
};
export const voucherApi = {
  list: (params = {}) => api.get("/vouchers", { params }),
  get: (id) => api.get(`/vouchers/${id}`),
  create: (data) => api.post("/vouchers", data),
  update: (id, data) => api.patch(`/vouchers/${id}`, data),
  remove: (id) => api.delete(`/vouchers/${id}`),
  submit: (id) => api.post(`/vouchers/${id}/submit`),
  employeeSignature: (id, file) => { const fd = new FormData(); fd.append("signature", file); return api.post(`/vouchers/${id}/employee-signature`, fd); },
  approve: (id, file) => { const fd = new FormData(); fd.append("signature", file); return api.post(`/vouchers/${id}/approve`, fd); },
  reject: (id, reason) => api.post(`/vouchers/${id}/reject`, { reason })
};
export const dashboardApi = { get: () => api.get("/dashboard") };
export default api;

import axios from 'axios';

// In the browser, use relative path (/api/v1) so requests go through the
// Next.js proxy rewrite → same-origin → httpOnly cookies work correctly.
// In SSR (Node.js), use the direct backend URL since the proxy doesn't apply.
const baseURL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || '/api/v1'
    : process.env.NEXT_PUBLIC_API_URL_INTERNAL || 'http://localhost:3001/api/v1';

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await apiClient.post('/auth/refresh');
        return apiClient(originalRequest);
      } catch {
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;

export const api = {
  auth: {
    login: (data: { username: string; password: string }) => apiClient.post('/auth/login', data),
    googleLogin: (token: string) => apiClient.post('/auth/google', { token }),
    logout: () => apiClient.post('/auth/logout'),
    me: () => apiClient.get('/auth/me'),
    refresh: () => apiClient.post('/auth/refresh'),
  },
  appointments: {
    list: (params?: any) => apiClient.get('/appointments', { params }),
    get: (id: string) => apiClient.get(`/appointments/${id}`),
    create: (data: any) => apiClient.post('/appointments', data),
    update: (id: string, data: any) => apiClient.put(`/appointments/${id}`, data),
    updateStatus: (id: string, data: { status: string; reason?: string }) => apiClient.post(`/appointments/${id}/status`, data),
    confirm: (id: string, reason?: string) => apiClient.post(`/appointments/${id}/confirm`, { reason }),
    reject: (id: string, reason?: string) => apiClient.post(`/appointments/${id}/reject`, { reason }),
    cancel: (id: string, reason?: string) => apiClient.post(`/appointments/${id}/cancel`, { reason }),
    complete: (id: string) => apiClient.post(`/appointments/${id}/complete`),
    addNote: (id: string, content: string) => apiClient.post(`/appointments/${id}/notes`, { content }),
    today: () => apiClient.get('/appointments/today'),
    upcoming: (limit?: number) => apiClient.get('/appointments/upcoming', { params: { limit } }),
    statusCounts: () => apiClient.get('/appointments/status-counts'),
  },
  clients: {
    list: (params?: any) => apiClient.get('/clients', { params }),
    get: (id: string) => apiClient.get(`/clients/${id}`),
    create: (data: any) => apiClient.post('/clients', data),
    update: (id: string, data: any) => apiClient.put(`/clients/${id}`, data),
    timeline: (id: string) => apiClient.get(`/clients/timeline/${id}`),
  },
  blogs: {
    list: (params?: any) => apiClient.get('/blogs', { params }),
    published: (params?: any) => apiClient.get('/blogs/published', { params }),
    get: (id: string) => apiClient.get(`/blogs/${id}`),
    bySlug: (slug: string) => apiClient.get(`/blogs/slug/${slug}`),
    getBySlug: (slug: string) => apiClient.get(`/blogs/slug/${slug}`),
    create: (data: any) => apiClient.post('/blogs', data),
    update: (id: string, data: any) => apiClient.put(`/blogs/${id}`, data),
    publish: (id: string) => apiClient.post(`/blogs/${id}/publish`),
  },
  faqs: {
    list: (params?: any) => apiClient.get('/faqs', { params }),
    published: (params?: any) => apiClient.get('/faqs', { params: { ...params, isVisible: true } }),
    categories: () => apiClient.get('/faqs/categories'),
    create: (data: any) => apiClient.post('/faqs', data),
    update: (id: string, data: any) => apiClient.put(`/faqs/${id}`, data),
    reorder: (items: any[]) => apiClient.put('/faqs/reorder/batch', { items }),
  },
  payments: {
    list: (params?: any) => apiClient.get('/payments', { params }),
    get: (id: string) => apiClient.get(`/payments/${id}`),
    create: (data: any) => apiClient.post('/payments', data),
    update: (id: string, data: any) => apiClient.put(`/payments/${id}`, data),
    revenue: (startDate?: string, endDate?: string) => apiClient.get('/payments/revenue', { params: { startDate, endDate } }),
  },
  notifications: {
    list: (params?: any) => apiClient.get('/notifications', { params }),
    unreadCount: () => apiClient.get('/notifications/unread-count'),
    markRead: (id: string) => apiClient.post(`/notifications/${id}/read`),
    markAllRead: () => apiClient.post('/notifications/read-all'),
  },
  analytics: {
    dashboard: () => apiClient.get('/analytics/dashboard'),
    appointmentTrends: (days?: number) => apiClient.get('/analytics/appointment-trends', { params: { days } }),
    revenue: (months?: number) => apiClient.get('/analytics/revenue', { params: { months } }),
  },
  auditLogs: {
    list: (params?: any) => apiClient.get('/audit-logs', { params }),
  },
  settings: {
    list: () => apiClient.get('/settings'),
    update: (key: string, value: any) => apiClient.put(`/settings/${key}`, { value }),
  },
  search: {
    global: (q: string) => apiClient.get('/search', { params: { q } }),
  },
  calendar: {
    getAppointments: (startDate: string, endDate: string) => apiClient.get('/calendar/appointments', { params: { startDate, endDate } }),
    getSlots: (date: string) => apiClient.get('/calendar/slots', { params: { date } }),
  },
};
import apiClient from "../apiClient";

export const codeDetailsApi = {
  getAll: async (params) => {
    const response = await apiClient.get("/api/app/lookup-detail", { params });
    return response.data?.items || response.data || [];
  },

  getById: async (id) => {
    // Assuming standard by-id path
    const response = await apiClient.get(`/api/app/lookup-detail/${id}/by-id`).catch(
      () => apiClient.get(`/api/app/lookup-detail/${id}`)
    );
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post("/api/app/lookup-detail", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/api/app/lookup-detail/${id}`, data);
    return response.data;
  },

  disable: async (id) => {
    // Disable requires a PUT with isActive = false and the concurrency tracking field
    const fresh = await apiClient.get(`/api/app/lookup-detail/${id}/by-id`).catch(
      () => apiClient.get(`/api/app/lookup-detail/${id}`)
    );
    const record = fresh.data;
    const payload = {
      ...record,
      isActive: false,
    };
    const response = await apiClient.put(`/api/app/lookup-detail/${id}`, payload);
    return response.data;
  },

  enable: async (id) => {
    // Assuming standard enable path
    const response = await apiClient.post(`/api/app/lookup-detail/${id}/enable`);
    return response.data;
  },
};

export default codeDetailsApi;

import apiClient from "../apiClient";

export const codesApi = {
  getAll: () => {
    // We can fetch all lookup codes
    return apiClient
      .get("/api/app/lookup")
      .then((r) => r.data?.items || r.data || []);
  },
  create: (data) => {
    console.log("[DB.codes] creating:", data);
    return apiClient.post("/api/app/lookup", data).then((r) => r.data);
  },
  update: (id, data) => {
    console.log("[DB.codes] updating:", id, data);
    return apiClient.put(`/api/app/lookup/${id}`, data).then((r) => r.data);
  },
  delete: (id) => {
    console.log("[DB.codes] deleting/disabling:", id);
    return apiClient.delete(`/api/app/lookup/${id}`).then((r) => r.data);
  },
  enable: (id) => {
    return apiClient.post(`/api/app/lookup/${id}/enable`).then((r) => r.data);
  }
};

export default codesApi;

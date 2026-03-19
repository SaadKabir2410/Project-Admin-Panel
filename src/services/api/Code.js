import apiClient from "../apiClient";

export const codesApi = {
  // Fetch all lookup records
  getAll: async () => {
    const response = await apiClient.get("/api/app/lookup");
    return response.data?.items || response.data || [];
  },

  // Fetch single record by ID before editing
  getById: async (id) => {
    const response = await apiClient.get(`/api/app/lookup/${id}/by-id`);
    return response.data;
  },

  // Create a new lookup record (stripped payload)
  create: async (data) => {
    const payload = {
      lookupCode: data.lookupCode,
      description: data.description,
      sequence: Number(data.sequence),
      isSystemIndicator: data.isSystemIndicator ?? false,
      isActive: data.isActive ?? true,
    };
    const response = await apiClient.post("/api/app/lookup", payload);
    return response.data;
  },

  // Save edited record (stripped payload)
  update: async (id, data) => {
    const payload = {
      lookupCode: data.lookupCode,
      description: data.description,
      sequence: Number(data.sequence),
      isSystemIndicator: data.isSystemIndicator ?? false,
      isActive: data.isActive ?? true,
      concurrencyStamp: data.concurrencyStamp,
    };
    const response = await apiClient.put(`/api/app/lookup/${id}`, payload);
    return response.data;
  },

  // Disable — PUT with isActive: false + concurrencyStamp
  disable: async (id) => {
    const fresh = await apiClient.get(`/api/app/lookup/${id}/by-id`);
    const record = fresh.data;
    const payload = {
      lookupCode: record.lookupCode || "",
      description: record.description || "",
      sequence: Number(record.sequence || 0),
      isSystemIndicator: !!record.isSystemIndicator,
      isActive: false,
      concurrencyStamp: record.concurrencyStamp,
    };
    const response = await apiClient.put(`/api/app/lookup/${id}`, payload);
    return response.data;
  },

  // Enable — POST with isActive: true
  enable: async (id) => {
    const response = await apiClient.post(`/api/app/lookup/${id}/enable`, {
      isActive: true,
    });
    return response.data;
  },
};

export default codesApi;

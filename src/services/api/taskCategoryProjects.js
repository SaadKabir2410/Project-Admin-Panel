import apiClient from "../apiClient";

// Dummy API to satisfy ResourcePage until backend is hooked up
export const taskCategoryProjectsApi = {
  getAll: async (params) => {
    // console.log("Fetching Task Category Projects with params:", params);
    return {
      items: [], // Empty for now, as requested "call the api later"
      totalCount: 0,
    };
  },
  create: async (data) => {
    return data;
  },
  update: async (id, data) => {
    return data;
  },
  delete: async (id) => {
    return true;
  },
};

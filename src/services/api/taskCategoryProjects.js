import apiClient from "../apiClient";

export const taskCategoryProjectsApi = {

  // GET /api/app/task-category-project/paged-list
  getAll: async (params) => {
    const response = await apiClient.get("/api/app/task-category-project/paged-list", {
      params: {
        // Match the backend's expected parameter structure: TaskCategoryProjectSearch.ProjectId
        "TaskCategoryProjectSearch.ProjectId": params.projectId || undefined,
        Sorting: params.sorting || undefined,
        SkipCount: params.skipCount ?? 0,
        MaxResultCount: params.maxResultCount ?? 10,
        "api-version": "1.0"
      },
    });
    return response.data || { items: [], totalCount: 0 };
  },

  // GET /api/app/task-category-project/task-categories-by-project-id/{projectId}
  getCategoriesByProjectId: async (projectId) => {
    const response = await apiClient.get(
      `/api/app/task-category-project/task-categories-by-project-id/${projectId}`
    );
    return response.data || [];
  },

  // GET /api/app/task-category-project/task-categories-ids-by-project-id/{projectId}
  getCategoryIdsByProjectId: async (projectId) => {
    const response = await apiClient.get(
      `/api/app/task-category-project/task-categories-ids-by-project-id/${projectId}`
    );
    return response.data || [];
  },

  // POST /api/app/task-category-project/many
  // Body: { projectId, taskCategoryIds: [...] }
  create: async ({ projectId, taskCategoryIds }) => {
    const response = await apiClient.post("/api/app/task-category-project/many", {
      projectId,
      taskCategoryIds,
    });
    return response.data;
  },

  // PUT /api/app/task-category-project/many
  // Body: { id, projectId, taskCategoryIds, concurrencyStamp }
  update: async ({ id, projectId, taskCategoryIds, concurrencyStamp }) => {
    const response = await apiClient.put("/api/app/task-category-project/many", {
      id,
      projectId,
      taskCategoryIds,
      concurrencyStamp,
    });
    return response.data;
  },

  // DELETE /api/app/task-category-project?projectId={uuid}
  delete: async (projectId) => {
    const response = await apiClient.delete("/api/app/task-category-project", {
      params: { projectId },
    });
    return response.data;
  },

  entityName: "TaskCategoryProject",
  id: "taskCategoryProject",
};

export default taskCategoryProjectsApi;
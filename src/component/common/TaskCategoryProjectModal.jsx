import { useState, useEffect } from "react";
import { Dialog, IconButton } from "@mui/material";
import { codesApi } from "../../services/api/Code";
import codeDetailsApi from "../../services/api/CodeDetails";
import { taskCategoryProjectsApi } from "../../services/api/taskCategoryProjects";
import { useToast } from "./ToastContext";

export default function TaskCategoryProjectModal({ open, onClose, onSave, preSelectedProject }) {
  const { toast } = useToast();

  const [projectId, setProjectId] = useState("");        // UUID
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);  // array of UUIDs
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [existingRecord, setExistingRecord] = useState(null);
  const [isHandoffEdit, setIsHandoffEdit] = useState(false);

  // Mark if we started in edit mode (from table actions)
  useEffect(() => {
    if (open) {
      setIsHandoffEdit(!!preSelectedProject);
    }
  }, [open, preSelectedProject]);

  // Fetch Existing Mapping when Project Changes
  useEffect(() => {
    if (!open || !projectId) {
      setExistingRecord(null);
      setSelectedCategories([]);
      return;
    }

    const fetchExisting = async () => {
      setLoading(true);
      try {
        // 1. Fetch current mappings to find the one for this project
        const resp = await taskCategoryProjectsApi.getAll({ skipCount: 0, maxResultCount: 1000 });
        const record = resp.items?.find((i) => i.projectId === projectId);

        if (record) {
          setExistingRecord(record);
          // 2. Fetch specific IDs for this project
          const ids = await taskCategoryProjectsApi.getCategoryIdsByProjectId(projectId);
          
          // ONLY pre-fill if we explicitly came from the table Edit action
          // If we are in 'New' mode, keep it unmarked per user request
          if (isHandoffEdit) {
            setSelectedCategories(Array.isArray(ids) ? ids : []);
          } else {
            setSelectedCategories([]);
          }
        } else {
          setExistingRecord(null);
          setSelectedCategories([]);
        }
      } catch (err) {
        console.error("Failed to fetch existing mapping", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExisting();
  }, [projectId, open, isHandoffEdit]);

  // Initial Data Load (Projects & Categories)
  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const allLookups = await codesApi.getAll();

        // Load Projects
        const projectLookup = allLookups.find((l) => l.lookupCode === "PRJ");
        if (projectLookup) {
          const pDetails = await codeDetailsApi.getAll({ lookupId: projectLookup.id });
          const pList = pDetails.map((d) => ({ id: d.id, name: d.description || d.newCode }));
          setProjects(pList);

          // Pre-select project if passed in
          if (preSelectedProject) {
            const matched = pList.find(
              (p) => p.id === preSelectedProject.id || p.name === preSelectedProject.name
            );
            setProjectId(matched?.id || "");
          } else {
            setProjectId("");
          }
        }

        // Load Task Categories
        const taskCategoryLookup = allLookups.find((l) => l.lookupCode === "TSK");
        if (taskCategoryLookup) {
          const cDetails = await codeDetailsApi.getAll({ lookupId: taskCategoryLookup.id });
          setCategories(cDetails.map((d) => ({ id: d.id, name: d.description || d.newCode })));
        }
      } catch (err) {
        toast("Error loading projects/categories", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, preSelectedProject, toast]);

  const handleToggle = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSave = async () => {
    if (!projectId) {
      toast("Please select a project", "error");
      return;
    }
    if (selectedCategories.length === 0) {
      toast("Please select at least one category", "error");
      return;
    }

    setSubmitting(true);
    try {
      if (existingRecord) {
        // Update existing record
        await taskCategoryProjectsApi.update({
          id: existingRecord.id,
          projectId,
          taskCategoryIds: selectedCategories,
          concurrencyStamp: existingRecord.concurrencyStamp
        });
        toast("Task Category Project(s) updated successfully!");
      } else {
        // Create new record
        await taskCategoryProjectsApi.create({
          projectId,
          taskCategoryIds: selectedCategories,
        });
        toast("Task Category Project(s) created successfully!");
      }
      
      if (onSave) onSave();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || "Failed to save mappings";
      toast(errorMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          bgcolor: document.documentElement.classList.contains("dark") ? "#000000" : "#ffffff",
          padding: "4px",
          border: "1px solid",
          borderColor: document.documentElement.classList.contains("dark")
            ? "rgba(255,255,255,0.05)"
            : "#e2e8f0",
        },
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <h2 className="text-[18px] font-black text-slate-800 dark:text-slate-100 tracking-tighter uppercase leading-none">
          New Task Category Project
        </h2>
        <IconButton onClick={onClose} size="small" disabled={submitting}>
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </IconButton>
      </div>

      <div className="px-5 py-2">
        {/* Project Select */}
        <div className="mb-4 mt-2">
          <label className="block text-[10.5px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
            Project <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              disabled={loading || submitting}
              className="w-full appearance-none bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs rounded-lg pl-3 pr-8 py-2.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer shadow-sm"
            >
              <option value="" disabled className="text-slate-400">Choose An Option</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Checkbox List */}
        <label className="block text-[10.5px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
          Select Categories <span className="text-red-500">*</span>
        </label>
        <div className="space-y-1.5 pr-1 max-h-[300px] overflow-y-auto no-scrollbar py-1">
          {loading ? (
            <div className="py-10 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Loading...
            </div>
          ) : categories.length === 0 ? (
            <div className="py-10 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest">
              No categories found in lookup
            </div>
          ) : (
            categories.map((cat) => (
              <label
                key={cat.id}
                className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition-all
                  ${selectedCategories.includes(cat.id)
                    ? "bg-blue-50 border-blue-200 dark:bg-blue-600/10 dark:border-blue-500/30"
                    : "bg-white border-slate-100 dark:bg-black dark:border-white/5 hover:border-slate-200"
                  }`}
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => handleToggle(cat.id)}
                    disabled={submitting}
                    className="peer appearance-none w-4 h-4 rounded border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                  />
                  <svg
                    className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={4}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className={`text-[11px] font-black uppercase tracking-tight
                  ${selectedCategories.includes(cat.id)
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {cat.name}
                </span>
              </label>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 px-5 pt-5 pb-3">
        <button
          onClick={onClose}
          disabled={submitting}
          className="h-[30px] px-6 rounded-lg text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={submitting || loading}
          className="h-[30px] px-8 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-[10.5px] font-black uppercase shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {submitting ? "Processing..." : "Save Mapping"}
        </button>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `}</style>
    </Dialog>
  );
}
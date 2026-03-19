import { useState, useMemo } from "react";
import ResourcePage from "../component/common/ResourcePage";
import { taskCategoryProjectsApi } from "../services/api/taskCategoryProjects";

export default function TaskCategoryProjectsPage() {
  const [projectFilter, setProjectFilter] = useState("");

  // "no row and column" requested by user for the initial setup. 
  // We provide a single empty shell column to avoid crashing the DataGrid.
  const columns = useMemo(() => [
    { key: "name", label: "NAME" },
    { key: "project", label: "PROJECT" },
  ], []);

  const handleClear = () => {
    setProjectFilter("");
  };

  const extraParams = useMemo(() => {
    const p = {};
    if (projectFilter) p.project = projectFilter;
    return p;
  }, [projectFilter]);

  const customFilterArea = (
    <div className="flex items-end gap-3 w-full sm:w-auto mt-4 sm:mt-0">
      <div className="flex flex-col flex-1 min-w-[200px]">
        <span className="text-[10px] text-slate-400 mb-1 ml-1 uppercase tracking-wider font-semibold">
          Project
        </span>
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="w-full px-3 py-2 bg-white dark:bg-[#1e2436] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-700 dark:text-slate-200 outline-none hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
        >
          <option value="" className="text-slate-400">Choose an option</option>
          <option value="AMS">AMS</option>
          <option value="central monitoring">central monitoring</option>
          <option value="LIS">LIS</option>
        </select>
      </div>
      
      <button
        onClick={handleClear}
        className="px-4 py-2 bg-white dark:bg-[#1e2436] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-medium text-slate-400 hover:text-blue-500 hover:border-blue-500/30 transition-all shadow-sm shrink-0 active:scale-95 h-[34px]"
        title="Clear Filters"
      >
        Clear
      </button>
    </div>
  );

  return (
    <ResourcePage
      title="Task Category Projects"
      apiObject={taskCategoryProjectsApi}
      columns={columns}
      showPagination={true}
      createButtonText="New Task Category Projects"
      customFilterArea={customFilterArea}
      extraParams={extraParams}
      searchPlaceholder="Search task categories..."
      entityName="Task Category"
      breadcrumb={["Home", "Management", "Lookups", "Task Category Projects"]}
    />
  );
}

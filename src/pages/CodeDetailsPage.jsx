import { useState, useRef } from "react";
import ResourcePage from "../component/common/ResourcePage";
import codeDetailsApi from "../services/api/CodeDetails";
import { useToast } from "../component/common/ToastContext";

export default function CodeDetailsPage() {
  const { toast } = useToast();
  const refetchRef = useRef(null);

  // Custom API wrapper to ensure at least one empty row always exists for inline input
  const inlineApi = {
    ...codeDetailsApi,
    getAll: async (p) => {
      try {
        const data = await codeDetailsApi.getAll(p);
        if (!data || data.length === 0) {
          return [{
            id: "draft-1",
            code: "",
            lookupCode: "",
            description: "",
            value1: "",
            value2: "",
            groupCode: "",
            groupCodeDetail: "",
            hasSubCategory: false,
            sequence: 0,
            isDefaultIndicator: false,
            isSystemIndicator: false,
            extraDescription: "",
          }];
        }
        return data;
      } catch (err) {
        return [{
            id: "draft-1",
            code: "",
            lookupCode: "",
            description: "",
            value1: "",
            value2: "",
            groupCode: "",
            groupCodeDetail: "",
            hasSubCategory: false,
            sequence: 0,
            isDefaultIndicator: false,
            isSystemIndicator: false,
            extraDescription: "",
        }];
      }
    }
  };

  const getInputStyle = (width = "w-full") => 
    `h-[32px] bg-[#f1f3f5] dark:bg-slate-800 rounded-lg px-2.5 text-xs outline-none border border-transparent focus:border-blue-500 transition-colors ${width}`;

  const getTextAreaStyle = (width = "w-full") => 
    `h-[34px] py-1.5 resize-none no-scrollbar bg-[#f1f3f5] dark:bg-slate-800 rounded-lg px-2.5 text-xs leading-tight outline-none border border-transparent focus:border-blue-500 transition-colors break-words ${width}`;

  const columns = [
    { 
      key: "code", 
      label: "CODE", 
      flex: 0.8,
      minWidth: 60,
      render: (val) => <textarea className={getTextAreaStyle()} defaultValue={val} />
    },
    { 
      key: "lookupCode", 
      label: "LOOKUP CODE", 
      flex: 1,
      minWidth: 80,
      render: (val) => <div className="text-[10px] font-medium text-slate-500 tracking-wide break-words whitespace-normal w-full">{val || ""}</div> 
    },
    { 
      key: "description", 
      label: "DESCRIPTION", 
      flex: 1.5,
      minWidth: 100,
      render: (val) => <textarea className={getTextAreaStyle()} defaultValue={val} /> 
    },
    { 
      key: "value1", 
      label: "VALUE 1", 
      flex: 0.8,
      minWidth: 60,
      render: (val) => <textarea className={getTextAreaStyle()} defaultValue={val} /> 
    },
    { 
      key: "value2", 
      label: "VALUE 2", 
      flex: 0.8,
      minWidth: 60,
      render: (val) => <textarea className={getTextAreaStyle()} defaultValue={val} /> 
    },
    { 
      key: "groupCode", 
      label: "GROUP CODE", 
      flex: 1,
      minWidth: 80,
      render: (val) => <textarea className={getTextAreaStyle()} defaultValue={val} /> 
    },
    { 
      key: "groupCodeDetail", 
      label: "GROUP CODE DETAIL", 
      flex: 1.2,
      minWidth: 110,
      render: (val) => <textarea className={getTextAreaStyle()} defaultValue={val} /> 
    },
    {
      key: "hasSubCategory",
      label: "HAS SUB CATEGORY",
      flex: 1,
      minWidth: 100,
      render: (val) => <div className="w-full"></div>
    },
    { 
      key: "sequence", 
      label: "SEQUENCE", 
      flex: 0.8,
      minWidth: 70,
      render: (val) => <input type="number" className={getInputStyle("w-full text-center font-medium")} defaultValue={val ?? 0} /> 
    },
    {
      key: "isDefaultIndicator",
      label: "DEFAULT INDICATOR",
      flex: 1,
      minWidth: 100,
      render: (val) => <div className="w-full"></div>
    },
    {
      key: "isSystemIndicator",
      label: "SYSTEM INDICATOR",
      flex: 1,
      minWidth: 100,
      render: (val) => <div className="w-full"></div>
    },
    { 
      key: "extraDescription", 
      label: "EXTRA DESCRIPTION", 
      flex: 1.5,
      minWidth: 100,
      render: (val) => <textarea className={getTextAreaStyle()} defaultValue={val} /> 
    },
  ];

  const customSearch = (
    <div className="flex items-end gap-3 w-full sm:w-auto mt-4 sm:mt-0 flex-1">
      <div className="flex flex-col flex-1 min-w-[300px] w-full max-w-[80%] relative">
        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
          LOOKUP CODE <span className="text-red-500">*</span>
        </span>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search Code..."
            className="w-full bg-slate-50 border border-slate-200 dark:bg-[#242938] dark:border-slate-600/50 text-slate-700 dark:text-slate-300 text-xs rounded-lg pl-3 pr-8 py-2 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 transition-all box-border shadow-sm"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ResourcePage
        title="Code Details"
        apiObject={inlineApi}
        columns={columns}
        breadcrumb={["Home", "Lookup", "Code Details"]}
        showSearchBar={false}
        showFilterBar={true}
        showActions={false}
        showPagination={false}
        entityName="CodeDetails"
        customFilterArea={customSearch}
        onRefetchReady={(fn) => { refetchRef.current = fn; }}
      />

      <style>{`
        /* Remove borders from rows and columns as requested */
        .MuiDataGrid-root {
          border: none !important;
        }
        .MuiDataGrid-columnHeaders {
          border-bottom: none !important;
          background: transparent !important;
        }
        .MuiDataGrid-columnSeparator {
          display: none !important;
        }
        .MuiDataGrid-row {
          border: none !important;
        }
        .MuiDataGrid-cell {
          border: none !important;
        }
        .MuiDataGrid-cell:focus, .MuiDataGrid-cell:focus-within {
          outline: none !important;
        }
        .MuiDataGrid-columnHeaderTitle {
          font-weight: 800 !important;
          font-size: 10px !important;
          color: #8f9baa !important;
          letter-spacing: 0.5px !important;
          white-space: normal !important;
          line-height: 1.3 !important;
        }
      `}</style>
    </>
  );
}

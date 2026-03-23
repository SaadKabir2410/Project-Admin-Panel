import { useState, useEffect } from "react";
import { Dialog, IconButton } from "@mui/material";
import codeDetailsApi from "../../services/api/CodeDetails";
import codesApi from "../../services/api/Code"; // in case we use it

const EMPTY_FORM = {
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
};

export default function CodeDetailsModal({
  open,
  onClose,
  onSubmit,
  item = null,
}) {
  const isEdit = !!item;
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [fetchedRecord, setFetchedRecord] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setError(null);
      setSubmitting(false);

      if (isEdit && item) {
        const fetchFreshRecord = async () => {
          setSubmitting(true);
          try {
            const record = await codeDetailsApi.getById(item.id);
            setFetchedRecord(record);
            setFormData({
              code: record.code || "",
              lookupCode: record.lookupCode || "",
              description: record.description || "",
              value1: record.value1 || "",
              value2: record.value2 || "",
              groupCode: record.groupCode || "",
              groupCodeDetail: record.groupCodeDetail || "",
              hasSubCategory: !!record.hasSubCategory,
              sequence: record.sequence ?? 0,
              isDefaultIndicator: !!record.isDefaultIndicator,
              isSystemIndicator: !!record.isSystemIndicator,
              extraDescription: record.extraDescription || "",
            });
          } catch {
            setError("Failed to fetch record details for editing.");
          } finally {
            setSubmitting(false);
          }
        };
        fetchFreshRecord();
      } else {
        setFetchedRecord(null);
        setFormData(EMPTY_FORM);
      }
    }
  }, [open, isEdit, item]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        code: formData.code,
        lookupCode: formData.lookupCode,
        description: formData.description,
        value1: formData.value1,
        value2: formData.value2,
        groupCode: formData.groupCode,
        groupCodeDetail: formData.groupCodeDetail,
        hasSubCategory: formData.hasSubCategory,
        sequence: Number(formData.sequence),
        isDefaultIndicator: formData.isDefaultIndicator,
        isSystemIndicator: formData.isSystemIndicator,
        extraDescription: formData.extraDescription,
        // System defaults for Create, preserved overrides for Edit
        isActive: isEdit && fetchedRecord ? fetchedRecord.isActive : true,
        concurrencyStamp: isEdit && fetchedRecord ? fetchedRecord.concurrencyStamp : "",
      };

      await onSubmit(payload);
    } catch (err) {
      const apiError =
        err?.response?.data?.error?.validationErrors?.[0]?.message ||
        err?.response?.data?.error?.message ||
        err?.message ||
        "Something went wrong.";
      setError(apiError);
    } finally {
      if (!isEdit) {
        setSubmitting(false);
      } else {
        setSubmitting(false);
      }
    }
  };

  const getInputClass = (isTextarea = false) => {
    return `w-full px-4 py-2.5 rounded-xl border outline-none text-sm transition-all bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-[#242938] dark:border-white/10 dark:text-slate-200 ${isTextarea ? "min-h-[100px] resize-y" : ""}`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "16px", bgcolor: "background.paper" },
        className: "bg-white dark:bg-[#1e2436] dark:text-white",
      }}
    >
      <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100 dark:border-white/5">
        <h2 className="text-lg font-medium text-slate-800 dark:text-white">
          {isEdit ? "Edit Code Detail" : "Add Code Detail"}
        </h2>
        <IconButton onClick={onClose} size="small" disabled={submitting}>
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </IconButton>
      </div>

      <div className="px-6 py-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Removed grid layout as requested: "no rows and column recommended" -> using space-y-4 instead */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1.5 ml-1 font-medium">
              Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              className={getInputClass()}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1.5 ml-1 font-medium">
              Lookup Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lookupCode"
              value={formData.lookupCode}
              onChange={handleChange}
              required
              className={getInputClass()}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1.5 ml-1 font-medium">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={getInputClass()}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1.5 ml-1 font-medium">
              Value 1
            </label>
            <input
              type="text"
              name="value1"
              value={formData.value1}
              onChange={handleChange}
              className={getInputClass()}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1.5 ml-1 font-medium">
              Value 2
            </label>
            <input
              type="text"
              name="value2"
              value={formData.value2}
              onChange={handleChange}
              className={getInputClass()}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1.5 ml-1 font-medium">
              Group Code
            </label>
            <input
              type="text"
              name="groupCode"
              value={formData.groupCode}
              onChange={handleChange}
              className={getInputClass()}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1.5 ml-1 font-medium">
              Group Code Detail
            </label>
            <input
              type="text"
              name="groupCodeDetail"
              value={formData.groupCodeDetail}
              onChange={handleChange}
              className={getInputClass()}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1.5 ml-1 font-medium">
              Sequence <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="sequence"
              min={0}
              step={1}
              value={formData.sequence}
              onChange={handleChange}
              required
              className={getInputClass()}
              disabled={submitting}
            />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <label className="flex items-center gap-3 w-fit cursor-pointer">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  name="hasSubCategory"
                  checked={formData.hasSubCategory}
                  onChange={handleChange}
                  className="peer w-5 h-5 opacity-0 absolute cursor-pointer"
                  disabled={submitting}
                />
                <div className="w-5 h-5 rounded-[6px] border-[1.5px] border-slate-300 dark:border-white/20 bg-white dark:bg-[#1e2436] peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                  {formData.hasSubCategory && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Has Sub Category
              </span>
            </label>

            <label className="flex items-center gap-3 w-fit cursor-pointer">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  name="isDefaultIndicator"
                  checked={formData.isDefaultIndicator}
                  onChange={handleChange}
                  className="peer w-5 h-5 opacity-0 absolute cursor-pointer"
                  disabled={submitting}
                />
                <div className="w-5 h-5 rounded-[6px] border-[1.5px] border-slate-300 dark:border-white/20 bg-white dark:bg-[#1e2436] peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                  {formData.isDefaultIndicator && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Default Indicator
              </span>
            </label>

            <label className="flex items-center gap-3 w-fit cursor-pointer">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  name="isSystemIndicator"
                  checked={formData.isSystemIndicator}
                  onChange={handleChange}
                  className="peer w-5 h-5 opacity-0 absolute cursor-pointer"
                  disabled={submitting}
                />
                <div className="w-5 h-5 rounded-[6px] border-[1.5px] border-slate-300 dark:border-white/20 bg-white dark:bg-[#1e2436] peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                  {formData.isSystemIndicator && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                System Indicator
              </span>
            </label>
          </div>

          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1.5 ml-1 font-medium">
              Extra Description
            </label>
            <textarea
              name="extraDescription"
              value={formData.extraDescription}
              onChange={handleChange}
              className={getInputClass(true)}
              disabled={submitting}
            />
          </div>

        </form>
      </div>

      <div className="flex items-center justify-end gap-3 px-6 pt-4 pb-5 border-t border-slate-100 dark:border-white/5">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="px-5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors dark:text-slate-300 dark:hover:bg-white/10"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm font-medium transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] flex items-center justify-center"
        >
          {submitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : isEdit ? "Save Changes" : "Create"}
        </button>
      </div>
    </Dialog>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw, FileText, ArrowLeftRight } from "lucide-react";

const STATUS_OPTIONS = ["Closed", "All", "Open", "Void"];
const TICKET_TYPES = [
  "service planed",
  "service demand",
  "inquiry",
  "complain",
];

export default function AMSTicketsReportPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    cmsNextTicketNo: "",
    dateFrom: "",
    dateTo: "",
    status: "All",
    country: "",
    ticketType: "",
    customer: "",
    workDoneCode: "",
    performed: "",
    ticketNumber: "",
  });

  const handleClear = () => {
    setFilters({
      cmsNextTicketNo: "",
      dateFrom: "",
      dateTo: "",
      status: "All",
      country: "",
      ticketType: "",
      customer: "",
      workDoneCode: "",
      performed: "",
      ticketNumber: "",
    });
  };

  const handleGetReport = () => {
    alert("Generating AMS Tickets Report...");
  };

  const handleCompareTicket = () => {
    alert("Comparing Tickets...");
  };

  const filterInputClass =
    "pl-3 pr-3 py-2.5 text-[11px] font-bold bg-white dark:bg-[#242938] border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 shadow-sm w-full";

  return (
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in duration-500">
      <div className="bg-white dark:bg-[#1e2436] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden flex flex-col">
        {/* Header Section */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
            <span
              onClick={() => navigate("/")}
              className="hover:text-blue-500 cursor-pointer transition-colors"
            >
              Home
            </span>
            <span>/</span>
            <span>Management</span>
            <span>/</span>
            <span>Reports</span>
            <span>/</span>
            <span className="text-blue-500 font-black">AMS Tickets Report</span>
          </nav>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <button
                onClick={() => navigate(-1)}
                className="p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-400 hover:text-blue-500 hover:border-blue-500/30 transition-all active:scale-95 shadow-sm"
              >
                <ArrowLeft size={22} />
              </button>
              <div>
                <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
                  AMS Tickets Report
                </h1>
              </div>
            </div>

            {/* Small Action Buttons in Header */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#242938] border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-rose-500 hover:border-rose-500/30 transition-all active:scale-95 shadow-sm"
              >
                <RotateCcw size={14} />
                Clear
              </button>
              <button
                onClick={handleGetReport}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-blue-500/20"
              >
                <FileText size={14} />
                Get Report
              </button>
              <button
                onClick={handleCompareTicket}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-emerald-500/20"
              >
                <ArrowLeftRight size={14} />
                Compare Ticket
              </button>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="px-8 py-6 bg-white dark:bg-transparent space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black tracking-widest text-slate-400 ml-1 uppercase">
                CMS Next Ticket No
              </label>
              <input
                type="text"
                placeholder="Enter ticket no..."
                value={filters.cmsNextTicketNo}
                onChange={(e) =>
                  setFilters({ ...filters, cmsNextTicketNo: e.target.value })
                }
                className={filterInputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black tracking-widest text-slate-400 ml-1 uppercase">
                Ticket Closed Data From
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value })
                }
                className={filterInputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black tracking-widest text-slate-400 ml-1 uppercase">
                Ticket Closed Data To
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value })
                }
                className={filterInputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black tracking-widest text-slate-400 ml-1 uppercase">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className={filterInputClass}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black tracking-widest text-slate-400 ml-1 uppercase">
                Country
              </label>
              <input
                type="text"
                placeholder="Country..."
                value={filters.country}
                onChange={(e) =>
                  setFilters({ ...filters, country: e.target.value })
                }
                className={filterInputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black tracking-widest text-slate-400 ml-1 uppercase">
                Ticket Type
              </label>
              <select
                value={filters.ticketType}
                onChange={(e) =>
                  setFilters({ ...filters, ticketType: e.target.value })
                }
                className={filterInputClass}
              >
                <option value="">Choose an option</option>
                {TICKET_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black tracking-widest text-slate-400 ml-1 uppercase">
                Customer
              </label>
              <input
                type="text"
                placeholder="Customer..."
                value={filters.customer}
                onChange={(e) =>
                  setFilters({ ...filters, customer: e.target.value })
                }
                className={filterInputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black tracking-widest text-slate-400 ml-1 uppercase">
                Work Done Code
              </label>
              <input
                type="text"
                placeholder="Work code..."
                value={filters.workDoneCode}
                onChange={(e) =>
                  setFilters({ ...filters, workDoneCode: e.target.value })
                }
                className={filterInputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black tracking-widest text-slate-400 ml-1 uppercase">
                Performed
              </label>
              <input
                type="text"
                placeholder="Performed by..."
                value={filters.performed}
                onChange={(e) =>
                  setFilters({ ...filters, performed: e.target.value })
                }
                className={filterInputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black tracking-widest text-slate-400 ml-1 uppercase">
                Ticket number
              </label>
              <input
                type="text"
                placeholder="Ticket no..."
                value={filters.ticketNumber}
                onChange={(e) =>
                  setFilters({ ...filters, ticketNumber: e.target.value })
                }
                className={filterInputClass}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

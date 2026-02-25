import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Plus, MoreVertical, Eye, Pencil, Trash2,
    Loader2, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
    ChevronDown, ChevronUp, ArrowLeft
} from 'lucide-react';
import { DataGrid } from '@mui/x-data-grid';
import { useResource } from "../hooks/useResource";
import { useToast } from './Toast';

function ActionsMenu({ onDetail, onEdit }) {
    const [open, setOpen] = useState(false);
    const ref = useRef();
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(!open)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors text-slate-400">
                <MoreVertical size={16} />
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#1e2436] rounded-xl border border-slate-200 dark:border-white/10 shadow-xl z-50 py-1 overflow-hidden animate-fade-in">
                    <button onClick={() => { onDetail(); setOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-500 transition-colors">
                        <Eye size={14} /> View Details
                    </button>
                    <button onClick={() => { onEdit(); setOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-500 transition-colors">
                        <Pencil size={14} /> Update Data
                    </button>
                </div>
            )}
        </div>
    );
}

export default function ResourcePage({
    title, apiObject, columns, ModalComponent, DetailComponent, DeleteModal,
    searchPlaceholder = "Search records...", createButtonText = "New",
    breadcrumb = []
}) {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [sortKey, setSortKey] = useState(columns[0]?.key || 'id');
    const [sortDir, setSortDir] = useState('desc');
    const [activeItem, setActiveItem] = useState(null);
    const [modals, setModals] = useState({ create: false, edit: false, detail: false });



    // Debounce search: waits 500ms after typing stops before calling API
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const params = useMemo(() => ({
        search: debouncedSearch,
        page,
        perPage,
        sortKey,
        sortDir
    }), [debouncedSearch, page, perPage, sortKey, sortDir]);
    const { data, total, totalPages, loading, refetch } = useResource(apiObject, params);

    // Enforce page size in UI in case server returns too much data
    const visibleData = useMemo(() => {
        if (!data) return [];
        // If server data length exceeds perPage, it's likely the server ignored the limit
        // In that case, we slice it on the client as a fallback.
        return data.length > perPage ? data.slice(0, perPage) : data;
    }, [data, perPage]);

    const onHandleCreate = async (p) => {
        try {
            await apiObject.create(p);
            toast(`${title} created!`);
            setModals(m => ({ ...m, create: false }));
            refetch();
        } catch (error) {
            console.error("Create failed:", error);
            toast(`Failed to create ${title}: ` + (error.response?.data?.message || error.message || 'Server Error'));
        }
    };
    const onHandleUpdate = async (p) => {
        try {
            await apiObject.update(activeItem.id, p);
            toast(`${title} updated!`);
            setModals(m => ({ ...m, edit: false }));
            refetch();
        } catch (error) {
            console.error("Update failed:", error);
            toast(`Failed to update ${title}: ` + (error.response?.data?.message || error.message || 'Server Error'));
        }
    };

    const handleSort = (key) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortKey(key); setSortDir('asc'); }
    }

    const handleNextPage = () => {
        if (page < totalPages) setPage(p => p + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(p => p - 1);
    };

    const SortIcon = ({ col }) => {
        if (sortKey !== col) return <ChevronDown size={12} className="text-slate-300 dark:text-slate-600" />
        return sortDir === 'asc' ? <ChevronUp size={12} className="text-blue-500" /> : <ChevronDown size={12} className="text-blue-500" />
    }

    const muiColumns = useMemo(() => {
        const cols = columns.map(col => ({
            field: col.key,
            headerName: col.label,
            flex: 1,
            minWidth: 150,
            renderCell: (params) => {
                const val = params.value;
                const row = params.row;
                if (col.render) {
                    return col.render(val, row);
                }
                return (
                    <span className={`text-sm ${col.bold ? 'font-bold text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                        {val || '—'}
                    </span>
                );
            }
        }));

        cols.push({
            field: 'actions',
            headerName: 'ACTIONS',
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <ActionsMenu
                    onDetail={() => { setActiveItem(params.row); setModals(m => ({ ...m, detail: true })) }}
                    onEdit={() => { setActiveItem(params.row); setModals(m => ({ ...m, edit: true })) }}
                />
            )
        });

        return cols;
    }, [columns]);

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            {/* Breadcrumb */}
            {breadcrumb.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    {breadcrumb.map((item, i) => (
                        <span key={i} className="flex items-center gap-2">
                            <span
                                onClick={() => item === 'Home' && navigate('/')}
                                className={`${item === 'Home' ? 'hover:text-blue-500 cursor-pointer' : ''} transition-colors`}
                            >
                                {item}
                            </span>
                            {i < breadcrumb.length - 1 && <span>/</span>}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex justify-between items-end">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-400 hover:text-blue-500 hover:border-blue-500/30 transition-all active:scale-95"
                        title="Go Back"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-none">{title}</h1>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Management Portal</p>
                    </div>
                </div>
                <button onClick={() => setModals(m => ({ ...m, create: true }))} className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-95">
                    <Plus size={18} /> {createButtonText}
                </button>
            </div>

            <div className="bg-white dark:bg-[#1e2436] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                    <div className="relative max-w-md">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 text-sm bg-white dark:bg-[#242938] border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={14} /></button>}
                    </div>
                </div>

                <div className="w-full bg-white dark:bg-[#1e2436]">
                    <DataGrid
                        autoHeight
                        rows={visibleData}
                        columns={muiColumns}
                        rowCount={total || 0}
                        loading={loading}
                        pageSizeOptions={[2, 5, 10, 25, 50]}
                        paginationModel={{ page: page - 1, pageSize: perPage }}
                        paginationMode="server"
                        filterMode="server"
                        hideFooter={true} // Hide default footer to use custom pagination
                        onPaginationModelChange={(newModel) => {
                            setPage(newModel.page + 1);
                            setPerPage(newModel.pageSize);
                        }}
                        sortModel={[{ field: sortKey, sort: sortDir }]}
                        sortingMode="server"
                        onSortModelChange={(newModel) => {
                            if (newModel.length > 0) {
                                setSortKey(newModel[0].field);
                                setSortDir(newModel[0].sort);
                            } else {
                                setSortKey(columns[0]?.key || 'id');
                                setSortDir('desc');
                            }
                        }}
                        disableRowSelectionOnClick
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-cell': {
                                borderColor: 'rgba(226, 232, 240, 1)',
                                display: 'flex',
                                alignItems: 'center',
                                outline: 'none !important',
                                overflow: 'visible !important',
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: 'rgba(248, 250, 252, 0.5)',
                                borderColor: 'rgba(226, 232, 240, 1)',
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                            },
                            '& .MuiDataGrid-footerContainer': {
                                display: 'none'
                            }
                        }}
                        className="dark:text-slate-300! [&_.MuiDataGrid-cell]:dark:border-white/5! [&_.MuiDataGrid-columnHeaders]:dark:bg-white/2! [&_.MuiDataGrid-columnHeaders]:dark:border-white/5! [&_.MuiDataGrid-footerContainer]:dark:border-white/5! [&_.MuiDataGrid-iconSeparator]:dark:hidden!"
                    />
                </div>

                {/* Custom Pagination Footer */}
                <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/1 flex items-center justify-between">
                    <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Showing <span className="text-slate-900 dark:text-white">{total > 0 ? (page - 1) * perPage + 1 : 0}</span> to <span className="text-slate-900 dark:text-white">{Math.min(page * perPage, total)}</span> of <span className="text-slate-900 dark:text-white">{total}</span> results
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={page === 1 || loading}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-bold transition-all ${page === 1 || loading
                                ? 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                : 'bg-white dark:bg-[#242938] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-blue-500/50 hover:text-blue-500 active:scale-95 shadow-sm'
                                }`}
                        >
                            <ChevronLeft size={16} /> Prev
                        </button>

                        <div className="flex items-center px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-bold">
                            Page {page} of {totalPages || 1}
                        </div>

                        <button
                            onClick={handleNextPage}
                            disabled={page >= (totalPages || 1) || loading}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-bold transition-all ${page >= (totalPages || 1) || loading
                                ? 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                : 'bg-white dark:bg-[#242938] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-blue-500/50 hover:text-blue-500 active:scale-95 shadow-sm'
                                }`}
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ModalComponent
                open={modals.create}
                onClose={() => setModals(m => ({ ...m, create: false }))}
                onSubmit={onHandleCreate}
            />
            <ModalComponent
                open={modals.edit}
                item={activeItem}
                ticket={activeItem} // Backwards compatibility
                site={activeItem}   // Backwards compatibility
                onClose={() => setModals(m => ({ ...m, edit: false }))}
                onSubmit={onHandleUpdate}
            />
            {DetailComponent && (
                <DetailComponent
                    open={modals.detail}
                    item={activeItem}
                    ticket={activeItem}
                    site={activeItem}
                    onClose={() => setModals(m => ({ ...m, detail: false }))}
                />
            )}
        </div>
    );
}

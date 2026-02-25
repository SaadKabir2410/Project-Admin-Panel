import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, IconButton, Autocomplete, TextField } from '@mui/material';
import { X, Loader2, Check } from 'lucide-react';

const EMPTY = {
    name: '',
    oCN: '',
    countryId: '',
    address: '',
    status: 'Active',
};

export default function SiteModal({ open, onClose, onSubmit, site = null, loading = false }) {
    const isEdit = !!site;
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});

    const [countries, setCountries] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(false);

    useEffect(() => {
        if (open) {
            setErrors({});
            if (site) {
                setForm({
                    name: site.name || '',
                    oCN: site.ocn || site.oCN || '',
                    countryId: site.countryId || site.country?.id || '',
                    address: site.address || '',
                    status: site.status || 'Active',
                });
            } else {
                setForm(EMPTY);
            }
        }
    }, [open, site]);

    useEffect(() => {
        if (!open || countries.length > 0) return;

        const fetchCountries = async () => {
            setLoadingCountries(true);
            try {
                // Keep the actual country objects so we can grab the ID
                const response = await axios.get('/api/app/country');
                const countryList = response.data.sort((a, b) => a.name.localeCompare(b.name));
                setCountries(countryList);
            } catch (error) {
                console.error("Failed to load countries", error);
            } finally {
                setLoadingCountries(false);
            }
        };

        fetchCountries();
    }, [open, countries.length]);

    const handleChange = (field) => (e) => {
        setForm(f => ({ ...f, [field]: e.target.value }));
        if (errors[field]) {
            setErrors(errs => ({ ...errs, [field]: '' }));
        }
    };

    const validate = () => {
        const errs = {};
        if (!form.name) errs.name = "Name is required";
        else if (form.name.length > 200) errs.name = "Name cannot exceed 200";

        if (!form.oCN) errs.oCN = "OCN is required";
        else if (form.oCN.length > 50) errs.oCN = "OCN cannot exceed 50";

        if (!form.countryId) errs.countryId = "Country is required";

        if (form.address && form.address.length > 500) errs.address = "Address cannot exceed 500";

        return errs;
    };

    const handleSubmit = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }

        const payload = { ...form };
        payload.ocn = payload.oCN;
        delete payload.oCN;

        if (isEdit) {
            payload.id = site.id;
            payload.concurrencyStamp = site.concurrencyStamp;
        }

        onSubmit(payload);
    };

    const InputLabel = ({ label, required }) => (
        <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
    );

    const inputClasses = (error, isValid) =>
        `w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-sm ` +
        (error
            ? `bg-red-50/50 border-red-400 text-red-900 placeholder:text-red-300 dark:bg-red-500/10 dark:border-red-500/50 dark:text-red-200`
            : isValid
                ? `bg-green-50/50 border-green-500 focus:border-green-600 text-green-900 dark:bg-green-500/10 dark:border-green-500/50 dark:text-green-200`
                : `bg-slate-50 border-slate-200 hover:border-slate-300 focus:bg-white focus:border-blue-500 text-slate-700 placeholder:text-slate-400 dark:bg-[#242938] dark:border-white/10 dark:text-slate-200 dark:focus:border-blue-500`);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: '16px', bgcolor: 'background.paper', p: 1 },
                className: "bg-white dark:bg-[#1e2436] dark:text-white"
            }}
        >
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                    {isEdit ? 'Edit Site' : 'New Site'}
                </h2>
                <IconButton onClick={onClose} size="small" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <X size={20} />
                </IconButton>
            </div>

            <div className="px-6 py-2 space-y-5">
                <div>
                    <InputLabel label="Name" required />
                    <div className="relative">
                        <input
                            type="text"
                            maxLength={200}
                            value={form.name}
                            onChange={handleChange('name')}
                            className={inputClasses(errors.name, form.name.length > 0 && !errors.name)}
                        />
                        {form.name.length > 0 && !errors.name && (
                            <Check size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                        )}
                    </div>
                    {typeof errors.name === 'string' && <p className="text-red-500 text-xs font-semibold mt-1.5">{errors.name}</p>}
                </div>

                <div>
                    <InputLabel label="OCN" required />
                    <div className="relative">
                        <input
                            type="text"
                            maxLength={50}
                            value={form.oCN}
                            onChange={handleChange('oCN')}
                            className={inputClasses(errors.oCN, form.oCN.length > 0 && !errors.oCN)}
                        />
                        {form.oCN.length > 0 && !errors.oCN && (
                            <Check size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                        )}
                    </div>
                    {typeof errors.oCN === 'string' && <p className="text-red-500 text-xs font-semibold mt-1.5">{errors.oCN}</p>}
                </div>

                <div>
                    <InputLabel label="Country" required />
                    <Autocomplete
                        options={countries}
                        getOptionLabel={(option) => option.name || ''}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        value={countries.find(c => c.id === form.countryId) || null}
                        onChange={(e, newValue) => {
                            setForm(f => ({ ...f, countryId: newValue ? newValue.id : '' }));
                            if (errors.countryId) setErrors(errs => ({ ...errs, countryId: '' }));
                        }}
                        loading={loadingCountries}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '0.75rem',
                                padding: '1.5px 12px',
                                backgroundColor: 'transparent',
                                '& fieldset': {
                                    border: '1px solid',
                                    borderColor: errors.countryId ? 'rgb(248 113 113)' : 'inherit',
                                },
                            },
                        }}
                        className={`w-full transition-all text-sm rounded-xl ${errors.countryId
                            ? 'bg-red-50/50 text-red-900 placeholder:text-red-300 dark:bg-red-500/10 dark:text-red-200'
                            : form.countryId
                                ? 'bg-green-50/50 text-green-900 border-green-500 dark:bg-green-500/10 dark:text-green-200'
                                : 'bg-slate-50 text-slate-700 dark:bg-[#242938] dark:text-slate-200'
                            }`}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder={loadingCountries ? "Loading countries..." : "Select a country..."}
                                variant="outlined"
                                sx={{
                                    '& .MuiInputBase-input': {
                                        padding: '10px !important',
                                    }
                                }}
                            />
                        )}
                    />
                    {typeof errors.countryId === 'string' && <p className="text-red-500 text-xs font-semibold mt-1.5">{errors.countryId}</p>}
                </div>

                <div>
                    <InputLabel label="Address" />
                    <div className="relative">
                        <textarea
                            rows={3}
                            maxLength={500}
                            value={form.address}
                            onChange={handleChange('address')}
                            className={`${inputClasses(errors.address, form.address.length > 0 && !errors.address)} resize-y`}
                        />
                        {form.address.length > 0 && !errors.address && (
                            <Check size={16} className="absolute right-3 top-3 text-green-500" />
                        )}
                    </div>
                    {typeof errors.address === 'string' && <p className="text-red-500 text-xs font-semibold mt-1.5">{errors.address}</p>}
                </div>

            </div>

            <div className="flex items-center justify-end gap-3 px-6 pt-6 pb-5">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded-xl border border-indigo-500 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-5 py-2 rounded-xl border border-indigo-500 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors flex items-center justify-center min-w-[80px]"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : (isEdit ? 'Save' : 'Create')}
                </button>
            </div>
        </Dialog>
    );
}
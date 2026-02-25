/**
 * DB.js — Real API Integration
 * This file replaces the simulated localStorage DB with real network calls.
 */
import axios from 'axios';

// 1. Set up your API configuration
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
    'https://sureze.ddns.net:3333/api/app';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Uncomment if using tokens
    }
});



// The Database Connector
const DB = {
    // ── Tickets ──────────────────────────────────────────────────────────────
    tickets: {
        getAll: (params) => {
            const { page = 1, perPage = 10, search, sortKey, sortDir } = params;
            const apiParams = {
                SkipCount: (page - 1) * perPage,
                skipCount: (page - 1) * perPage, // Send both cases for compatibility
                MaxResultCount: perPage,
                maxResultCount: perPage,
                Filter: search || undefined,
                Sorting: sortKey ? `${sortKey} ${sortDir}` : undefined
            };
            return api.get('/tickets', { params: apiParams }).then(r => r.data);
        },
        getById: (id) => api.get(`/tickets/${id}`).then(r => r.data),
        create: (data) => api.post('/tickets', data).then(r => r.data),
        update: (id, data) => api.put(`/tickets/${id}`, data).then(r => r.data),
        delete: (id) => api.delete(`/tickets/${id}`).then(r => r.data),
        getStats: () => api.get('/tickets/stats').then(r => r.data),
    },
    sites: {
        getAll: (params) => {
            const { page = 1, perPage = 10, search, sortKey, sortDir } = params;
            const apiParams = {
                SkipCount: (page - 1) * perPage,
                skipCount: (page - 1) * perPage, // Send both cases for compatibility
                MaxResultCount: perPage,
                maxResultCount: perPage,
                Filter: search || undefined,
                Sorting: sortKey ? `${sortKey} ${sortDir}` : undefined
            };
            return api.get('/site/paged-list', { params: apiParams }).then(r => r.data);
        },
        getById: (id) => api.get(`/site/${id}/by-id`).then(r => r.data),
        create: (data) => api.post('/site', data).then(r => r.data),
        update: (id, data) => api.put(`/site/${id}`, data).then(r => r.data),
        delete: (id) => api.delete(`/site/${id}`).then(r => r.data),
    }
};

// ── UI Dropdown Constants ──────────────────────────────────────────────────
// You can keep these here for now, or fetch them from a lookup API later.
const SITES = [
    'NHSBT FILTON (MSC)', 'PENANG ADVENTIST HOSPITAL (PAH)',
    'WILLIAM HARVEY HPL(MSC)', 'CHARING CROSS HOSPITAL',
    'GLASGOW ROYAL INFIRMARY', 'ST PETERS HOSPITAL',
    'SUNWAY MEDICAL CENTRE IPOH SDN BHD', 'JAMES PAGET HOSPITAL (ABB MSC)',
    'ALDER HEY CHILDRENS HOSPITAL(LIVERPOOL)', 'ABERDEEN ROYAL INFIRMARY',
    'ROYAL VICTORIA HOSPITAL', 'MANCHESTER ROYAL INFIRMARY',
    'LEEDS GENERAL INFIRMARY', 'KING COLLEGE HOSPITAL',
    "GUY'S AND ST THOMAS'", 'NORTHAMPTON GENERAL HOSPITAL',
];

const OCNS = [
    'OCE00791_001', 'OCN04212-801-00', 'OCE00481_010',
    'OCE00005_028', 'OCE00210_037', 'AAS356',
    'OCN05006-801-00', 'OCN01641-801-00', 'OCE00683-000', 'OCN02294-801-00',
];

const ASSIGNEES = ['Rukesh', 'Wahida', 'Abdul_Karem', 'Saad', 'Priya', 'Chen Wei'];
const STATUSES = ['Open', 'In Progress', 'Closed'];

export { DB, SITES, OCNS, ASSIGNEES, STATUSES };
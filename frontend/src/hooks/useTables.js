// // src/hooks/useTables.js
// // One place that talks to /api/tables. Pages call these functions instead of
// // touching mockDatabase. Every action returns { ok, message } so a page can keep
// // its popup open and show the server's reason when something fails.
// //
// // This file does NOT import services/http.js, so it cannot break if that file changes.
// import { useCallback, useEffect, useState } from "react";

// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// const getToken = () =>
//   localStorage.getItem("token") || sessionStorage.getItem("token");

// async function request(method, path, body) {
//   const token = getToken();
//   const res = await fetch(`${BASE_URL}${path}`, {
//     method,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//     body: body !== undefined ? JSON.stringify(body) : undefined,
//   });
//   const json = await res.json().catch(() => ({}));
//   if (!res.ok) {
//     if (res.status === 401) throw new Error("Please log in again.");
//     if (res.status === 403)
//       throw new Error("Your account is not allowed to do this.");
//     throw new Error(json.message || `Request failed (${res.status})`);
//   }
//   return json;
// }

// // Pages read table.table_number; the API sends both names, this guarantees it.
// const normalize = (t) => ({ ...t, table_number: t.table_number ?? t.number });
// const byNumber = (a, b) =>
//   String(a.table_number).localeCompare(String(b.table_number), undefined, {
//     numeric: true,
//   });

// export default function useTables() {
//   const [tables, setTables] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [notice, setNotice] = useState("");

//   const flash = (message) => {
//     setNotice(message);
//     setTimeout(() => setNotice(""), 3000);
//   };

//   const refresh = useCallback(async () => {
//     try {
//       setError("");
//       const json = await request("GET", "/tables");
//       setTables((json.data || []).map(normalize));
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     refresh();
//   }, [refresh]);

//   const run = async (fn) => {
//     try {
//       await fn();
//       return { ok: true };
//     } catch (e) {
//       return { ok: false, message: e.message };
//     }
//   };

//   const addTable = ({ number, capacity, zone }) =>
//     run(async () => {
//       const json = await request("POST", "/tables", {
//         number: String(number),
//         capacity: Number(capacity),
//         zone,
//       });
//       setTables((prev) => [...prev, normalize(json.data)].sort(byNumber));
//       flash(`Table ${number} added.`);
//     });

//   const changeStatus = (id, status) =>
//     run(async () => {
//       const json = await request("PATCH", `/tables/${id}/status`, { status });
//       setTables((prev) =>
//         prev.map((t) => (t.id === id ? normalize(json.data) : t)),
//       );
//       flash("Status updated.");
//     });

//   const removeTable = (id) =>
//     run(async () => {
//       await request("DELETE", `/tables/${id}`);
//       setTables((prev) => prev.filter((t) => t.id !== id));
//       flash("Table deleted.");
//     });

//   return {
//     tables,
//     loading,
//     error,
//     notice,
//     refresh,
//     addTable,
//     changeStatus,
//     removeTable,
//   };
// }


// src/hooks/useTables.js
// One place that talks to /api/tables. Pages call these functions instead of
// touching mockDatabase. Every action returns { ok, message } so a page can keep
// its popup open and show the server's reason when something fails.
//
// This file does NOT import services/http.js, so it cannot break if that file changes.
import { useCallback, useEffect, useState } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

async function request(method, path, body) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) throw new Error('Please log in again.');
    if (res.status === 403) throw new Error(json.message || 'Your account is not allowed to do this.');
    throw new Error(json.message || `Request failed (${res.status})`);
  }
  return json;
}

// Pages read table.table_number; the API sends both names, this guarantees it.
const normalize = (t) => ({ ...t, table_number: t.table_number ?? t.number });
const byNumber = (a, b) =>
  String(a.table_number).localeCompare(String(b.table_number), undefined, { numeric: true });

// useTables()                -> every table (manager, admin, waiter "All Tables")
// useTables({ mine: true })   -> only the tables assigned to the logged-in waiter
export default function useTables({ mine = false } = {}) {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const flash = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(''), 3000);
  };

  const refresh = useCallback(async () => {
    try {
      setError('');
      const json = await request('GET', mine ? '/tables?mine=true' : '/tables');
      setTables((json.data || []).map(normalize));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [mine]);

  useEffect(() => { refresh(); }, [refresh]);

  const run = async (fn) => {
    try {
      await fn();
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.message };
    }
  };

  const addTable = ({ number, capacity, zone }) =>
    run(async () => {
      const json = await request('POST', '/tables', { number: String(number), capacity: Number(capacity), zone });
      setTables((prev) => [...prev, normalize(json.data)].sort(byNumber));
      flash(`Table ${number} added.`);
    });

  const changeStatus = (id, status) =>
    run(async () => {
      const json = await request('PATCH', `/tables/${id}/status`, { status });
      setTables((prev) => prev.map((t) => (t.id === id ? normalize(json.data) : t)));
      flash('Status updated.');
    });

  const removeTable = (id) =>
    run(async () => {
      await request('DELETE', `/tables/${id}`);
      setTables((prev) => prev.filter((t) => t.id !== id));
      flash('Table deleted.');
    });

  return { tables, loading, error, notice, refresh, addTable, changeStatus, removeTable };
}
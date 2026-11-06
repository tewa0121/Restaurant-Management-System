// src/hooks/useOrders.js   (adapter for the installed Orders API)
// ----------------------------------------------------------------------------
// The server answers with its own names (statusLabel, qty, customer.name, ...).
// This file translates them ONCE into the names every order page reads
// (displayStatus, quantity, customerName, ...), so pages never touch raw responses.
//
//   useOrders({ status:'pending', sort:'priority', pollMs:8000 })   kitchen "Incoming"
//   useOrders({ active:true, pollMs:10000 })                        waiter "Active Orders"
//   useOrders({ my:true })                                          customer "My Orders"
//
// Options: status ('pending' or 'pending,preparing'), active, type, tableId, today,
//          search, sort ('oldest' | 'priority'), limit, withItems (default true),
//          pollMs (auto-refresh), my (accepted; the server already scopes by role)
//
// The server scopes the list by role (a customer sees only their own orders, a waiter
// only their tables), so no "mine" filter is needed here.
import { useCallback, useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

// Exported so a page can make a one-off call (for example GET /orders/pricing)
export async function apiRequest(method, path, body) {
  const token = getToken();
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    throw new Error("Cannot reach the server. Is the backend running?");
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) throw new Error("Please log in again.");
    throw new Error(json.message || `Request failed (${res.status})`);
  }
  return json;
}

// "10:20 AM" from an ISO date
export const timeOf = (iso) =>
  iso
    ? new Date(iso).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "—";

// whole minutes since an ISO date
export const minutesSince = (iso) =>
  iso
    ? Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
    : 0;

// ------------------------------------------------------------ translation ----
const num = (v) => Number(v) || 0;
const cap = (s) =>
  s
    ? String(s).charAt(0).toUpperCase() + String(s).slice(1).replace(/_/g, " ")
    : "";
const ACTIVE = ["pending", "preparing", "ready", "served"];

// a table may arrive as { id, number } or as a plain value
const tableName = (t) =>
  `Table ${t !== null && typeof t === "object" ? (t.number ?? t.tableNumber ?? t.table_number ?? t.name ?? t.id) : t}`;

export const normalizeItem = (i = {}) => ({
  id: i.id,
  menuItemId: i.menuItemId ?? i.menu_item_id,
  name: i.name,
  image: i.image || "",
  category: i.category || null,
  quantity: num(i.qty ?? i.quantity),
  unitPrice: num(i.price ?? i.unitPrice),
  subtotal: num(i.subtotal),
  instructions: i.notes || "",
  status: i.status,
  progress: num(i.progress),
});

export const normalizeOrder = (r = {}) => {
  const hasItems = Array.isArray(r.items);
  const items = hasItems ? r.items.map(normalizeItem) : [];
  const tables = Array.isArray(r.tables) ? r.tables : [];
  const created = r.createdAt || r.created_at || null;
  const total = num(r.total);
  const waited = minutesSince(created);
  const live = items.filter((i) => i.status !== "ready");
  const slowest = [...items].sort((a, b) => a.progress - b.progress)[0];
  const first = tables[0];

  return {
    id: r.id,
    orderNumber: r.orderNumber,
    order_number: r.orderNumber,
    displayId: `#${r.orderNumber}`,
    type: r.type,
    status: r.status,
    displayStatus: r.statusLabel || cap(r.status),
    tables,
    tableLabel: tables.length ? tables.map(tableName).join(", ") : "—",
    table_id:
      first && typeof first === "object" ? (first.id ?? null) : (first ?? null),
    customerId: r.customer ? r.customer.id : null,
    customerName:
      (r.customer && r.customer.name) || r.customerName || "Walk-in",
    customerPhone: (r.customer && r.customer.phone) || r.customerPhone || "",
    waiterName: (r.waiter && r.waiter.name) || r.waiterName || null,
    items,
    hasItems,
    itemsText: items.map((i) => `${i.name} x${i.quantity}`),
    itemCount: num(r.itemCount) || items.reduce((s, i) => s + i.quantity, 0),
    subtotal: num(r.subtotal),
    discount: num(r.discount),
    tax: num(r.tax),
    deliveryFee: num(r.deliveryFee),
    total,
    total_amount: total,
    notes: r.notes || "",
    delivery: r.delivery || null,
    // the server sends no kitchen priority yet: derive it from how long a pending order waited
    priority:
      r.status === "pending"
        ? waited >= 15
          ? "High"
          : waited >= 8
            ? "Medium"
            : "Low"
        : "Low",
    orderedAt: created,
    ordered_at: created,
    updatedAt: r.updatedAt || null,
    elapsedMinutes: waited,
    cookingStartedAt: r.cookingStartedAt || null,
    readyAt: r.cookingFinishedAt || null,
    notifiedWaiter: false,
    progress: items.length
      ? Math.round(items.reduce((s, i) => s + i.progress, 0) / items.length)
      : 0,
    stage: slowest && live.length ? slowest.category || "Preparing" : "Done",
  };
};

// ---------------------------------------------------------------- filtering --
const sameDay = (iso) => {
  if (!iso) return false;
  const d = new Date(iso),
    n = new Date();
  return (
    d.getFullYear() === n.getFullYear() &&
    d.getMonth() === n.getMonth() &&
    d.getDate() === n.getDate()
  );
};
const rank = { High: 2, Medium: 1, Low: 0 };

export const applyFilters = (orders, f = {}) => {
  let out = orders;
  const statuses = f.statuses || [];
  if (statuses.length) out = out.filter((o) => statuses.includes(o.status));
  if (f.active) out = out.filter((o) => ACTIVE.includes(o.status));
  if (f.type) out = out.filter((o) => o.type === f.type);
  if (f.tableId)
    out = out.filter((o) =>
      o.tables.some(
        (t) =>
          String(t !== null && typeof t === "object" ? t.id : t) ===
          String(f.tableId),
      ),
    );
  if (f.today) out = out.filter((o) => sameDay(o.orderedAt));
  if (f.search) {
    const term = String(f.search).toLowerCase();
    out = out.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(term) ||
        o.customerName.toLowerCase().includes(term) ||
        o.tableLabel.toLowerCase().includes(term),
    );
  }
  const byDate = (a, b) => new Date(a.orderedAt) - new Date(b.orderedAt);
  if (f.sort === "oldest") out = [...out].sort(byDate);
  else if (f.sort === "priority")
    out = [...out].sort(
      (a, b) => rank[b.priority] - rank[a.priority] || byDate(a, b),
    );
  else out = [...out].sort((a, b) => byDate(b, a));
  if (f.limit) out = out.slice(0, Number(f.limit));
  return out;
};

// -------------------------------------------------------------- loading ------
// The list answers without dishes, so each order's detail is loaded too (at most 40 at once)
export async function loadOrders(options = {}) {
  const { withItems = true, status, my, pollMs, ...rest } = options;
  const statuses = status
    ? String(status)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const query = new URLSearchParams({ limit: "100" });
  if (statuses.length === 1) query.set("status", statuses[0]); // the server filters one status itself
  const json = await apiRequest("GET", `/orders?${query.toString()}`);
  let rows = applyFilters((json.data || []).map(normalizeOrder), {
    ...rest,
    statuses,
  });
  if (withItems) {
    rows = await Promise.all(
      rows.slice(0, 40).map(async (row) => {
        try {
          const detail = await apiRequest("GET", `/orders/${row.id}`);
          return normalizeOrder(detail.data);
        } catch (e) {
          return row; // keep the summary row if one detail fails
        }
      }),
    );
  }
  return rows;
}

// ------------------------------------------------------------------- hook ----
const NOT_AVAILABLE = "This action is not available on the server yet.";

export default function useOrders(options = {}) {
  const { pollMs = 0 } = options;
  const key = JSON.stringify(options);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const flash = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(""), 3000);
  };

  const refresh = useCallback(async () => {
    try {
      setOrders(await loadOrders(JSON.parse(key)));
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    setLoading(true);
    refresh();
    if (pollMs > 0) {
      const timer = setInterval(refresh, pollMs); // quiet refresh: no loading flicker
      return () => clearInterval(timer);
    }
    return undefined;
  }, [refresh, pollMs]);

  // run an action, then reload the list so every number on the page is the server's
  const act = async (fn, okMessage) => {
    try {
      const json = await fn();
      await refresh();
      if (okMessage) flash(okMessage);
      return { ok: true, data: json.data ? normalizeOrder(json.data) : null };
    } catch (e) {
      return { ok: false, message: e.message };
    }
  };

  const createOrder = (body) =>
    act(() => apiRequest("POST", "/orders", body), "Order created.");
  const changeStatus = (id, status, message = "Order updated.") =>
    act(() => apiRequest("PATCH", `/orders/${id}/status`, { status }), message);
  const addItems = (id, items) =>
    act(
      () => apiRequest("POST", `/orders/${id}/items`, { items }),
      "Dishes added.",
    );

  // not offered by the installed server yet: the pages show this message instead of failing silently
  const unavailable = async () => ({ ok: false, message: NOT_AVAILABLE });

  return {
    orders,
    loading,
    error,
    notice,
    refresh,
    createOrder,
    changeStatus,
    addItems,
    setProgress: unavailable,
    notifyWaiter: unavailable,
    setPriority: unavailable,
  };
}

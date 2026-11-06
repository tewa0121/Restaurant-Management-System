// // src/services/api.js
// // Same exports as before (default apiService + named createOrder), so existing pages keep working.
// // Each area can be switched between mock and real backend in .env:
// //   VITE_API_URL=http://localhost:5000/api
// //   VITE_USE_MOCK_MENU=true      (menu is REAL by default; set true only for fake data)
// //   VITE_USE_MOCK_USERS=true
// //   VITE_USE_MOCK_ORDERS=true
// //   VITE_USE_MOCK_TABLES=false   (tables are MOCK unless you set this to false)
// import {
//   initialMenuItems,
//   initialUsers,
//   initialTables,
//   initialOrders,
// } from "./mockData";

// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// const MOCK = {
//   // Menu uses the REAL backend by default. Set VITE_USE_MOCK_MENU=true only if you want fake data.
//   menu: import.meta.env.VITE_USE_MOCK_MENU === "true",
//   users: import.meta.env.VITE_USE_MOCK_USERS !== "false",
//   orders: import.meta.env.VITE_USE_MOCK_ORDERS !== "false",
//   tables: import.meta.env.VITE_USE_MOCK_TABLES !== "false",
// };

// if (MOCK.menu) {
//   console.warn(
//     "[api] Menu is in MOCK mode: dishes are saved in this browser only, not in the database.",
//   );
// }

// const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

// // ---------- real API helper ----------
// async function request(path, { method = "GET", body } = {}) {
//   // The token lives in localStorage (AuthContext). sessionStorage is the fallback.
//   const token =
//     localStorage.getItem("token") || sessionStorage.getItem("token");
//   let res;
//   try {
//     res = await fetch(`${BASE_URL}${path}`, {
//       method,
//       headers: {
//         "Content-Type": "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//       body: body !== undefined ? JSON.stringify(body) : undefined,
//     });
//   } catch (e) {
//     throw new Error("Cannot reach the server. Is the backend running?");
//   }
//   const payload = await res.json().catch(() => ({}));
//   if (!res.ok || payload.success === false) {
//     throw new Error(payload.message || `Request failed (${res.status})`);
//   }
//   // The backend answers { success: true, data: ... }. Pages expect just the data.
//   return payload && payload.data !== undefined ? payload.data : payload;
// }

// // Cleans a dish before it is sent to the backend:
// // price becomes a number, category id becomes a number, available becomes true/false
// const toMenuPayload = (item = {}) => {
//   const payload = { ...item };
//   if (payload.price !== undefined && payload.price !== "") {
//     payload.price = Number(payload.price);
//   }
//   const cat = payload.categoryId ?? payload.category_id;
//   if (cat !== undefined && cat !== "") payload.categoryId = Number(cat);
//   delete payload.category_id;
//   if (payload.available !== undefined) {
//     payload.available = Boolean(payload.available);
//   }
//   return payload;
// };

// // Cleans a table before it is sent to the backend:
// // number stays text, capacity becomes a number. Accepts table_number or number.
// const toTablePayload = (table = {}) => {
//   const payload = { ...table };
//   const number = payload.number ?? payload.table_number;
//   if (number !== undefined && number !== "") payload.number = String(number);
//   delete payload.table_number;
//   if (payload.capacity !== undefined && payload.capacity !== "") {
//     payload.capacity = Number(payload.capacity);
//   }
//   return payload;
// };

// // ---------- mock helpers (your original behaviour) ----------
// const readMock = (key, fallback) => {
//   const stored = localStorage.getItem(key);
//   return stored ? JSON.parse(stored) : fallback;
// };
// const writeMock = (key, value) =>
//   localStorage.setItem(key, JSON.stringify(value));

// // Mock categories are built from the mock dishes
// const mockCategories = () => {
//   const names = [
//     ...new Set(readMock("resto_menu", initialMenuItems).map((i) => i.category)),
//   ].filter(Boolean);
//   return names.map((name, i) => ({ id: i + 1, name, active: true }));
// };

// const apiService = {
//   // ================= MENU =================
//   // Public list: only available dishes. Optional filters: { category: 3, search: 'pizza' }
//   getMenuItems: async (filters = {}) => {
//     if (MOCK.menu) {
//       await delay();
//       return readMock("resto_menu", initialMenuItems);
//     }
//     const qs = new URLSearchParams(filters).toString();
//     return request(`/menu${qs ? `?${qs}` : ""}`);
//   },
//   // Staff list: ALL dishes, including sold out or hidden (manager, kitchen, admin)
//   getManageMenuItems: async () => {
//     if (MOCK.menu) {
//       await delay();
//       return readMock("resto_menu", initialMenuItems);
//     }
//     return request("/menu/manage");
//   },
//   getMenuItem: async (id) => {
//     if (MOCK.menu) {
//       await delay();
//       return readMock("resto_menu", initialMenuItems).find(
//         (i) => String(i.id) === String(id),
//       );
//     }
//     return request(`/menu/${id}`);
//   },
//   createMenuItem: async (item) => {
//     if (MOCK.menu) {
//       await delay();
//       const items = readMock("resto_menu", initialMenuItems);
//       const created = { ...item, id: "MENU-" + Date.now() };
//       writeMock("resto_menu", [created, ...items]);
//       return created;
//     }
//     return request("/menu", { method: "POST", body: toMenuPayload(item) });
//   },
//   updateMenuItem: async (id, changes) => {
//     if (MOCK.menu) {
//       await delay();
//       const items = readMock("resto_menu", initialMenuItems).map((i) =>
//         String(i.id) === String(id) ? { ...i, ...changes } : i,
//       );
//       writeMock("resto_menu", items);
//       return items.find((i) => String(i.id) === String(id));
//     }
//     return request(`/menu/${id}`, {
//       method: "PUT",
//       body: toMenuPayload(changes),
//     });
//   },
//   // Mark a dish sold out or back (manager and kitchen). available = true | false
//   setMenuItemAvailability: async (id, available) => {
//     if (MOCK.menu) {
//       await delay();
//       const items = readMock("resto_menu", initialMenuItems).map((i) =>
//         String(i.id) === String(id) ? { ...i, available } : i,
//       );
//       writeMock("resto_menu", items);
//       return items.find((i) => String(i.id) === String(id));
//     }
//     return request(`/menu/${id}/availability`, {
//       method: "PATCH",
//       body: { available: Boolean(available) },
//     });
//   },
//   deleteMenuItem: async (id) => {
//     if (MOCK.menu) {
//       await delay();
//       writeMock(
//         "resto_menu",
//         readMock("resto_menu", initialMenuItems).filter(
//           (i) => String(i.id) !== String(id),
//         ),
//       );
//       return { message: "Deleted" };
//     }
//     return request(`/menu/${id}`, { method: "DELETE" });
//   },
//   // Old "save the whole list" style. Mock only: a real backend saves one record at a time.
//   saveMenuItems: async (items) => {
//     if (!MOCK.menu) {
//       console.warn(
//         "saveMenuItems is mock-only. Use createMenuItem / updateMenuItem / deleteMenuItem.",
//       );
//       return items;
//     }
//     await delay();
//     writeMock("resto_menu", items);
//     return items;
//   },

//   // ================= MENU CATEGORIES =================
//   getCategories: async () => {
//     if (MOCK.menu) {
//       await delay();
//       return mockCategories();
//     }
//     return request("/menu/categories");
//   },
//   createCategory: async (category) => {
//     if (MOCK.menu) {
//       await delay();
//       return { ...category, id: Date.now() };
//     }
//     return request("/menu/categories", { method: "POST", body: category });
//   },
//   updateCategory: async (id, changes) => {
//     if (MOCK.menu) {
//       await delay();
//       return { id, ...changes };
//     }
//     return request(`/menu/categories/${id}`, { method: "PUT", body: changes });
//   },
//   deleteCategory: async (id) => {
//     if (MOCK.menu) {
//       await delay();
//       return { message: "Deleted" };
//     }
//     return request(`/menu/categories/${id}`, { method: "DELETE" });
//   },

//   // ================= TABLES =================
//   // Real backend: GET/POST /tables, PUT /tables/:id, PATCH /tables/:id/status, DELETE /tables/:id
//   // Each table comes back with BOTH `number` and `table_number`, plus capacity, status, zone.
//   // Optional filters: { status: 'available', section: 'Main Hall' }
//   getTables: async (filters = {}) => {
//     if (MOCK.tables) {
//       await delay();
//       return readMock("resto_tables", initialTables);
//     }
//     const qs = new URLSearchParams(filters).toString();
//     return request(`/tables${qs ? `?${qs}` : ""}`);
//   },
//   getTable: async (id) => {
//     if (MOCK.tables) {
//       await delay();
//       return readMock("resto_tables", initialTables).find(
//         (t) => String(t.id) === String(id),
//       );
//     }
//     return request(`/tables/${id}`);
//   },
//   createTable: async (table) => {
//     if (MOCK.tables) {
//       await delay();
//       const tables = readMock("resto_tables", initialTables);
//       const created = { ...table, id: Date.now() };
//       writeMock("resto_tables", [...tables, created]);
//       return created;
//     }
//     return request("/tables", { method: "POST", body: toTablePayload(table) });
//   },
//   updateTable: async (id, changes) => {
//     if (MOCK.tables) {
//       await delay();
//       const tables = readMock("resto_tables", initialTables).map((t) =>
//         String(t.id) === String(id) ? { ...t, ...changes } : t,
//       );
//       writeMock("resto_tables", tables);
//       return tables.find((t) => String(t.id) === String(id));
//     }
//     return request(`/tables/${id}`, {
//       method: "PUT",
//       body: toTablePayload(changes),
//     });
//   },
//   // status: available | reserved | occupied | cleaning | out_of_order
//   updateTableStatus: async (id, status) => {
//     if (MOCK.tables) {
//       await delay();
//       const tables = readMock("resto_tables", initialTables).map((t) =>
//         String(t.id) === String(id) ? { ...t, status } : t,
//       );
//       writeMock("resto_tables", tables);
//       return tables.find((t) => String(t.id) === String(id));
//     }
//     return request(`/tables/${id}/status`, {
//       method: "PATCH",
//       body: { status },
//     });
//   },
//   deleteTable: async (id) => {
//     if (MOCK.tables) {
//       await delay();
//       writeMock(
//         "resto_tables",
//         readMock("resto_tables", initialTables).filter(
//           (t) => String(t.id) !== String(id),
//         ),
//       );
//       return { message: "Deleted" };
//     }
//     return request(`/tables/${id}`, { method: "DELETE" });
//   },

//   // ================= USERS =================
//   getUsers: async () => {
//     if (MOCK.users) {
//       await delay();
//       return readMock("resto_users", initialUsers);
//     }
//     return request("/users"); // admin only
//   },
//   saveUsers: async (users) => {
//     if (!MOCK.users) {
//       console.warn(
//         "saveUsers is mock-only. Use per-user create/update endpoints.",
//       );
//       return users;
//     }
//     await delay();
//     writeMock("resto_users", users);
//     return users;
//   },

//   // ================= ORDERS =================
//   getOrders: async (filters = {}) => {
//     if (MOCK.orders) {
//       await delay();
//       return readMock("resto_orders", initialOrders);
//     }
//     const qs = new URLSearchParams(filters).toString();
//     return request(`/orders${qs ? `?${qs}` : ""}`);
//   },
//   updateOrderStatus: async (id, status) => {
//     if (MOCK.orders) {
//       await delay();
//       const orders = readMock("resto_orders", initialOrders).map((o) =>
//         o.id === id ? { ...o, status } : o,
//       );
//       writeMock("resto_orders", orders);
//       return orders.find((o) => o.id === id);
//     }
//     return request(`/orders/${id}/status`, {
//       method: "PATCH",
//       body: { status },
//     });
//   },
//   saveOrders: async (orders) => {
//     if (!MOCK.orders) {
//       console.warn(
//         "saveOrders is mock-only. Use createOrder / updateOrderStatus.",
//       );
//       return orders;
//     }
//     await delay();
//     writeMock("resto_orders", orders);
//     return orders;
//   },
//   createOrder: async (orderData) => {
//     if (MOCK.orders) {
//       await delay();
//       const orders = readMock("resto_orders", initialOrders);
//       const newOrder = {
//         id: "ORD-" + Date.now(),
//         createdAt: new Date().toISOString(),
//         status: "Pending",
//         ...orderData,
//       };
//       writeMock("resto_orders", [newOrder, ...orders]);
//       return newOrder;
//     }
//     return request("/orders", { method: "POST", body: orderData });
//   },
// };

// // Aliases, in case a page or hook uses another name for the same call
// apiService.getMenuCategories = apiService.getCategories;
// apiService.toggleMenuItemAvailability = apiService.setMenuItemAvailability;
// apiService.updateMenuItemAvailability = apiService.setMenuItemAvailability;

// // The logged-in customer's VIP progress, always asked from the server
// apiService.getMyVip = () => request("/vip/me");
// apiService.getTableList = apiService.getTables;
// apiService.setTableStatus = apiService.updateTableStatus;

// export const createOrder = apiService.createOrder;
// export default apiService;




// src/services/api.js
// Same exports as before (default apiService + named createOrder), so existing pages keep working.
// Each area can be switched between mock and real backend in .env:
//   VITE_API_URL=http://localhost:5000/api
//   VITE_USE_MOCK_MENU=true      (menu is REAL by default; set true only for fake data)
//   VITE_USE_MOCK_USERS=true
//   VITE_USE_MOCK_ORDERS=true
//   VITE_USE_MOCK_TABLES=false   (tables are MOCK unless you set this to false)
import {
  initialMenuItems,
  initialUsers,
  initialTables,
  initialOrders,
} from "./mockData";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const MOCK = {
  // Menu uses the REAL backend by default. Set VITE_USE_MOCK_MENU=true only if you want fake data.
  menu: import.meta.env.VITE_USE_MOCK_MENU === "true",
  users: import.meta.env.VITE_USE_MOCK_USERS !== "false",
  orders: import.meta.env.VITE_USE_MOCK_ORDERS !== "false",
  tables: import.meta.env.VITE_USE_MOCK_TABLES !== "false",
};

if (MOCK.menu) {
  console.warn(
    "[api] Menu is in MOCK mode: dishes are saved in this browser only, not in the database.",
  );
}

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------- real API helper ----------
async function request(path, { method = "GET", body } = {}) {
  // The token lives in localStorage (AuthContext). sessionStorage is the fallback.
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
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
  const payload = await res.json().catch(() => ({}));
  if (!res.ok || payload.success === false) {
    throw new Error(payload.message || `Request failed (${res.status})`);
  }
  // The backend answers { success: true, data: ... }. Pages expect just the data.
  return payload && payload.data !== undefined ? payload.data : payload;
}

// Cleans a dish before it is sent to the backend:
// price becomes a number, category id becomes a number, available becomes true/false
const toMenuPayload = (item = {}) => {
  const payload = { ...item };
  if (payload.price !== undefined && payload.price !== "") {
    payload.price = Number(payload.price);
  }
  const cat = payload.categoryId ?? payload.category_id;
  if (cat !== undefined && cat !== "") payload.categoryId = Number(cat);
  delete payload.category_id;
  if (payload.available !== undefined) {
    payload.available = Boolean(payload.available);
  }
  return payload;
};

// Cleans a table before it is sent to the backend:
// number stays text, capacity becomes a number. Accepts table_number or number.
const toTablePayload = (table = {}) => {
  const payload = { ...table };
  const number = payload.number ?? payload.table_number;
  if (number !== undefined && number !== "") payload.number = String(number);
  delete payload.table_number;
  if (payload.capacity !== undefined && payload.capacity !== "") {
    payload.capacity = Number(payload.capacity);
  }
  return payload;
};

// ---------- mock helpers (your original behaviour) ----------
const readMock = (key, fallback) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
};
const writeMock = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

// Mock categories are built from the mock dishes
const mockCategories = () => {
  const names = [
    ...new Set(readMock("resto_menu", initialMenuItems).map((i) => i.category)),
  ].filter(Boolean);
  return names.map((name, i) => ({ id: i + 1, name, active: true }));
};

const apiService = {
  // ================= MENU =================
  // Public list: only available dishes. Optional filters: { category: 3, search: 'pizza' }
  getMenuItems: async (filters = {}) => {
    if (MOCK.menu) {
      await delay();
      return readMock("resto_menu", initialMenuItems);
    }
    const qs = new URLSearchParams(filters).toString();
    return request(`/menu${qs ? `?${qs}` : ""}`);
  },
  // Staff list: ALL dishes, including sold out or hidden (manager, kitchen, admin)
  getManageMenuItems: async () => {
    if (MOCK.menu) {
      await delay();
      return readMock("resto_menu", initialMenuItems);
    }
    return request("/menu/manage");
  },
  getMenuItem: async (id) => {
    if (MOCK.menu) {
      await delay();
      return readMock("resto_menu", initialMenuItems).find(
        (i) => String(i.id) === String(id),
      );
    }
    return request(`/menu/${id}`);
  },
  createMenuItem: async (item) => {
    if (MOCK.menu) {
      await delay();
      const items = readMock("resto_menu", initialMenuItems);
      const created = { ...item, id: "MENU-" + Date.now() };
      writeMock("resto_menu", [created, ...items]);
      return created;
    }
    return request("/menu", { method: "POST", body: toMenuPayload(item) });
  },
  updateMenuItem: async (id, changes) => {
    if (MOCK.menu) {
      await delay();
      const items = readMock("resto_menu", initialMenuItems).map((i) =>
        String(i.id) === String(id) ? { ...i, ...changes } : i,
      );
      writeMock("resto_menu", items);
      return items.find((i) => String(i.id) === String(id));
    }
    return request(`/menu/${id}`, {
      method: "PUT",
      body: toMenuPayload(changes),
    });
  },
  // Mark a dish sold out or back (manager and kitchen). available = true | false
  setMenuItemAvailability: async (id, available) => {
    if (MOCK.menu) {
      await delay();
      const items = readMock("resto_menu", initialMenuItems).map((i) =>
        String(i.id) === String(id) ? { ...i, available } : i,
      );
      writeMock("resto_menu", items);
      return items.find((i) => String(i.id) === String(id));
    }
    return request(`/menu/${id}/availability`, {
      method: "PATCH",
      body: { available: Boolean(available) },
    });
  },
  deleteMenuItem: async (id) => {
    if (MOCK.menu) {
      await delay();
      writeMock(
        "resto_menu",
        readMock("resto_menu", initialMenuItems).filter(
          (i) => String(i.id) !== String(id),
        ),
      );
      return { message: "Deleted" };
    }
    return request(`/menu/${id}`, { method: "DELETE" });
  },
  // Old "save the whole list" style. Mock only: a real backend saves one record at a time.
  saveMenuItems: async (items) => {
    if (!MOCK.menu) {
      console.warn(
        "saveMenuItems is mock-only. Use createMenuItem / updateMenuItem / deleteMenuItem.",
      );
      return items;
    }
    await delay();
    writeMock("resto_menu", items);
    return items;
  },

  // ================= MENU CATEGORIES =================
  getCategories: async () => {
    if (MOCK.menu) {
      await delay();
      return mockCategories();
    }
    return request("/menu/categories");
  },
  createCategory: async (category) => {
    if (MOCK.menu) {
      await delay();
      return { ...category, id: Date.now() };
    }
    return request("/menu/categories", { method: "POST", body: category });
  },
  updateCategory: async (id, changes) => {
    if (MOCK.menu) {
      await delay();
      return { id, ...changes };
    }
    return request(`/menu/categories/${id}`, { method: "PUT", body: changes });
  },
  deleteCategory: async (id) => {
    if (MOCK.menu) {
      await delay();
      return { message: "Deleted" };
    }
    return request(`/menu/categories/${id}`, { method: "DELETE" });
  },

  // ================= TABLES =================
  // Real backend: GET/POST /tables, PUT /tables/:id, PATCH /tables/:id/status, DELETE /tables/:id
  // Each table comes back with BOTH `number` and `table_number`, plus capacity, status, zone.
  // Optional filters: { status: 'available', section: 'Main Hall' }
  getTables: async (filters = {}) => {
    if (MOCK.tables) {
      await delay();
      return readMock("resto_tables", initialTables);
    }
    const qs = new URLSearchParams(filters).toString();
    return request(`/tables${qs ? `?${qs}` : ""}`);
  },
  getTable: async (id) => {
    if (MOCK.tables) {
      await delay();
      return readMock("resto_tables", initialTables).find(
        (t) => String(t.id) === String(id),
      );
    }
    return request(`/tables/${id}`);
  },
  createTable: async (table) => {
    if (MOCK.tables) {
      await delay();
      const tables = readMock("resto_tables", initialTables);
      const created = { ...table, id: Date.now() };
      writeMock("resto_tables", [...tables, created]);
      return created;
    }
    return request("/tables", { method: "POST", body: toTablePayload(table) });
  },
  updateTable: async (id, changes) => {
    if (MOCK.tables) {
      await delay();
      const tables = readMock("resto_tables", initialTables).map((t) =>
        String(t.id) === String(id) ? { ...t, ...changes } : t,
      );
      writeMock("resto_tables", tables);
      return tables.find((t) => String(t.id) === String(id));
    }
    return request(`/tables/${id}`, {
      method: "PUT",
      body: toTablePayload(changes),
    });
  },
  // status: available | reserved | occupied | cleaning | out_of_order
  updateTableStatus: async (id, status) => {
    if (MOCK.tables) {
      await delay();
      const tables = readMock("resto_tables", initialTables).map((t) =>
        String(t.id) === String(id) ? { ...t, status } : t,
      );
      writeMock("resto_tables", tables);
      return tables.find((t) => String(t.id) === String(id));
    }
    return request(`/tables/${id}/status`, {
      method: "PATCH",
      body: { status },
    });
  },
  deleteTable: async (id) => {
    if (MOCK.tables) {
      await delay();
      writeMock(
        "resto_tables",
        readMock("resto_tables", initialTables).filter(
          (t) => String(t.id) !== String(id),
        ),
      );
      return { message: "Deleted" };
    }
    return request(`/tables/${id}`, { method: "DELETE" });
  },

  // ================= USERS =================
  getUsers: async () => {
    if (MOCK.users) {
      await delay();
      return readMock("resto_users", initialUsers);
    }
    return request("/users"); // admin only
  },
  saveUsers: async (users) => {
    if (!MOCK.users) {
      console.warn(
        "saveUsers is mock-only. Use per-user create/update endpoints.",
      );
      return users;
    }
    await delay();
    writeMock("resto_users", users);
    return users;
  },

  // ================= ORDERS =================
  getOrders: async (filters = {}) => {
    if (MOCK.orders) {
      await delay();
      return readMock("resto_orders", initialOrders);
    }
    const qs = new URLSearchParams(filters).toString();
    return request(`/orders${qs ? `?${qs}` : ""}`);
  },
  updateOrderStatus: async (id, status) => {
    if (MOCK.orders) {
      await delay();
      const orders = readMock("resto_orders", initialOrders).map((o) =>
        o.id === id ? { ...o, status } : o,
      );
      writeMock("resto_orders", orders);
      return orders.find((o) => o.id === id);
    }
    return request(`/orders/${id}/status`, {
      method: "PATCH",
      body: { status },
    });
  },
  saveOrders: async (orders) => {
    if (!MOCK.orders) {
      console.warn(
        "saveOrders is mock-only. Use createOrder / updateOrderStatus.",
      );
      return orders;
    }
    await delay();
    writeMock("resto_orders", orders);
    return orders;
  },
  createOrder: async (orderData) => {
    if (MOCK.orders) {
      await delay();
      const orders = readMock("resto_orders", initialOrders);
      const newOrder = {
        id: "ORD-" + Date.now(),
        createdAt: new Date().toISOString(),
        status: "Pending",
        ...orderData,
      };
      writeMock("resto_orders", [newOrder, ...orders]);
      return newOrder;
    }
    return request("/orders", { method: "POST", body: orderData });
  },
};

// Aliases, in case a page or hook uses another name for the same call
apiService.getMenuCategories = apiService.getCategories;
apiService.toggleMenuItemAvailability = apiService.setMenuItemAvailability;
apiService.updateMenuItemAvailability = apiService.setMenuItemAvailability;

// The logged-in customer's VIP progress, always asked from the server
apiService.getMyVip = () => request("/vip/me");
apiService.getTableList = apiService.getTables;
apiService.setTableStatus = apiService.updateTableStatus;

export const createOrder = apiService.createOrder;
export default apiService;
// ============================================================================
// src/hooks/useMenuManagement.js
// ----------------------------------------------------------------------------
// ONE place that knows how the admin and manager menu pages talk to the backend.
// Both pages call this hook and only worry about how things LOOK.
//
// A "hook" is a function that starts with "use" and keeps React state for a page.
// What this one gives the page:
//   items, categories     the real data from the database
//   loading, loadError    for the "Loading..." text and the error + Retry button
//   saving                true while a save/delete is in progress (disable the buttons)
//   notice                { type: 'success' | 'error', text } -> shown as a message
//   createItem, updateItem, toggleAvailability, deleteItem
//        each returns true when the SERVER accepted it, false when it refused.
//        The page closes its popup only on true, so a failed save never looks like a success.
// ============================================================================
import { useCallback, useEffect, useState } from "react";
import apiService from "../services/api";

// Makes every dish look the same, whether it came from the real API or from the old fake data.
const normalizeItem = (item, categoryNames) => {
  const categoryId = item.categoryId ?? item.category_id ?? null;
  return {
    ...item,
    price: Number(item.price),
    available: item.available ?? item.is_available ?? true,
    categoryId,
    category: item.category || categoryNames[categoryId] || "",
    description: item.description || "",
  };
};

// What we send to the server. Names match what menuService.js (backend) validates.
const toPayload = (form) => ({
  name: String(form.name || "").trim(),
  price: form.price,
  categoryId: form.categoryId,
  description: form.description,
  available: form.available,
});

export default function useMenuManagement() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  // Reads dishes + categories from the backend (manage list = includes unavailable dishes).
  const fetchAll = useCallback(async () => {
    const [rawItems, rawCategories] = await Promise.all([
      apiService.getManageMenuItems(),
      apiService.getMenuCategories(),
    ]);
    const categoryList = Array.isArray(rawCategories) ? rawCategories : [];
    const categoryNames = Object.fromEntries(
      categoryList.map((c) => [c.id, c.name]),
    );
    setCategories(categoryList);
    setItems(
      (Array.isArray(rawItems) ? rawItems : []).map((i) =>
        normalizeItem(i, categoryNames),
      ),
    );
  }, []);

  // First load (shows the "Loading..." text) and the Retry button.
  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      await fetchAll();
    } catch (err) {
      setLoadError(err.message || "Could not load the menu.");
    } finally {
      setLoading(false);
    }
  }, [fetchAll]);

  useEffect(() => {
    reload();
  }, [reload]);

  // Success messages disappear by themselves after 4 seconds. Errors stay until closed.
  useEffect(() => {
    if (!notice || notice.type !== "success") return undefined;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const clearNotice = useCallback(() => setNotice(null), []);

  // Runs one action against the server:
  //   1. disable the buttons (saving = true)
  //   2. call the server
  //   3. on success: re-read the list (so the screen shows exactly what is in the database)
  //   4. on failure: keep the server's message (e.g. "A dish with this name already exists.")
  const run = async (action, successText) => {
    setSaving(true);
    setNotice(null);
    try {
      const result = await action();
      await fetchAll();
      setNotice({
        type: "success",
        text:
          typeof successText === "function" ? successText(result) : successText,
      });
      return true;
    } catch (err) {
      setNotice({
        type: "error",
        text: err.message || "Something went wrong. Please try again.",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const createItem = (form) =>
    run(
      () => apiService.createMenuItem(toPayload(form)),
      "Dish added to the menu.",
    );

  const updateItem = (id, form) =>
    run(() => apiService.updateMenuItem(id, toPayload(form)), "Dish updated.");

  const toggleAvailability = (item) =>
    run(
      () => apiService.setMenuItemAvailability(item.id, !item.available),
      item.available
        ? `"${item.name}" is now marked unavailable.`
        : `"${item.name}" is available again.`,
    );

  // The server deletes a dish that was never ordered, but only HIDES one that appears in old bills.
  // Its message tells us which happened, so we show it.
  const deleteItem = (id) =>
    run(
      () => apiService.deleteMenuItem(id),
      (result) =>
        result && result.archived ? result.message : "Dish deleted.",
    );

  return {
    items,
    categories,
    loading,
    loadError,
    saving,
    notice,
    clearNotice,
    reload,
    createItem,
    updateItem,
    toggleAvailability,
    deleteItem,
  };
}

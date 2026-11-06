// src/hooks/useCustomerMenu.js
// One place where every customer menu page gets its dishes and categories.
// Data comes from the real backend through apiService (menu is real by default).
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import apiService from "../services/api";

const FALLBACK_IMAGE = "/assets/food-placeholders/food-healthy-bowl.png";

// Turns a backend dish into the shape the pages and the cart use
const normalizeDish = (d) => ({
  id: d.id,
  name: d.name,
  description: d.description || "",
  price: Number(d.price),
  image: d.image || d.image_url || FALLBACK_IMAGE,
  category: d.category || "",
  categoryId: d.categoryId ?? d.category_id ?? null,
  available: Boolean(d.available ?? d.is_available ?? true),
  prepTime: d.prepTime ?? null,
});

export default function useCustomerMenu() {
  // Categories.jsx opens the menu with navigate(path, { state: { categoryId } })
  const location = useLocation();
  const startCategory = location.state?.categoryId ?? "all";

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(startCategory); // "all" or a category id

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [dishes, cats] = await Promise.all([
        apiService.getMenuItems(),
        apiService.getCategories(),
      ]);
      setItems((dishes || []).map(normalizeDish).filter((d) => d.available));
      setCategories(cats || []);
    } catch (err) {
      setError(err.message || "Could not load the menu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Search and category filter run in the browser (fine for a restaurant-sized menu)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((d) => {
      const inCategory =
        selectedCategory === "all" ||
        String(d.categoryId) === String(selectedCategory);
      const matches =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q);
      return inCategory && matches;
    });
  }, [items, search, selectedCategory]);

  return {
    items,
    filtered,
    categories,
    loading,
    error,
    reload: load,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
  };
}

// src/hooks/useVip.js
// The customer's VIP status, always asked from the server.
// The browser never decides who is VIP, so editing localStorage cannot unlock anything.
import { useCallback, useEffect, useState } from "react";
import apiService from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function useVip() {
  const { user } = useAuth();
  // Only customers have a VIP status. Staff accounts skip the request.
  const isCustomer = String(user?.role || "").toLowerCase() === "customer";

  const [vip, setVip] = useState(null);
  const [loading, setLoading] = useState(isCustomer);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!isCustomer) {
      setVip(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      setVip(await apiService.getMyVip());
    } catch (err) {
      setError(err.message || "Could not load your VIP status.");
    } finally {
      setLoading(false);
    }
  }, [isCustomer]);

  useEffect(() => {
    load();
  }, [load]);

  return { vip, loading, error, reload: load, isVip: Boolean(vip?.isVip) };
}

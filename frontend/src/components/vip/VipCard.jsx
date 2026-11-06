// src/components/vip/VipCard.jsx
import React, { useEffect, useState } from "react";
import { Crown, Lock, Copy, Check, Zap, Percent, RefreshCw } from "lucide-react";
import useVip from "../../hooks/useVip";

export default function VipCard({ compact = false }) {
  const { vip, loading, error, reload } = useVip();
  const [copied, setCopied] = useState(false);

  // Hide the "Copied" tick after 2 seconds. The cleanup cancels the timer if the page closes first.
  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  if (loading) {
    return <div className="h-28 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />;
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex items-center justify-between p-3 rounded-xl text-xs font-semibold border bg-rose-50 text-rose-700 border-rose-100"
      >
        <span>{error}</span>
        <button
          type="button"
          onClick={reload}
          className="flex items-center gap-1 px-3 py-1 bg-rose-600 text-white rounded-lg cursor-pointer"
        >
          <RefreshCw size={12} /> Retry
        </button>
      </div>
    );
  }

  // Staff accounts have no VIP status
  if (!vip) return null;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(vip.code);
      setCopied(true);
    } catch {
      /* clipboard blocked: the code is still visible on screen */
    }
  };

  // ---------- LOCKED: fewer visits than required ----------
  if (!vip.isVip) {
    return (
      <div className="bg-white dark:bg-[#0B1426] border border-gray-100 dark:border-gray-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 shrink-0">
            <Lock size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Become a VIP</h3>
            <p className="text-[11px] text-gray-400">
              Place {vip.required} orders to unlock priority service and {vip.discountPercent}% off every order.
            </p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] font-bold text-gray-600 dark:text-gray-300">
            <span>{vip.visits} of {vip.required} orders</span>
            <span>
              {vip.remaining} {vip.remaining === 1 ? "order" : "orders"} to go
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="VIP progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={vip.progressPercent}
            className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden mt-1.5"
          >
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${vip.progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ---------- UNLOCKED: VIP ----------
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 text-amber-950 shadow-md space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-white/40 flex items-center justify-center shrink-0">
          <Crown size={22} />
        </div>
        <div>
          <h3 className="font-black text-sm">You are a VIP</h3>
          <p className="text-[11px] font-semibold opacity-80">
            Thank you for {vip.visits} orders. Your perks are active.
          </p>
        </div>
      </div>

      {!compact && (
        <div className="flex flex-wrap gap-2 text-[11px] font-bold">
          <span className="inline-flex items-center gap-1 bg-white/40 rounded-full px-2.5 py-1">
            <Zap size={12} /> Priority service
          </span>
          <span className="inline-flex items-center gap-1 bg-white/40 rounded-full px-2.5 py-1">
            <Percent size={12} /> {vip.discountPercent}% off your orders
          </span>
        </div>
      )}

      {!vip.code && (
        <p className="text-[11px] font-semibold opacity-80">
          Your {vip.discountPercent}% discount is applied automatically at checkout.
        </p>
      )}

      {vip.code && (
        <div className="flex items-center justify-between gap-3 bg-white/60 rounded-xl px-3 py-2">
          <div>
            <p className="text-[10px] font-bold uppercase opacity-70">Your VIP code</p>
            <p className="font-mono font-black text-base tracking-wider">{vip.code}</p>
          </div>
          <button
            type="button"
            onClick={copyCode}
            className="flex items-center gap-1.5 bg-amber-950 text-white text-xs font-bold px-3 py-2 rounded-lg cursor-pointer active:scale-95 transition-all"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
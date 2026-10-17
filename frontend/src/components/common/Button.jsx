import React from 'react';

export default function Button({ busy = false, children, className = '', ...props }) {
  return (
    <button
      {...props}
      disabled={busy || props.disabled}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 font-semibold text-white hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60 ${className}`}
    >
      {busy && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent motion-reduce:animate-none"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
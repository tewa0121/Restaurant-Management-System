import React from 'react';

export default function LanguageSelector() {
  return (
    <select
      aria-label="Language"
      defaultValue="en"
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
    >
      <option value="en">English</option>      <option value="am" disabled>
        አማርኛ (coming soon)
      </option>    </select>
  );
}
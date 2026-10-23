import React from 'react';

export default function Footer({ appName = 'RestoManager', version = 'v2.4.0' }) {
  return (
    <footer className="py-4 px-6 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 text-[11px] font-medium flex items-center justify-between shrink-0">
      <p>© {new Date().getFullYear()} {appName}. All rights reserved.</p>
      <p className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-500">{version}</p>
    </footer>
  );
}
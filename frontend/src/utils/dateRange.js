// Local-time YYYY-MM-DD helpers shared by the report pages.
const pad = (n) => String(n).padStart(2, '0');

export const toIsoDay = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

// Day offset from today: dayOffset(0) = today, dayOffset(-29) = 29 days ago.
export const dayOffset = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return toIsoDay(d);
};

// First day of the month, `monthsAgo` months back.
export const monthStart = (monthsAgo = 0) => {
  const d = new Date();
  return toIsoDay(new Date(d.getFullYear(), d.getMonth() - monthsAgo, 1));
};

// Monday of the week that contains the given YYYY-MM-DD day.
export const weekStart = (isoDay) => {
  const [y, m, d] = String(isoDay).split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const shift = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - shift);
  return toIsoDay(date);
};

export const downloadTextFile = (filename, text, type = 'text/csv;charset=utf-8') => {
  const blob = new Blob([text], { type });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
};

export const toCsv = (columns, rows) => {
  const escape = (v) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [columns.map((c) => escape(c.label)).join(','), ...rows.map((r) => columns.map((c) => escape(r[c.key])).join(','))].join('\n');
};

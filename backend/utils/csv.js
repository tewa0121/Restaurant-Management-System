const guard = (value) => {
  if (typeof value !== 'string') return value;
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
};

const escapeCell = (value) => {
  if (value === null || value === undefined) return '';
  const text = String(guard(value));
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

function toCsv(columns, rows) {
  const header = columns.map((column) => escapeCell(column.label)).join(',');
  const lines = rows.map((row) => columns.map((column) => escapeCell(row[column.key])).join(','));
  return `\uFEFF${[header, ...lines].join('\r\n')}\r\n`;
}

module.exports = { toCsv };
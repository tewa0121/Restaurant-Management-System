const pad = (n) => String(n).padStart(2, '0');

const toDate = (value) => (value instanceof Date ? value : new Date(String(value).replace(' ', 'T')));

const dayString = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const weekdayShort = (day) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(`${day}T00:00:00`).getDay()];

const clock = (value) => {
  if (!value) return '';
  const date = toDate(value);
  const hours = date.getHours();
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const twelve = hours % 12 === 0 ? 12 : hours % 12;
  return `${twelve}:${pad(date.getMinutes())} ${suffix}`;
};

const hourLabel = (hour) => {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve} ${suffix}`;
};

const timeAgo = (value) => {
  if (!value) return '';
  const minutes = Math.max(0, Math.floor((Date.now() - toDate(value).getTime()) / 60000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

const number = (value) => Number(value || 0).toLocaleString('en-US');

const money = (value, currency = 'ETB') => {
  const formatted = Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return currency === 'USD' ? `$${formatted}` : `${currency} ${formatted}`;
};

const change = (current, previous) => {
  const now = Number(current || 0);
  const before = Number(previous || 0);
  if (!before) return { change: '', trend: now > 0 ? 'up' : 'neutral' };
  const percent = Math.round(((now - before) / before) * 1000) / 10;
  if (percent === 0) return { change: '0%', trend: 'neutral' };
  return { change: `${percent > 0 ? '+' : ''}${percent}%`, trend: percent > 0 ? 'up' : 'down' };
};

const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

module.exports = { dayString, weekdayShort, clock, hourLabel, timeAgo, number, money, change, round2, toDate };
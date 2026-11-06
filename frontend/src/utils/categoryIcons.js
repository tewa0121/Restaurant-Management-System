// src/utils/categoryIcons.js
// The database stores no icon for a category, so one is picked by name.
// A category the manager adds later still works: it gets the fallback icon.
const ICONS = [
  ["breakfast", "🥞"],
  ["lunch", "🍲"],
  ["dinner", "🍖"],
  ["appetizer", "🧆"],
  ["starter", "🧆"],
  ["drink", "🍹"],
  ["beverage", "🍹"],
  ["dessert", "🍰"],
  ["salad", "🥗"],
  ["pizza", "🍕"],
  ["burger", "🍔"],
  ["pasta", "🍝"],
];

export const iconFor = (name) => {
  const n = String(name || "").toLowerCase();
  const hit = ICONS.find(([key]) => n.includes(key));
  return hit ? hit[1] : "🍽️";
};

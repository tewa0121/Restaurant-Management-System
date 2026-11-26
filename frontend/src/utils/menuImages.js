// Fallback dish photos, used only when a real menu item has no image of its own.
export const FOOD_PLACEHOLDER_FILES = [
  'food-biryani.png',
  'food-burger-fries.png',
  'food-burger.png',
  'food-chocolate-cake.png',
  'food-dessert.png',
  'food-grilled-chicken.png',
  'food-healthy-bowl.png',
  'food-juice.png',
  'food-pasta-alfredo.png',
  'food-pizza.png',
  'food-salad.png',
  'food-steak.png',
];

export const PLACEHOLDER_IMAGES = FOOD_PLACEHOLDER_FILES.map(
  (file) => `/assets/food-placeholders/${file}`
);

export const resolveImageSrc = (item, index = 0) => {
  const raw = item?.imageUrl || item?.image_url || item?.image || '';
  if (raw && typeof raw === 'string' && raw.trim()) {
    const clean = raw.trim();
    if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('/')) {
      return clean;
    }
    return `/assets/food-placeholders/${clean.replace(/^\/+/, '')}`;
  }
  return PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
};

export const categoryOf = (item) =>
  item?.categoryName ||
  item?.category_name ||
  item?.category?.name ||
  (typeof item?.category === 'string' ? item.category : '') ||
  '';
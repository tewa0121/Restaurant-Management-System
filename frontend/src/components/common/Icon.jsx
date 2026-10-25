import React from 'react';
import * as LucideIcons from 'lucide-react';

/**
 * Reusable dynamic icon component wrapping lucide-react.
 * 
 * @param {string} name - Lucide icon component name (e.g., "ShoppingBag", "Users", "Settings")
 * @param {string} className - Optional Tailwind CSS class string
 * @param {object} props - Additional Lucide SVG props (color, size, strokeWidth, etc.)
 */
export default function Icon({ name, className = 'w-4 h-4', ...props }) {
  // Retrieve icon component dynamically or default to HelpCircle if not found
  const IconComponent = LucideIcons[name] || LucideIcons.HelpCircle;

  return <IconComponent className={className} {...props} />;
}
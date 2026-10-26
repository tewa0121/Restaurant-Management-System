// src/components/common/Icon.jsx
import React from 'react';
import * as LucideIcons from 'lucide-react';

export default function Icon({ name, icon, size = 20, color, className = '', ...props }) {
  // 1. If an explicit Lucide Icon component is passed via `icon` or `name`
  const DirectComponent = icon || (typeof name === 'function' ? name : null);
  if (DirectComponent) {
    return <DirectComponent size={size} color={color} className={className} {...props} />;
  }

  // 2. If a string name is passed (e.g. name="Menu" or name="utensils")
  if (typeof name === 'string' && name.trim()) {
    // Standardize to PascalCase (e.g. "menu" -> "Menu")
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    const FoundIcon = LucideIcons[name] || LucideIcons[formattedName] || LucideIcons.HelpCircle;
    return <FoundIcon size={size} color={color} className={className} {...props} />;
  }

  // 3. Default fallback icon if nothing valid is passed
  const Fallback = LucideIcons.HelpCircle;
  return <Fallback size={size} color={color} className={className} {...props} />;
}
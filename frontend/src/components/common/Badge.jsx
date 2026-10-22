import React from 'react';

/**
 * A highly reusable Badge component.
 * 
 * Usage Examples:
 * <Badge variant="success">Paid</Badge>
 * <Badge variant="warning">Pending</Badge>
 * <Badge variant="danger" size="sm">Cancelled</Badge>
 * <Badge variant="info" icon={CheckCircle}>Ready</Badge>
 * <Badge variant="custom" className="bg-purple-100 text-purple-700">VIP</Badge>
 */
export default function Badge({ 
  children, 
  variant = 'default', 
  size = 'md', 
  icon: Icon,
  className = '',
  dot = false 
}) {
  
  // 1. Define the color variations
  const variants = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-orange-100 text-orange-700 border-orange-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    teal: 'bg-teal-100 text-teal-700 border-teal-200',
    custom: '', // For custom overrides via className
  };

  // 2. Define the sizes
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  // 3. Define the dot color based on variant
  const dotColors = {
    default: 'bg-gray-500',
    success: 'bg-green-500',
    warning: 'bg-orange-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
    teal: 'bg-teal-500',
    custom: 'bg-current',
  };

  return (
    <span 
      className={`
        inline-flex items-center justify-center gap-1.5 
        font-bold rounded-full border 
        whitespace-nowrap
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
      `}
    >
      {/* Optional Status Dot */}
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      
      {/* Optional Icon */}
      {Icon && <Icon size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} />}
      
      {/* Badge Text */}
      {children}
    </span>
  );
}
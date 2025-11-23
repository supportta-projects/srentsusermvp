'use client';

import { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'availability' | 'featured' | 'verified' | 'scarcity';
  children: ReactNode;
  className?: string;
}

export default function Badge({ variant = 'availability', children, className = '' }: BadgeProps) {
  const variantStyles = {
    availability: 'bg-[#10B981] text-white',
    featured: 'bg-yellow-500 text-yellow-900',
    verified: 'bg-blue-500 text-white',
    scarcity: 'bg-[#DC2626] text-white',
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}


'use client';

interface ScarcityBadgeProps {
  type: 'availability' | 'urgency' | 'social-proof';
  value?: string | number;
  className?: string;
}

export default function ScarcityBadge({ type, value, className = '' }: ScarcityBadgeProps) {
  const badges = {
    availability: {
      icon: '✓',
      text: value ? `Only ${value} left` : 'Available',
      color: 'bg-[#10B981] text-white',
    },
    urgency: {
      icon: '🔥',
      text: value || 'Popular - Booked today',
      color: 'bg-[#DC2626] text-white',
    },
    'social-proof': {
      icon: '👁️',
      text: value ? `${value} people viewing` : 'People viewing',
      color: 'bg-blue-500 text-white',
    },
  };
  
  const badge = badges[type];
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${badge.color} ${className}`}>
      <span>{badge.icon}</span>
      <span>{badge.text}</span>
    </span>
  );
}


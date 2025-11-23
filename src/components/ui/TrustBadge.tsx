'use client';

interface TrustBadgeProps {
  type: 'verified' | 'response-time' | 'member-since' | 'total-rentals';
  value?: string | number;
  className?: string;
}

export default function TrustBadge({ type, value, className = '' }: TrustBadgeProps) {
  const badges = {
    verified: {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: 'Verified Shop',
      color: 'text-blue-400',
    },
    'response-time': {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: value ? `Usually responds within ${value}` : 'Quick Response',
      color: 'text-green-400',
    },
    'member-since': {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      text: value ? `Member since ${value}` : 'Established Shop',
      color: 'text-gray-400',
    },
    'total-rentals': {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: value ? `${value} successful rentals` : 'Trusted',
      color: 'text-green-400',
    },
  };
  
  const badge = badges[type];
  
  return (
    <div className={`inline-flex items-center gap-1.5 text-xs ${badge.color} ${className}`}>
      {badge.icon}
      <span>{badge.text}</span>
    </div>
  );
}


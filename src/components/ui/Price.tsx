'use client';

interface PriceProps {
  amount: number;
  period?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}

export default function Price({ amount, period = '/day', size = 'md', className = '' }: PriceProps) {
  const sizeStyles = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl md:text-4xl',
    hero: 'text-4xl md:text-5xl lg:text-6xl',
  };
  
  return (
    <div className={`flex items-baseline gap-1.5 ${className}`}>
      <span className={`font-bold text-[#DC2626] ${sizeStyles[size]}`}>
        ₹{amount.toLocaleString()}
      </span>
      {period && (
        <span className="text-gray-400 font-medium text-sm md:text-base">
          {period}
        </span>
      )}
    </div>
  );
}


'use client';

import { motion } from 'framer-motion';

interface RentOrentLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function RentOrentLogo({ className = '', size = 'md' }: RentOrentLogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <motion.div
      className={`flex items-center gap-1 font-bold tracking-tight ${sizeClasses[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <motion.span
        className="text-white"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Rent
      </motion.span>
      <motion.span
        className="bg-gradient-to-r from-[#DC2626] to-[#EF4444] bg-clip-text text-transparent"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Orent
      </motion.span>
    </motion.div>
  );
}


'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Users, Package, ShoppingCart, TrendingUp } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: 8,
    suffix: '+',
    label: 'Active Vendors',
    color: 'text-[#DC2626]',
  },
  {
    icon: Package,
    value: 500,
    suffix: '+',
    label: 'Products Managed',
    color: 'text-[#3B82F6]',
  },
  {
    icon: ShoppingCart,
    value: 1000,
    suffix: '+',
    label: 'Orders Processed',
    color: 'text-[#10B981]',
  },
  {
    icon: TrendingUp,
    value: 99.9,
    suffix: '%',
    label: 'Uptime',
    color: 'text-[#F59E0B]',
  },
];

function AnimatedNumber({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {decimals > 0 ? displayValue.toFixed(decimals) : Math.floor(displayValue)}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black border-y border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className={`p-4 rounded-xl bg-white/5 border border-white/10 ${stat.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                </div>
                <div className="mb-2">
                  <span className={`text-4xl sm:text-5xl font-bold ${stat.color}`}>
                    <AnimatedNumber 
                      value={stat.value} 
                      suffix={stat.suffix}
                      decimals={stat.value === 99.9 ? 1 : 0}
                    />
                  </span>
                </div>
                <p className="text-gray-400 text-sm sm:text-base font-medium">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


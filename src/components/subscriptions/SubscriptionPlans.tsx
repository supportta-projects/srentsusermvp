'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { SubscriptionPlan } from '@/types';
import Button from '../ui/Button';

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  onSelectPlan: (plan: SubscriptionPlan) => void;
  currentPlanId?: string;
  loading?: boolean;
}

export default function SubscriptionPlans({ 
  plans, 
  onSelectPlan, 
  currentPlanId,
  loading = false 
}: SubscriptionPlansProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  useEffect(() => {
    if (currentPlanId) {
      setSelectedPlanId(currentPlanId);
    }
  }, [currentPlanId]);

  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No subscription plans available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan, index) => {
        const isSelected = selectedPlanId === plan.id;
        const isCurrentPlan = currentPlanId === plan.id;
        const monthlyPrice = plan.duration === 30 
          ? plan.amount 
          : Math.round(plan.amount / (plan.duration / 30));

        return (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className={`relative bg-[#1A1A1A] rounded-2xl border p-8 transition-all duration-300 ${
              isSelected
                ? 'border-[#DC2626] shadow-lg shadow-[#DC2626]/20'
                : 'border-white/10 hover:border-[#DC2626]/50 hover:shadow-lg hover:shadow-[#DC2626]/10'
            }`}
          >
            {isCurrentPlan && (
              <div className="absolute top-4 right-4">
                <span className="bg-[#10B981] text-white text-xs font-medium px-3 py-1 rounded-full">
                  Current Plan
                </span>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">₹{plan.amount}</span>
                {plan.duration !== 30 && (
                  <span className="text-gray-400 text-sm">
                    /{plan.duration} days
                  </span>
                )}
              </div>
              {plan.duration !== 30 && (
                <p className="text-gray-400 text-sm mt-1">
                  ₹{monthlyPrice}/month equivalent
                </p>
              )}
            </div>

            <p className="text-gray-400 text-sm mb-6 min-h-[40px]">
              {plan.description}
            </p>

            <div className="border-t border-white/10 pt-6 mt-6 space-y-4">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              variant={isSelected ? 'primary' : 'secondary'}
              size="md"
              onClick={() => {
                setSelectedPlanId(plan.id);
                onSelectPlan(plan);
              }}
              disabled={loading || isCurrentPlan}
              className="w-full"
            >
              {isCurrentPlan
                ? 'Current Plan'
                : isSelected
                ? 'Selected'
                : 'Select Plan'}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}


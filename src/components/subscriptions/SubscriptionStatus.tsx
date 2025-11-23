'use client';

import { VendorSubscription } from '@/types';
import Button from '../ui/Button';

interface SubscriptionStatusProps {
  subscription: VendorSubscription | null;
  onRenew?: () => void;
}

export default function SubscriptionStatus({ subscription, onRenew }: SubscriptionStatusProps) {
  if (!subscription) {
    return (
      <div className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Subscription Status</h3>
          <span className="bg-gray-800 text-gray-400 text-sm font-medium px-3 py-1 rounded-full">
            No Subscription
          </span>
        </div>
        <p className="text-gray-400 mb-4">
          You don't have an active subscription. Subscribe to continue using the platform.
        </p>
        {onRenew && (
          <Button variant="primary" size="md" onClick={onRenew}>
            Subscribe Now
          </Button>
        )}
      </div>
    );
  }

  const now = new Date();
  const endDate = subscription.endDate instanceof Date 
    ? subscription.endDate 
    : new Date(subscription.endDate);
  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = daysRemaining <= 0;
  const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 7;

  const getStatusColor = () => {
    if (subscription.status === 'active' && !isExpired) {
      return 'bg-[#10B981]';
    } else if (isExpiringSoon) {
      return 'bg-yellow-600';
    } else {
      return 'bg-gray-800';
    }
  };

  const getStatusText = () => {
    if (subscription.status === 'active' && !isExpired) {
      return 'Active';
    } else if (isExpired) {
      return 'Expired';
    } else if (isExpiringSoon) {
      return 'Expiring Soon';
    } else {
      return subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1);
    }
  };

  return (
    <div className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">Subscription Status</h3>
        <span className={`${getStatusColor()} text-white text-sm font-medium px-3 py-1 rounded-full`}>
          {getStatusText()}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-gray-400 text-sm mb-1">Current Plan</p>
          <p className="text-white font-medium">{subscription.planName}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-sm mb-1">Start Date</p>
            <p className="text-white text-sm">
              {subscription.startDate instanceof Date 
                ? subscription.startDate.toLocaleDateString()
                : new Date(subscription.startDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">End Date</p>
            <p className="text-white text-sm">
              {endDate.toLocaleDateString()}
            </p>
          </div>
        </div>

        {!isExpired && (
          <div>
            <p className="text-gray-400 text-sm mb-1">Days Remaining</p>
            <p className={`text-lg font-semibold ${isExpiringSoon ? 'text-yellow-400' : 'text-white'}`}>
              {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
            </p>
          </div>
        )}

        {isExpired && onRenew && (
          <Button variant="primary" size="md" onClick={onRenew} className="w-full mt-4">
            Renew Subscription
          </Button>
        )}

        {isExpiringSoon && !isExpired && onRenew && (
          <Button variant="primary" size="md" onClick={onRenew} className="w-full mt-4">
            Renew Now
          </Button>
        )}
      </div>
    </div>
  );
}


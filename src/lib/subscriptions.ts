import { SubscriptionPlan, VendorSubscription, SubscriptionPayment } from '@/types';

/**
 * Get all active subscription plans (Mock - no Firebase)
 */
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  // Return mock plans - no Firebase needed
  return [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      description: 'Perfect for getting started. Access all features for one month.',
      amount: 1499,
      duration: 30,
      features: [
        'Full access to vendor dashboard',
        'Unlimited product listings',
        'Unlimited orders management',
        'Customer management',
        'Staff management',
        'Analytics and reports',
        'Email support',
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'six-month',
      name: '6-Month Plan',
      description: 'Save money with 6 months subscription. Best value for growing businesses.',
      amount: 6300,
      duration: 180,
      features: [
        'Full access to vendor dashboard',
        'Unlimited product listings',
        'Unlimited orders management',
        'Customer management',
        'Staff management',
        'Analytics and reports',
        'Priority email support',
        'Save ₹2,694 vs monthly',
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      description: 'Best value! Get 12 months at the best price. Perfect for established businesses.',
      amount: 9999,
      duration: 365,
      features: [
        'Full access to vendor dashboard',
        'Unlimited product listings',
        'Unlimited orders management',
        'Customer management',
        'Staff management',
        'Analytics and reports',
        '24/7 dedicated support',
        'Save ₹4,497 vs monthly',
        'Only ₹27/day',
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}

/**
 * Get subscription plan by ID (Mock - no Firebase)
 */
export async function getSubscriptionPlan(planId: string): Promise<SubscriptionPlan | null> {
  const plans = await getSubscriptionPlans();
  return plans.find(plan => plan.id === planId) || null;
}

/**
 * Get vendor subscription (Mock - no Firebase)
 */
export async function getVendorSubscription(vendorId: string): Promise<VendorSubscription | null> {
  // Check localStorage for subscription
  try {
    const stored = localStorage.getItem(`vendor_subscription_${vendorId}`);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      } as VendorSubscription;
    }
  } catch (error) {
    console.error('Error fetching vendor subscription:', error);
  }
  return null;
}

/**
 * Check if vendor has active subscription (Mock - no Firebase)
 */
export async function hasActiveSubscription(vendorId: string): Promise<boolean> {
  const subscription = await getVendorSubscription(vendorId);
  
  if (!subscription || subscription.status !== 'active') {
    return false;
  }
  
  // Check if subscription is not expired
  const now = new Date();
  const endDate = subscription.endDate instanceof Date 
    ? subscription.endDate 
    : new Date(subscription.endDate);
  
  if (now >= endDate) {
    // Subscription expired - update status in localStorage
    const stored = localStorage.getItem(`vendor_subscription_${vendorId}`);
    if (stored) {
      const data = JSON.parse(stored);
      data.status = 'expired';
      data.updatedAt = Date.now();
      localStorage.setItem(`vendor_subscription_${vendorId}`, JSON.stringify(data));
    }
    return false;
  }
  
  return true;
}

/**
 * Create or update vendor subscription (Mock - no Firebase)
 */
export async function createVendorSubscription(
  vendorId: string,
  subscriptionData: Omit<VendorSubscription, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  const subscription: VendorSubscription = {
    id: vendorId,
    ...subscriptionData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  localStorage.setItem(`vendor_subscription_${vendorId}`, JSON.stringify({
    ...subscription,
    startDate: subscription.startDate.getTime(),
    endDate: subscription.endDate.getTime(),
    createdAt: subscription.createdAt.getTime(),
    updatedAt: subscription.updatedAt.getTime(),
  }));
}

/**
 * Update vendor subscription (Mock - no Firebase)
 */
export async function updateVendorSubscription(
  vendorId: string,
  updates: Partial<VendorSubscription>
): Promise<void> {
  const stored = localStorage.getItem(`vendor_subscription_${vendorId}`);
  if (stored) {
    const data = JSON.parse(stored);
    const updated = {
      ...data,
      ...updates,
      updatedAt: Date.now(),
    };
    localStorage.setItem(`vendor_subscription_${vendorId}`, JSON.stringify(updated));
  }
}

/**
 * Create subscription payment record (Mock - no Firebase)
 */
export async function createSubscriptionPayment(
  paymentData: Omit<SubscriptionPayment, 'id' | 'createdAt'>
): Promise<string> {
  const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const payment: SubscriptionPayment = {
    id: paymentId,
    ...paymentData,
    createdAt: new Date(),
  };
  
  const payments = JSON.parse(localStorage.getItem('vendor_payments') || '[]');
  payments.push({
    ...payment,
    createdAt: payment.createdAt.getTime(),
    completedAt: payment.completedAt?.getTime(),
    failedAt: payment.failedAt?.getTime(),
  });
  localStorage.setItem('vendor_payments', JSON.stringify(payments));
  
  return paymentId;
}

/**
 * Update subscription payment status (Mock - no Firebase)
 */
export async function updateSubscriptionPayment(
  paymentId: string,
  updates: Partial<SubscriptionPayment>
): Promise<void> {
  const payments = JSON.parse(localStorage.getItem('vendor_payments') || '[]');
  const index = payments.findIndex((p: any) => p.id === paymentId);
  if (index !== -1) {
    payments[index] = {
      ...payments[index],
      ...updates,
      ...(updates.status === 'completed' && { completedAt: Date.now() }),
      ...(updates.status === 'failed' && { failedAt: Date.now() }),
    };
    localStorage.setItem('vendor_payments', JSON.stringify(payments));
  }
}

/**
 * Get vendor payment history (Mock - no Firebase)
 */
export async function getVendorPayments(vendorId: string): Promise<SubscriptionPayment[]> {
  try {
    const payments = JSON.parse(localStorage.getItem('vendor_payments') || '[]');
    return payments
      .filter((p: any) => p.vendorId === vendorId)
      .map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        completedAt: p.completedAt ? new Date(p.completedAt) : undefined,
        failedAt: p.failedAt ? new Date(p.failedAt) : undefined,
      })) as SubscriptionPayment[];
  } catch (error) {
    console.error('Error fetching vendor payments:', error);
    return [];
  }
}


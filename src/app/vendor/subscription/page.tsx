import { redirect } from 'next/navigation';

// Redirect old /vendor/subscription route to /subscription
export default function SubscriptionRedirect() {
  redirect('/subscription');
}

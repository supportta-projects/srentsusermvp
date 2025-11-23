import { redirect } from 'next/navigation';

// Redirect to vendor portal - focusing only on vendor registration and payment
export default function Home() {
  redirect('/vendor');
}

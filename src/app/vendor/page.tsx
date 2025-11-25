import { redirect } from 'next/navigation';

// Redirect old /vendor route to root
export default function VendorRedirect() {
  redirect('/');
}

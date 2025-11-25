import { redirect } from 'next/navigation';

// Redirect old /vendor/login route to /login
export default function LoginRedirect() {
  redirect('/login');
}

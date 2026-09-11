import { redirect } from 'next/navigation';

export default function HomePage() {
  // Purely cosmetic redirect for demo recording purposes.
  // We want the app to start at the login page.
  redirect('/login');
}

'use client';
import Link from 'next/link';
import { useSession } from '@/store/session';

// "Welcome back, Asha." in the footer, shown only while someone is signed in.
export function FooterGreeting() {
  const user = useSession((s) => s.user);
  if (!user) return null;
  return (
    <p className="greet" role="status">
      Welcome back, <b>{user.first}</b>. <Link className="ulink" href="/account">Your account</Link>
    </p>
  );
}

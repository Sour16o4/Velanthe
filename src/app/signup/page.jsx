import { Suspense } from 'react';
import { AuthForm } from '@/components/AuthForm';

export const metadata = { title: 'Sign up' };

export default function Signup() {
  return <main id="main" className="pg narrow"><Suspense><AuthForm mode="signup" /></Suspense></main>;
}

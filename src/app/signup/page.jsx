import { Suspense } from 'react';
import { AuthForm } from '@/components/AuthForm';

export const metadata = { title: 'Sign up' };

export default function Signup() {
  return <main id="main" className="px-4 pb-16 pt-36"><Suspense><AuthForm mode="signup" /></Suspense></main>;
}

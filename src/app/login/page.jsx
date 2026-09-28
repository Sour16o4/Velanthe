import { Suspense } from 'react';
import { AuthForm } from '@/components/AuthForm';

export const metadata = { title: 'Log in' };

export default function Login() {
  return <main id="main" className="pg narrow"><Suspense><AuthForm mode="login" /></Suspense></main>;
}

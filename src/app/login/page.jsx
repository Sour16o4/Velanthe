import { Suspense } from 'react';
import { AuthForm } from '@/components/AuthForm';

export const metadata = { title: 'Log in' };

export default function Login() {
  return <main id="main" className="px-4 pb-16 pt-36"><Suspense><AuthForm mode="login" /></Suspense></main>;
}

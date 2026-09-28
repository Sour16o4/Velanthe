import { ForgotPasswordForm } from '@/components/ForgotPasswordForm';

export const metadata = { title: 'Reset password' };

export default function ForgotPassword() {
  return (
    <main id="main" className="pg narrow">
      <span className="eyebrow">Account</span>
      <h1 className="serif pgh">Reset password</h1>
      <ForgotPasswordForm />
    </main>
  );
}

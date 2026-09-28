import { UpdatePasswordForm } from '@/components/UpdatePasswordForm';

export const metadata = { title: 'New password' };

// Only reachable while signed in (middleware guards /account/*): the reset email link signs the user in first.
export default function UpdatePassword() {
  return (
    <main id="main" className="pg narrow">
      <span className="eyebrow">Account</span>
      <h1 className="serif pgh">New password</h1>
      <UpdatePasswordForm />
    </main>
  );
}

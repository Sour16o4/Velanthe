'use client';
import { useFormStatus } from 'react-dom';

// Must live inside the <form action={placeOrder}>: useFormStatus reads the
// status of its parent form. Disabling while pending is what stops a double
// click from submitting the order twice.
export function PlaceOrderButton({ total }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="label border border-ink bg-ink px-6 py-4 text-ivory hover:bg-gold hover:text-ink disabled:opacity-50"
    >
      {pending ? 'Placing order…' : `Place order · ${total}`}
    </button>
  );
}

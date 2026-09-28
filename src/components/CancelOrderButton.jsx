'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cancelOrder } from '@/app/account/orders/actions';
import { useUI } from '@/store/ui';

export function CancelOrderButton({ orderId }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function cancel() {
    if (!window.confirm('Cancel this order? This cannot be undone.')) return;
    setBusy(true);
    try {
      await cancelOrder(orderId);
      useUI.getState().say('Order cancelled.');
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" disabled={busy} className="dtext" onClick={cancel}>
      {busy ? 'Cancelling…' : 'Cancel order'}
    </button>
  );
}

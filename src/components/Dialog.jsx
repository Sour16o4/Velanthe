'use client';
import { useEffect, useRef } from 'react';

export function Dialog({ open, onClose, label, className, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} aria-label={label} className={className} onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      {children}
    </dialog>
  );
}

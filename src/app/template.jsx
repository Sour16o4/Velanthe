'use client';
import { usePathname } from 'next/navigation';

// No opacity animation on the home hero (LCP).
export default function Template({ children }) {
  const home = usePathname() === '/';
  return <div className={home ? undefined : 'animate-[fade-in_0.4s_ease-out_both]'}>{children}</div>;
}

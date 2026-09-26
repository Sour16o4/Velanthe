'use client';

export default function Error({ reset }) {
  return (
    <main id="main" className="mx-auto max-w-xl px-4 pb-32 pt-32 text-center">
      <h1 className="display text-5xl">Something went wrong</h1>
      <p className="mt-4 text-mute">Please try again in a moment.</p>
      <button onClick={reset} className="label mt-8 border border-ink px-6 py-3 hover:bg-gold hover:text-ink">Try again</button>
    </main>
  );
}

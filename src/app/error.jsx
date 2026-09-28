'use client';

export default function Error({ reset }) {
  return (
    <main id="main" className="pg empty">
      <h1 className="serif pgh">Something went <em>wrong</em></h1>
      <p className="muted lede">Please try again in a moment.</p>
      <button type="button" onClick={reset} className="btn"><span>Try again</span></button>
    </main>
  );
}

export function safeNext(raw) {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\') || /[\u0000-\u001f\u007f\\]/.test(raw)) return '/';
  try {
    const u = new URL(raw, 'http://x');
    // Guards against dot-segment / mixed-slash tricks (e.g. "/..//evil.com") that
    // resolve to a protocol-relative path, and any resolution that escapes the origin.
    if (u.origin !== 'http://x' || u.pathname.startsWith('//')) return '/';
    return u.pathname + u.search + u.hash;
  } catch {
    return '/';
  }
}

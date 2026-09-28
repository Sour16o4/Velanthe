// Names shown for a signed-in user. Pure functions, so they are easy to test.

// Trim, collapse spaces, and cap the length. Anything that is not a string becomes ''.
export function cleanName(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, 80) : '';
}

// The full name saved at signup; older accounts without one fall back to the part of their email before "@".
export function displayName(user) {
  const saved = cleanName(user?.user_metadata?.full_name);
  if (saved) return saved;
  const local = cleanName(String(user?.email ?? '').split('@')[0].replace(/[._+-]+/g, ' '));
  return local ? local.replace(/\b\w/g, (c) => c.toUpperCase()) : 'friend';
}

export const firstName = (user) => displayName(user).split(' ')[0];

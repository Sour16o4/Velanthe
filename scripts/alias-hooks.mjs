// Lets Node's built-in test runner load the app's source files as they are written for Next.js:
//   '@/lib/bag'  -> src/lib/bag.js      (the "@/" alias from jsconfig.json)
//   './bag'      -> ./bag.js            (imports without a file extension)
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const srcDir = new URL('../src/', import.meta.url);

function findFile(target) {
  const base = fileURLToPath(target);
  for (const ext of ['', '.js', '.jsx', '/index.js']) {
    if (existsSync(base + ext) && statSync(base + ext).isFile()) {
      return pathToFileURL(base + ext).href + target.search; // keep ?query so tests can load a fresh copy of a module
    }
  }
}

// Works both as a sync hook (module.registerHooks) and as an async hook (module.register).
export function resolve(specifier, context, nextResolve) {
  let target;
  if (specifier.startsWith('@/')) target = new URL(specifier.slice(2), srcDir);
  else if (/^\.\.?\//.test(specifier) && context.parentURL?.startsWith(srcDir.href)) target = new URL(specifier, context.parentURL);
  const found = target && findFile(target);
  return nextResolve(found ?? specifier, context);
}

// The app's .js files use import/export but package.json has no "type": "module"
// (Next.js needs it that way), so tell Node to load them as ES modules.
export function load(url, context, nextLoad) {
  const isSource = url.startsWith(srcDir.href) && new URL(url).pathname.endsWith('.js');
  return nextLoad(url, isSource ? { ...context, format: 'module' } : context);
}

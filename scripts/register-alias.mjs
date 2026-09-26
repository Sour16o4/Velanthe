// Preloaded with `node --import` by the test script (see package.json).
import * as nodeModule from 'node:module';
import { resolve, load } from './alias-hooks.mjs';

// registerHooks is the current API (Node 22.15+); older 22.x only has register.
if (nodeModule.registerHooks) nodeModule.registerHooks({ resolve, load });
else nodeModule.register('./alias-hooks.mjs', import.meta.url);

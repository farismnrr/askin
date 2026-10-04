import { cp, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const source = dirname(require.resolve('pyodide/package.json'));
const destination = resolve('static/pyodide');

// Python execution loads this runtime on demand; startup only copies local assets.
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });
console.log('Pyodide runtime assets ready.');

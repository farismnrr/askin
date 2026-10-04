import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const root = process.cwd();
const require = createRequire(path.join(root, 'package.json'));
const ts = require('typescript');
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (/\.(svelte|[cm]?js|ts|css|json)$/.test(file)) files.push(file);
  }
}
walk(path.join(root, 'src'));
const modules = files.filter(f => /\.(svelte|[cm]?js|ts)$/.test(f));
const graph = new Map();
const packages = new Map();
const unresolved = [];
function resolve(spec, from) {
  spec = spec.split('?')[0];
  const base = spec.startsWith('$lib/') ? path.join(root, 'src/lib', spec.slice(5)) : path.resolve(path.dirname(from), spec);
  return [base, ...['.ts','.js','.svelte','.json','.css','/index.ts','/index.js'].map(e => base + e)].find(f => fs.existsSync(f) && fs.statSync(f).isFile());
}
function imports(file) {
  const text = fs.readFileSync(file, 'utf8');
  const snippets = file.endsWith('.svelte') ? [...text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]) : [text];
  const specs = new Set();
  for (const snippet of snippets) {
    const ast = ts.createSourceFile(file, snippet, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    function visit(n) {
      if ((ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) && n.moduleSpecifier && ts.isStringLiteral(n.moduleSpecifier)) specs.add(n.moduleSpecifier.text);
      if (ts.isCallExpression(n) && n.expression.kind === ts.SyntaxKind.ImportKeyword && n.arguments[0] && (ts.isStringLiteral(n.arguments[0]) || ts.isNoSubstitutionTemplateLiteral(n.arguments[0]))) specs.add(n.arguments[0].text);
      if (ts.isNewExpression(n) && n.expression.getText(ast) === 'URL' && n.arguments?.[0] && ts.isStringLiteral(n.arguments[0])) specs.add(n.arguments[0].text);
      ts.forEachChild(n, visit);
    }
    visit(ast);
  }
  return specs;
}
for (const file of modules) {
  const deps = [];
  for (const spec of imports(file)) {
    if (spec.startsWith('.') || spec.startsWith('$lib/')) {
      const resolved = resolve(spec, file);
      if (resolved) deps.push(resolved);
      else unresolved.push({ file: path.relative(root,file), spec });
    } else if (!spec.startsWith('$') && !spec.startsWith('node:')) {
      const pkg = spec.startsWith('@') ? spec.split('/').slice(0,2).join('/') : spec.split('/')[0];
      packages.set(pkg, [...(packages.get(pkg) || []), path.relative(root,file)]);
    }
  }
  graph.set(file, deps);
}
const entries = modules.filter(f => f.includes('/src/routes/') || f.endsWith('/src/app.d.ts'));
const reachable = new Set();
function visit(file) {
  if (reachable.has(file)) return;
  reachable.add(file);
  for (const dep of graph.get(file) || []) visit(dep);
}
entries.forEach(visit);
const unused = modules.filter(f => !reachable.has(f)).map(f => ({file:path.relative(root,f),bytes:fs.statSync(f).size}));
const packageJson = JSON.parse(fs.readFileSync(path.join(root,'package.json')));
const missingDirect = [...packages.keys()].filter(p => !(p in packageJson.dependencies) && !(p in packageJson.devDependencies));
const report = {sourceModules: modules.length,entries:entries.length,reachableModules:modules.filter(f=>reachable.has(f)).length,unused,unresolved,packages:Object.fromEntries(packages),missingDirect};

console.log(JSON.stringify({...report,packages:[...packages.keys()]},null,2));

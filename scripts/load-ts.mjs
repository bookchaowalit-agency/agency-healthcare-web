// Imports a TypeScript module from a plain Node script on every supported Node (22.12+): Node before 22.18 does
// not strip types by default, so the file is transpiled with the project's own `typescript` into a temporary
// sibling .mjs (same folder, so its imports resolve the same way), imported, and removed again.
import { createRequire } from 'node:module';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);

export async function importTs(path) {
  const ts = require('typescript');
  const { outputText } = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, verbatimModuleSyntax: false },
    fileName: path,
  });
  const temp = join(dirname(path), `.${basename(path)}.${process.pid}.${Date.now()}.mjs`);
  writeFileSync(temp, outputText);
  try {
    return await import(pathToFileURL(temp).href);
  } finally {
    rmSync(temp, { force: true });
  }
}

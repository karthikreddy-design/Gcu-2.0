import { readFile, access } from 'node:fs/promises';
import assert from 'node:assert/strict';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'HTML IDs must be unique');
for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) {
  assert(ids.includes(id), `Missing link destination: #${id}`);
}
for (const [, path] of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)) {
  await access(new URL(`..${path}`, import.meta.url));
}
console.log('Local assets and section links verified.');

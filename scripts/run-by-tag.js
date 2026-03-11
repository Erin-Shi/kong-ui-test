const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Simple script to run cypress specs that contain a given tag in the it() title.
// Usage: node ./scripts/run-by-tag.js @service

const tag = process.argv[2];
if (!tag) {
  console.error('Usage: node ./scripts/run-by-tag.js <tag>');
  process.exit(1);
}

const specsDir = path.join(process.cwd(), 'cypress', 'e2e');
const allSpecs = fs.readdirSync(specsDir).filter(f => f.endsWith('.js'));

const matched = [];
for (const spec of allSpecs) {
  const content = fs.readFileSync(path.join(specsDir, spec), 'utf8');
  if (content.includes(tag)) matched.push(`cypress/e2e/${spec}`);
}

if (matched.length === 0) {
  console.log('No specs matched tag', tag);
  process.exit(0);
}

console.log('Running specs:', matched);
const cmd = `npx cypress run --spec "${matched.join(',')}"`;
console.log('Exec:', cmd);
execSync(cmd, { stdio: 'inherit' });

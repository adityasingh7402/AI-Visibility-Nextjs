import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eslintBin = path.join(__dirname, 'node_modules', '.bin', 'eslint');

try {
  const output = execSync(`"${eslintBin}" . --format=compact`, {
    cwd: __dirname,
    encoding: 'utf8',
    timeout: 90000,
    maxBuffer: 10 * 1024 * 1024
  });
  console.log(output);
} catch (e) {
  if (e.stdout) process.stdout.write(e.stdout);
  if (e.stderr) process.stderr.write(e.stderr);
}

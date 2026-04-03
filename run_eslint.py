import subprocess
import os
import sys

project_dir = r'C:\ASE\Project08\AI-Visibility-SaaS\AI-Visibility-Nextjs'
eslint_cmd = os.path.join(project_dir, 'node_modules', '.bin', 'eslint.cmd')

result = subprocess.run(
    [eslint_cmd, '.', '--format=compact'],
    cwd=project_dir,
    capture_output=True,
    text=True,
    timeout=90,
    encoding='utf-8',
    errors='replace'
)

print("=== STDOUT ===")
print(result.stdout if result.stdout else "(empty)")
print("=== STDERR ===")
print(result.stderr if result.stderr else "(empty)")
print("=== RETURN CODE:", result.returncode)

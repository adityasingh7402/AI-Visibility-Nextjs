#!/bin/sh
cd /c/ASE/Project08/AI-Visibility-SaaS/AI-Visibility-Nextjs
node node_modules/eslint/bin/eslint.js . --format=compact
echo "EXIT_CODE=$?"

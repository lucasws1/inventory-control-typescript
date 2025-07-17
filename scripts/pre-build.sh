#!/bin/bash
echo "🧹 Cleaning Prisma artifacts..."

# Remove generated Prisma client
rm -rf app/generated/prisma
rm -rf node_modules/.prisma
rm -rf .next

echo "✨ Generating fresh Prisma client..."
pnpm prisma generate --no-engine

echo "🔧 Build preparation complete!"

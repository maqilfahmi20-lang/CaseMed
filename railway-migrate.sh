#!/bin/bash
# Script untuk menjalankan migration di Railway production

echo "🚀 Running Prisma migration on Railway production..."

# Deploy migration
npx prisma migrate deploy

echo "✅ Migration completed!"
echo "📊 Checking database status..."

# Generate Prisma Client
npx prisma generate

echo "✅ Done! Database is ready."

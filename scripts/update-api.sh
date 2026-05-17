#!/bin/bash
# scripts/update-api.sh

# Exit on error
set -e

# Configuration
OPENAPI_URL="https://kapi.deth.dev/api/openapi.json"
OPENAPI_JSON="openapi.json"
CONTRACTS_DIR="app/shared-contracts"
TYPES_FILE="$CONTRACTS_DIR/openapi-types.ts"
GENERATED_API_FILE="$CONTRACTS_DIR/generated-api.ts"

echo "📥 Downloading OpenAPI specification from $OPENAPI_URL..."
curl -s -o $OPENAPI_JSON $OPENAPI_URL

echo "🚀 Generating TypeScript types (openapi-typescript)..."
npx openapi-typescript $OPENAPI_JSON -o $TYPES_FILE

echo "🚀 Generating Zod schemas (openapi-zod-client)..."
npx openapi-zod-client $OPENAPI_JSON -o $GENERATED_API_FILE

# Export endpoints so we can extract schemas from them
echo "🔧 Patching generated-api.ts to export endpoints..."
sed -i 's/const endpoints =/export const endpoints =/' $GENERATED_API_FILE

echo "✅ API definitions updated successfully!"

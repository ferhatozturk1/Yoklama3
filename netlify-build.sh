#!/bin/bash
set -e

echo "🚀 Building React App..."

# Set environment
export CI=false
export GENERATE_SOURCEMAP=false

# Install dependencies
npm install --legacy-peer-deps

# Build
npm run build

echo "✅ Build completed!"
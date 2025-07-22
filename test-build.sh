#!/bin/bash
echo "Testing local build..."

# Clean any previous build
rm -rf build/

# Run the same commands as Netlify
echo "Installing dependencies..."
npm install --legacy-peer-deps

echo "Building project..."
npm run build:netlify

if [ -d "build" ]; then
    echo "✅ Build successful! Build directory created."
    echo "Build contents:"
    ls -la build/
else
    echo "❌ Build failed! No build directory found."
    exit 1
fi
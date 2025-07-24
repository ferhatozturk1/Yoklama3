#!/bin/bash
set -e  # Exit on any error

echo "🚀 Starting Netlify build process..."

# Display environment info
echo "📋 Environment Information:"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Current directory: $(pwd)"
echo "Available memory: $(free -h 2>/dev/null || echo 'Memory info not available')"

# Clean any previous build
echo "🧹 Cleaning previous build..."
rm -rf build/ node_modules/.cache/ || true

echo "📦 Installing dependencies..."
if ! npm install --legacy-peer-deps --verbose; then
    echo "❌ Error: Failed to install dependencies"
    echo "📋 NPM Debug Info:"
    npm config list
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Show installed packages
echo "📋 Key dependencies:"
npm list react react-scripts --depth=0 || true

echo "🔨 Building project..."
export NODE_OPTIONS="--max-old-space-size=4096"
if ! npm run build:netlify; then
    echo "❌ Error: Build failed"
    echo "📋 Build logs:"
    cat npm-debug.log 2>/dev/null || echo "No npm debug log found"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Build directory contents:"
if [ -d "build" ]; then
    ls -la build/
    echo "📊 Build size:"
    du -sh build/
else
    echo "❌ Build directory not found"
    exit 1
fi
#!/bin/bash
set -e  # Exit on any error

echo "🚀 Starting Netlify build process..."

# Display environment info
echo "📋 Environment Information:"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Current directory: $(pwd)"
echo "Git branch: $(git branch --show-current 2>/dev/null || echo 'Branch info not available')"
echo "Available memory: $(free -h 2>/dev/null || echo 'Memory info not available')"

# Fix potential encoding issues
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# Clean any previous build
echo "🧹 Cleaning previous build..."
rm -rf build/ node_modules/.cache/ || true

echo "📦 Installing dependencies..."
# Set environment variables for fsevents fix
export DISABLE_OPENCOLLECTIVE=true
export ADBLOCK=true
export CI=false

if ! npm install --legacy-peer-deps --no-optional --verbose; then
    echo "❌ Error: Failed to install dependencies"
    echo "📋 NPM Debug Info:"
    npm config list
    echo "📋 Trying alternative install method..."
    if ! npm ci --legacy-peer-deps --no-optional; then
        echo "❌ Alternative install also failed"
        exit 1
    fi
fi

echo "✅ Dependencies installed successfully"

# Show installed packages
echo "📋 Key dependencies:"
npm list react react-scripts --depth=0 || true

echo "🔨 Building project..."
export NODE_OPTIONS="--max-old-space-size=4096"
export CI=false
export GENERATE_SOURCEMAP=false
export DISABLE_ESLINT_PLUGIN=true

if ! npm run build:netlify; then
    echo "❌ Error: Build failed"
    echo "📋 Build logs:"
    cat npm-debug.log 2>/dev/null || echo "No npm debug log found"
    echo "📋 Trying direct build command..."
    if ! CI=false GENERATE_SOURCEMAP=false react-scripts build; then
        echo "❌ Direct build also failed"
        exit 1
    fi
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
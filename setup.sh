#!/bin/bash

# Setup script for Aspect Digital (Next.js)

set -e

echo "🚀 Setting up Aspect Digital Next.js project..."

# Load nvm if it exists
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "📦 Node.js not found. Installing Node.js 20 LTS..."
    nvm install 20
    nvm use 20
    nvm alias default 20
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Strapi API URL
# For local development, use: http://localhost:1337/api
# For production, use your Strapi deployment URL
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337/api
EOF
    echo "✅ Created .env.local"
else
    echo "✅ .env.local already exists"
fi

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "The site will be available at http://localhost:3000"

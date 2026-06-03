#!/bin/bash

echo "🚀 Installing Multi-AI Agent Platform..."

echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "📋 Setting up environment files..."
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "✅ Created backend/.env - Please add your NVIDIA NIM API key"
fi

if [ ! -f frontend/.env ]; then
  cp frontend/.env.example frontend/.env
  echo "✅ Created frontend/.env"
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Add your NVIDIA NIM API key to backend/.env"
echo "  2. Run: npm run dev"
echo ""

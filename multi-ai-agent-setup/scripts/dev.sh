#!/bin/bash

echo "🚀 Starting Multi-AI Agent Platform..."
echo ""

# Function to cleanup on exit
cleanup() {
  echo ""
  echo "🛑 Shutting down..."
  pkill -P $$ 2>/dev/null
  exit 0
}

trap cleanup SIGINT

# Start backend
echo "🔧 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

sleep 2

# Start frontend
echo "🎨 Starting frontend development server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

sleep 2

echo ""
echo "✅ Platform is running!"
echo ""
echo "📍 Frontend: http://localhost:5173"
echo "📍 Backend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop..."
echo ""

wait

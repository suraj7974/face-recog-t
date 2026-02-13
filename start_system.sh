#!/bin/bash

# Kill any existing processes on ports 5000, 5001, 5173
echo "Cleaning up ports..."
fuser -k 5000/tcp 2>/dev/null
fuser -k 5001/tcp 2>/dev/null
fuser -k 5173/tcp 2>/dev/null

# Activate virtual environment
if [ -d ".venv" ]; then
    source .venv/bin/activate
else
    echo "Creating virtual environment..."
    python3 -m venv .venv
    source .venv/bin/activate
fi

# Always install/update dependencies to ensure everything is fresh
echo "Installing/Updating dependencies..."
pip install -r server/requirements.txt
pip install -r admin/server/requirements.txt

# Create necessary directories
mkdir -p logs
mkdir -p server/data/celeb_images
mkdir -p server/data/uploads

# Start Backend API
echo "Starting Face Recognition API (Port 5000)..."
cd server
export FLASK_APP=api_service.py
export FLASK_ENV=development
python3 api_service.py > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Start Admin API
echo "Starting Admin API (Port 5001)..."
cd admin/server
python3 admin.py > ../../logs/admin_api.log 2>&1 &
ADMIN_PID=$!
cd ../..

# Start Admin Frontend
echo "Starting Admin Frontend..."
cd admin/client
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    pnpm install
fi
pnpm run dev > ../../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ../..

echo "System started!"
echo "Backend API: http://localhost:5000"
echo "Admin API: http://localhost:5001"
echo "Frontend: http://localhost:5173"
echo "Logs are in ./logs/"

# Handle shutdown
cleanup() {
    echo "Shutting down..."
    kill $BACKEND_PID
    kill $ADMIN_PID
    kill $FRONTEND_PID
    exit
}

trap cleanup SIGINT

# Keep script running
wait
#!/bin/bash

# ESG Experiment App Starter Script
# After optimization: Express serves both API and frontend
# This script starts the integrated application

echo "========================================="
echo "ESG Experiment Application Starter"
echo "Optimized for 30 concurrent users"
echo "Integrated frontend + backend"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "⚠️  Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    echo "Or use alternative methods below."
    echo ""
fi

# Check if Python is available (as fallback)
if command -v python3 &> /dev/null; then
    PYTHON_AVAILABLE=true
else
    PYTHON_AVAILABLE=false
fi

echo "Select an option:"
echo "1. Start Backend API Server only (Node.js required)"
echo "2. Start Frontend Server only (Legacy Mode)"
echo "3. Start Integrated Application (Recommended)"
echo "4. Install dependencies"
echo "5. Exit"
echo ""

read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo "Starting Backend Server..."
        cd backend
        if [ -f "node_modules/.bin/nodemon" ]; then
            npm run dev
        elif [ -f "node_modules/.bin/node" ]; then
            node src/server.js
        else
            echo "⚠️  Backend dependencies not installed."
            echo "Run 'cd backend && npm install' first."
        fi
        ;;
    2)
        echo "Starting Frontend Server (Legacy Mode)..."
        echo "Note: After optimization, frontend is now served by Express backend."
        echo "For integrated app, choose option 3 instead."
        echo ""

        cd frontend/public

        echo "Frontend available at:"
        echo "- http://localhost:3000 (if using server)"
        echo "- file://$(pwd)/index.html (direct file access)"
        echo ""

        if command -v python3 &> /dev/null; then
            echo "Starting Python HTTP server on port 3000..."
            python3 -m http.server 3000
        elif command -v node &> /dev/null; then
            echo "Starting Node.js HTTP server on port 3000..."
            npx serve -s . -p 3000
        else
            echo "⚠️  No HTTP server found. Opening file directly..."
            open index.html 2>/dev/null || xdg-open index.html 2>/dev/null || echo "Please open frontend/public/index.html manually"
        fi
        ;;
    3)
        echo "Starting Integrated Application Server..."
        echo "Note: After optimization, Express serves both API and frontend"
        echo ""

        cd backend

        if command -v node &> /dev/null; then
            if [ -f "node_modules/.bin/nodemon" ]; then
                echo "🚀 Starting integrated server with nodemon..."
                echo "App will be available at: http://localhost:5001"
                echo "API Health: http://localhost:5001/api/health"
                echo ""
                echo "Press Ctrl+C to stop"
                echo ""
                npm run dev
            elif [ -f "node_modules/.bin/node" ]; then
                echo "🚀 Starting integrated server..."
                echo "App will be available at: http://localhost:5001"
                echo "API Health: http://localhost:5001/api/health"
                echo ""
                echo "Press Ctrl+C to stop"
                echo ""
                node src/server.js
            else
                echo "⚠️  Backend dependencies not installed."
                echo "Choose option 4 to install dependencies first."
                echo ""
                echo "After installation, run: cd backend && npm run dev"
            fi
        else
            echo "⚠️  Node.js is not installed"
            echo "Please install Node.js from https://nodejs.org/"
        fi
        ;;
    4)
        echo "Installing dependencies..."
        if command -v node &> /dev/null; then
            echo "Installing backend dependencies..."
            cd backend && npm install
            cd ..

            echo "Installing frontend dependencies (for development)..."
            cd frontend && npm install
            cd ..

            echo "✅ Dependencies installed"
            echo ""
            echo "To start integrated application:"
            echo "cd backend && npm run dev"
            echo ""
            echo "App will be available at: http://localhost:5001"
            echo "API endpoints at: http://localhost:5001/api/*"
        else
            echo "⚠️  Node.js not installed. Cannot install dependencies."
            echo "Please install Node.js first."
        fi
        ;;
    5)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
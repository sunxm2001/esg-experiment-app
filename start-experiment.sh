#!/bin/bash

# ESG Experiment App Starter Script
# This script helps start both backend and frontend servers

echo "========================================="
echo "ESG Experiment Application Starter"
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
echo "1. Start Backend Server only (Node.js required)"
echo "2. Start Frontend Server only"
echo "3. Start Both (requires Node.js)"
echo "4. Install dependencies and start both"
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
        echo "Starting Frontend Server..."
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
        echo "Starting Both Servers..."
        echo "Note: Run in separate terminals for best results"
        echo ""
        echo "For Backend: cd backend && npm run dev"
        echo "For Frontend: cd frontend/public && python3 -m http.server 3000"
        echo ""
        echo "Or open frontend/public/index.html directly in browser"
        ;;
    4)
        echo "Installing dependencies..."
        if command -v node &> /dev/null; then
            echo "Installing backend dependencies..."
            cd backend && npm install
            cd ..

            echo "Installing frontend dependencies..."
            cd frontend && npm install
            cd ..

            echo "✅ Dependencies installed"
            echo ""
            echo "To start:"
            echo "1. Terminal 1: cd backend && npm run dev"
            echo "2. Terminal 2: cd frontend/public && python3 -m http.server 3000"
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
#!/bin/bash

# Bee Algorithm Platform - Setup Script
# This script automates the installation and setup process

set -e  # Exit on any error

echo "🐝 Bee Algorithm Platform - Setup Script"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check system requirements
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        print_success "Node.js found: v$NODE_VERSION"
        
        # Check if version is 18+
        if ! node -e "process.exit(process.version.split('.')[0] >= 18 ? 0 : 1)" 2>/dev/null; then
            print_error "Node.js version 18+ required. Current: v$NODE_VERSION"
            print_status "Please install Node.js 18+ from https://nodejs.org/"
            exit 1
        fi
    else
        print_error "Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    # Check npm
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        print_success "npm found: v$NPM_VERSION"
    else
        print_error "npm not found. Please install npm."
        exit 1
    fi
    
    # Check Python
    if command_exists python3; then
        PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
        print_success "Python found: v$PYTHON_VERSION"
        
        # Check if version is 3.11+
        if ! python3 -c "import sys; exit(0 if sys.version_info >= (3, 11) else 1)" 2>/dev/null; then
            print_warning "Python 3.11+ recommended. Current: v$PYTHON_VERSION"
        fi
    else
        print_error "Python3 not found. Please install Python 3.11+ from https://python.org/"
        exit 1
    fi
    
    # Check pip
    if command_exists pip3; then
        print_success "pip3 found"
    else
        print_error "pip3 not found. Please install pip3."
        exit 1
    fi
    
    # Check Git
    if command_exists git; then
        GIT_VERSION=$(git --version | cut -d' ' -f3)
        print_success "Git found: v$GIT_VERSION"
    else
        print_error "Git not found. Please install Git from https://git-scm.com/"
        exit 1
    fi
}

# Install frontend dependencies
install_frontend() {
    print_status "Installing frontend dependencies..."
    
    cd algoabcapp
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_error "package.json not found in algoabcapp directory"
        exit 1
    fi
    
    # Install dependencies
    if npm install --legacy-peer-deps; then
        print_success "Frontend dependencies installed successfully"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    
    cd ..
}

# Install backend dependencies
install_backend() {
    print_status "Installing backend dependencies..."
    
    cd bee-fastapi
    
    # Check if requirements.txt exists
    if [ ! -f "requirements.txt" ]; then
        print_error "requirements.txt not found in bee-fastapi directory"
        exit 1
    fi
    
    # Install dependencies
    if pip3 install -r requirements.txt; then
        print_success "Backend dependencies installed successfully"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    
    cd ..
}

# Create environment file
create_env_file() {
    print_status "Creating environment configuration..."
    
    if [ ! -f "algoabcapp/.env.local" ]; then
        echo "NEXT_PUBLIC_BEE_API=http://localhost:8001" > algoabcapp/.env.local
        print_success "Environment file created: algoabcapp/.env.local"
    else
        print_warning "Environment file already exists: algoabcapp/.env.local"
    fi
}

# Verify installation
verify_installation() {
    print_status "Verifying installation..."
    
    # Check if node_modules exists
    if [ -d "algoabcapp/node_modules" ]; then
        print_success "Frontend dependencies verified"
    else
        print_error "Frontend dependencies not found"
        exit 1
    fi
    
    # Check if Python packages are installed
    if python3 -c "import fastapi, uvicorn, pydantic, numpy" 2>/dev/null; then
        print_success "Backend dependencies verified"
    else
        print_error "Backend dependencies not found"
        exit 1
    fi
}

# Main setup function
main() {
    echo "Starting setup process..."
    echo ""
    
    check_requirements
    echo ""
    
    install_frontend
    echo ""
    
    install_backend
    echo ""
    
    create_env_file
    echo ""
    
    verify_installation
    echo ""
    
    print_success "Setup completed successfully! 🎉"
    echo ""
    echo "Next steps:"
    echo "1. Start the backend: cd bee-fastapi && uvicorn main:app --reload --port 8001"
    echo "2. Start the frontend: cd algoabcapp && npm run dev"
    echo "3. Or use: make dev (from project root)"
    echo ""
    echo "Access the application:"
    echo "- Frontend: http://localhost:3000"
    echo "- Backend API: http://localhost:8001"
    echo "- API Docs: http://localhost:8001/docs"
    echo ""
    echo "For more information, see REQUIREMENTS.md"
}

# Run main function
main "$@"

# Bee Algorithm Platform - Requirements & Setup Guide

## 📋 System Requirements

### Minimum System Requirements
- **Operating System**: macOS 10.15+, Windows 10+, or Linux (Ubuntu 18.04+)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Internet**: Required for downloading dependencies

### Required Software

#### 1. Node.js & npm
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)

**Installation:**
```bash
# Check if Node.js is installed
node --version
npm --version

# If not installed, download from: https://nodejs.org/
# Or use a version manager like nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### 2. Python
- **Python**: Version 3.11 or higher
- **pip**: Package installer for Python

**Installation:**
```bash
# Check if Python is installed
python3 --version
pip3 --version

# If not installed:
# macOS: brew install python3
# Ubuntu: sudo apt install python3 python3-pip
# Windows: Download from https://python.org/
```

#### 3. Git
- **Git**: Version 2.0 or higher

**Installation:**
```bash
# Check if Git is installed
git --version

# If not installed:
# macOS: brew install git
# Ubuntu: sudo apt install git
# Windows: Download from https://git-scm.com/
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Algo_ABC
```

### 2. Install Dependencies

#### Frontend (Next.js)
```bash
cd algoabcapp
npm install
```

#### Backend (FastAPI)
```bash
cd ../bee-fastapi
pip install -r requirements.txt
```

### 3. Start the Application

#### Option A: Using Makefile (Recommended)
```bash
# From project root
make install
make dev
```

#### Option B: Manual Start
```bash
# Terminal 1 - Backend
cd bee-fastapi
uvicorn main:app --reload --port 8001

# Terminal 2 - Frontend
cd algoabcapp
NEXT_PUBLIC_BEE_API=http://localhost:8001 npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **API Documentation**: http://localhost:8001/docs
- **API Health Check**: http://localhost:8001/health

## 📦 Detailed Dependencies

### Frontend Dependencies (algoabcapp/package.json)
```json
{
  "dependencies": {
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "next": "16.0.0",
    "daisyui": "^4.12.10",
    "react-apexcharts": "^1.4.1",
    "apexcharts": "^3.50.0",
    "papaparse": "^5.4.1",
    "xlsx": "^0.18.5",
    "zustand": "^4.5.5"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/papaparse": "^5.3.14",
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "16.0.0"
  }
}
```

### Backend Dependencies (bee-fastapi/requirements.txt)
```
fastapi>=0.104.1
uvicorn[standard]>=0.24.0
pydantic>=2.5.0
numpy>=1.26.0
python-multipart>=0.0.6
```

## 🛠 Development Setup

### Environment Variables

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_BEE_API=http://localhost:8001
```

#### Backend (Optional)
```bash
# No environment variables required for basic setup
# CORS is configured for localhost:3000
```

### Project Structure
```
Algo_ABC/
├── algoabcapp/                 # Next.js Frontend
│   ├── app/                   # App Router pages
│   ├── components/            # React components
│   ├── lib/                   # Utilities and helpers
│   ├── types/                 # TypeScript definitions
│   ├── data/                  # JSON data storage
│   ├── package.json           # Frontend dependencies
│   └── next.config.ts         # Next.js configuration
├── bee-fastapi/               # FastAPI Backend
│   ├── main.py               # Main application
│   ├── schema.py             # Pydantic models
│   └── requirements.txt      # Python dependencies
├── docker-compose.yml         # Docker configuration
├── Makefile                   # Development commands
└── README.md                  # Project documentation
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill processes on ports 3000 and 8001
lsof -ti:3000,8001 | xargs kill -9

# Or use different ports
NEXT_PUBLIC_BEE_API=http://localhost:8001 npm run dev -- -p 3001
uvicorn main:app --reload --port 8002
```

#### 2. Node.js Version Issues
```bash
# Use nvm to manage Node.js versions
nvm install 18
nvm use 18
npm install
```

#### 3. Python Version Issues
```bash
# Ensure Python 3.11+ is being used
python3 --version
pip3 install -r requirements.txt
```

#### 4. Permission Issues (Linux/macOS)
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
npm install
```

#### 5. Dependency Conflicts
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Clear Python cache
pip cache purge
pip install -r requirements.txt --force-reinstall
```

### Performance Issues

#### 1. Slow npm install
```bash
# Use npm ci for faster, reliable installs
npm ci

# Or use yarn instead
npm install -g yarn
yarn install
```

#### 2. Memory Issues
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```

## 🐳 Docker Setup (Alternative)

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### Quick Start with Docker
```bash
# Clone repository
git clone <repository-url>
cd Algo_ABC

# Start with Docker Compose
docker-compose up --build

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:8001
```

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [DaisyUI Documentation](https://daisyui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Development Tools
- **VS Code Extensions**:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Importer
  - Python
  - Prettier - Code formatter

### Testing
```bash
# Run frontend tests
cd algoabcapp
npm run test

# Run backend tests
cd bee-fastapi
python -m pytest

# Run integration tests
node test-workflow.js
```

## 🆘 Getting Help

### Support Channels
1. **GitHub Issues**: Report bugs and feature requests
2. **Documentation**: Check this file and README.md
3. **Code Comments**: Inline documentation in source code

### Before Asking for Help
1. Check this requirements file
2. Verify all dependencies are installed
3. Check the troubleshooting section
4. Look at existing GitHub issues
5. Test with the provided test scripts

### Useful Commands
```bash
# Check system status
node --version && npm --version && python3 --version

# Verify installation
cd algoabcapp && npm list
cd ../bee-fastapi && pip list

# Test application
curl http://localhost:8001/health
curl http://localhost:3000
```

---

**Last Updated**: October 2024  
**Maintained By**: Bee Algorithm Platform Team

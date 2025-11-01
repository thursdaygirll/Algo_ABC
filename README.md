# Bee Algorithm Platform

A modern web platform for running and analyzing Artificial Bee Colony (ABC) algorithm experiments. Built with Next.js, TypeScript, Tailwind CSS, and FastAPI.

## Features

- 🐝 **Bee Algorithm Implementation**: Run optimization experiments with configurable parameters
- 📊 **Interactive Visualizations**: Real-time charts showing algorithm convergence and performance
- 📁 **Multiple Data Sources**: Upload Excel/CSV files, use preloaded datasets, or manually input data
- 📈 **Comprehensive Analytics**: Detailed KPIs, convergence analysis, and result export
- 🎨 **Modern UI**: Built with Tailwind CSS and daisyUI for a beautiful, responsive interface

## Tech Stack

### Frontend
- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS v4** + **daisyUI** for styling
- **ApexCharts** for data visualization
- **Zustand** for state management
- **PapaParse** for CSV parsing
- **XLSX** for Excel file handling

### Backend
- **FastAPI** for the API server
- **Pydantic** for data validation
- **NumPy** for numerical computations
- **CORS** enabled for cross-origin requests

## Quick Start

### Prerequisites
- **Node.js**: Version 18.0.0 or higher
- **Python**: Version 3.11 or higher  
- **Git**: Version 2.0 or higher
- **npm**: Comes with Node.js

> 📋 **Detailed Requirements**: See [REQUIREMENTS.md](./REQUIREMENTS.md) for complete system requirements and troubleshooting.

### 🚀 Automated Setup (Recommended)

#### Option 1: Using Setup Scripts

**macOS/Linux:**
```bash
# Clone the repository
git clone <repository-url>
cd Algo_ABC

# Run setup script
./setup.sh
```

**Windows:**
```cmd
# Clone the repository
git clone <repository-url>
cd Algo_ABC

# Run setup script
setup.bat
```

#### Option 2: Using Makefile
```bash
# Clone the repository
git clone <repository-url>
cd Algo_ABC

# Install dependencies and start
make install
make dev
```

### 🐳 Docker Setup (Alternative)

```bash
# Clone the repository
git clone <repository-url>
cd Algo_ABC

# Start with Docker Compose
docker-compose up --build
```

### 📝 Manual Setup

#### 1. Install Dependencies

**Frontend:**
```bash
cd algoabcapp
npm install --legacy-peer-deps
```

**Backend:**
```bash
cd bee-fastapi
pip install -r requirements.txt
```

#### 2. Start Services

**Terminal 1 - Backend:**
```bash
cd bee-fastapi
uvicorn main:app --reload --port 8001
```

**Terminal 2 - Frontend:**
```bash
cd algoabcapp
NEXT_PUBLIC_BEE_API=http://localhost:8001 npm run dev
```

### 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **API Documentation**: http://localhost:8001/docs
- **API Health Check**: http://localhost:8001/health

## Usage

### Running an Experiment

1. **Navigate to "New Experiment"**
2. **Choose Data Input Method**:
   - Upload Excel/CSV file
   - Use preloaded dataset
   - Manual matrix input (10×10 grid)
3. **Configure Parameters**:
   - Feed Limit: Maximum attempts before scout phase
   - Number of Bees: Population size
   - Iterations: Maximum iterations (1-1000)
   - Random Seed: For reproducible results (optional)
4. **Enter Experiment Name** and click "Run Experiment"
5. **View Results**: Automatically redirected to results page with charts and analytics

### Viewing Results

The results page displays:
- **Metadata**: Experiment details, parameters, and timing
- **KPIs**: Key performance indicators and metrics
- **Charts**: 
  - Line chart showing fitness convergence over time
  - Area chart for convergence progress
  - Radar chart for solution components
- **Export Options**: Download results as CSV, Excel, or PDF

### Previous Experiments

View all past experiments in a grid layout with:
- Experiment name and date
- Duration and iteration count
- Best fitness achieved
- Input mode used
- Quick access to detailed results

## API Endpoints

### FastAPI Backend

- `GET /health` - Health check
- `POST /run` - Run Bee Algorithm experiment

### Next.js API Routes

- `GET /api/experiments` - List all experiments
- `POST /api/experiments` - Save new experiment
- `GET /api/experiments/[id]` - Get specific experiment
- `GET /api/export/[id]?format=csv` - Export experiment data

## Project Structure

```
Algo_ABC/
├── algoabcapp/                 # Next.js frontend
│   ├── app/
│   │   ├── (marketing)/       # Home page
│   │   ├── new-experiment/    # New experiment page
│   │   ├── experiments/       # Experiments listing
│   │   └── api/              # API routes
│   ├── components/           # React components
│   ├── lib/                  # Utilities and helpers
│   ├── types/                # TypeScript definitions
│   └── data/                 # JSON data storage
├── bee-fastapi/              # FastAPI backend
│   ├── main.py              # Main application
│   ├── schema.py            # Pydantic models
│   └── requirements.txt     # Python dependencies
└── docker-compose.yml       # Docker configuration
```

## Development

### Adding New Features

1. **Frontend Components**: Add to `algoabcapp/components/`
2. **API Routes**: Add to `algoabcapp/app/api/`
3. **Types**: Update `algoabcapp/types/experiment.ts`
4. **Backend Logic**: Modify `bee-fastapi/main.py`

### Code Style

- **TypeScript**: Strict mode enabled
- **React**: Functional components with hooks
- **Styling**: Tailwind CSS utility classes
- **State**: Zustand for global state management

## TODO

- [ ] Replace mock algorithm with real Bee Algorithm implementation
- [ ] Add PDF export functionality
- [ ] Implement user authentication and roles
- [ ] Add SQLite/Prisma for scalable persistence
- [ ] Add more chart types and visualizations
- [ ] Implement algorithm parameter tuning
- [ ] Add experiment comparison features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request


## Acknowledgments

- Based on the Artificial Bee Colony algorithm research
- Built for educational and research purposes
- Inspired by optimization and decision-making applications

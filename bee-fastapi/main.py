from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schema import ExperimentRunRequest, ExperimentRunResponse
import random
import time
import numpy as np

app = FastAPI(title="Bee Algorithm API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/run", response_model=ExperimentRunResponse)
def run_experiment(req: ExperimentRunRequest):
    """
    Run a Bee Algorithm experiment with the provided parameters and input data.
    This is a simplified implementation that simulates the algorithm behavior.
    """
    start_time = time.time()
    
    # Set random seed if provided
    if req.params.seed is not None:
        random.seed(req.params.seed)
        np.random.seed(req.params.seed)
    
    # Extract matrix from input
    matrix = req.input.matrix
    if not matrix or len(matrix) == 0:
        raise ValueError("No matrix data provided")
    
    # Convert to numpy array for easier manipulation
    data = np.array(matrix)
    n_alternatives, n_criteria = data.shape
    
    # Simulate Bee Algorithm iterations
    iterations = req.params.iterations
    best_fitness = 100.0  # Start with high fitness (minimization problem)
    result_series = []
    
    # Simulate convergence behavior
    for i in range(1, iterations + 1):
        # Simulate improvement with some randomness
        improvement = random.uniform(0.1, 0.5) * (100 / iterations)
        best_fitness = max(0.0, best_fitness - improvement)
        
        # Add some noise to make it more realistic
        noise = random.uniform(-0.01, 0.01)
        best_fitness = max(0.0, best_fitness + noise)
        
        result_series.append({
            "iteration": i,
            "bestFitness": round(best_fitness, 6)
        })
    
    # Calculate final metrics
    initial_fitness = result_series[0]["bestFitness"] if result_series else 100.0
    final_fitness = result_series[-1]["bestFitness"] if result_series else 0.0
    convergence = initial_fitness - final_fitness
    
    # Generate mock best solution (normalized values)
    best_solution = [random.uniform(0, 1) for _ in range(n_criteria)]
    
    # Calculate KPIs
    kpis = [
        {"label": "Best fitness", "value": round(final_fitness, 6)},
        {"label": "Iterations", "value": iterations},
        {"label": "Convergence", "value": round(convergence, 6)},
        {"label": "Alternatives", "value": n_alternatives},
        {"label": "Criteria", "value": n_criteria},
        {"label": "Bees", "value": req.params.numBees},
        {"label": "Feed Limit", "value": req.params.feedLimit}
    ]
    
    duration_ms = int((time.time() - start_time) * 1000)
    
    return ExperimentRunResponse(
        durationMs=duration_ms,
        kpis=kpis,
        bestSolution=best_solution,
        resultSeries=result_series
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

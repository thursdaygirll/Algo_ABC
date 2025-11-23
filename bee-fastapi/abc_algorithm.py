"""
Real Artificial Bee Colony (ABC) Algorithm Implementation
Based on the thesis work by Anette Angélica Juárez Sánchez
"""

import numpy as np
from typing import List, Dict, Any


class ABCAlgorithm:
    def __init__(
        self,
        matrix: np.ndarray,
        num_bees: int,
        iterations: int,
        seed: int = None,
        lb: float = 0.0,
        ub: float = 1.0
    ):
        """
        Initialize the ABC Algorithm.
        
        Args:
            matrix: Decision matrix (alternatives x criteria)
            num_bees: Number of food sources (employed bees)
            iterations: Maximum number of iterations
            seed: Random seed for reproducibility
            lb: Lower bound for solution space
            ub: Upper bound for solution space
        """
        if seed is not None:
            np.random.seed(seed)
        
        self.matrix = matrix
        self.N = num_bees  # Number of food sources
        self.max_iter = iterations
        self.D = matrix.shape[1]  # Dimension (number of criteria)
        self.lb = np.array([lb] * self.D)
        self.ub = np.array([ub] * self.D)
        self.limit = self.N * self.D  # Trial limit
        
        # Initialize population
        # If we have enough alternatives, use them; otherwise generate random solutions
        if matrix.shape[0] >= num_bees:
            self.pos = matrix[:num_bees].copy()
        else:
            # Use available alternatives and fill the rest with random solutions
            self.pos = np.zeros((num_bees, self.D))
            self.pos[:matrix.shape[0]] = matrix.copy()
            # Generate random solutions for remaining positions
            for i in range(matrix.shape[0], num_bees):
                self.pos[i] = np.random.uniform(self.lb, self.ub, self.D)
        
        self.trial = np.zeros(self.N)
        
        # Results tracking
        self.history = []
        self.best_solutions = []
        self.best_costs = []
    
    def fobj(self, X: np.ndarray) -> np.ndarray:
        """Objective function - minimize distance from ideal point (0.05)"""
        if X.ndim == 1:
            X = X.reshape(1, -1)
        return np.sum((X - 0.05)**2, axis=1)
    
    def calculate_fitness(self, fx: np.ndarray) -> np.ndarray:
        """Calculate fitness values from objective function values"""
        fit = np.zeros_like(fx)
        fit[fx >= 0] = 1 / (1 + fx[fx >= 0])
        fit[fx < 0] = 1 + np.abs(fx[fx < 0])
        return fit
    
    def run(self) -> Dict[str, Any]:
        """
        Execute the ABC algorithm.
        
        Returns:
            Dictionary containing results with iteration history
        """
        # Initial evaluation
        fx = self.fobj(self.pos)
        fit = self.calculate_fitness(fx)
        
        for iter_num in range(1, self.max_iter + 1):
            num_scouts = 0
            
            # EMPLOYED BEE PHASE
            for i in range(self.N):
                # Select random dimension and partner
                p2c = np.random.randint(self.D)
                partner = np.random.randint(self.N)
                while partner == i:
                    partner = np.random.randint(self.N)
                
                # Generate new solution
                X = self.pos[i, p2c]
                Xp = self.pos[partner, p2c]
                phi = (np.random.rand() - 0.5) * 2 * (X - Xp)
                Xnew_val = X + phi
                Xnew_val = np.clip(Xnew_val, self.lb[p2c], self.ub[p2c])
                
                Xnew = np.copy(self.pos[i])
                Xnew[p2c] = Xnew_val
                
                # Evaluate new solution
                fnew = self.fobj(Xnew.reshape(1, -1))[0]
                new_fit = self.calculate_fitness(np.array([fnew]))[0]
                
                # Greedy selection
                if new_fit > fit[i]:
                    self.pos[i] = Xnew
                    fx[i] = fnew
                    fit[i] = new_fit
                    self.trial[i] = 0
                else:
                    self.trial[i] += 1
            
            # ONLOOKER BEE PHASE
            prob = fit / np.sum(fit)
            for i in range(self.N):
                if np.random.rand() < prob[i]:
                    # Select random dimension and partner
                    p2c = np.random.randint(self.D)
                    partner = np.random.randint(self.N)
                    while partner == i:
                        partner = np.random.randint(self.N)
                    
                    # Generate new solution
                    X = self.pos[i, p2c]
                    Xp = self.pos[partner, p2c]
                    phi = (np.random.rand() - 0.5) * 2 * (X - Xp)
                    Xnew_val = X + phi
                    Xnew_val = np.clip(Xnew_val, self.lb[p2c], self.ub[p2c])
                    
                    Xnew = np.copy(self.pos[i])
                    Xnew[p2c] = Xnew_val
                    
                    # Evaluate new solution
                    fnew = self.fobj(Xnew.reshape(1, -1))[0]
                    new_fit = self.calculate_fitness(np.array([fnew]))[0]
                    
                    # Greedy selection
                    if new_fit > fit[i]:
                        self.pos[i] = Xnew
                        fx[i] = fnew
                        fit[i] = new_fit
                        self.trial[i] = 0
                    else:
                        self.trial[i] += 1
            
            # SCOUT BEE PHASE
            for i in range(self.N):
                if self.trial[i] > self.limit:
                    self.pos[i] = np.random.uniform(self.lb, self.ub, self.D)
                    fx[i] = self.fobj(self.pos[i].reshape(1, -1))[0]
                    fit[i] = self.calculate_fitness(np.array([fx[i]]))[0]
                    self.trial[i] = 0
                    num_scouts += 1
            
            # Record best solution for this iteration
            best_idx = np.argmin(fx)
            best_cost = fx[best_idx]
            best_pos = self.pos[best_idx].copy()
            
            # Calculate statistics
            avg_fitness = np.mean(fx)
            std_fitness = np.std(fx)
            worst_fitness = np.max(fx)
            
            # Calculate diversity (standard deviation of positions across all dimensions)
            diversity = np.mean(np.std(self.pos, axis=0))
            
            # Determine if there was improvement
            improvement = 1 if (iter_num == 1 or best_cost < self.best_costs[-1]) else 0
            
            # Store iteration results
            self.best_costs.append(best_cost)
            self.best_solutions.append(best_pos)
            
            iteration_data = {
                'iteration': iter_num,
                'bestFitness': float(best_cost),
                'avgFitness': float(avg_fitness),
                'stdFitness': float(std_fitness),
                'worstFitness': float(worst_fitness),
                'diversity': float(diversity),
                'numScouts': int(num_scouts),
                'improvement': int(improvement)
            }
            
            self.history.append(iteration_data)
        
        # Return final results
        best_iter_idx = np.argmin(self.best_costs)
        
        return {
            'bestSolution': self.best_solutions[best_iter_idx].tolist(),
            'bestFitness': float(self.best_costs[best_iter_idx]),
            'convergence': float(self.best_costs[0] - self.best_costs[-1]),
            'resultSeries': self.history
        }


def run_abc_experiment(
    matrix: List[List[float]],
    num_bees: int,
    iterations: int,
    seed: int = None,
    lb: float = 0.0,
    ub: float = 1.0
) -> Dict[str, Any]:
    """
    Run ABC algorithm experiment.
    
    Args:
        matrix: Decision matrix as list of lists
        num_bees: Number of bees (food sources)
        iterations: Number of iterations
        seed: Random seed
        lb: Lower bound
        ub: Upper bound
    
    Returns:
        Dictionary with experiment results
    """
    matrix_array = np.array(matrix)
    
    abc = ABCAlgorithm(
        matrix=matrix_array,
        num_bees=num_bees,
        iterations=iterations,
        seed=seed,
        lb=lb,
        ub=ub
    )
    
    results = abc.run()
    
    return results

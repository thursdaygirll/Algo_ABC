from pydantic import BaseModel
from typing import List, Optional
from typing import Any

class BeeParams(BaseModel):
    feedLimit: int
    numBees: int
    iterations: int
    seed: Optional[int] = None

class ExperimentInput(BaseModel):
    mode: str
    datasetName: Optional[str] = None
    matrix: Optional[List[List[float]]] = None

class ExperimentRunRequest(BaseModel):
    params: BeeParams
    input: ExperimentInput

class ExperimentRunResponse(BaseModel):
    durationMs: int
    kpis: List[dict]
    bestSolution: Optional[List[float]] = None
    resultSeries: List[dict]


# Experiment storage models
class ExperimentInput(BaseModel):
    mode: str
    datasetName: Optional[str] = None
    matrix: Optional[List[List[float]]] = None


class Experiment(BaseModel):
    id: str
    name: str
    createdAt: str
    durationMs: int
    params: Any
    input: ExperimentInput
    kpis: List[dict]
    bestSolution: Optional[List[float]] = None
    resultSeries: List[dict]

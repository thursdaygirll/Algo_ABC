"""Excel export utility for ABC experiment results using a template.

Constraints implemented:
1. Load existing template at template_path (default: /mnt/data/tabla_abc.xlsx).
2. Use sheet name 'Datos'.
3. Preserve headers, column order, and existing styles.
4. Write ONLY data for columns 1–13 (ExperimentName .. Seed).
5. Do NOT modify columns 14–17 (documentation / description area).
6. Save to output_path (default: /mnt/data/tabla_abc_export.xlsx).

Input accepted:
- List[Dict[str, Any]] where keys are column names.
- pandas.DataFrame with required columns.

Required columns (order preserved):
['ExperimentName','Iteration','Fbest','Xbest','MeanFitness','WorstFitness','NumScouts',
 'Diversity','Improvement','Time (s)','NumBees','TrialLimit','Seed']

Usage example:

from export_excel import export_results_to_excel

results = [
    {
        'ExperimentName': 'ABC_Exp_01', 'Iteration': 1, 'Fbest': 0.542, 'Xbest': 0.4560,
        'MeanFitness': 0.688, 'WorstFitness': 0.992, 'NumScouts': 0, 'Diversity': 0.152,
        'Improvement': 1, 'Time (s)': 0.004, 'NumBees': 20, 'TrialLimit': 3, 'Seed': 42
    },
    # more rows ...
]

output_file = export_results_to_excel(results)
print('Export saved to', output_file)

Notes:
- Numeric fidelity: values written directly; openpyxl preserves number formats if template
  already has formatted rows. If there are no pre-formatted data rows, you may extend this
  utility to copy number_format from header cells.
- Xbest: if value is a list/tuple/ndarray it will be converted to a comma-separated string.
"""

from typing import Any, Dict, List, Sequence, Union
import os

from openpyxl import load_workbook

try:
    import pandas as pd  # type: ignore
except ImportError:  # pandas is optional for DataFrame handling
    pd = None  # type: ignore

DATA_SHEET_NAME = "Datos"
REQUIRED_ORDER: List[str] = [
    "ExperimentName",
    "Iteration",
    "Fbest",
    "Xbest",
    "MeanFitness",
    "WorstFitness",
    "NumScouts",
    "Diversity",
    "Improvement",
    "Time (s)",
    "NumBees",
    "TrialLimit",
    "Seed",
]

# Column descriptions and data types from specification
COLUMN_SPECS = {
    "ExperimentName": {"description": "Unique identifier of the experiment.", "type": "Text"},
    "Iteration": {"description": "Current iteration number (1...max_iter).", "type": "Integer"},
    "Fbest": {"description": "Best value of the objective function found so far.", "type": "Decimal"},
    "Xbest": {"description": "Vector with the values of the best solution.", "type": "List or string"},
    "MeanFitness": {"description": "Average fitness of the population.", "type": "Decimal"},
    "WorstFitness": {"description": "Worst value in the population.", "type": "Decimal"},
    "NumScouts": {"description": "How many bees became scouts in this iteration.", "type": "Integer"},
    "Diversity": {"description": "Standard deviation of the population (measures exploration).", "type": "Decimal"},
    "Improvement": {"description": "1 if Fbest improved compared to the previous iteration, 0 if not.", "type": "Binary"},
    "Time (s)": {"description": "Time taken for this iteration to execute.", "type": "Decimal"},
    "NumBees": {"description": "Total number of bees (population).", "type": "Integer"},
    "TrialLimit": {"description": "Limit of attempts before becoming a scout.", "type": "Integer"},
    "Seed": {"description": "Seed used for reproducibility.", "type": "Integer or empty"},
}

TemplateLike = Union[List[Dict[str, Any]], "pd.DataFrame"]  # type: ignore

__all__ = ["export_results_to_excel"]


def _coerce_dataframe(results: TemplateLike) -> "pd.DataFrame":  # type: ignore
    """Return a pandas DataFrame regardless of input form."""
    if pd is None:
        # pandas not available: accept only list-of-dicts
        if isinstance(results, list):
            # Minimal fake DataFrame-like structure using list of dicts
            # Instead of implementing a full DataFrame, we raise for consistency
            raise RuntimeError(
                "pandas not installed; install pandas or pass a DataFrame after adding pandas to requirements."  # noqa: E501
            )
    if isinstance(results, list):
        return pd.DataFrame(results)  # type: ignore
    if pd is not None and isinstance(results, pd.DataFrame):  # type: ignore
        return results
    raise TypeError("Unsupported results data type. Provide list[dict] or pandas.DataFrame.")


def _normalize_xbest(value: Any) -> Any:
    """Convert list-like Xbest to a string; leave scalar values unchanged."""
    if isinstance(value, (list, tuple)):
        return ",".join(str(v) for v in value)
    try:
        import numpy as np  # local import to avoid hard dep if not needed
        if isinstance(value, np.ndarray):  # type: ignore
            return ",".join(str(v) for v in value.tolist())
    except Exception:  # pragma: no cover - numpy errors ignored
        pass
    return value


def export_results_to_excel(
    results: TemplateLike,
    template_path: str = "/mnt/data/tabla_abc.xlsx",
    output_path: str = "/mnt/data/tabla_abc_export.xlsx",
) -> str:
    """Export ABC experiment iteration results into the template Excel file.

    Parameters
    ----------
    results : list[dict] | pandas.DataFrame
        Collection of rows with at least the REQUIRED_ORDER columns.
    template_path : str
        Path to the existing Excel template (must contain sheet 'Datos').
    output_path : str
        Where to save the filled workbook.

    Returns
    -------
    str
        Path to the written Excel file.
    """
    if not os.path.exists(template_path):
        raise FileNotFoundError(f"Template not found: {template_path}")

    df = _coerce_dataframe(results)

    missing = [c for c in REQUIRED_ORDER if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns: {missing}")

    # Reorder and slice to required columns (ignore extra columns if present)
    df_ordered = df[REQUIRED_ORDER].copy()

    # Normalize Xbest values
    df_ordered["Xbest"] = df_ordered["Xbest"].map(_normalize_xbest)

    wb = load_workbook(template_path)
    if DATA_SHEET_NAME not in wb.sheetnames:
        raise ValueError(f"Sheet '{DATA_SHEET_NAME}' not found in template.")
    ws = wb[DATA_SHEET_NAME]

    # Detect header row: assume first row contains headers matching REQUIRED_ORDER subset
    header_row = 1
    headers_in_sheet = [ws.cell(row=header_row, column=col_index + 1).value for col_index in range(len(REQUIRED_ORDER))]
    # Basic validation: first required header must match
    if headers_in_sheet[0] != REQUIRED_ORDER[0]:
        raise ValueError("Template header mismatch: expected first header 'ExperimentName'.")

    # Find first empty row in column A after header
    write_row = header_row + 1
    while ws.cell(row=write_row, column=1).value not in (None, ""):
        write_row += 1

    # Write data rows (columns 1-13 only)
    for _, row in df_ordered.iterrows():  # type: ignore
        col_excel = 1
        for col_name in REQUIRED_ORDER:
            cell = ws.cell(row=write_row, column=col_excel)
            value = row[col_name]
            cell.value = value
            col_excel += 1
        write_row += 1

    # Preserve existing descriptive columns (14–17) untouched

    wb.save(output_path)
    return output_path


if __name__ == "__main__":  # Simple manual test harness (optional)
    sample = [
        {
            'ExperimentName': 'ABC_Exp_01', 'Iteration': 1, 'Fbest': 0.542, 'Xbest': 0.4560,
            'MeanFitness': 0.688, 'WorstFitness': 0.992, 'NumScouts': 0, 'Diversity': 0.152,
            'Improvement': 1, 'Time (s)': 0.004, 'NumBees': 20, 'TrialLimit': 3, 'Seed': 42
        },
        {
            'ExperimentName': 'ABC_Exp_01', 'Iteration': 2, 'Fbest': 0.500, 'Xbest': [0.1, 0.2],
            'MeanFitness': 0.600, 'WorstFitness': 0.950, 'NumScouts': 1, 'Diversity': 0.160,
            'Improvement': 0, 'Time (s)': 0.005, 'NumBees': 20, 'TrialLimit': 3, 'Seed': 42
        }
    ]
    try:
        path = export_results_to_excel(sample)
        print(f"Export done: {path}")
    except Exception as e:
        print(f"Export failed: {e}")

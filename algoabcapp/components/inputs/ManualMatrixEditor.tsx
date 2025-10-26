'use client';

import { useState, useEffect } from 'react';
import { generateRandomMatrix } from '@/lib/csv';

interface ManualMatrixEditorProps {
  rows: number;
  cols: number;
  onMatrixChange: (matrix: number[][]) => void;
  initialMatrix?: number[][];
}

export default function ManualMatrixEditor({ 
  rows, 
  cols, 
  onMatrixChange, 
  initialMatrix 
}: ManualMatrixEditorProps) {
  const [matrix, setMatrix] = useState<number[][]>(() => 
    initialMatrix || generateRandomMatrix(rows, cols)
  );

  useEffect(() => {
    setMatrix(initialMatrix || generateRandomMatrix(rows, cols));
  }, [rows, cols, initialMatrix]);

  const updateCell = (row: number, col: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newMatrix = matrix.map((r, rIdx) => 
      r.map((c, cIdx) => rIdx === row && cIdx === col ? numValue : c)
    );
    setMatrix(newMatrix);
    onMatrixChange(newMatrix);
  };

  const fillRandom = () => {
    const newMatrix = generateRandomMatrix(rows, cols);
    setMatrix(newMatrix);
    onMatrixChange(newMatrix);
  };

  const clearMatrix = () => {
    const newMatrix = Array(rows).fill(null).map(() => Array(cols).fill(0));
    setMatrix(newMatrix);
    onMatrixChange(newMatrix);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Matrix Editor ({rows}×{cols})</h3>
        <div className="flex gap-2">
          <button 
            className="btn btn-sm btn-outline"
            onClick={fillRandom}
          >
            Fill Random
          </button>
          <button 
            className="btn btn-sm btn-outline"
            onClick={clearMatrix}
          >
            Clear
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="table table-bordered table-compact w-full">
          <thead>
            <tr>
              <th className="bg-base-200">Alt/Crit</th>
              {Array.from({ length: cols }, (_, i) => (
                <th key={i} className="bg-base-200 text-center">C{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rowIdx) => (
              <tr key={rowIdx}>
                <td className="bg-base-200 font-medium">A{rowIdx + 1}</td>
                {row.map((cell, colIdx) => (
                  <td key={colIdx} className="p-0">
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      max="1"
                      value={cell.toFixed(3)}
                      onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                      className="input input-bordered input-sm w-full text-center"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

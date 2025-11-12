'use client';

import { useState } from 'react';
import { BeeParams } from '@/types/experiment';

interface ParamFormProps {
  // Named with "Action" suffix to avoid Next.js serializable-props rule confusion in client components
  onSubmitAction: (params: BeeParams) => void;
  isLoading?: boolean;
}

export default function ParamForm({ onSubmitAction, isLoading = false }: ParamFormProps) {
  const [params, setParams] = useState<BeeParams>({
    numBees: 20,
    iterations: 50,
    seed: undefined,
    lowerBound: undefined,
    upperBound: undefined,
    objectiveFunction: undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitAction(params);
  };

  const updateParam = (key: keyof BeeParams, value: string | number | undefined) => {
    setParams(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Bounds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label pb-1">
            <span className="label-text">Lower Bound (lb)</span>
          </label>
          <input
            type="number"
            value={params.lowerBound ?? ''}
            onChange={(e) => updateParam('lowerBound', e.target.value === '' ? undefined : Number(e.target.value))}
            className="input input-bordered w-full"
            placeholder="Optional"
          />
          <label className="label pt-1">
            <span className="label-text-alt">Valor mínimo permitido para las variables</span>
          </label>
        </div>

        <div className="form-control">
          <label className="label pb-1">
            <span className="label-text">Upper Bound (ub)</span>
          </label>
          <input
            type="number"
            value={params.upperBound ?? ''}
            onChange={(e) => updateParam('upperBound', e.target.value === '' ? undefined : Number(e.target.value))}
            className="input input-bordered w-full"
            placeholder="Optional"
          />
          <label className="label pt-1">
            <span className="label-text-alt">Valor máximo permitido para las variables</span>
          </label>
        </div>
      </div>

      <div className="form-control">
        <label className="label pb-1">
          <span className="label-text">Number of Bees</span>
        </label>
        <input
          type="number"
          min="1"
          value={params.numBees}
          onChange={(e) => updateParam('numBees', parseInt(e.target.value) || 1)}
          className="input input-bordered w-full"
          required
        />
        <label className="label pt-1">
          <span className="label-text-alt">Population size for the algorithm</span>
        </label>
      </div>

      <div className="form-control">
        <label className="label pb-1">
          <span className="label-text">Iterations</span>
        </label>
        <input
          type="number"
          min="1"
          max="1000"
          value={params.iterations}
          onChange={(e) => updateParam('iterations', parseInt(e.target.value) || 1)}
          className="input input-bordered w-full"
          required
        />
        <label className="label pt-1">
          <span className="label-text-alt">Maximum number of iterations (1-1000)</span>
        </label>
      </div>

      {/* Objective Function */}
      <div className="form-control">
        <label className="label pb-1">
          <span className="label-text">Objective Function (fobj)</span>
        </label>
        <input
          type="text"
          value={params.objectiveFunction ?? ''}
          onChange={(e) => updateParam('objectiveFunction', e.target.value || undefined)}
          className="input input-bordered w-full"
          placeholder="e.g., sphere, rastrigin, custom_f"
        />
        <label className="label pt-1">
          <span className="label-text-alt">Nombre/identificador de la función objetivo</span>
        </label>
      </div>

      <div className="form-control">
        <label className="label pb-1">
          <span className="label-text">Random Seed (Optional)</span>
        </label>
        <input
          type="number"
          min="0"
          value={params.seed || ''}
          onChange={(e) => updateParam('seed', e.target.value === '' ? undefined : parseInt(e.target.value))}
          className="input input-bordered w-full"
          placeholder="Leave empty for random"
        />
        <label className="label pt-1">
          <span className="label-text-alt">For reproducible results</span>
        </label>
      </div>

      <div className="form-control mt-4">
        <button
          type="submit"
          className={`btn btn-neutral ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Running...' : 'Run Experiment'}
        </button>
      </div>
    </form>
  );
}

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
    feedLimit: 10,
    numBees: 20,
    iterations: 50,
    seed: undefined
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
      <h3 className="text-lg font-medium mb-4">Algorithm Parameters</h3>
      
      <div className="form-control text-stone-700">
        <label className="label text-stone-700">
          <span className="label-text text-stone-700">Feed Limit</span>
        </label>
        <input
          type="number"
          min="1"
          value={params.feedLimit}
          onChange={(e) => updateParam('feedLimit', parseInt(e.target.value) || 1)}
          className="input input-bordered"
          required
        />
        <label className="label text-stone-700">
          <span className="label-text-alt">Maximum attempts before scout phase</span>
        </label>
      </div>

      <div className="form-control text-stone-700">
        <label className="label text-stone-700">
          <span className="label-text">Number of Bees</span>
        </label>
        <input
          type="number"
          min="1"
          value={params.numBees}
          onChange={(e) => updateParam('numBees', parseInt(e.target.value) || 1)}
          className="input input-bordered"
          required
        />
        <label className="label text-stone-700">
          <span className="label-text-alt">Population size for the algorithm</span>
        </label>
      </div>

      <div className="form-control text-stone-700">
        <label className="label text-stone-700">
          <span className="label-text">Iterations</span>
        </label>
        <input
          type="number"
          min="1"
          max="1000"
          value={params.iterations}
          onChange={(e) => updateParam('iterations', parseInt(e.target.value) || 1)}
          className="input input-bordered"
          required
        />
        <label className="label text-stone-700">
          <span className="label-text-alt">Maximum number of iterations (1-1000)</span>
        </label>
      </div>

      <div className="form-control text-stone-700">
        <label className="label text-stone-700">
          <span className="label-text">Random Seed (Optional)</span>
        </label>
        <input
          type="number"
          min="0"
          value={params.seed || ''}
          onChange={(e) => updateParam('seed', e.target.value === '' ? undefined : parseInt(e.target.value))}
          className="input input-bordered"
          placeholder="Leave empty for random"
        />
        <label className="label text-stone-700">
          <span className="label-text-alt">For reproducible results</span>
        </label>
      </div>

      <div className="form-control mt-6 text-stone-700">
        <button
          type="submit"
          className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Running...' : 'Run Experiment'}
        </button>
      </div>
    </form>
  );
}

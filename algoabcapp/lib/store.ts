import { create } from 'zustand';
import { Experiment } from '@/types/experiment';

interface ExperimentStore {
  experiments: Experiment[];
  currentExperiment: Experiment | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setExperiments: (experiments: Experiment[]) => void;
  addExperiment: (experiment: Experiment) => void;
  setCurrentExperiment: (experiment: Experiment | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useExperimentStore = create<ExperimentStore>((set) => ({
  experiments: [],
  currentExperiment: null,
  isLoading: false,
  error: null,
  
  setExperiments: (experiments) => set({ experiments }),
  addExperiment: (experiment) => set((state) => ({ 
    experiments: [...state.experiments, experiment] 
  })),
  setCurrentExperiment: (experiment) => set({ currentExperiment: experiment }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

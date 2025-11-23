import { Experiment } from '@/types/experiment';

interface ExperimentMetaCardProps {
  experiment: Experiment;
}

export default function ExperimentMetaCard({ experiment }: ExperimentMetaCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{experiment.name}</h2>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Created:</span>
            <span>{formatDate(experiment.createdAt)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Duration:</span>
            <span>{formatDuration(experiment.durationMs)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Iterations:</span>
            <span>{experiment.params.iterations}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Bees:</span>
            <span>{experiment.params.numBees}</span>
          </div>
          
          {experiment.params.lowerBound !== undefined && (
            <div className="flex justify-between">
              <span className="font-medium">Lower Bound (lb):</span>
              <span>{experiment.params.lowerBound}</span>
            </div>
          )}
          {experiment.params.upperBound !== undefined && (
            <div className="flex justify-between">
              <span className="font-medium">Upper Bound (ub):</span>
              <span>{experiment.params.upperBound}</span>
            </div>
          )}
          {experiment.params.objectiveFunction && (
            <div className="flex justify-between">
              <span className="font-medium">Objective Function:</span>
              <span>{experiment.params.objectiveFunction}</span>
            </div>
          )}
          {/* TrialLimit derived (N*D) */}
          {experiment.input.matrix && (
            <div className="flex justify-between">
              <span className="font-medium">Trial Limit (N*D):</span>
              <span>{experiment.params.numBees * experiment.input.matrix[0].length}</span>
            </div>
          )}
          
          {experiment.params.seed !== undefined && (
            <div className="flex justify-between">
              <span className="font-medium">Seed:</span>
              <span>{experiment.params.seed}</span>
            </div>
          )}
        </div>
        
        <div className="divider"></div>
        
        <div>
          <h3 className="font-medium mb-2">Input Mode:</h3>
          <span className="badge badge-primary">{experiment.input.mode}</span>
          {experiment.input.datasetName && (
            <span className="badge badge-secondary ml-2">{experiment.input.datasetName}</span>
          )}
        </div>
      </div>
    </div>
  );
}

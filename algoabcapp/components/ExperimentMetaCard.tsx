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
          
          <div className="flex justify-between">
            <span className="font-medium">Feed Limit:</span>
            <span>{experiment.params.feedLimit}</span>
          </div>
          
          {experiment.params.seed && (
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

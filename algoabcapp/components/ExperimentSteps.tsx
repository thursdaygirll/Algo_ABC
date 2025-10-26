'use client';

import { InputMode } from '@/types/experiment';

interface ExperimentStepsProps {
  currentStep: number;
  inputMode: InputMode;
  hasData: boolean;
  hasName: boolean;
  isRunning: boolean;
}

export default function ExperimentSteps({ 
  currentStep, 
  inputMode, 
  hasData, 
  hasName, 
  isRunning 
}: ExperimentStepsProps) {
  const steps = [
    {
      id: 1,
      title: 'Choose Data Input',
      description: 'Select how to provide your data',
      icon: '📊',
      status: currentStep >= 1 ? (inputMode ? 'completed' : 'current') : 'pending'
    },
    {
      id: 2,
      title: 'Upload/Configure Data',
      description: 'Provide your dataset',
      icon: '📁',
      status: currentStep >= 2 ? (hasData ? 'completed' : 'current') : 'pending'
    },
    {
      id: 3,
      title: 'Set Parameters',
      description: 'Configure algorithm settings',
      icon: '⚙️',
      status: currentStep >= 3 ? 'completed' : 'pending'
    },
    {
      id: 4,
      title: 'Name Experiment',
      description: 'Give your experiment a name',
      icon: '✏️',
      status: currentStep >= 4 ? (hasName ? 'completed' : 'current') : 'pending'
    },
    {
      id: 5,
      title: 'Run Experiment',
      description: 'Execute the Bee Algorithm',
      icon: '🚀',
      status: isRunning ? 'running' : (currentStep >= 5 ? 'completed' : 'pending')
    }
  ];

  const getStepClass = (step: any) => {
    const baseClass = 'step';
    switch (step.status) {
      case 'completed':
        return `${baseClass} step-success`;
      case 'current':
        return `${baseClass} step-primary`;
      case 'running':
        return `${baseClass} step-warning`;
      default:
        return baseClass;
    }
  };

  const getStepIcon = (step: any) => {
    if (step.status === 'running') {
      return (
        <span className="step-icon">
          <span className="loading loading-spinner loading-xs"></span>
        </span>
      );
    }
    if (step.status === 'completed') {
      return (
        <span className="step-icon">✓</span>
      );
    }
    return (
      <span className="step-icon">{step.icon}</span>
    );
  };

  const getStepDataContent = (step: any) => {
    if (step.status === 'completed') {
      return '✓';
    }
    if (step.status === 'running') {
      return '⟳';
    }
    return undefined;
  };

  return (
    <div className="w-full mb-8">
      <div className="overflow-x-auto">
        <ul className="steps steps-horizontal w-full">
          {steps.map((step) => (
            <li 
              key={step.id} 
              className={getStepClass(step)}
              data-content={getStepDataContent(step)}
            >
              {getStepIcon(step)}
              <div className="step-content">
                <div className="font-medium">{step.title}</div>
                <div className="text-xs text-base-content/60">{step.description}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Progress indicator */}
      <div className="mt-4 text-center">
        <div className="text-sm text-base-content/70">
          Step {currentStep} of {steps.length}: {steps.find(s => s.id === currentStep)?.title}
        </div>
        <div className="w-full bg-base-200 rounded-full h-2 mt-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
  <div className="card bg-base-100 shadow-sm">
      <div className="card-body text-center">
        <div className="text-6xl mb-4 text-yellow-400">{icon}</div>
        <h3 className="card-title justify-center text-stone-700">{title}</h3>
        <p className="text-base-content/70">{description}</p>
      </div>
    </div>
  );
}

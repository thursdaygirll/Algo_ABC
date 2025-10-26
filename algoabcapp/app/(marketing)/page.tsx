import Link from 'next/link';
import FeatureCard from '@/components/cards/FeatureCard';
import ThemePreview from '@/components/ThemePreview';

export default function HomePage() {
  const features = [
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Run sophisticated Bee Algorithm experiments with real-time visualization and comprehensive result analysis.'
    },
    {
      icon: '⚡',
      title: 'Fast Processing',
      description: 'Optimized algorithms deliver quick results with configurable parameters for different problem sizes.'
    },
    {
      icon: '📈',
      title: 'Visual Insights',
      description: 'Interactive charts and graphs help you understand algorithm performance and convergence patterns.'
    }
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
        <div className="hero min-h-[60vh] bg-linear-to-br from-primary/10 to-secondary/10">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-6">
              🐝 Bee Algorithm Platform
            </h1>
            <p className="text-xl mb-8 text-base-content/80">
              Advanced decision-making optimization using Artificial Bee Colony algorithms. 
              Upload your data, configure parameters, and discover optimal solutions through 
              intelligent swarm intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/new-experiment" className="btn btn-primary btn-lg">
                Run New Experiment
              </Link>
              <Link href="/experiments" className="btn btn-outline btn-lg">
                View Previous Results
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
          
          {/* Theme Preview Section */}
          <div className="max-w-4xl mx-auto">
            <ThemePreview />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-base-200">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Optimize Your Decisions?
          </h2>
          <p className="text-lg text-base-content/80 mb-8">
            Start with our preloaded datasets or upload your own data. 
            Configure the algorithm parameters and watch the magic happen.
          </p>
          <Link href="/new-experiment" className="btn btn-primary btn-lg">
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
}

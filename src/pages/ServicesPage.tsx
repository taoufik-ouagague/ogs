import { Check, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase, Package } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ServicesPageProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export default function ServicesPage({ onNavigate }: ServicesPageProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPackage = (pkg: Package) => {
    if (!user) {
      onNavigate('auth');
      return;
    }
    onNavigate('get-started', { selectedPackage: pkg });
  };

  const getPackageColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'basic':
        return 'blue';
      case 'ultimate':
        return 'green';
      case 'epic':
        return 'orange';
      default:
        return 'blue';
    }
  };

  const getPackageBadge = (name: string) => {
    if (name.toLowerCase() === 'ultimate') return 'Most Popular';
    if (name.toLowerCase() === 'epic') return 'Best Value';
    return null;
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <section className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Choose Your LLC Package
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Select the perfect package for your business needs. All packages include professional filing
            and expert support.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading packages...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => {
              const color = getPackageColor(pkg.name);
              const badge = getPackageBadge(pkg.name);
              const isPopular = pkg.name.toLowerCase() === 'ultimate';

              return (
                <div
                  key={pkg.id}
                  className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all hover:scale-105 ${
                    isPopular ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                  }`}
                >
                  {badge && (
                    <div className={`bg-${color}-500 text-white text-center py-2 text-sm font-semibold`}>
                      {badge}
                    </div>
                  )}

                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {pkg.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 min-h-[48px]">
                      {pkg.description}
                    </p>

                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-5xl font-bold text-gray-900 dark:text-white">
                          ${pkg.price}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 ml-2">+ state fees</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectPackage(pkg)}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                        isPopular
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <span>Select Package</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>

                    <div className="mt-8 space-y-4">
                      {pkg.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 text-${color}-500`} />
                          <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-blue-50 dark:bg-gray-800 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Not Sure Which Package to Choose?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Our AI assistant can help you find the perfect package for your business needs.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
          >
            Contact Our Team
          </button>
        </div>
      </section>
    </div>
  );
}

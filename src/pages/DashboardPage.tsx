import { useEffect, useState } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Package as PackageIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, LLCApplication, Package } from '../lib/supabase';
import { US_STATES } from '../utils/constants';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { user } = useAuth();
  const [applications, setApplications] = useState<(LLCApplication & { package: Package })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadApplications();
    }
  }, [user]);

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('llc_applications')
        .select('*, package:packages(*)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data as (LLCApplication & { package: Package })[]);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200';
      case 'processing':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200';
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Track your LLC formation applications
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Applications Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't submitted any LLC formation applications yet.
            </p>
            <button
              onClick={() => onNavigate('get-started')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
            >
              Start Your First Application
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {app.company_name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">State</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {US_STATES.find((s) => s.code === app.state)?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Package</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {app.package.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Payment Status</p>
                        <p className={`font-semibold ${getPaymentStatusColor(app.payment_status)}`}>
                          {app.payment_status.charAt(0).toUpperCase() + app.payment_status.slice(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Submitted</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {new Date(app.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      {getStatusIcon(app.status)}
                      <span className="text-gray-600 dark:text-gray-400">
                        {app.status === 'completed' && 'Your LLC has been successfully formed!'}
                        {app.status === 'processing' && 'Your application is being processed.'}
                        {app.status === 'pending' &&
                          'Your application is pending. Please complete payment to proceed.'}
                        {app.status === 'rejected' &&
                          'Your application needs attention. Please contact support.'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 lg:mt-0 lg:ml-6">
                    {app.payment_status === 'pending' && (
                      <button className="w-full lg:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold">
                        Complete Payment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Total Applications</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {applications.length}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Completed</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {applications.filter((app) => app.status === 'completed').length}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">In Progress</h3>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {applications.filter((app) => ['pending', 'processing'].includes(app.status)).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

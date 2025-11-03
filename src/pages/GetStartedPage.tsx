import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, MapPin, Building2, User, Mail, Phone, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Package } from '../lib/supabase';
import { US_STATES } from '../utils/constants';

interface GetStartedPageProps {
  onNavigate: (page: string) => void;
  selectedPackage?: Package;
}

export default function GetStartedPage({ onNavigate, selectedPackage }: GetStartedPageProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    state: '',
    packageId: selectedPackage?.id || '',
    companyName: '',
    memberName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    businessType: 'single-member',
    businessPurpose: '',
  });

  useEffect(() => {
    if (!user) {
      onNavigate('auth');
      return;
    }
    loadPackages();
  }, [user, onNavigate]);

  const loadPackages = async () => {
    const { data } = await supabase
      .from('packages')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });

    setPackages(data || []);
  };

  const steps = [
    { id: 1, title: 'State Selection', icon: MapPin },
    { id: 2, title: 'Package Selection', icon: Building2 },
    { id: 3, title: 'Business Information', icon: Building2 },
    { id: 4, title: 'Contact Information', icon: User },
    { id: 5, title: 'Review & Submit', icon: Check },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('llc_applications').insert({
        user_id: user!.id,
        package_id: formData.packageId,
        state: formData.state,
        company_name: formData.companyName,
        form_data: {
          memberName: formData.memberName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          businessType: formData.businessType,
          businessPurpose: formData.businessPurpose,
        },
        status: 'pending',
        payment_status: 'pending',
      });

      if (error) throw error;

      alert('Application submitted successfully! You will be redirected to payment.');
      onNavigate('dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.state !== '';
      case 2:
        return formData.packageId !== '';
      case 3:
        return formData.companyName && formData.businessPurpose;
      case 4:
        return formData.memberName && formData.email && formData.phone && formData.address && formData.city && formData.zipCode;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Start Your LLC Formation
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete the following steps to form your LLC
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        currentStep > step.id
                          ? 'bg-green-500 text-white'
                          : currentStep === step.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className="text-xs mt-2 text-center hidden sm:block text-gray-600 dark:text-gray-400">
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 rounded ${
                        currentStep > step.id
                          ? 'bg-green-500'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="min-h-[400px]">
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Select Your State
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Choose the state where you want to form your LLC
                </p>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                >
                  <option value="">Select a state...</option>
                  {US_STATES.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Choose Your Package
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Select the service package that fits your needs
                </p>
                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => handleInputChange('packageId', pkg.id)}
                      className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                        formData.packageId === pkg.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {pkg.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {pkg.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-gray-900 dark:text-white">
                            ${pkg.price}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            + state fees
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Business Information
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Tell us about your business
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="e.g., My Business LLC"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Type
                    </label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="single-member">Single-Member LLC</option>
                      <option value="multi-member">Multi-Member LLC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Purpose
                    </label>
                    <textarea
                      value={formData.businessPurpose}
                      onChange={(e) => handleInputChange('businessPurpose', e.target.value)}
                      placeholder="Describe what your business will do..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Contact Information
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  How can we reach you?
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.memberName}
                      onChange={(e) => handleInputChange('memberName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Review Your Information
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Please review your information before submitting
                </p>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">State</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {US_STATES.find(s => s.code === formData.state)?.name}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Package</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {packages.find(p => p.id === formData.packageId)?.name}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Business Details</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Company Name:</strong> {formData.companyName}<br />
                      <strong>Type:</strong> {formData.businessType}<br />
                      <strong>Purpose:</strong> {formData.businessPurpose}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contact Information</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Name:</strong> {formData.memberName}<br />
                      <strong>Email:</strong> {formData.email}<br />
                      <strong>Phone:</strong> {formData.phone}<br />
                      <strong>Address:</strong> {formData.address}, {formData.city}, {formData.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Back</span>
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>{loading ? 'Submitting...' : 'Submit Application'}</span>
                <Check className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useSolvencyQuestionnaire } from '../../hooks/useSolvencyQuestionnaire';
import { CreditCard, Settings, FileText, Star, TrendingUp, Briefcase, Home, GraduationCap } from 'lucide-react';

export default function AccountOverview() {
  const user = useAuthStore((state) => state.user);
  const { profile, loading: profileLoading } = useUserProfile();
  const { questionnaire, rating, loading: solvencyLoading } = useSolvencyQuestionnaire();

  if (profileLoading || solvencyLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Account Overview</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">Manage your account settings and view your applications</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-semibold">Profile Information</h3>
              <Link to="/account/settings" className="text-primary-600 hover:text-primary-700">
                <Settings className="h-5 w-5" />
              </Link>
            </div>
            <div className="space-y-3">
              <p className="text-sm sm:text-base text-gray-600">
                <span className="font-medium">Name:</span>{' '}
                {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : 'Not set'}
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                <span className="font-medium">Email:</span> {user?.email}
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                <span className="font-medium">Phone:</span> {profile?.phone || 'Not set'}
              </p>
            </div>
          </div>

          {/* Payment Methods Card */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-semibold">Payment Methods</h3>
              <Link to="/account/settings#payment" className="text-primary-600 hover:text-primary-700">
                <CreditCard className="h-5 w-5" />
              </Link>
            </div>
            <div className="space-y-3">
              <p className="text-sm sm:text-base text-gray-600">Manage your saved payment methods</p>
              <Link
                to="/account/settings#payment"
                className="inline-flex items-center text-sm sm:text-base text-primary-600 hover:text-primary-700"
              >
                View saved cards
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>

          {/* Applications Card */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-semibold">Applications</h3>
              <Link to="/applications" className="text-primary-600 hover:text-primary-700">
                <FileText className="h-5 w-5" />
              </Link>
            </div>
            <div className="space-y-3">
              <p className="text-sm sm:text-base text-gray-600">View and manage your loan applications</p>
              <Link
                to="/applications"
                className="inline-flex items-center text-sm sm:text-base text-primary-600 hover:text-primary-700"
              >
                View applications
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Solvency Assessment Section */}
        {rating && questionnaire && (
          <div className="mt-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Solvency Assessment</h3>
            
            {/* Rating Scores */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Credit Rating</h4>
                <Link to="/solvency" className="text-primary-600 hover:text-primary-700">
                  <Star className="h-5 w-5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Credit Score</p>
                  <p className="text-lg font-semibold">{rating.credit_score}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employment Score</p>
                  <p className="text-lg font-semibold">{rating.employment_score}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Income Score</p>
                  <p className="text-lg font-semibold">{rating.income_score}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Debt Ratio Score</p>
                  <p className="text-lg font-semibold">{rating.debt_ratio_score}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment History</p>
                  <p className="text-lg font-semibold">{rating.payment_history_score}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Overall Rating</p>
                  <p className="text-lg font-semibold text-primary-600">{rating.overall_rating}</p>
                </div>
              </div>
            </div>

            {/* Questionnaire Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Financial Information */}
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
                  <h4 className="text-lg font-semibold">Financial Information</h4>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Annual Income:</span>{' '}
                    {formatCurrency(questionnaire.annual_income)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Monthly Expenses:</span>{' '}
                    {formatCurrency(questionnaire.monthly_expenses)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Existing Loans:</span>{' '}
                    {formatCurrency(questionnaire.existing_loans)}
                  </p>
                </div>
              </div>

              {/* Employment Details */}
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                <div className="flex items-center mb-4">
                  <Briefcase className="h-5 w-5 text-primary-600 mr-2" />
                  <h4 className="text-lg font-semibold">Employment Details</h4>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Status:</span>{' '}
                    {questionnaire.employment_status.charAt(0).toUpperCase() + 
                     questionnaire.employment_status.slice(1)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Industry:</span> {questionnaire.industry}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Job Title:</span> {questionnaire.job_title}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Years Employed:</span> {questionnaire.employment_length}
                  </p>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                <div className="flex items-center mb-4">
                  <Home className="h-5 w-5 text-primary-600 mr-2" />
                  <h4 className="text-lg font-semibold">Housing</h4>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Home Ownership:</span>{' '}
                    {questionnaire.home_ownership.charAt(0).toUpperCase() + 
                     questionnaire.home_ownership.slice(1)}
                  </p>
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                <div className="flex items-center mb-4">
                  <GraduationCap className="h-5 w-5 text-primary-600 mr-2" />
                  <h4 className="text-lg font-semibold">Education</h4>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Education Level:</span>{' '}
                    {questionnaire.education_level.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
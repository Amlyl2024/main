import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Clock, X, User, Phone, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

interface Application {
  id: string;
  application_type: 'lender' | 'borrower';
  loan_amount: number;
  loan_term: number;
  interest_rate: number;
  purpose: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  monthly_payment: number;
  total_amount: number;
  amount_paid: number;
  remaining_amount: number;
  next_payment_date: string;
  created_at: string;
}

interface ProjectInvestment {
  id: string;
  amount: number;
  created_at: string;
  project: {
    id: string;
    title: string;
    description: string;
    target_amount: number;
    funded_amount: number;
    deadline: string;
    backers_count: number;
  };
}

interface ApplicationDetailsProps {
  application: Application;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({ application, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-900">Application Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Loan Information</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Loan Amount</p>
                  <p className="font-medium">{formatCurrency(application.loan_amount)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Term</p>
                  <p className="font-medium">{application.loan_term} months</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Interest Rate</p>
                  <p className="font-medium">{application.interest_rate}% APR</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Payment Details</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Monthly Payment</p>
                  <p className="font-medium">{formatCurrency(application.monthly_payment)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Amount Paid</p>
                  <p className="font-medium">{formatCurrency(application.amount_paid)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Remaining Amount</p>
                  <p className="font-medium">{formatCurrency(application.remaining_amount)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <h4 className="font-medium text-gray-900 mb-4">Contact Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{application.first_name} {application.last_name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{application.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ApplicationCard = ({ app, onViewDetails }: { app: Application, onViewDetails: (app: Application) => void }) => (
  <div className="bg-white rounded-lg shadow p-4 mb-4">
    <div className="flex justify-between items-start mb-4">
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
        app.status === 'approved'
          ? 'bg-green-100 text-green-800'
          : app.status === 'rejected'
          ? 'bg-red-100 text-red-800'
          : 'bg-yellow-100 text-yellow-800'
      }`}>
        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
      </span>
      <button
        onClick={() => onViewDetails(app)}
        className="text-primary-600 hover:text-primary-900"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>

    <div className="space-y-3">
      <div>
        <p className="text-sm text-gray-500">Amount</p>
        <p className="text-base font-semibold">{formatCurrency(app.loan_amount)}</p>
      </div>
      
      <div>
        <p className="text-sm text-gray-500">Monthly Payment</p>
        <p className="text-base font-semibold">{formatCurrency(app.monthly_payment)}</p>
      </div>

      {app.next_payment_date && (
        <div>
          <p className="text-sm text-gray-500">Next Due Date</p>
          <p className="text-base font-semibold">{formatDate(app.next_payment_date)}</p>
        </div>
      )}

      <div>
        <p className="text-sm text-gray-500">Remaining</p>
        <p className="text-base font-semibold">{formatCurrency(app.remaining_amount)}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Counterpart</p>
        <p className="text-base font-semibold">{app.first_name} {app.last_name}</p>
      </div>
    </div>
  </div>
);

const ApplicationTable = ({ applications, title, onViewDetails }: { 
  applications: Application[], 
  title: string,
  onViewDetails: (app: Application) => void 
}) => (
  <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
    <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    </div>
    {applications.length > 0 ? (
      <>
        {/* Mobile Card View */}
        <div className="sm:hidden p-4">
          {applications.map((app) => (
            <ApplicationCard key={app.id} app={app} onViewDetails={onViewDetails} />
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Counterpart</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      app.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : app.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCurrency(app.loan_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCurrency(app.monthly_payment)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {app.next_payment_date ? formatDate(app.next_payment_date) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCurrency(app.remaining_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {app.first_name} {app.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => onViewDetails(app)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ) : (
      <div className="p-4 sm:p-6 text-center text-gray-500">
        No {title.toLowerCase()} found
      </div>
    )}
  </div>
);

const ProjectInvestmentCard = ({ investment }: { investment: ProjectInvestment }) => (
  <div className="bg-white rounded-lg shadow p-4 mb-4">
    <div className="space-y-3">
      <div>
        <p className="text-sm text-gray-500">Project</p>
        <p className="text-base font-semibold">{investment.project.title}</p>
      </div>
      
      <div>
        <p className="text-sm text-gray-500">Investment Amount</p>
        <p className="text-base font-semibold">{formatCurrency(investment.amount)}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Project Progress</p>
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
            <div 
              style={{ width: `${(investment.project.funded_amount / investment.project.target_amount) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>{formatCurrency(investment.project.funded_amount)} raised</span>
            <span>{formatCurrency(investment.project.target_amount)} goal</span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500">Investment Date</p>
        <p className="text-base font-semibold">{formatDate(investment.created_at)}</p>
      </div>
    </div>
  </div>
);

export default function ApplicationsList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [investments, setInvestments] = useState<ProjectInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [viewType, setViewType] = useState<'loans' | 'investments'>('loans');
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      if (viewType === 'loans') {
        fetchApplications();
      } else {
        fetchInvestments();
      }
    }
  }, [user, viewType]);

  async function fetchApplications() {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchInvestments() {
    try {
      const { data, error } = await supabase
        .from('project_investments')
        .select(`
          id,
          amount,
          created_at,
          project:projects (
            id,
            title,
            description,
            target_amount,
            funded_amount,
            deadline,
            backers_count
          )
        `)
        .eq('investor_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvestments(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const activeApplications = applications.filter(app => app.status === 'approved' && app.remaining_amount > 0);
  const completedApplications = applications.filter(app => app.status === 'approved' && app.remaining_amount === 0);

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Applications</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            View and manage your lending and borrowing applications
          </p>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setViewType('loans')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                viewType === 'loans'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Loan Applications
            </button>
            <button
              onClick={() => setViewType('investments')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                viewType === 'investments'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Project Investments
            </button>
          </div>
        </div>

        {viewType === 'loans' ? (
          <>
            <ApplicationTable 
              applications={pendingApplications} 
              title="Pending Applications" 
              onViewDetails={setSelectedApp}
            />

            <ApplicationTable 
              applications={activeApplications} 
              title="Active Applications" 
              onViewDetails={setSelectedApp}
            />

            <ApplicationTable 
              applications={completedApplications} 
              title="Completed Applications" 
              onViewDetails={setSelectedApp}
            />
          </>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Project Investments</h3>
            </div>
            
            {investments.length > 0 ? (
              <div className="p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {investments.map((investment) => (
                  <ProjectInvestmentCard key={investment.id} investment={investment} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                You haven't made any project investments yet.
              </div>
            )}
          </div>
        )}

        {selectedApp && (
          <ApplicationDetails
            application={selectedApp}
            onClose={() => setSelectedApp(null)}
          />
        )}
      </div>
    </div>
  );
}
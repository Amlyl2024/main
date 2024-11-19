import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { supabase, Project, investInProject } from '../../lib/supabase';
import { Calendar, Target, Users, DollarSign, AlertCircle } from 'lucide-react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  amount: Yup.number()
    .required('Required')
    .min(10, 'Minimum investment is $10')
});

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  async function fetchProject() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProject(data);
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

  if (error || !project) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 flex items-center justify-center">
        <div className="text-red-600">Error: {error || 'Project not found'}</div>
      </div>
    );
  }

  const progress = (project.funded_amount / project.target_amount) * 100;
  const daysLeft = Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {project.image_urls && project.image_urls.length > 0 && (
                <img 
                  src={project.image_urls[0]} 
                  alt={project.title}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
                <p className="text-gray-600 whitespace-pre-wrap mb-6">{project.description}</p>

                <div className="space-y-6">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-200">
                          Progress
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-primary-600">
                          {progress.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
                      <div 
                        style={{ width: `${progress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex items-center">
                      <Target className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Target</p>
                        <p className="text-sm font-medium">${project.target_amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Raised</p>
                        <p className="text-sm font-medium">${project.funded_amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Backers</p>
                        <p className="text-sm font-medium">{project.backers_count}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Days Left</p>
                        <p className="text-sm font-medium">{daysLeft}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Back this project</h2>
              
              {!user ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">Please sign in to invest in this project</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Sign In
                  </button>
                </div>
              ) : (
                <Formik
                  initialValues={{ amount: '' }}
                  validationSchema={validationSchema}
                  onSubmit={async (values, { setSubmitting, setStatus }) => {
                    try {
                      await investInProject(project.id, Number(values.amount), user.id);
                      await fetchProject(); // Refresh project data
                      setStatus('Investment successful!');
                    } catch (error: any) {
                      setStatus(error.message);
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ values, errors, touched, handleChange, handleBlur, isSubmitting, status }) => (
                    <Form className="space-y-4">
                      {status && (
                        <div className={`p-4 rounded-md ${
                          status === 'Investment successful!' 
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          <p className="text-sm">{status}</p>
                        </div>
                      )}

                      <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                          Investment Amount ($)
                        </label>
                        <input
                          type="number"
                          id="amount"
                          name="amount"
                          value={values.amount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                        {touched.amount && errors.amount && (
                          <p className="mt-2 text-sm text-red-600">{errors.amount}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        {isSubmitting ? 'Processing...' : 'Invest Now'}
                      </button>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
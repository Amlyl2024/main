import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useSolvencyQuestionnaire } from '../../hooks/useSolvencyQuestionnaire';
import { AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import FinancialInfo from './steps/FinancialInfo';
import EmploymentInfo from './steps/EmploymentInfo';
import CreditInfo from './steps/CreditInfo';
import AdditionalInfo from './steps/AdditionalInfo';
import StepIndicator from './StepIndicator';
import SuccessPopup from './SuccessPopup';

const steps = [
  {
    title: 'Financial Information',
    description: 'Income and expenses',
    validationSchema: Yup.object({
      annual_income: Yup.number().required('Required').min(0, 'Must be a positive number'),
      monthly_expenses: Yup.number().required('Required').min(0, 'Must be a positive number'),
      existing_loans: Yup.number().required('Required').min(0, 'Must be a positive number'),
    })
  },
  {
    title: 'Employment Details',
    description: 'Work history and status',
    validationSchema: Yup.object({
      employment_status: Yup.string()
        .required('Required')
        .oneOf(['employed', 'self-employed', 'unemployed', 'retired']),
      employment_length: Yup.number()
        .required('Required')
        .min(0, 'Must be a positive number'),
      industry: Yup.string().required('Required'),
      job_title: Yup.string().required('Required'),
    })
  },
  {
    title: 'Credit Information',
    description: 'Credit score and history',
    validationSchema: Yup.object({
      credit_score: Yup.number()
        .required('Required')
        .min(300, 'Must be at least 300')
        .max(850, 'Must be at most 850'),
      has_bankruptcies: Yup.boolean().required('Required'),
      bankruptcy_years: Yup.number().nullable()
        .when('has_bankruptcies', {
          is: true,
          then: (schema) => schema.required('Required').min(0),
          otherwise: (schema) => schema.nullable()
        }),
      has_defaults: Yup.boolean().required('Required'),
      default_years: Yup.number().nullable()
        .when('has_defaults', {
          is: true,
          then: (schema) => schema.required('Required').min(0),
          otherwise: (schema) => schema.nullable()
        }),
    })
  },
  {
    title: 'Additional Details',
    description: 'Housing and education',
    validationSchema: Yup.object({
      home_ownership: Yup.string()
        .required('Required')
        .oneOf(['own', 'mortgage', 'rent']),
      education_level: Yup.string()
        .required('Required')
        .oneOf(['high_school', 'bachelors', 'masters', 'phd', 'other'])
    })
  }
];

export default function SolvencyQuestionnaire() {
  const navigate = useNavigate();
  const { questionnaire, rating, loading, error, submitQuestionnaire } = useSolvencyQuestionnaire();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [newRating, setNewRating] = useState<any>(null);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const initialValues = questionnaire || {
    annual_income: '',
    employment_status: '',
    employment_length: '',
    monthly_expenses: '',
    existing_loans: '',
    home_ownership: '',
    credit_score: '',
    has_bankruptcies: false,
    bankruptcy_years: '',
    has_defaults: false,
    default_years: '',
    industry: '',
    job_title: '',
    education_level: ''
  };

  const renderStepContent = (step: number, formikProps: any) => {
    switch (step) {
      case 0:
        return <FinancialInfo formikProps={formikProps} />;
      case 1:
        return <EmploymentInfo formikProps={formikProps} />;
      case 2:
        return <CreditInfo formikProps={formikProps} />;
      case 3:
        return <AdditionalInfo formikProps={formikProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Solvency Assessment</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Complete this assessment to determine your lending eligibility
          </p>
        </div>

        {rating && !showSuccessPopup && (
          <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Your Current Rating</h3>
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
                <p className="text-lg font-semibold">{rating.overall_rating}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <StepIndicator steps={steps} currentStep={currentStep} />

          <div className="p-6">
            <Formik
              initialValues={initialValues}
              validationSchema={steps[currentStep].validationSchema}
              onSubmit={async (values, { setSubmitting, setStatus }) => {
                if (currentStep < steps.length - 1) {
                  setCurrentStep(currentStep + 1);
                  setSubmitting(false);
                  return;
                }

                try {
                  const result = await submitQuestionnaire(values);
                  setNewRating(result.rating);
                  setShowSuccessPopup(true);
                } catch (error: any) {
                  setStatus(error.message);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {(formikProps) => (
                <Form className="space-y-6">
                  {formikProps.status && (
                    <div className="mb-6 bg-red-50 p-4 rounded-md flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                      <p className="text-sm text-red-700">{formikProps.status}</p>
                    </div>
                  )}

                  {renderStepContent(currentStep, formikProps)}

                  <div className="flex justify-between pt-6">
                    {currentStep > 0 && (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Previous
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={formikProps.isSubmitting}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 ml-auto"
                    >
                      {currentStep === steps.length - 1 ? (
                        formikProps.isSubmitting ? 'Submitting...' : 'Submit'
                      ) : (
                        <>
                          Next
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      {showSuccessPopup && newRating && (
        <SuccessPopup 
          rating={newRating} 
          onClose={() => setShowSuccessPopup(false)} 
        />
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { useSolvencyQuestionnaire } from '../../hooks/useSolvencyQuestionnaire';
import RoleSelection from './RoleSelection';
import LoanTerms from './LoanTerms';
import PersonalInfo from './PersonalInfo';
import CreditCardInfo from './CreditCardInfo';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

type Role = 'lender' | 'borrower' | null;

const getSteps = (role: Role) => {
  if (!role) return [];
  return [
    role === 'lender' ? 'Investment Terms' : 'Loan Terms',
    'Personal Information',
    'Payment Details'
  ];
};

const getValidationSchema = (role: Role, step: number) => {
  if (!role) return Yup.object({});
  
  const baseSchemas = [
    // Step 1: Terms validation
    Yup.object({
      loanAmount: Yup.number()
        .required('Required')
        .min(role === 'lender' ? 5000 : 1000, 
          `Minimum ${role === 'lender' ? 'investment' : 'loan'} amount is $${role === 'lender' ? '5,000' : '1,000'}`),
      loanTerm: Yup.number()
        .required('Required')
        .min(6, 'Minimum term is 6 months'),
      interestRate: Yup.number()
        .required('Required')
        .min(1, 'Minimum rate is 1%')
        .max(30, 'Maximum rate is 30%'),
      ...(role === 'borrower' && {
        purpose: Yup.string().required('Required'),
      }),
    }),
    // Step 2: Personal Information validation
    Yup.object({
      firstName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      phone: Yup.string().required('Required'),
      address: Yup.string().required('Required'),
    }),
    // Step 3: Payment Information validation
    Yup.object({
      savedCard: Yup.string(),
      cardNumber: Yup.string().when('savedCard', {
        is: '',
        then: Yup.string().required('Required').matches(/^\d{16}$/, 'Invalid card number'),
      }),
      cardName: Yup.string().when('savedCard', {
        is: '',
        then: Yup.string().required('Required'),
      }),
      expiryDate: Yup.string().when('savedCard', {
        is: '',
        then: Yup.string().required('Required').matches(/^\d{2}\/\d{2}$/, 'Invalid expiry date'),
      }),
      cvv: Yup.string().when('savedCard', {
        is: '',
        then: Yup.string().required('Required').matches(/^\d{3,4}$/, 'Invalid CVV'),
      }),
      saveCard: Yup.boolean(),
    }),
  ];

  return baseSchemas[step];
};

const initialValues = {
  loanAmount: '',
  loanTerm: '',
  interestRate: '',
  purpose: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  savedCard: '',
  cardNumber: '',
  cardName: '',
  expiryDate: '',
  cvv: '',
  saveCard: false,
};

export default function LoanApplication() {
  const [role, setRole] = useState<Role>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { rating, loading: ratingLoading } = useSolvencyQuestionnaire();

  useEffect(() => {
    if (!ratingLoading && !rating) {
      navigate('/solvency');
    }
  }, [rating, ratingLoading, navigate]);

  if (ratingLoading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const handleSubmit = async (values: any) => {
    if (!role) return;
    
    if (currentStep === getSteps(role).length - 1) {
      try {
        let paymentMethodId = values.savedCard;

        // Save new card if requested
        if (!values.savedCard && values.saveCard) {
          const { data: cardData, error: cardError } = await supabase
            .from('saved_cards')
            .insert([
              {
                user_id: user?.id,
                card_last_four: values.cardNumber.slice(-4),
                card_brand: detectCardBrand(values.cardNumber),
                card_holder_name: values.cardName,
                expiry_date: values.expiryDate,
                is_default: false,
              }
            ])
            .select()
            .single();

          if (cardError) throw cardError;
          paymentMethodId = cardData.id;
        }

        // Submit application
        const { error } = await supabase
          .from('applications')
          .insert([
            {
              user_id: user?.id,
              application_type: role,
              loan_amount: Number(values.loanAmount),
              loan_term: Number(values.loanTerm),
              interest_rate: Number(values.interestRate),
              purpose: values.purpose,
              first_name: values.firstName,
              last_name: values.lastName,
              email: values.email,
              phone: values.phone,
              address: values.address,
              payment_method_id: paymentMethodId,
            }
          ]);

        if (error) throw error;
        
        navigate('/applications');
      } catch (error: any) {
        setSubmissionError(error.message);
        console.error('Submission error:', error);
      }
    }
  };

  function detectCardBrand(cardNumber: string): string {
    if (cardNumber.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(cardNumber)) return 'Mastercard';
    if (/^3[47]/.test(cardNumber)) return 'American Express';
    if (/^6(?:011|5)/.test(cardNumber)) return 'Discover';
    return 'Unknown';
  }

  const renderStepContent = (step: number, formikProps: any) => {
    switch (step) {
      case 0:
        return <LoanTerms formikProps={formikProps} role={role!} />;
      case 1:
        return <PersonalInfo formikProps={formikProps} />;
      case 2:
        return <CreditCardInfo formikProps={formikProps} />;
      default:
        return null;
    }
  };

  if (!role) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <RoleSelection onSelect={setRole} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
            {role === 'lender' ? 'Investment Application' : 'Loan Application'}
          </h2>
          <div className="mt-4">
            <div className="flex justify-center">
              {getSteps(role).map((step, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                      index <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <span className="text-sm sm:text-base">{index + 1}</span>
                  </div>
                  {index < getSteps(role).length - 1 && (
                    <div
                      className={`w-12 sm:w-20 h-1 mx-1 sm:mx-2 ${
                        index < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-2">
              {getSteps(role).map((step, index) => (
                <div
                  key={index}
                  className={`mx-2 sm:mx-8 text-xs sm:text-sm ${
                    index <= currentStep ? 'text-primary-600' : 'text-gray-500'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        {submissionError && (
          <div className="mb-4 sm:mb-6 bg-red-50 p-3 sm:p-4 rounded-md">
            <p className="text-sm text-red-600">{submissionError}</p>
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={getValidationSchema(role, currentStep)}
          onSubmit={handleSubmit}
        >
          {(formikProps) => (
            <Form className="bg-white shadow-lg rounded-lg p-4 sm:p-8">
              {renderStepContent(currentStep, formikProps)}

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between gap-4">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-sm sm:text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 w-full sm:w-auto"
                  >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Previous
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    formikProps.validateForm().then((errors) => {
                      if (Object.keys(errors).length === 0) {
                        if (currentStep === getSteps(role).length - 1) {
                          formikProps.handleSubmit();
                        } else {
                          setCurrentStep(currentStep + 1);
                        }
                      } else {
                        formikProps.submitForm();
                      }
                    });
                  }}
                  className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 w-full sm:w-auto sm:ml-auto"
                >
                  {currentStep === getSteps(role).length - 1 ? (
                    'Submit Application'
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
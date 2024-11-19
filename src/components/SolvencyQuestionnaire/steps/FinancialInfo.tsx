import React from 'react';
import { FormikProps } from 'formik';
import { DollarSign } from 'lucide-react';

interface Props {
  formikProps: FormikProps<any>;
}

export default function FinancialInfo({ formikProps }: Props) {
  const { values, errors, touched, handleChange, handleBlur } = formikProps;

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="annual_income" className="block text-sm font-medium text-gray-700">
          Annual Income ($)
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            id="annual_income"
            name="annual_income"
            value={values.annual_income}
            onChange={handleChange}
            onBlur={handleBlur}
            className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500"
            placeholder="0.00"
          />
        </div>
        {touched.annual_income && errors.annual_income && (
          <p className="mt-2 text-sm text-red-600">{errors.annual_income}</p>
        )}
      </div>

      <div>
        <label htmlFor="monthly_expenses" className="block text-sm font-medium text-gray-700">
          Monthly Expenses ($)
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            id="monthly_expenses"
            name="monthly_expenses"
            value={values.monthly_expenses}
            onChange={handleChange}
            onBlur={handleBlur}
            className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500"
            placeholder="0.00"
          />
        </div>
        {touched.monthly_expenses && errors.monthly_expenses && (
          <p className="mt-2 text-sm text-red-600">{errors.monthly_expenses}</p>
        )}
      </div>

      <div>
        <label htmlFor="existing_loans" className="block text-sm font-medium text-gray-700">
          Existing Loans ($)
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            id="existing_loans"
            name="existing_loans"
            value={values.existing_loans}
            onChange={handleChange}
            onBlur={handleBlur}
            className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500"
            placeholder="0.00"
          />
        </div>
        {touched.existing_loans && errors.existing_loans && (
          <p className="mt-2 text-sm text-red-600">{errors.existing_loans}</p>
        )}
      </div>
    </div>
  );
}
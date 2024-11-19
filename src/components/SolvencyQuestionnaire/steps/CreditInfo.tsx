import React from 'react';
import { FormikProps } from 'formik';
import { CreditCard } from 'lucide-react';

interface Props {
  formikProps: FormikProps<any>;
}

export default function CreditInfo({ formikProps }: Props) {
  const { values, errors, touched, handleChange, handleBlur } = formikProps;

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="credit_score" className="block text-sm font-medium text-gray-700">
          Credit Score
        </label>
        <input
          type="number"
          id="credit_score"
          name="credit_score"
          value={values.credit_score}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500"
          placeholder="300-850"
        />
        {touched.credit_score && errors.credit_score && (
          <p className="mt-2 text-sm text-red-600">{errors.credit_score}</p>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="has_bankruptcies"
              name="has_bankruptcies"
              checked={values.has_bankruptcies}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="has_bankruptcies" className="ml-2 block text-sm text-gray-700">
              Have you ever filed for bankruptcy?
            </label>
          </div>
          {values.has_bankruptcies && (
            <div className="mt-4">
              <label htmlFor="bankruptcy_years" className="block text-sm font-medium text-gray-700">
                Years since bankruptcy
              </label>
              <input
                type="number"
                id="bankruptcy_years"
                name="bankruptcy_years"
                value={values.bankruptcy_years || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-1 block w-full rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500"
              />
              {touched.bankruptcy_years && errors.bankruptcy_years && (
                <p className="mt-2 text-sm text-red-600">{errors.bankruptcy_years}</p>
              )}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="has_defaults"
              name="has_defaults"
              checked={values.has_defaults}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="has_defaults" className="ml-2 block text-sm text-gray-700">
              Have you had any loan defaults?
            </label>
          </div>
          {values.has_defaults && (
            <div className="mt-4">
              <label htmlFor="default_years" className="block text-sm font-medium text-gray-700">
                Years since last default
              </label>
              <input
                type="number"
                id="default_years"
                name="default_years"
                value={values.default_years || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-1 block w-full rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500"
              />
              {touched.default_years && errors.default_years && (
                <p className="mt-2 text-sm text-red-600">{errors.default_years}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
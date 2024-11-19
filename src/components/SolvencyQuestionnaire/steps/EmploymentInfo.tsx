import React from 'react';
import { FormikProps } from 'formik';
import { Briefcase } from 'lucide-react';

interface Props {
  formikProps: FormikProps<any>;
}

export default function EmploymentInfo({ formikProps }: Props) {
  const { values, errors, touched, handleChange, handleBlur } = formikProps;

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="employment_status" className="block text-sm font-medium text-gray-700">
          Employment Status
        </label>
        <select
          id="employment_status"
          name="employment_status"
          value={values.employment_status}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select status</option>
          <option value="employed">Employed</option>
          <option value="self-employed">Self-employed</option>
          <option value="unemployed">Unemployed</option>
          <option value="retired">Retired</option>
        </select>
        {touched.employment_status && errors.employment_status && (
          <p className="mt-2 text-sm text-red-600">{errors.employment_status}</p>
        )}
      </div>

      <div>
        <label htmlFor="employment_length" className="block text-sm font-medium text-gray-700">
          Years in Current Employment
        </label>
        <input
          type="number"
          id="employment_length"
          name="employment_length"
          value={values.employment_length}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500"
        />
        {touched.employment_length && errors.employment_length && (
          <p className="mt-2 text-sm text-red-600">{errors.employment_length}</p>
        )}
      </div>

      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
          Industry
        </label>
        <input
          type="text"
          id="industry"
          name="industry"
          value={values.industry}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500"
        />
        {touched.industry && errors.industry && (
          <p className="mt-2 text-sm text-red-600">{errors.industry}</p>
        )}
      </div>

      <div>
        <label htmlFor="job_title" className="block text-sm font-medium text-gray-700">
          Job Title
        </label>
        <input
          type="text"
          id="job_title"
          name="job_title"
          value={values.job_title}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500"
        />
        {touched.job_title && errors.job_title && (
          <p className="mt-2 text-sm text-red-600">{errors.job_title}</p>
        )}
      </div>
    </div>
  );
}
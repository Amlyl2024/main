import React from 'react';
import { FormikProps } from 'formik';
import { Home, GraduationCap } from 'lucide-react';

interface Props {
  formikProps: FormikProps<any>;
}

export default function AdditionalInfo({ formikProps }: Props) {
  const { values, errors, touched, handleChange, handleBlur } = formikProps;

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="home_ownership" className="block text-sm font-medium text-gray-700">
          Home Ownership Status
        </label>
        <select
          id="home_ownership"
          name="home_ownership"
          value={values.home_ownership}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select status</option>
          <option value="own">Own</option>
          <option value="mortgage">Mortgage</option>
          <option value="rent">Rent</option>
        </select>
        {touched.home_ownership && errors.home_ownership && (
          <p className="mt-2 text-sm text-red-600">{errors.home_ownership}</p>
        )}
      </div>

      <div>
        <label htmlFor="education_level" className="block text-sm font-medium text-gray-700">
          Education Level
        </label>
        <select
          id="education_level"
          name="education_level"
          value={values.education_level}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select level</option>
          <option value="high_school">High School</option>
          <option value="bachelors">Bachelor's Degree</option>
          <option value="masters">Master's Degree</option>
          <option value="phd">PhD</option>
          <option value="other">Other</option>
        </select>
        {touched.education_level && errors.education_level && (
          <p className="mt-2 text-sm text-red-600">{errors.education_level}</p>
        )}
      </div>
    </div>
  );
}
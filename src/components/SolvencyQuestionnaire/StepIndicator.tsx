import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  title: string;
  description: string;
}

interface Props {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: Props) {
  return (
    <div className="p-6 border-b border-gray-200">
      <nav aria-label="Progress">
        <ol className="space-y-4 md:flex md:space-y-0 md:space-x-8">
          {steps.map((step, index) => (
            <li key={step.title} className="md:flex-1">
              <div className="flex flex-col md:pl-0">
                <span className="flex items-center text-sm font-medium">
                  <span className={`
                    flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full
                    ${index < currentStep
                      ? 'bg-primary-600'
                      : index === currentStep
                      ? 'border-2 border-primary-600'
                      : 'border-2 border-gray-300'
                    }
                    ${index <= currentStep ? 'text-white' : 'text-gray-500'}
                  `}>
                    {index < currentStep ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </span>
                  <span className={`ml-2 text-sm font-medium ${
                    index <= currentStep ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </span>
                <span className="mt-0.5 ml-8 md:ml-0 text-xs text-gray-500">
                  {step.description}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
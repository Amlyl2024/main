import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Star, TrendingUp, DollarSign, Clock, X } from 'lucide-react';

interface Props {
  rating: {
    credit_score: number;
    employment_score: number;
    income_score: number;
    debt_ratio_score: number;
    payment_history_score: number;
    overall_rating: number;
  };
  onClose: () => void;
}

export default function SuccessPopup({ rating, onClose }: Props) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Assessment Complete!</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700">
                <Star className="h-5 w-5 mr-2" />
                <span className="text-lg font-semibold">Overall Rating: {rating.overall_rating}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-gray-600 mb-1">
                  <Star className="h-4 w-4 mr-1" />
                  <span className="text-sm">Credit Score</span>
                </div>
                <p className="text-lg font-semibold">{rating.credit_score}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-gray-600 mb-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">Employment</span>
                </div>
                <p className="text-lg font-semibold">{rating.employment_score}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-gray-600 mb-1">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="text-sm">Income</span>
                </div>
                <p className="text-lg font-semibold">{rating.income_score}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-gray-600 mb-1">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">Payment History</span>
                </div>
                <p className="text-lg font-semibold">{rating.payment_history_score}</p>
              </div>
            </div>

            <div className="text-center text-sm text-gray-600">
              Based on your assessment, you're ready to proceed with your application.
            </div>

            <button
              onClick={() => navigate('/apply')}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Continue to Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
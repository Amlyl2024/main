import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface QuestionnaireInput {
  annual_income: number;
  employment_status: string;
  employment_length: number;
  monthly_expenses: number;
  existing_loans: number;
  home_ownership: string;
  credit_score: number;
  has_bankruptcies: boolean;
  bankruptcy_years: number | null;
  has_defaults: boolean;
  default_years: number | null;
  industry: string;
  job_title: string;
  education_level: string;
}

interface Rating {
  credit_score: number;
  employment_score: number;
  income_score: number;
  debt_ratio_score: number;
  payment_history_score: number;
  overall_rating: number;
}

export function useSolvencyQuestionnaire() {
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireInput | null>(null);
  const [rating, setRating] = useState<Rating | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  const fetchQuestionnaire = async () => {
    try {
      const { data, error } = await supabase
        .from('solvency_questionnaires')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setQuestionnaire(data || null);
    } catch (err: any) {
      console.error('Error fetching questionnaire:', err);
      setError(err.message);
    }
  };

  const fetchRating = async () => {
    try {
      const { data, error } = await supabase
        .from('user_ratings')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setRating(data || null);
    } catch (err: any) {
      console.error('Error fetching rating:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (user) {
      Promise.all([fetchQuestionnaire(), fetchRating()])
        .finally(() => setLoading(false));
    }
  }, [user]);

  const calculateRating = (values: QuestionnaireInput): Rating => {
    // Credit score rating (300-850 scale)
    const creditScore = values.credit_score;

    // Employment score based on status and length (0-100)
    let employmentScore = 0;
    if (values.employment_status === 'employed' || values.employment_status === 'self-employed') {
      employmentScore = Math.min(100, values.employment_length * 10);
    } else if (values.employment_status === 'retired') {
      employmentScore = 70;
    }

    // Income score relative to expenses (0-100)
    const monthlyIncome = values.annual_income / 12;
    const incomeToExpenseRatio = monthlyIncome / values.monthly_expenses;
    const incomeScore = Math.min(100, incomeToExpenseRatio * 25);

    // Debt ratio score (0-100)
    const totalDebt = values.existing_loans;
    const debtToIncomeRatio = (totalDebt / values.annual_income) * 100;
    const debtRatioScore = Math.max(0, 100 - debtToIncomeRatio);

    // Payment history score based on defaults and bankruptcies (0-100)
    let paymentHistoryScore = 100;
    if (values.has_defaults) {
      paymentHistoryScore -= Math.max(0, 50 - (values.default_years || 0) * 5);
    }
    if (values.has_bankruptcies) {
      paymentHistoryScore -= Math.max(0, 70 - (values.bankruptcy_years || 0) * 7);
    }
    paymentHistoryScore = Math.max(0, paymentHistoryScore);

    // Overall rating (weighted average, 0-100)
    const overallRating = Math.round(
      (((creditScore - 300) / 550) * 100 * 0.3) + // Convert credit score to 0-100 scale for weighting
      (employmentScore * 0.2) +
      (incomeScore * 0.2) +
      (debtRatioScore * 0.15) +
      (paymentHistoryScore * 0.15)
    );

    return {
      credit_score: creditScore,
      employment_score: Math.round(employmentScore),
      income_score: Math.round(incomeScore),
      debt_ratio_score: Math.round(debtRatioScore),
      payment_history_score: Math.round(paymentHistoryScore),
      overall_rating: Math.min(100, Math.max(0, overallRating))
    };
  };

  const submitQuestionnaire = async (values: QuestionnaireInput) => {
    try {
      const processedValues = {
        ...values,
        annual_income: Number(values.annual_income),
        employment_length: Number(values.employment_length),
        monthly_expenses: Number(values.monthly_expenses),
        existing_loans: Number(values.existing_loans),
        credit_score: Number(values.credit_score),
        bankruptcy_years: values.has_bankruptcies ? Number(values.bankruptcy_years) : null,
        default_years: values.has_defaults ? Number(values.default_years) : null,
      };

      // Calculate the new rating
      const newRating = calculateRating(processedValues);

      // First, submit the questionnaire
      const { error: questionnaireError } = await supabase
        .from('solvency_questionnaires')
        .upsert(
          {
            user_id: user?.id,
            ...processedValues
          },
          {
            onConflict: 'user_id'
          }
        );

      if (questionnaireError) throw questionnaireError;

      // Submit the rating
      const { error: ratingError } = await supabase
        .from('user_ratings')
        .upsert(
          {
            user_id: user?.id,
            ...newRating
          },
          {
            onConflict: 'user_id'
          }
        );

      if (ratingError) throw ratingError;
      
      // Refresh the data
      await Promise.all([
        fetchQuestionnaire(),
        fetchRating()
      ]);
      
      return { success: true, rating: newRating };
    } catch (error: any) {
      console.error('Error submitting questionnaire:', error);
      throw new Error('Failed to submit questionnaire. Please try again.');
    }
  };

  return {
    questionnaire,
    rating,
    loading,
    error,
    submitQuestionnaire
  };
}
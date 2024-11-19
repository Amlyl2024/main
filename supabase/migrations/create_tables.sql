-- Create solvency_questionnaires table
CREATE TABLE solvency_questionnaires (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  annual_income DECIMAL(12,2) NOT NULL,
  employment_status TEXT NOT NULL CHECK (employment_status IN ('employed', 'self-employed', 'unemployed', 'retired')),
  employment_length INTEGER NOT NULL,
  monthly_expenses DECIMAL(12,2) NOT NULL,
  existing_loans DECIMAL(12,2) NOT NULL,
  home_ownership TEXT NOT NULL CHECK (home_ownership IN ('own', 'mortgage', 'rent')),
  credit_score INTEGER CHECK (credit_score BETWEEN 300 AND 850),
  has_bankruptcies BOOLEAN NOT NULL,
  bankruptcy_years INTEGER,
  has_defaults BOOLEAN NOT NULL,
  default_years INTEGER,
  industry TEXT NOT NULL,
  job_title TEXT NOT NULL,
  education_level TEXT NOT NULL CHECK (education_level IN ('high_school', 'bachelors', 'masters', 'phd', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create user_ratings table
CREATE TABLE user_ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  credit_score INTEGER CHECK (credit_score BETWEEN 300 AND 850),
  employment_score INTEGER CHECK (employment_score BETWEEN 0 AND 100),
  income_score INTEGER CHECK (income_score BETWEEN 0 AND 100),
  debt_ratio_score INTEGER CHECK (debt_ratio_score BETWEEN 0 AND 100),
  payment_history_score INTEGER CHECK (payment_history_score BETWEEN 0 AND 100),
  overall_rating INTEGER CHECK (overall_rating BETWEEN 0 AND 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Rest of the file remains the same...
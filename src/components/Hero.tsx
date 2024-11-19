import React from 'react';
import { ArrowRight, Shield, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white pt-16">
      <div className="absolute inset-0 z-0">
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 transform opacity-20 hidden lg:block">
          <svg width="400" height="400" viewBox="0 0 500 500" fill="currentColor" className="text-primary-200">
            <path d="M250 100c-30 0-60 20-90 60-30-40-60-60-90-60s-60 20-90 60v240c30-40 60-60 90-60s60 20 90 60c30-40 60-60 90-60s60 20 90 60c30-40 60-60 90-60V160c-30 0-60 20-90 60-30-40-60-60-90-60z" />
          </svg>
        </div>
        <div className="absolute left-0 bottom-0 translate-y-12 -translate-x-12 transform opacity-20 hidden lg:block">
          <svg width="400" height="400" viewBox="0 0 500 500" fill="currentColor" className="text-primary-200">
            <path d="M250 200c-30 0-60 20-90 60-30-40-60-60-90-60s-60 20-90 60v140c30-40 60-60 90-60s60 20 90 60c30-40 60-60 90-60s60 20 90 60c30-40 60-60 90-60V260c-30 0-60 20-90 60-30-40-60-60-90-60z" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-12 sm:pb-16 text-center lg:pt-32 relative z-10">
        <h1 className="mx-auto max-w-4xl font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-slate-900">
          Lend and borrow
        </h1>
          <h1 className="mx-auto max-w-4xl font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-slate-900">
          <span className="relative whitespace-nowrap text-primary-600">
            <span className="relative"> 
              from people like you</span>
          </span>
        </h1>
        <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg tracking-tight text-slate-700">
          Connect borrowers with lenders directly. Get better rates, faster approvals, and a more transparent lending experience.
        </p>
        <div className="mt-6 sm:mt-10 flex justify-center">
          <Link
            to="/apply"
            className="group inline-flex items-center justify-center rounded-xl bg-primary-600 px-8 sm:px-10 py-3 sm:py-4 text-sm font-semibold text-white hover:bg-primary-500 hover:text-slate-100 transition"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="flex flex-col items-center p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
            <Shield className="h-10 sm:h-12 w-10 sm:w-12 text-primary-600 mb-4" />
            <h3 className="text-base sm:text-lg font-semibold">Bank-Level Security</h3>
            <p className="text-sm sm:text-base text-slate-600 text-center mt-2">Your investments are protected with the highest security standards</p>
          </div>
          <div className="flex flex-col items-center p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
            <LineChart className="h-10 sm:h-12 w-10 sm:w-12 text-primary-600 mb-4" />
            <h3 className="text-base sm:text-lg font-semibold">High Returns</h3>
            <p className="text-sm sm:text-base text-slate-600 text-center mt-2">Earn up to 12% annual returns on your investments</p>
          </div>
          <div className="hidden lg:flex flex-col items-center p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
            <Shield className="h-10 sm:h-12 w-10 sm:w-12 text-primary-600 mb-4" />
            <h3 className="text-base sm:text-lg font-semibold">Quick Process</h3>
            <p className="text-sm sm:text-base text-slate-600 text-center mt-2">Get funded within 24 hours of approval</p>
          </div>
        </div>
      </div>
    </div>
  );
}
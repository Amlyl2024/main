import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import Stats from './components/Stats';
import Footer from './components/Footer';
import LoanApplication from './components/LoanApplication';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import ApplicationsList from './components/Applications/ApplicationsList';
import AccountOverview from './components/Account/AccountOverview';
import AccountSettings from './components/Account/AccountSettings';
import SolvencyQuestionnaire from './components/SolvencyQuestionnaire';
import ProjectList from './components/Marketplace/ProjectList';
import ProjectDetails from './components/Marketplace/ProjectDetails';
import CreateProject from './components/Marketplace/CreateProject';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';

function ScrollToSection() {
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return null;
}

function App() {
  const checkUser = useAuthStore((state) => state.checkUser);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  return (
    <Router>
      <ScrollToSection />
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <HowItWorks />
              <Benefits />
              <Stats />
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/apply" element={
            <ProtectedRoute>
              <LoanApplication />
            </ProtectedRoute>
          } />
          <Route path="/applications" element={
            <ProtectedRoute>
              <ApplicationsList />
            </ProtectedRoute>
          } />
          <Route path="/account" element={
            <ProtectedRoute>
              <AccountOverview />
            </ProtectedRoute>
          } />
          <Route path="/account/settings" element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          } />
          <Route path="/solvency" element={
            <ProtectedRoute>
              <SolvencyQuestionnaire />
            </ProtectedRoute>
          } />
          <Route path="/marketplace" element={<ProjectList />} />
          <Route path="/marketplace/create" element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          } />
          <Route path="/projects/:id" element={<ProjectDetails />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
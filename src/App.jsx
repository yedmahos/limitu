import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { SpendingProvider } from './context/SpendingContext';
import LandingPage from './pages/LandingPage';
import HowItWorks from './pages/HowItWorks';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Simulation from './pages/Simulation';
import Insights from './pages/Insights';
import LimAI from './pages/LimAI';
import About from './pages/About';
import Team from './pages/Team';
import OTPVerification from './pages/OTPVerification';
import PhoneVerification from './pages/PhoneVerification';
import ForgotPassword from './pages/ForgotPassword';

import { UserProvider } from './context/UserContext';
import AppLayout from './components/layout/AppLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { PageLoader } from './components/ui/PageLoader';

// Inner component that uses useLocation
// Inner component that uses useLocation
function AppRoutes() {
  const [loading, setLoading] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState("Loading...");
  const location = useLocation();
  const { user } = useAuth();
  const prevUserRef = React.useRef(user);

  React.useEffect(() => {
    const prevUser = prevUserRef.current;
    const isLoggingIn = !prevUser && user;
    const isLoggingOut = prevUser && !user;
    const isPublicNav = !prevUser && !user;

    // Update ref for next render
    prevUserRef.current = user;

    if (isLoggingIn) {
      setLoadingMessage(user.name ? `Welcome back, ${user.name.split(' ')[0]}!` : "Welcome to Limit U!");
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1600); // Slightly longer for welcome
      return () => clearTimeout(timer);
    } else if (isLoggingOut) {
      setLoadingMessage("See you soon!");
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 900);
      return () => clearTimeout(timer);
    } else if (isPublicNav) {
      // Just navigating between public pages
      setLoadingMessage("Loading...");
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 600);
      return () => clearTimeout(timer);
    } else {
      // User is logged in and navigating (Dashboard -> Dashboard)
      // Ensure loader is off
      setLoading(false);
    }
  }, [location.pathname, user]);

  return (
    <>
      {loading && <PageLoader message={loadingMessage} />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/verify-phone" element={<PhoneVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/team" element={<Team />} />

        {/* Onboarding Logic - Keep separate if needed, or put under protected */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } />

        {/* Main App Layout - Protected */}
        <Route element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pay" element={<Simulation />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/lim-ai" element={<LimAI />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <SpendingProvider>
          <Router>
            <AppRoutes />
          </Router>
        </SpendingProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;

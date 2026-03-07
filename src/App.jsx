import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import { RouteProgressBar, PageTransition } from './components/PageTransition';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Simulator from './pages/Simulator';
import LimAI from './pages/LimAI';
import Insights from './pages/Insights';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import Team from './pages/Team';
import About from './pages/About';

function ProtectedRoute({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

function AnimatedRoutes() {
  const { user } = useApp();
  const location = useLocation();

  return (
    <PageTransition>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
        <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
        <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/simulator" element={<ProtectedRoute><Simulator /></ProtectedRoute>} />
        <Route path="/lim-ai" element={<ProtectedRoute><LimAI /></ProtectedRoute>} />
        <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/team" element={<Team />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PageTransition>
  );
}

function AppRoutes() {
  return (
    <>
      <RouteProgressBar />
      <Navbar />
      <AnimatedRoutes />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

// ✅ App.tsx (Fully Updated)
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/Auth/LoginForm';
import { SignupForm } from './components/Auth/SignupForm';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { BorrowerDashboard } from './components/Dashboard/BorrowDashboard';
import { LenderDashboard } from './components/Dashboard/LenderDashboard';

// ✅ Pages
import { ProfilePage } from './components/Pages/ProfilePage';
import { SettingsPage } from './components/Pages/SettingPage';
import { LendingStats } from './components/Pages/LendingStats';
import { NotificationsPage } from './components/Pages/NotificationPage';
import { HelpPage } from './components/Pages/HelpPage';
import { LiveTrackingPage } from './components/Pages/LiveTrackingPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
}

function AuthPage() {
  const { user } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
      {isLoginMode ? (
        <LoginForm onSwitchToSignup={() => setIsLoginMode(false)} />
      ) : (
        <SignupForm onSwitchToLogin={() => setIsLoginMode(true)} />
      )}
    </div>
  );
}

function MainApp() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const path = location.pathname;
  const activeTab = path.includes('/borrow')
    ? 'borrow'
    : path.includes('/lend')
    ? 'lend'
    : path.includes('/profile')
    ? 'profile'
    : path.includes('/settings')
    ? 'settings'
    : path.includes('/loan-history')
    ? 'loan-history'
    : path.includes('/improve-score')
    ? 'improve-score'
    : path.includes('/lending-stats')
    ? 'lending-stats'
    : path.includes('/notifications')
    ? 'notifications'
    : path.includes('/help')
    ? 'help'
    : path.includes('/language')
    ? 'language'
    : 'dashboard';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            window.location.href = `/dashboard/${tab === 'dashboard' ? '' : tab}`;
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 lg:ml-64 p-4">
          <Routes>
            <Route path="" element={<Dashboard />} />
            <Route path="borrow" element={<BorrowerDashboard />} />
            <Route path="lend" element={<LenderDashboard />} />
            <Route path="live-map" element={<LiveTrackingPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="lending-stats" element={<LendingStats />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="help" element={<HelpPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

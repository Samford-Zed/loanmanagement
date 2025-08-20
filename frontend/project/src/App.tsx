// src/App.tsx
import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { RequireAuth, RequireRole } from "./routes/RoleGuard";

// Public pages
import LandingPage from "./components/LandingPage";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";

// Layout (shared for admin & customer)
import Layout from "./components/Layout";

// Customer feature
import CustomerDashboard from "./components/customer/CustomerDashboard";

// Admin features (make sure these files exist exactly)
import AdminHome from "./components/admin/AdminHome";
import AdminApplications from "./components/admin/AdminApplications";
import AdminCustomersPage from "./components/admin/AdminCustomersPage";
import AdminReportsPage from "./components/admin/AdminReportsPage";
import AdminSettingsPage from "./components/admin/AdminSettingsPage";

/* ---------------- Helpers for auth pages (keeps your pretty background) ---------------- */

const AuthBG: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4'>
    {children}
  </div>
);

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <AuthBG>
      <LoginForm onToggleMode={() => navigate("/register")} />
    </AuthBG>
  );
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <AuthBG>
      <RegisterForm onToggleMode={() => navigate("/login")} />
    </AuthBG>
  );
};

/* ---------------- Shells pass view state into Layout ---------------- */

const CustomerShell: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>("dashboard");
  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {/* CustomerDashboard understands currentView and swaps its panels */}
      <CustomerDashboard currentView={currentView} />
    </Layout>
  );
};

const AdminShell: React.FC = () => {
  // default to Applications (change to "dashboard" if you prefer landing there)
  const [currentView, setCurrentView] = useState<string>("applications");
  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {currentView === "dashboard" && <AdminHome />}
      {currentView === "applications" && <AdminApplications />}
      {currentView === "customers" && <AdminCustomersPage />}
      {currentView === "reports" && <AdminReportsPage />}
      {currentView === "settings" && <AdminSettingsPage />}
    </Layout>
  );
};

/* ---------------- Routes ---------------- */

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public */}
      <Route
        path='/'
        element={
          <LandingPage
            onShowLogin={() => (window.location.href = "/login")}
            onShowRegister={() => (window.location.href = "/register")}
          />
        }
      />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />

      {/* Protected zones */}
      <Route element={<RequireAuth />}>
        {/* Admin */}
        <Route element={<RequireRole allowed={["ADMIN"]} />}>
          <Route path='/admin' element={<AdminShell />} />
        </Route>

        {/* Customer */}
        <Route element={<RequireRole allowed={["CUSTOMER"]} />}>
          <Route path='/app' element={<CustomerShell />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

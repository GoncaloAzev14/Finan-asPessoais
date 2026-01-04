import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Goals from './pages/Goals';
import CategorySettings from "./pages/CategorySettings";
import Login from './pages/Login';
import Landing from './pages/Landing';
import { useAuth } from "./contexts/AuthContext";
import { Toaster } from 'sonner';

function App() {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState("landing");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">A carregar...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // 1. Mostra a Landing Page
    if (authView === "landing") {
      return <Landing onNavigate={setAuthView} />;
    }
    
    // 2. Ou mostra o Login/Signup (com botão de voltar)
    return (
      <Login
        initialMode={authView} // 'login' ou 'signup'
        onBack={() => setAuthView("landing")}
      />
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/categories" element={<CategorySettings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
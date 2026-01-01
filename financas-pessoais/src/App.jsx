import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Goals from './pages/Goals';
import { useAuth } from "./contexts/AuthContext";
import Login from './pages/Login';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <Routes>
        {/* Dashboard Route */}
        <Route 
          path="/" 
          element={
            <Layout currentPageName="Dashboard">
              <Dashboard />
            </Layout>
          } 
        />

        {/* Transactions Route */}
        <Route 
          path="/transactions" 
          element={
            <Layout currentPageName="Transactions">
              <Transactions />
            </Layout>
          } 
        />

        {/* Goals Route */}
        <Route 
          path="/goals" 
          element={
            <Layout currentPageName="Goals">
              <Goals />
            </Layout>
          } 
        />

        {/* Fallback to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
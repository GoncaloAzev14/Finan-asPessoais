import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { LogIn } from "lucide-react";

export default function Login() {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center space-y-6">
        <h1 className="text-2xl font-bold">Bem-vindo ao FinanceApp</h1>
        <p className="text-slate-500">Faça login para gerir as suas finanças</p>
        <Button onClick={loginWithGoogle} className="w-full bg-slate-900">
          <LogIn className="w-4 h-4 mr-2" />
          Entrar com Google
        </Button>
      </div>
    </div>
  );
}
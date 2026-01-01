import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { LogIn, Wallet } from "lucide-react";

export default function Login() {
  const { login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(
        err.code === "auth/invalid-credential"
          ? "Email ou senha incorretos"
          : err.code === "auth/email-already-in-use"
          ? "Este email já está em uso"
          : err.code === "auth/weak-password"
          ? "A senha deve ter pelo menos 6 caracteres"
          : "Erro ao autenticar. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isRegistering ? "Criar Conta" : "Bem-vindo"}
          </h1>
          <p className="text-slate-500">
            {isRegistering
              ? "Crie sua conta para começar"
              : "Faça login para gerir as suas finanças"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-xl"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-slate-900 hover:bg-slate-800 rounded-xl"
          >
            {loading ? (
              "Carregando..."
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                {isRegistering ? "Criar Conta" : "Entrar"}
              </>
            )}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError("");
            }}
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            {isRegistering
              ? "Já tem uma conta? Fazer login"
              : "Não tem uma conta? Criar conta"}
          </button>
        </div>
      </div>
    </div>
  );
}
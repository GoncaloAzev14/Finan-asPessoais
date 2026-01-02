/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Wallet, Mail, Lock, ArrowRight, Chrome, Loader2 } from "lucide-react"; // Importado Loader2
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Novo estado para o clique no botão
  
  const { login, register, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  // Se o AuthContext ainda estiver a verificar a sessão inicial (onAuthStateChanged)
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium animate-pulse">A carregar...</p>
      </div>
    );
  }

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      setError("");
      await loginWithGoogle();
      navigate("/");
    } catch (error) {
      setError("Erro ao autenticar com Google.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate("/");
    } catch (err) {
      setError("Falha na autenticação. Verifique os seus dados.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/20 mb-6">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            {isLogin ? "Bem-vindo de volta" : "Criar conta"}
          </h1>
          <p className="text-slate-500 font-medium">
            Gerir as tuas finanças nunca foi tão simples.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-white">
          <div className="space-y-6">
            <Button 
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              variant="outline" 
              className="w-full h-14 rounded-2xl border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 text-slate-700 font-semibold shadow-none"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Chrome className="w-5 h-5 text-blue-500" />}
              Continuar com Google
            </Button>

            <div className="relative flex items-center py-2">
              <div className="grow border-t border-slate-100"></div>
              <span className="shrink mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">ou e-mail</span>
              <div className="grow border-t border-slate-100"></div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl font-medium border border-red-100 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <Input 
                    required
                    disabled={isSubmitting}
                    type="email" 
                    placeholder="exemplo@mail.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:bg-white transition-all shadow-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Palavra-passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <Input 
                    required
                    disabled={isSubmitting}
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:bg-white transition-all shadow-none"
                  />
                </div>
              </div>

              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2 group mt-6"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    A carregar...
                  </>
                ) : (
                  <>
                    {isLogin ? "Entrar" : "Registar"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        <div className="text-center mt-8">
          <button 
            disabled={isSubmitting}
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50"
          >
            {isLogin ? (
              <>Não tens conta? <span className="text-emerald-600">Regista-te aqui</span></>
            ) : (
              <>Já tens conta? <span className="text-emerald-600">Faz login</span></>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
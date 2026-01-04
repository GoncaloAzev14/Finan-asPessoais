/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Wallet, Mail, Lock, ArrowRight, Chrome, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast, Toaster } from "sonner";

export default function Login({ initialMode = "login", onBack }) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, register, loginWithGoogle } = useAuth();

  useEffect(() => {
    setIsLogin(initialMode === "login");
  }, [initialMode]);

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      setError("");
      await loginWithGoogle();
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
        toast.success("Bem-vindo de volta!");
      } else {
        await register(email, password);
        toast.success("Conta criada com sucesso!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Falha na autenticação", {
        description: "Verifique as suas credenciais e tente novamente."
      });
      setError("Falha na autenticação. Verifique os dados.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/20 mb-4">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
            {isLogin ? "Bem-vindo de volta" : "Criar conta"}
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Gerir as tuas finanças nunca foi tão simples.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl shadow-slate-200/50 border border-white">
          <div className="space-y-4">
            <Button
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              variant="outline"
              className="w-full h-11 rounded-xl border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 text-slate-700 font-semibold shadow-none text-sm"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Chrome className="w-4 h-4 text-blue-500" />}
              Continuar com Google
            </Button>

            <div className="relative flex items-center py-1">
              <div className="grow border-t border-slate-100"></div>
              <span className="shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ou e-mail</span>
              <div className="grow border-t border-slate-100"></div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs p-2.5 rounded-lg font-medium border border-red-100 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <Input
                    required
                    disabled={isSubmitting}
                    type="email"
                    placeholder="exemplo@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-slate-50/50 border-slate-100 rounded-xl focus:bg-white transition-all shadow-none text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Palavra-passe</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <Input
                    required
                    disabled={isSubmitting}
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 bg-slate-50/50 border-slate-100 rounded-xl focus:bg-white transition-all shadow-none text-sm"
                  />
                </div>
              </div>

              <Button 
                type="submit"
                disabled={isSubmitting}
                // Reduzido de h-14 para h-11 e mt-6 para mt-4
                className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2 group mt-4 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
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

        <div className="text-center mt-6">
          <button 
            disabled={isSubmitting}
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50"
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
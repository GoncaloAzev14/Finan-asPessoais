
/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Wallet, ArrowRight, CheckCircle2, ShieldCheck, PieChart } from "lucide-react";
import { Button } from "../components/ui/button";

export default function Landing({ onNavigate }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      
      {/* Background Decorativo */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-slate-900 rounded-b-[3rem] z-0" />
      <div className="absolute top-10 right-10 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl z-0" />
      <div className="absolute top-40 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl z-0" />

      <div className="relative z-10 flex-1 flex flex-col max-w-md mx-auto w-full px-6 pt-12 pb-8">
        
        {/* Header / Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-12"
        >
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">Finanças</span>
        </motion.div>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-white leading-[1.1] mb-6 tracking-tight"
          >
            Controlo total do teu <span className="text-emerald-400">dinheiro.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-lg font-medium leading-relaxed mb-8"
          >
            Gere receitas, despesas e metas numa única aplicação. Simples, rápida e intuitiva.
          </motion.p>

          {/* Card Flutuante de Exemplo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-6 shadow-2xl shadow-slate-900/20 border border-slate-100 mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-violet-50 rounded-2xl text-violet-600">
                <PieChart className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Poupança Mensal</p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Meta Atingida</p>
              </div>
              <div className="ml-auto">
                <span className="text-emerald-600 font-black">+ 450€</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-[75%] bg-violet-500 rounded-full" />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Progresso</span>
                <span>75%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Botões de Ação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <Button
            onClick={() => onNavigate("signup")}
            className="w-full h-16 rounded-4xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg tracking-wide shadow-xl shadow-slate-900/20 transition-all active:scale-95"
          >
            Criar Conta Gratuita
          </Button>
          
          <Button
            onClick={() => onNavigate("login")}
            variant="ghost"
            className="w-full h-16 rounded-4xl bg-white border border-slate-200 text-slate-700 font-bold text-lg hover:bg-slate-50 transition-all active:scale-95"
          >
            Já tenho conta
          </Button>
        </motion.div>

        {/* Footer Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex justify-center gap-6 text-slate-400"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Seguro
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" /> Gratuito
          </div>
        </motion.div>

      </div>
    </div>
  );
}
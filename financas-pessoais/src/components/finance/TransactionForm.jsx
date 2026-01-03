/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { firebaseDb } from "./../../api/firestoreClient";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./../ui/button";
import { Input } from "./../ui/input";
import { Label } from "./../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./../ui/select";
import { X, Plus, Minus, Repeat } from "lucide-react";

const defaultCategories = {
  income: [
    { value: "salary", label: "Salário" },
    { value: "freelance", label: "Freelance" },
    { value: "investments", label: "Investimentos" },
    { value: "other", label: "Outros" }
  ],
  expense: [
    { value: "food", label: "Alimentação" },
    { value: "transport", label: "Transporte" },
    { value: "housing", label: "Moradia" },
    { value: "utilities", label: "Contas" },
    { value: "health", label: "Saúde" },
    { value: "education", label: "Educação" },
    { value: "entertainment", label: "Lazer" },
    { value: "shopping", label: "Compras" },
    { value: "travel", label: "Viagem" },
    { value: "other", label: "Outros" }
  ]
};

export default function TransactionForm({ onSubmit, onClose, transaction }) {
  const [type, setType] = useState(transaction?.type || "expense");

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
  
  const { data: dbCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => firebaseDb.entities.Category.list()
  });

  const currentCategories = dbCategories.filter(c => c.type === type);
  const finalCategories = currentCategories.length > 0 
    ? currentCategories 
    : defaultCategories[type];

  const [formData, setFormData] = useState({
    description: transaction?.description || "",
    amount: transaction?.amount || "",
    category: transaction?.category || "",
    date: transaction?.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    isFixed: transaction?.isFixed || false,
    periodicity: transaction?.periodicity || "monthly"
  });

  const handleTypeChange = (newType) => {
    setType(newType);
    setFormData(prev => ({ ...prev, category: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      type,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString(),
      periodicity: formData.isFixed ? formData.periodicity : "none"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-white rounded-t-[2.5rem] sm:rounded-3xl w-full max-w-lg p-8 pb-10 space-y-6 shadow-2xl overflow-y-auto max-h-[95vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle visual para mobile */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-2 sm:hidden" />

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {transaction ? "Editar Item" : "Novo Registo"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full bg-slate-50 hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-500" />
          </Button>
        </div>

        {/* Seletor de Tipo Premium */}
        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => handleTypeChange("expense")}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs tracking-widest transition-all ${
              type === "expense" 
                ? "bg-white text-slate-900 shadow-md" 
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Minus className="w-4 h-4" /> DESPESA
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("income")}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs tracking-widest transition-all ${
              type === "income" 
                ? "bg-white text-emerald-600 shadow-md" 
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Plus className="w-4 h-4" /> RECEITA
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Descrição</Label>
            <Input
              placeholder="Ex: Assinatura Mensal"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="h-16 rounded-2xl bg-slate-50 border-none px-6 text-slate-900 font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-slate-900/5"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Valor</Label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black">€</span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="h-16 rounded-2xl bg-slate-50 border-none pl-10 text-xl font-black text-slate-900"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Data</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="h-16 rounded-2xl bg-slate-50 border-none px-4 font-bold text-slate-700"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger className="h-16 rounded-2xl bg-slate-50 border-none px-6 font-bold text-slate-700">
                <SelectValue placeholder="Escolher categoria" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                {finalCategories.map((cat) => (
                  <SelectItem key={cat.id || cat.value} value={cat.value} className="rounded-xl py-3 font-medium">
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recorrência com Estilo Card */}
          <div
            onClick={() => setFormData({ ...formData, isFixed: !formData.isFixed })}
            className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all cursor-pointer ${
              formData.isFixed 
                ? "bg-violet-50 border-violet-100" 
                : "bg-slate-50 border-transparent active:bg-slate-100"
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
              formData.isFixed ? "bg-violet-500 text-white" : "bg-slate-200 text-slate-400"
            }`}>
              <Repeat className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-slate-800">Transação Recorrente</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Lançamento automático</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              formData.isFixed ? "border-violet-500 bg-violet-500" : "border-slate-300"
            }`}>
              {formData.isFixed && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </div>
          
          <AnimatePresence>
            {formData.isFixed && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="pt-1"
              >
                <Select
                  value={formData.periodicity}
                  onValueChange={(value) => setFormData({ ...formData, periodicity: value })}
                >
                  <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-200 shadow-sm px-6 font-bold text-slate-600">
                    <SelectValue placeholder="Frequência" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="daily" className="rounded-xl">Diária</SelectItem>
                    <SelectItem value="weekly" className="rounded-xl">Semanal</SelectItem>
                    <SelectItem value="monthly" className="rounded-xl">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            style={{ backgroundColor: type === "income" ? "#10b981" : "#0f172a" }}
            className="w-full h-18 rounded-4xl font-black text-white text-md shadow-2xl shadow-slate-900/10 transition-all active:scale-95 mt-6 tracking-widest uppercase"
          >
            {transaction ? "Guardar Alterações" : `Adicionar ${type === "income" ? "Receita" : "Despesa"}`}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
}
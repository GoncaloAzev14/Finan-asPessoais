/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react"; // Adicionado useEffect
import { useQuery } from "@tanstack/react-query";
import { firebaseDb } from "./../../api/firestoreClient";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./../ui/button"; // Verificado caminho do componente
import { Input } from "./../ui/input";
import { Label } from "./../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./../ui/select";
import { X, Plus, Minus, Repeat, Info } from "lucide-react";

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
  // O estado 'type' controla a cor das abas e a cor do botão final
  const [type, setType] = useState(transaction?.type || "expense");
  
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

  // Importante: Limpar a categoria se mudar de tipo para não enviar uma categoria de despesa numa receita
  const handleTypeChange = (newType) => {
    setType(newType);
    setFormData(prev => ({ ...prev, category: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      type, // Usa o estado 'type' atualizado pelas abas
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-white rounded-t-[2.5rem] sm:rounded-4xl w-full max-w-md p-6 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold text-slate-900">
            {transaction ? "Editar Transação" : "Nova Transação"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Seletor de Tipo - Agora usa handleTypeChange */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => handleTypeChange("expense")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
              type === "expense" 
                ? "bg-white text-slate-900 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Minus className="w-4 h-4" />
            DESPESA
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("income")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
              type === "income" 
                ? "bg-white text-emerald-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Plus className="w-4 h-4" />
            RECEITA
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-2">
          {/* ... campos de input (Descrição, Valor, Categoria, Data) mantêm-se iguais ... */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Descrição</Label>
            <Input
              placeholder="Ex: Supermercado"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="h-14 rounded-2xl bg-slate-50 border-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Valor</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="h-14 rounded-2xl bg-slate-50 border-none pl-10 text-lg font-bold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none">
                <SelectValue placeholder="Seleciona uma categoria" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100">
                {finalCategories.map((cat) => (
                  <SelectItem key={cat.id || cat.value} value={cat.value} className="rounded-lg">
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Data</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="h-14 rounded-2xl bg-slate-50 border-none"
              required
            />
          </div>

          {/* SECÇÃO DE RECORRÊNCIA */}
          <div className="pt-2">
            <div
              onClick={() => setFormData({ ...formData, isFixed: !formData.isFixed })}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                formData.isFixed ? "bg-violet-50 border-violet-100" : "bg-slate-50 border-transparent"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                formData.isFixed ? "bg-violet-500 text-white" : "bg-slate-200 text-slate-400"
              }`}>
                <Repeat className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-700">Transação Recorrente</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Automatizar lançamentos</p>
              </div>
              <input type="checkbox" checked={formData.isFixed} readOnly className="hidden" />
            </div>
            
            <AnimatePresence>
              {formData.isFixed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 pt-3"
                >
                  <Select
                    value={formData.periodicity}
                    onValueChange={(value) => setFormData({ ...formData, periodicity: value })}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-white border-slate-200 shadow-sm">
                      <SelectValue placeholder="Frequência" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="daily">Diária</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* O BOTÃO AGORA REAGE AO ESTADO 'type' CORRETAMENTE */}
          <Button
            type="submit"
            style={{
              backgroundColor: type === "income" ? "#10b981" : "#0f172a", // Emerald-500 ou Slate-900
              color: "white"
            }}
            className={`w-full h-14 rounded-2xl font-bold shadow-lg transition-all active:scale-[0.98] ${
              type === "income" 
                ? "shadow-emerald-500/20" 
                : "shadow-slate-900/20"
            }`}
          >
            {transaction ? "Guardar Alterações" : `Adicionar ${type === "income" ? "Receita" : "Despesa"}`}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
}
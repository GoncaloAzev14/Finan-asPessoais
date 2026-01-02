/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./../ui/button";
import { Input } from "./../ui/input";
import { Label } from "./../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./../ui/select";
import { X, Plus, Minus, Repeat, Info } from "lucide-react";

const categories = {
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
  const [formData, setFormData] = useState(transaction || {
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    isFixed: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      type,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString()
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
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {transaction ? "Editar Transação" : "Nova Transação"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Seletor de Tipo */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
              type === "expense" 
                ? "bg-white text-slate-900 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Minus className="w-4 h-4" />
            Despesa
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
              type === "income" 
                ? "bg-white text-emerald-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Plus className="w-4 h-4" />
            Receita
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input
              placeholder="Ex: Supermercado"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="h-12 rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Valor</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="h-12 rounded-xl pl-12 text-lg font-semibold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories[type].map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="h-12 rounded-xl"
              required
            />
          </div>

          {/* CHECKBOX DE RECORRÊNCIA COM EXPLICAÇÃO */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-4 bg-violet-50 rounded-xl border border-violet-100">
              <input 
                type="checkbox" 
                id="isFixed" 
                checked={formData.isFixed}
                onChange={(e) => setFormData({ ...formData, isFixed: e.target.checked })}
                className="w-5 h-5 text-violet-600 rounded-md border-slate-300 focus:ring-violet-500"
              />
              <label htmlFor="isFixed" className="text-sm font-medium text-slate-700 flex items-center gap-2 cursor-pointer flex-1">
                <Repeat className="w-4 h-4 text-violet-500" />
                Transação Recorrente Mensal
              </label>
            </div>
            
            {formData.isFixed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100"
              >
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900">
                  Esta transação será automaticamente criada todo mês. 
                  Ideal para salário, aluguel, assinaturas, etc.
                </p>
              </motion.div>
            )}
          </div>

          <Button
            type="submit"
            className={`w-full h-12 rounded-xl font-semibold text-white transition-colors ${
              type === "income" 
                ? "bg-emerald-500 hover:bg-emerald-600" 
                : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            {transaction ? "Salvar Alterações" : `Adicionar ${type === "income" ? "Receita" : "Despesa"}`}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
}
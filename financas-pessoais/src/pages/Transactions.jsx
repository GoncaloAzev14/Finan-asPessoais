/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { firebaseDb as base44 } from "./../api/firestoreClient";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Search, Trash2, Edit2, List, BarChart3, Filter, ChevronDown } from "lucide-react";
import TransactionItem from "./../components/finance/TransactionItem";
import TransactionForm from "./../components/finance/TransactionForm";
import ExpenseChart from "./../components/finance/ExpenseChart";
import MonthlyChart from "./../components/finance/MonthlyChart";

export default function Transactions() {
  const [view, setView] = useState("list"); // 'list' ou 'chart'
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [editingTransaction, setEditingTransaction] = useState(null);
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => base44.entities.Transaction.list("-date"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Transaction.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Transaction.update(editingTransaction.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setEditingTransaction(null);
    },
  });

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDelete = (id) => {
    if (window.confirm("Tens a certeza que queres eliminar esta transação?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Seletor de Vista (On/Off) */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 w-full max-w-75">
          <button
            onClick={() => setView("list")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all ${
              view === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <List className="w-4 h-4" /> LISTA
          </button>
          <button
            onClick={() => setView("chart")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all ${
              view === "chart" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <BarChart3 className="w-4 h-4" /> GRÁFICO
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            {/* Cabeçalho e Filtros da Lista */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Histórico</h1>

              <div className="flex flex-row gap-2 w-full md:w-auto">
                {/* Barra de Pesquisa */}
                <div className="relative flex-1 sm:flex-none">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Pesquisar..."
                    className="pl-11 pr-4 h-11 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filtro de Tipo */}
                <div className="relative group min-w-30">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Filter className="w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                  </div>
                  <select
                    className="appearance-none w-full pl-9 pr-4 h-11 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all cursor-pointer"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">Todos</option>
                    <option value="income">Receitas</option>
                    <option value="expense">Despesas</option>
                  </select>

                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600 transition-colors">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Lista */}
            <div className="space-y-3">
              {isLoading ? (
                [1, 2, 3].map((i) => <div key={i} className="h-20 bg-white rounded-3xl animate-pulse border border-slate-100" />)
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-4xl border border-dashed border-slate-200">
                  <Wallet className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Sem registos encontrados</p>
                </div>
              ) : (
                filteredTransactions.map((transaction, index) => (
                  <div key={transaction.id} className="group relative">
                    <div className="transition-all duration-300 sm:group-hover:pr-24">
                      <TransactionItem transaction={transaction} index={index} />
                    </div>

                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-200 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTransaction(transaction);
                        }}
                        className="p-3 bg-white shadow-lg border border-slate-100 text-slate-400 hover:text-slate-900 rounded-2xl transition-all active:scale-90"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(transaction.id);
                        }}
                        className="p-3 bg-white shadow-lg border border-slate-100 text-slate-400 hover:text-red-600 rounded-2xl transition-all active:scale-90"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chart-view"
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
            className="space-y-6"
          >
            {/* Primeiro Gráfico: Distribuição/Despesas */}
            <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Distribuição por Categoria</h2>
              <ExpenseChart transactions={filteredTransactions} />
            </div>

            {/* Segundo Gráfico: Evolução Mensal */}
            <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Evolução Mensal</h2>
              <MonthlyChart transactions={filteredTransactions} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingTransaction && (
          <TransactionForm
            transaction={editingTransaction}
            onSubmit={(data) => updateMutation.mutate(data)}
            onClose={() => setEditingTransaction(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
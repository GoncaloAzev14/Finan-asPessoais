/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { firebaseDb as base44 } from "./../api/firestoreClient";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Search, List, BarChart3, Filter, ChevronDown, Calendar, Tag } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import TransactionItem from "./../components/finance/TransactionItem";
import TransactionForm from "./../components/finance/TransactionForm";
import ExpenseChart from "./../components/finance/ExpenseChart";
import MonthlyChart from "./../components/finance/MonthlyChart";
import { toast } from "sonner";

export default function Transactions() {
  const [view, setView] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Novos estados de filtro
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  
  const [editingTransaction, setEditingTransaction] = useState(null);
  const queryClient = useQueryClient();

  // 1. Buscar Transações
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => base44.entities.Transaction.list("-date"),
  });

  // 2. Buscar Categorias (para o filtro)
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => base44.entities.Category.list()
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Transaction.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transação eliminada.");
    },
    onError: () => toast.error("Erro ao eliminar."),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Transaction.update(editingTransaction.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setEditingTransaction(null);
      toast.success("Transação atualizada!");
    },
    onError: () => toast.error("Erro ao atualizar."),
  });

  // 3. Calcular Meses Disponíveis (baseado no histórico)
  const availableMonths = useMemo(() => {
    const months = new Set(transactions.map(t => t.date.substring(0, 7))); // "YYYY-MM"
    return Array.from(months).sort().reverse(); // Mais recentes primeiro
  }, [transactions]);

  // 4. Lógica de Filtragem Atualizada
  const filteredTransactions = transactions
    .filter((t) => {
      // Filtro de Texto
      const matchesSearch = t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           t.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro de Tipo (Receita/Despesa)
      const matchesType = filterType === "all" || t.type === filterType;

      // Filtro de Categoria (valor exato)
      const matchesCategory = filterCategory === "all" || t.category === filterCategory;

      // Filtro de Mês (compara string YYYY-MM)
      const matchesMonth = filterMonth === "all" || t.date.startsWith(filterMonth);

      return matchesSearch && matchesType && matchesCategory && matchesMonth;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleDelete = (id) => {
    toast.warning("Eliminar transação?", {
      description: "Esta ação não pode ser desfeita.",
      action: {
        label: "Eliminar",
        onClick: () => deleteMutation.mutate(id),
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Seletor de Vista */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 w-full max-w-75">
          <button onClick={() => setView("list")} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all ${view === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <List className="w-4 h-4" /> LISTA
          </button>
          <button onClick={() => setView("chart")} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all ${view === "chart" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <BarChart3 className="w-4 h-4" /> GRÁFICO
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div key="list-view" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
            
            {/* AREA DE FILTROS - Agora em Grid para mobile */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Pesquisar..." className="pl-11 pr-4 h-12 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>

              {/* Grid de Dropdowns */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                
                {/* 1. Filtro Mês */}
                <div className="relative group col-span-2 md:col-span-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"><Calendar className="w-4 h-4 text-slate-400" /></div>
                  <select 
                    className="appearance-none w-full pl-9 pr-8 h-12 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all cursor-pointer truncate"
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                  >
                    <option value="all">Meses</option>
                    {availableMonths.map(monthStr => (
                      <option key={monthStr} value={monthStr}>
                        {format(parseISO(monthStr + "-01"), "MMMM yyyy", { locale: ptBR })}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><ChevronDown className="w-4 h-4" /></div>
                </div>

                {/* 2. Filtro Categoria */}
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"><Tag className="w-4 h-4 text-slate-400" /></div>
                  <select 
                    className="appearance-none w-full pl-9 pr-8 h-12 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all cursor-pointer truncate"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="all">Categorias</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.value}>
                        {cat.icon || ""} {cat.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><ChevronDown className="w-4 h-4" /></div>
                </div>

                {/* 3. Filtro Tipo */}
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"><Filter className="w-4 h-4 text-slate-400" /></div>
                  <select 
                    className="appearance-none w-full pl-9 pr-8 h-12 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all cursor-pointer"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">Tipos</option>
                    <option value="income">Receitas</option>
                    <option value="expense">Despesas</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><ChevronDown className="w-4 h-4" /></div>
                </div>

              </div>
            </div>

            {/* LISTA DE TRANSAÇÕES */}
            <div className="space-y-3">
              {isLoading ? (
                [1, 2, 3].map((i) => <div key={i} className="h-20 bg-white rounded-3xl animate-pulse border border-slate-100" />)
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-4xl border border-dashed border-slate-200">
                  <Wallet className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Sem registos encontrados</p>
                  <p className="text-xs text-slate-400 mt-1">Tente ajustar os filtros selecionados</p>
                </div>
              ) : (
                filteredTransactions.map((transaction, index) => (
                  <TransactionItem 
                    key={transaction.id} 
                    transaction={transaction} 
                    index={index}
                    onEdit={setEditingTransaction} 
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="chart-view" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
            <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Distribuição por Categoria</h2>
              {/* O Gráfico também usa as transações filtradas! */}
              <ExpenseChart transactions={filteredTransactions} />
            </div>
            <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Evolução Mensal</h2>
              <MonthlyChart transactions={filteredTransactions} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DE EDIÇÃO */}
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
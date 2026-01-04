/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { firebaseDb as base44 } from "./../api/firestoreClient";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Search, List, BarChart3, Filter, ChevronDown, Calendar, Tag, X, Check, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import TransactionItem from "./../components/finance/TransactionItem";
import TransactionForm from "./../components/finance/TransactionForm";
import ExpenseChart from "./../components/finance/ExpenseChart";
import MonthlyChart from "./../components/finance/MonthlyChart";
import { Button } from "./../components/ui/button"; // Importar componente Button
import { toast } from "sonner";

export default function Transactions() {
  const [view, setView] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estados de Filtro
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  
  const [editingTransaction, setEditingTransaction] = useState(null);
  const queryClient = useQueryClient();

  // Queries e Mutações
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => base44.entities.Transaction.list("-date"),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => base44.entities.Category.list()
  });

  const filteredCategories = useMemo(() => {
    if (filterType === "all") return categories;
    return categories.filter(cat => cat.type === filterType);
  }, [categories, filterType]);

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

  // Calcular meses disponíveis
  const availableMonths = useMemo(() => {
    const months = new Set(transactions.map(t => t.date.substring(0, 7)));
    return Array.from(months).sort().reverse();
  }, [transactions]);

  // Lógica de Filtragem
  const filteredTransactions = transactions
    .filter((t) => {
      const matchesSearch = t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           t.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || t.type === filterType;
      const matchesCategory = filterCategory === "all" || t.category === filterCategory;
      const matchesMonth = filterMonth === "all" || t.date.startsWith(filterMonth);
      return matchesSearch && matchesType && matchesCategory && matchesMonth;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleDelete = (id) => {
    toast.warning("Eliminar transação?", {
      description: "Esta ação não pode ser desfeita.",
      action: { label: "Eliminar", onClick: () => deleteMutation.mutate(id) },
    });
  };

  // Conta quantos filtros estão ativos (diferentes de 'all')
  const activeFiltersCount = [filterType, filterCategory, filterMonth].filter(f => f !== "all").length;

  const clearFilters = () => {
    setFilterType("all");
    setFilterCategory("all");
    setFilterMonth("all");
    setIsFilterOpen(false);
    toast.info("Filtros limpos");
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
            
            {/* BARRA DE PESQUISA E BOTÃO DE FILTRO */}
            <div className="flex gap-3">
              {/* Barra de Pesquisa */}
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Pesquisar transações..." 
                  className="pl-12 pr-4 h-14 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all w-full shadow-sm" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>

              {/* Botão de Filtros Consolidado */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className={`h-14 px-5 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-sm active:scale-95 relative ${
                  activeFiltersCount > 0 
                    ? "bg-slate-900 text-white shadow-slate-900/20" 
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filtros</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-violet-500 text-white text-xs flex items-center justify-center rounded-full border-2 border-slate-50">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* LISTA DE TRANSAÇÕES */}
            <div className="space-y-3">
              {isLoading ? (
                [1, 2, 3].map((i) => <div key={i} className="h-20 bg-white rounded-3xl animate-pulse border border-slate-100" />)
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-4xl border border-dashed border-slate-200">
                  <Wallet className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Sem registos encontrados</p>
                  <button onClick={clearFilters} className="text-violet-600 font-bold text-sm mt-2 hover:underline">
                    Limpar filtros
                  </button>
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
             {/* Gráficos filtram com base nas transações filtradas */}
            <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Distribuição por Categoria</h2>
              <ExpenseChart transactions={filteredTransactions} />
            </div>
            <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Evolução Mensal</h2>
              <MonthlyChart transactions={filteredTransactions} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POPUP DE FILTROS (MODAL/BOTTOM SHEET) */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
            onClick={() => setIsFilterOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white rounded-t-[2.5rem] sm:rounded-3xl w-full max-w-md p-8 pb-10 space-y-6 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-2 sm:hidden" />
              
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Filtros</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)} className="rounded-full bg-slate-50">
                  <X className="w-5 h-5 text-slate-500" />
                </Button>
              </div>

              <div className="space-y-6">
                
                {/* 1. Filtro Tipo */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Movimento</label>
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
                    {["all", "expense", "income"].map((t) => (
                      <button
                        key={t}
                        onClick={() => {setFilterType(t); setFilterCategory("all");}}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                          filterType === t 
                            ? "bg-white text-slate-900 shadow-md" 
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        {t === "all" ? "Todos" : t === "expense" ? "Despesa" : "Receita"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Filtro Mês */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Período</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(e.target.value)}
                      className="w-full h-14 pl-12 pr-4 bg-slate-50 rounded-2xl font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-slate-900/5 outline-none"
                    >
                      <option value="all">Todo o histórico</option>
                      {availableMonths.map(monthStr => (
                        <option key={monthStr} value={monthStr}>
                          {format(parseISO(monthStr + "-01"), "MMMM yyyy", { locale: ptBR })}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* 3. Filtro Categoria */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full h-14 pl-12 pr-4 bg-slate-50 rounded-2xl font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-slate-900/5 outline-none"
                    >
                      <option value="all">Todas as categorias</option>
                      {filteredCategories.map(cat => (
                        <option key={cat.id} value={cat.value}>
                          {cat.icon || "🏷️"} {cat.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-3 pt-2">
                  <Button 
                    onClick={clearFilters}
                    variant="ghost" 
                    className="flex-1 h-14 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  >
                    Limpar
                  </Button>
                  <Button 
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-2 h-14 rounded-2xl bg-slate-900 text-white font-black tracking-widest uppercase shadow-xl shadow-slate-900/20 active:scale-95"
                  >
                    Aplicar Filtros
                  </Button>
                </div>

              </div>
            </motion.div>
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
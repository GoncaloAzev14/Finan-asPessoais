/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { firebaseDb as base44 } from "./../api/firestoreClient";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./../components/ui/button";
import { Wallet, TrendingUp, TrendingDown, Plus, ArrowRight, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./../utils";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { checkAndGenerateRecurring } from "./../utils";
import StatCard from "./../components/finance/StatCard";
import TransactionItem from "./../components/finance/TransactionItem";
import TransactionForm from "./../components/finance/TransactionForm";
import ExpenseChart from "./../components/finance/ExpenseChart";
import GoalCard from "./../components/finance/GoalCard";
import CategoryForm from "./../components/finance/CategoryForm";

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading: loadingTransactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => base44.entities.Transaction.list()
  });

  React.useEffect(() => {
    if (transactions.length > 0) {
      checkAndGenerateRecurring(transactions)
        .then(() => {
          // Opcional: Invalida a query para mostrar as novas transações geradas
          queryClient.invalidateQueries({ queryKey: ["transactions"] });
        })
        .catch(err => console.error("Erro ao gerar despesas fixas:", err));
    }
  }, [transactions, queryClient]);

  const { data: goals = [] } = useQuery({
    queryKey: ["goals"],
    queryFn: () => base44.entities.Goal.list("-created_date", 4)
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Transaction.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setShowForm(false);
    }
  });

  const currentMonth = {
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  };

  const monthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return isWithinInterval(date, currentMonth);
  });

  const totalIncome = monthTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = monthTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const formatCurrency = (value) => 
    `€ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-slate-500 mt-1">Visão geral das suas finanças</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-slate-900 hover:bg-slate-800 rounded-xl h-11 px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Saldo do Mês"
            value={formatCurrency(balance)}
            icon={Wallet}
            variant="balance"
          />
          <StatCard
            title="Receitas"
            value={formatCurrency(totalIncome)}
            icon={TrendingUp}
            variant="income"
          />
          <StatCard
            title="Despesas"
            value={formatCurrency(totalExpense)}
            icon={TrendingDown}
            variant="expense"
          />
        </div>

        {/* Charts & Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ExpenseChart transactions={monthTransactions} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Metas</h3>
              <Link
                to={createPageUrl("Goals")}
                className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1"
              >
                Ver todas <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {goals.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-slate-400">
                Nenhuma meta cadastrada
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {goals.slice(0, 2).map((goal, index) => (
                  <GoalCard key={goal.id} goal={goal} index={index} />
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Transações Recentes</h3>
            <Link
              to={createPageUrl("Transactions")}
              className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loadingTransactions ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-400">
              <Wallet className="w-12 h-12 mb-2 opacity-50" />
              <p>Nenhuma transação registrada</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction, index) => (
                <TransactionItem key={transaction.id} transaction={transaction} index={index} />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Transaction Form Modal */}
      <AnimatePresence>
        {showForm && (
          <TransactionForm
            key="transaction-modal"
            onSubmit={(data) => createMutation.mutate(data)}
            onClose={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { firebaseDb as base44 } from "./../api/firestoreClient";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./../components/ui/button";
import { Input } from "./../components/ui/input";
import { Label } from "./../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./../components/ui/select";
import { Progress } from "./../components/ui/progress";
import { Plus, X, Target, Plane, Home, Car, GraduationCap, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import GoalCard from "./../components/finance/GoalCard";

const icons = {
  target: Target,
  plane: Plane,
  home: Home,
  car: Car,
  education: GraduationCap,
  default: Sparkles
};

const iconOptions = [
  { value: "target", label: "Alvo", Icon: Target },
  { value: "plane", label: "Viagem", Icon: Plane },
  { value: "home", label: "Casa", Icon: Home },
  { value: "car", label: "Carro", Icon: Car },
  { value: "education", label: "Educação", Icon: GraduationCap },
  { value: "default", label: "Outro", Icon: Sparkles }
];

function GoalForm({ goal, onSubmit, onClose }) {
  const [formData, setFormData] = useState(goal || {
    name: "",
    target_amount: "",
    current_amount: 0,
    deadline: "",
    icon: "target"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      target_amount: parseFloat(formData.target_amount),
      current_amount: parseFloat(formData.current_amount || 0)
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
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {goal ? "Editar Meta" : "Nova Meta"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nome da Meta</Label>
            <Input
              placeholder="Ex: Viagem para Europa"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Ícone</Label>
            <Select
              value={formData.icon}
              onValueChange={(value) => setFormData({ ...formData, icon: value })}
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map(({ value, label, Icon }) => (
                  <SelectItem key={value} value={value}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Valor Alvo</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">€</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={formData.target_amount}
                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                className="h-12 rounded-xl pl-12 text-lg font-semibold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Valor Atual Economizado</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">€</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={formData.current_amount}
                onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                className="h-12 rounded-xl pl-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Data Limite (opcional)</Label>
            <Input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="h-12 rounded-xl"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl font-semibold bg-violet-600 hover:bg-violet-700"
          >
            {goal ? "Salvar Alterações" : "Criar Meta"}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function Goals() {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ["goals"],
    queryFn: () => base44.entities.Goal.list("-created_date", 50)
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Goal.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      setShowForm(false);
      toast.success("Meta criada com sucesso!");
    },
    onError: () => toast.error("Erro ao criar meta.")
  });
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Goal.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      setEditingGoal(null);
      toast.success("Meta atualizada!");
    },
    onError: () => toast.error("Erro ao atualizar meta.")
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Goal.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast.success("Meta eliminada.");
    },
    onError: () => toast.error("Erro ao eliminar meta.")
  });

  const totalTarget = goals.reduce((sum, g) => sum + g.target_amount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + (g.current_amount || 0), 0);

  const handleDeleteRequest = (id) => {
    toast.warning("Eliminar esta meta?", {
      description: "Esta ação não pode ser desfeita.",
      action: {
        label: "Eliminar",
        onClick: () => deleteMutation.mutate(id),
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 px-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Metas</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Acompanhe os seus objetivos financeiros</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-violet-600 hover:bg-violet-700 rounded-2xl h-12 px-6 font-bold shadow-lg shadow-violet-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      {/* Resumo de Progresso */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-linear-to-br from-violet-600 to-purple-700 rounded-4xl p-8 text-white shadow-xl shadow-violet-500/20 relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-violet-100 text-xs font-bold uppercase tracking-widest mb-1">Total Economizado</p>
              <p className="text-4xl font-black italic">
                € {totalSaved.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-violet-100 text-xs font-bold uppercase tracking-widest mb-1">Objetivo Final</p>
              <p className="text-xl font-bold opacity-80">
                € {totalTarget.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <Progress 
            value={totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0} 
            className="h-3 bg-white/20 rounded-full"
          />
          <div className="flex justify-between mt-3">
            <p className="text-sm font-bold text-violet-100">
              {totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : 0}% concluído
            </p>
          </div>
        </div>
        {/* Decorativo de fundo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
      </motion.div>

      {/* Grid de Metas */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm" />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div className="bg-white rounded-4xl p-16 text-center border border-dashed border-slate-200">
          <Target className="w-16 h-16 mx-auto text-slate-200 mb-4" />
          <p className="text-slate-500 font-bold">Ainda não tens metas definidas</p>
          <p className="text-sm text-slate-400 mt-1">Começa hoje a poupar para os teus sonhos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, index) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              index={index}
              onEdit={setEditingGoal}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {(showForm || editingGoal) && (
          <GoalForm
            goal={editingGoal}
            onSubmit={(data) => {
              if (editingGoal) {
                updateMutation.mutate({ id: editingGoal.id, data });
              } else {
                createMutation.mutate(data);
              }
            }}
            onClose={() => {
              setShowForm(false);
              setEditingGoal(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
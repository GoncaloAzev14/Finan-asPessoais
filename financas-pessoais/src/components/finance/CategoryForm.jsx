/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { firebaseDb } from "./../../api/firestoreClient";
import { useAuth } from "./../../contexts/AuthContext"; // Importar AuthContext
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./../ui/button";
import { Input } from "./../ui/input";
import { X, Plus, Trash2, Edit2, Check, LogOut, AlertTriangle } from "lucide-react";

export default function CategoryForm({ onClose }) {
  const queryClient = useQueryClient();
  const { logout } = useAuth(); // Obter função de logout
  const [newCategory, setNewCategory] = useState("");
  const [type, setType] = useState("expense");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => firebaseDb.entities.Category.list()
  });

  const createMutation = useMutation({
    mutationFn: (data) => firebaseDb.entities.Category.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      setNewCategory("");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => firebaseDb.entities.Category.delete(id),
    onSuccess: () => queryClient.invalidateQueries(["categories"])
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, label }) => 
      firebaseDb.entities.Category.update(id, { label, value: label.toLowerCase() }),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      setEditingId(null);
    }
  });

  const handleClearData = async () => {
    if (window.confirm("ATENÇÃO: Isto eliminará permanentemente todas as suas transações, metas e categorias. Deseja continuar?")) {
      try {
        await firebaseDb.clearAllUserData();
        queryClient.invalidateQueries();
        alert("Todos os dados foram eliminados.");
        onClose();
      } catch (error) {
        alert("Erro ao eliminar dados.");
      }
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    createMutation.mutate({ 
      label: newCategory, 
      value: newCategory.toLowerCase().replace(/\s+/g, '-'), 
      type 
    });
  };

  const filteredCategories = categories.filter(c => c.type === type);

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
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 space-y-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Definições</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* SECÇÃO: CATEGORIAS (O seu código original) */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Gestão de Categorias</h3>
          
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setType("expense")}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                type === "expense" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              }`}
            >
              Despesas
            </button>
            <button
              onClick={() => setType("income")}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                type === "income" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500"
              }`}
            >
              Receitas
            </button>
          </div>

          <form onSubmit={handleAdd} className="flex gap-2">
            <Input 
              placeholder="Nova categoria..." 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value)}
              className="h-11 rounded-xl"
            />
            <Button type="submit" className="h-11 rounded-xl px-4">
              <Plus className="w-4 h-4" />
            </Button>
          </form>

          <div className="space-y-2">
            {filteredCategories.length === 0 ? (
              <p className="text-center text-slate-400 py-4 text-sm">Nenhuma categoria personalizada</p>
            ) : (
              filteredCategories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  {editingId === cat.id ? (
                    <div className="flex gap-2 flex-1">
                      <Input 
                        value={editValue} 
                        onChange={(e) => setEditValue(e.target.value)}
                        className="h-9"
                        autoFocus
                      />
                      <Button size="icon" className="h-9 w-9" onClick={() => updateMutation.mutate({ id: cat.id, label: editValue })}>
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => setEditingId(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="text-slate-700 font-medium ml-2">{cat.label}</span>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400" onClick={() => { setEditingId(cat.id); setEditValue(cat.label); }}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-600" onClick={() => deleteMutation.mutate(cat.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* SECÇÃO: CONTA E PRIVACIDADE (Nova) */}
        <section className="pt-6 border-t border-slate-100 space-y-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Conta</h3>
          
          <div className="space-y-2">
            <button
              onClick={() => logout()}
              className="flex items-center gap-3 w-full p-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <LogOut className="w-4 h-4 text-slate-500" />
              </div>
              Terminar Sessão
            </button>

            <button
              onClick={handleClearData}
              className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              Eliminar Todos os Dados
            </button>
          </div>
        </section>
      </motion.div>
    </motion.div>
  );
}
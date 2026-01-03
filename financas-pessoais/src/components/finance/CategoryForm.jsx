/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { firebaseDb } from "./../../api/firestoreClient";
import { useAuth } from "./../../contexts/AuthContext";
import { motion } from "framer-motion";
import { Button } from "./../ui/button";
import { Input } from "./../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Importar Popover
import { X, Plus, Trash2, LogOut, AlertTriangle, ChevronRight, Smile } from "lucide-react";
import { toast } from "sonner";

// Lista de Emojis Sugeridos
const EMOJI_LIST = [
  "💰", "💸", "🏠", "🛒", "🚗", "⛽", "💊", "🎓",
  "✈️", "🍔", "🎮", "🎁", "💼", "📈", "🐾", "👶",
  "🔧", "💡", "📱", "💻", "👠", "🍺", "🏋️", "🎨"
];

export default function CategoryForm({ onClose }) {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const [newCategory, setNewCategory] = useState("");
  const [type, setType] = useState("expense");
  const [selectedIcon, setSelectedIcon] = useState("🏷️"); // Estado para o ícone
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => firebaseDb.entities.Category.list()
  });

  const createMutation = useMutation({
    mutationFn: (data) => firebaseDb.entities.Category.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      setNewCategory("");
      setSelectedIcon("🏷️"); // Reset do ícone
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => firebaseDb.entities.Category.delete(id),
    onSuccess: () => queryClient.invalidateQueries(["categories"])
  });

  const handleClearData = async () => {
    toast.error("Eliminar todos os dados?", {
      description: "Isto apagará permanentemente todo o seu histórico.",
      action: {
        label: "Confirmar",
        onClick: async () => {
          try {
            await firebaseDb.clearAllUserData();
            queryClient.invalidateQueries();
            toast.success("Todos os dados foram eliminados.");
            onClose();
          } catch (error) {
            toast.error("Erro ao eliminar dados.");
          }
        },
      },
    });
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if(newCategory) {
      createMutation.mutate({
        label: newCategory,
        value: newCategory.toLowerCase(),
        type,
        icon: selectedIcon // Envia o emoji
      });
    }
  };

  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        className="bg-white rounded-t-[2.5rem] sm:rounded-4xl w-full max-w-md flex flex-col max-h-[90vh] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Definições</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-8">
          
          {/* SECÇÃO: CATEGORIAS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Categorias</h3>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button onClick={() => setType("expense")} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${type === "expense" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>DESPESAS</button>
                <button onClick={() => setType("income")} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${type === "income" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500"}`}>RECEITAS</button>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-200/60 bg-white/50">
                <form onSubmit={handleAddCategory} className="flex gap-2">
                  {/* Seletor de Emoji */}
                  <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
                    <PopoverTrigger asChild>
                      <button type="button" className="w-10 h-10 flex items-center justify-center text-xl bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                        {selectedIcon}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2" align="start">
                      <div className="grid grid-cols-6 gap-1">
                        {EMOJI_LIST.map(emoji => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => { setSelectedIcon(emoji); setIsEmojiOpen(false); }}
                            className="p-2 hover:bg-slate-100 rounded-lg text-lg transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Input 
                    placeholder="Nome da categoria..." 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="border-none bg-transparent focus-visible:ring-0 h-10 px-0 placeholder:text-slate-400 flex-1"
                  />
                  <Button type="submit" size="sm" className="rounded-xl shadow-none bg-slate-900 hover:bg-slate-800">
                    <Plus className="w-4 h-4" />
                  </Button>
                </form>
              </div>

              <div className="divide-y divide-slate-200/60 max-h-60 overflow-y-auto">
                {filteredCategories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-4 group transition-colors hover:bg-white">
                    <div className="flex items-center gap-3">
                      {/* Exibe o emoji da categoria ou um fallback */}
                      <div className="w-8 h-8 rounded-lg bg-slate-200/50 flex items-center justify-center text-lg">
                        {cat.icon || "🏷️"}
                      </div>
                      <span className="text-slate-700 font-medium">{cat.label}</span>
                    </div>
                    <button 
                      onClick={() => {
                        toast.warning("Eliminar categoria?", {
                          description: "Esta ação não pode ser desfeita.",
                          action: {
                            label: "Eliminar",
                            onClick: () => deleteMutation.mutate(cat.id),
                          },
                        });
                      }} 
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECÇÃO: CONTA */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Conta e Privacidade</h3>
            <div className="bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden divide-y divide-slate-200/60">
              <button onClick={() => logout()} className="w-full flex items-center justify-between p-4 hover:bg-white transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-semibold text-slate-700">Terminar Sessão</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </button>

              <button onClick={handleClearData} className="w-full flex items-center justify-between p-4 hover:bg-white transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold text-red-600 block">Eliminar Dados</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Ação Irreversível</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </button>
            </div>
          </section>

        </div>
      </motion.div>
    </motion.div>
  );
}
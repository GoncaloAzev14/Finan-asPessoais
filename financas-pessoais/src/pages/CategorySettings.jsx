import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { firebaseDb } from "../api/firestoreClient";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Trash2, Edit2, X, Check } from "lucide-react";

const EMOJI_LIST = [
  "💰", "💸", "🏠", "🛒", "🚗", "⛽", "💊", "🎓", 
  "✈️", "🍔", "🎮", "🎁", "💼", "📈", "🐾", "👶", 
  "🔧", "💡", "📱", "💻", "👠", "🍺", "🏋️", "🎨"
];

export default function CategorySettings() {
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = useState("");
  const [type, setType] = useState("expense");
  const [selectedIcon, setSelectedIcon] = useState("🏷️");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
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
      setSelectedIcon("🏷️");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => firebaseDb.entities.Category.delete(id),
    onSuccess: () => queryClient.invalidateQueries(["categories"])
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, label }) => firebaseDb.entities.Category.update(id, { label, value: label.toLowerCase() }),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      setEditingId(null);
    }
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCategory) return;
    createMutation.mutate({ 
      label: newCategory, 
      value: newCategory.toLowerCase(), 
      type,
      icon: selectedIcon 
    });
  };

  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Gerir Categorias</h1>
        <p className="text-slate-500">Personalize as suas categorias de receitas e despesas.</p>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
        <button onClick={() => setType("expense")} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${type === "expense" ? "bg-white shadow text-slate-900" : "text-slate-500"}`}>Despesas</button>
        <button onClick={() => setType("income")} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${type === "income" ? "bg-white shadow text-emerald-600" : "text-slate-500"}`}>Receitas</button>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        {/* Seletor Emoji */}
        <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
          <PopoverTrigger asChild>
            <button type="button" className="w-10 h-10 flex items-center justify-center text-xl bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shrink-0">
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
          placeholder="Nome da nova categoria..." 
          value={newCategory} 
          onChange={(e) => setNewCategory(e.target.value)} 
          className="bg-white"
        />
        <Button type="submit"><Plus className="w-4 h-4 mr-2" /> Adicionar</Button>
      </form>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y">
        {filteredCategories.map((cat) => (
          <div key={cat.id} className="p-4 flex items-center justify-between">
            {editingId === cat.id ? (
              <div className="flex gap-2 flex-1 mr-4">
                <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                <Button size="icon" onClick={() => updateMutation.mutate({ id: cat.id, label: editValue })}><Check className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}><X className="w-4 h-4" /></Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 w-full">
                {/* Ícone */}
                <div className="w-8 h-8 flex items-center justify-center text-lg bg-slate-50 rounded-lg border border-slate-100">
                  {cat.icon || "🏷️"}
                </div>
                <span className="font-medium flex-1">{cat.label}</span>
                
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => { setEditingId(cat.id); setEditValue(cat.label); }}><Edit2 className="w-4 h-4 text-slate-400" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(cat.id)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Progress } from "./../ui/progress";
import { Target, Plane, Home, Car, GraduationCap, Sparkles, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const icons = {
  target: Target,
  plane: Plane,
  home: Home,
  car: Car,
  education: GraduationCap,
  default: Sparkles
};

export default function GoalCard({ goal, index, onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef(null);
  
  const Icon = icons[goal.icon] || icons.default;
  const progress = goal.target_amount > 0 
    ? Math.min(((goal.current_amount || 0) / goal.target_amount) * 100, 100)
    : 0;
  const remaining = goal.target_amount - (goal.current_amount || 0);

  // Lógica de Long Press
  const handleTouchStart = () => {
    timerRef.current = setTimeout(() => {
      setIsOpen(true);
      if (navigator.vibrate) navigator.vibrate(50);
    }, 600);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
          className="bg-white rounded-4xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all relative overflow-hidden cursor-pointer select-none"
        >
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-violet-600 transition-colors">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{goal.name}</h4>
                {goal.deadline && (
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    até {format(new Date(goal.deadline), "dd MMM yyyy", { locale: ptBR })}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Progress value={progress} className="h-2.5 rounded-full bg-slate-100" />
            
            <div className="flex items-end justify-between">
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Poupança</p>
                <p className="font-bold text-slate-900">€ {(goal.current_amount || 0).toLocaleString('pt-PT')}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-black text-violet-600 bg-violet-50 px-2 py-1 rounded-lg">
                  {progress.toFixed(0)}%
                </p>
              </div>
              <div className="text-right space-y-0.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Alvo</p>
                <p className="font-bold text-slate-900">€ {goal.target_amount.toLocaleString('pt-PT')}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </PopoverTrigger>

      <PopoverContent className="w-48 p-2 flex flex-col gap-1 shadow-xl border-slate-200">
        <button
          onClick={() => {
            setIsOpen(false);
            onEdit(goal);
          }}
          className="flex items-center gap-2 w-full p-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Pencil className="w-4 h-4" />
          Editar meta
        </button>
        <button
          onClick={() => {
            setIsOpen(false);
            onDelete(goal.id);
          }}
          className="flex items-center gap-2 w-full p-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar
        </button>
      </PopoverContent>
    </Popover>
  );
}
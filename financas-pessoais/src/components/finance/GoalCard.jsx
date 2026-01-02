/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Progress } from "./../ui/progress";
import { Target, Plane, Home, Car, GraduationCap, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const icons = {
  target: Target,
  plane: Plane,
  home: Home,
  car: Car,
  education: GraduationCap,
  default: Sparkles
};

export default function GoalCard({ goal, index }) {
  const Icon = icons[goal.icon] || icons.default;
  const progress = goal.target_amount > 0 
    ? Math.min(((goal.current_amount || 0) / goal.target_amount) * 100, 100)
    : 0;
  const remaining = goal.target_amount - (goal.current_amount || 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 text-white">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">{goal.name}</h4>
            {goal.deadline && (
              <p className="text-xs text-slate-500">
                até {format(new Date(goal.deadline), "MMM yyyy", { locale: ptBR })}
              </p>
            )}
          </div>
        </div>
        <span className="text-sm font-medium text-violet-600">{progress.toFixed(0)}%</span>
      </div>

      <Progress value={progress} className="h-2 mb-3" />

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">
          € {(goal.current_amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
        <span className="font-medium text-slate-900">
          € {goal.target_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      </div>
      
      {remaining > 0 && (
        <p className="text-xs text-slate-400 mt-2">
          Faltam € {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      )}
    </motion.div>
  );
}
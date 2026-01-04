/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { 
  Briefcase, Laptop, TrendingUp, Utensils, Car, Home,
  Zap, Heart, GraduationCap, Film, ShoppingBag, Plane,
  MoreHorizontal, Pencil, Trash2
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const categoryIcons = {
  salary: Briefcase,
  freelance: Laptop,
  investments: TrendingUp,
  food: Utensils,
  transport: Car,
  housing: Home,
  utilities: Zap,
  health: Heart,
  education: GraduationCap,
  entertainment: Film,
  shopping: ShoppingBag,
  travel: Plane,
  other: MoreHorizontal
};

const categoryLabels = {
  salary: "Salário",
  freelance: "Freelance",
  investments: "Investimentos",
  food: "Alimentação",
  transport: "Transporte",
  housing: "Moradia",
  utilities: "Contas",
  health: "Saúde",
  education: "Educação",
  entertainment: "Lazer",
  shopping: "Compras",
  travel: "Viagem",
  other: "Outros"
};

export default function TransactionItem({ transaction, index, onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef(null);

  const isEditable = !!onEdit || !!onDelete;

  const isIncome = transaction.type === "income";
  const hasCustomIcon = transaction.icon;
  const FallbackIcon = categoryIcons?.[transaction.category] || MoreHorizontal;
  
  const categoryLabel = categoryLabels?.[transaction.category] ||
                        (transaction.category ? transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1) : "Geral");

  const handleTouchStart = () => {
    if (!isEditable) return;

    timerRef.current = setTimeout(() => {
      setIsOpen(true);
      if (navigator.vibrate) navigator.vibrate(50);
    }, 600);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleAction = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    setTimeout(() => {
        if(action) action();
    }, 0);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          onTouchStart={isEditable ? handleTouchStart : undefined}
          onTouchEnd={isEditable ? handleTouchEnd : undefined}
          onMouseDown={isEditable ? handleTouchStart : undefined}
          onMouseUp={isEditable ? handleTouchEnd : undefined}
          onMouseLeave={isEditable ? handleTouchEnd : undefined}
          
          className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl border border-slate-100 active:bg-slate-50 transition-colors gap-3 sm:gap-0 ${
            isEditable ? "cursor-pointer select-none" : ""
          }`}
        >
          <div className="flex items-center gap-4 w-full">
            {/* Ícone */}
            <div className={`w-12 h-12 flex items-center justify-center rounded-xl shrink-0 text-xl border ${
              isIncome
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                : 'bg-slate-50 text-slate-600 border-slate-100'
            }`}>
              {hasCustomIcon ? (
                <span>{transaction.icon}</span>
              ) : (
                <FallbackIcon className="w-5 h-5" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 wrap-break-word leading-tight">
                {transaction.description}
              </p>
              <p className="text-sm text-slate-500 mt-0.5">
                {categoryLabel} • {format(new Date(transaction.date), "dd MMM", { locale: ptBR })}
              </p>
            </div>
          </div>

          <p className={`font-bold text-lg whitespace-nowrap self-end sm:self-auto ${
            isIncome ? 'text-emerald-600' : 'text-slate-900'
          }`}>
            {isIncome ? '+' : '-'} € {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </motion.div>
      </PopoverTrigger>

      {/* Conteúdo do Menu Popover */}
      {isEditable && (
        <PopoverContent className="w-48 p-2 flex flex-col gap-1 shadow-xl border-slate-200 z-50 bg-white">
          <div
            onClick={(e) => handleAction(e, () => onEdit && onEdit(transaction))}
            onTouchEnd={(e) => handleAction(e, () => onEdit && onEdit(transaction))}
            className="flex items-center gap-2 w-full p-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
            Editar item
          </div>
          <div
            onClick={(e) => handleAction(e, () => onDelete && onDelete(transaction.id))}
            onTouchEnd={(e) => handleAction(e, () => onDelete && onDelete(transaction.id))}
            className="flex items-center gap-2 w-full p-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}
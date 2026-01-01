import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { 
  Briefcase, Laptop, TrendingUp, Utensils, Car, Home, 
  Zap, Heart, GraduationCap, Film, ShoppingBag, Plane, MoreHorizontal 
} from "lucide-react";

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

export default function TransactionItem({ transaction, index }) {
  const Icon = categoryIcons[transaction.category] || MoreHorizontal;
  const isIncome = transaction.type === "income";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${
          isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-medium text-slate-900">{transaction.description}</p>
          <p className="text-sm text-slate-500">
            {categoryLabels[transaction.category]} • {format(new Date(transaction.date), "dd MMM", { locale: ptBR })}
          </p>
        </div>
      </div>
      <p className={`font-semibold ${isIncome ? 'text-emerald-600' : 'text-slate-900'}`}>
        {isIncome ? '+' : '-'} R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </p>
    </motion.div>
  );
}
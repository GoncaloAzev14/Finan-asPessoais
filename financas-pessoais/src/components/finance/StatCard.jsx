/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

export default function StatCard({ title, value, icon: Icon, trend, trendValue, variant = "default" }) {
  const variants = {
    default: "bg-white",
    income: "bg-gradient-to-br from-emerald-50 to-emerald-100/50",
    expense: "bg-gradient-to-br from-rose-50 to-rose-100/50",
    balance: "bg-gradient-to-br from-slate-900 to-slate-800 text-white"
  };

  const iconVariants = {
    default: "bg-slate-100 text-slate-600",
    income: "bg-emerald-500 text-white",
    expense: "bg-rose-500 text-white",
    balance: "bg-white/20 text-white"
  };

  const valueColors = {
    default: "text-slate-900",
    income: "text-emerald-600",
    expense: "text-rose-600",
    balance: "text-white"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${variants[variant]} rounded-2xl p-5 shadow-sm border border-slate-100/50`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className={`text-sm font-medium ${variant === 'balance' ? 'text-slate-300' : 'text-slate-500'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold tracking-tight ${valueColors[variant]}`}>
            {value}
          </p>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium ${
              trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              <span>{trend === 'up' ? '↑' : '↓'}</span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconVariants[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
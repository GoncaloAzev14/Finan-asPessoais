/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ArrowLeftRight, Target, Wallet, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CategoryForm from "./../components/finance/CategoryForm";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Transações", icon: ArrowLeftRight, path: "/transactions" },
  { name: "Metas", icon: Target, path: "/goals" },
];

export default function Layout({ children }) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-100 flex-col z-40">
        <div className="p-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Finanças</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}

          {/* Botão de Categorias Desktop */}
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-600 hover:bg-slate-100 mt-auto"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Categorias</span>
          </button>
        </nav>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-100 z-40">
        <div className="flex items-center justify-center h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">Finanças</span>
          </Link>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-40">
        <div className="flex items-center justify-around h-16 relative">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-1 relative px-4 py-2"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-900 rounded-full"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
                <item.icon 
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "text-slate-900" : "text-slate-400"
                  }`} 
                />
                <span 
                  className={`text-xs font-medium transition-colors ${
                    isActive ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}

          {/* Botão de Categorias Mobile */}
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex flex-col items-center gap-1 px-4 py-2"
          >
            <Settings className="w-5 h-5 text-slate-400" />
            <span className="text-xs font-medium text-slate-400">Categorias</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 pb-20 lg:pb-0">
        {children}
      </main>

      {/* Modal de Categorias */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <CategoryForm onClose={() => setIsCategoryModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
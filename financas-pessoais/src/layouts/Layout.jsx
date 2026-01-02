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
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const location = useLocation();

  // Encontra o nome da página atual com base no path
  const currentPage = navItems.find(item => item.path === location.pathname) || { name: "Finanças" };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-100 flex-col z-40">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          {/* Título da Aba Animado (Substitui o Logo) */}
          <div className="relative h-8 flex items-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={location.pathname}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-2xl font-bold text-slate-900 whitespace-now nowrap"
              >
                {currentPage.name}
              </motion.span>
            </AnimatePresence>
          </div>

          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-100 z-40">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Título da Aba Animado Mobile */}
          <div className="relative h-full flex items-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={location.pathname}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-lg font-bold text-slate-900"
              >
                {currentPage.name}
              </motion.span>
            </AnimatePresence>
          </div>

          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
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
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon 
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "text-slate-900" : "text-slate-400"
                  }`} 
                />
                <span className={`text-xs font-medium transition-colors ${
                    isActive ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="lg:pl-64 pt-16 lg:pt-0 pb-20 lg:pb-0">
        {children}
      </main>

      <AnimatePresence>
        {isSettingsModalOpen && (
          <CategoryForm onClose={() => setIsSettingsModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
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

  const currentPage = navItems.find(item => item.path === location.pathname) || { name: "Finanças" };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-100 flex-col z-40">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Finanças</span>
          </Link>
          
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-semibold">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Dynamic Header - Integrado no conteúdo */}
        <header className="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 sm:h-24 flex items-center justify-between">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={location.pathname}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
                >
                  {currentPage.name}
                </motion.h1>
              </AnimatePresence>
            </div>

            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 px-6 sm:px-8 pb-24 lg:pb-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 h-16 bg-slate-900/95 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl z-40 px-4">
        <div className="flex items-center justify-around h-full relative">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center gap-1 relative px-4"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabMobile"
                    className="absolute -bottom-1 w-8 h-1 bg-emerald-400 rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon 
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "text-emerald-400" : "text-slate-400"
                  }`} 
                />
                <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    isActive ? "text-white" : "text-slate-500"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <AnimatePresence>
        {isSettingsModalOpen && (
          <CategoryForm onClose={() => setIsSettingsModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
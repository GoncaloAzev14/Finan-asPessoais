/* eslint-disable no-unused-vars */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AlertDialog({ open, onOpenChange, children }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function AlertDialogContent({ children }) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
    >
      {children}
    </motion.div>
  );
}

export function AlertDialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function AlertDialogTitle({ children }) {
  return <h2 className="text-lg font-semibold text-slate-900">{children}</h2>;
}

export function AlertDialogDescription({ children }) {
  return <p className="text-sm text-slate-500 mt-2">{children}</p>;
}

export function AlertDialogFooter({ children }) {
  return <div className="flex justify-end gap-2 mt-6">{children}</div>;
}

export function AlertDialogCancel({ children }) {
  return (
    <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
      {children}
    </button>
  );
}

export function AlertDialogAction({ children, className = '', onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
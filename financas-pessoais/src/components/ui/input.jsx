// src/components/ui/input.jsx
import React from 'react';

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`
        w-full px-4 py-2 
        border border-slate-200 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent
        disabled:opacity-50 disabled:cursor-not-allowed
        placeholder:text-slate-400
        ${className}
      `}
      {...props}
    />
  );
}
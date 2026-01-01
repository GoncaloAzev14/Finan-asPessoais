// src/components/ui/progress.jsx
import React from 'react';

export function Progress({ value = 0, className = '' }) {
  const percentage = Math.min(100, Math.max(0, value));
  
  return (
    <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-300 ease-out rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
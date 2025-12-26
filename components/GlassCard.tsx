
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, active, onClick, className = '' }) => {
  return (
    <div
      onClick={onClick}
      className={`
        backdrop-blur-xl transition-all duration-300 cursor-pointer p-4 rounded-2xl border
        ${active 
          ? 'bg-blue-600/30 border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
          : 'bg-slate-800/40 border-white/5 hover:border-white/10'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const Button: React.FC<{ onClick: () => void; children: React.ReactNode; primary?: boolean }> = ({ onClick, children, primary }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-8 py-4 rounded-full font-medium tracking-wide transition-all active:scale-95
        ${primary 
          ? 'bg-blue-500 text-white shadow-[0_4px_15px_rgba(59,130,246,0.4)]' 
          : 'bg-white/10 text-white border border-white/10'}
      `}
    >
      {children}
    </button>
  );
};

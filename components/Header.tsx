
import React from 'react';
import { LayoutDashboard, History, Calendar, Settings } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-1.5 rounded-lg">
              <LayoutDashboard className="text-slate-900" size={24} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                CustomBet<span className="text-emerald-500">14</span>
              </h1>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest leading-none">
                Elite Football AI
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm font-medium text-emerald-500 hover:text-emerald-400 flex items-center gap-2">
              <Calendar size={18} /> Hoje
            </a>
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2">
              <History size={18} /> Histórico
            </a>
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2">
              <Settings size={18} /> Ajustes
            </a>
          </nav>

          <div className="flex items-center gap-3">
             <div className="hidden sm:block text-right">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Status</p>
                <div className="flex items-center justify-end gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-500">Live Data</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

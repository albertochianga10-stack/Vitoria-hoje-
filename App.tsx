
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import MatchCard from './components/MatchCard';
import { fetchFootballPredictions } from './services/geminiService';
import { BettingAppState, PredictionSlip } from './types';
import { Calendar as CalendarIcon, Loader2, Sparkles, Share2, Download, AlertTriangle, ExternalLink, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<BettingAppState>({
    currentSlip: null,
    loading: false,
    error: null,
    selectedDate: new Date().toISOString().split('T')[0]
  });

  const loadPredictions = useCallback(async (date: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const slip = await fetchFootballPredictions(date);
      setState(prev => ({ ...prev, currentSlip: slip, loading: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  }, []);

  useEffect(() => {
    loadPredictions(state.selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setState(prev => ({ ...prev, selectedDate: newDate }));
    loadPredictions(newDate);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            
            {/* Control Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="date"
                    value={state.selectedDate}
                    onChange={handleDateChange}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100"
                  />
                  <CalendarIcon className="absolute right-3 top-2.5 text-slate-500 pointer-events-none" size={16} />
                </div>
                <button
                  onClick={() => loadPredictions(state.selectedDate)}
                  disabled={state.loading}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all flex items-center gap-2"
                >
                  {state.loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                  Atualizar Ficha
                </button>
              </div>

              {state.currentSlip && (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Média Confiança</p>
                    <p className="text-lg font-bold text-emerald-400">{state.currentSlip.averageProbability}%</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-300 transition-colors">
                      <Share2 size={18} />
                    </button>
                    <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-300 transition-colors">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Error State */}
            {state.error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl flex flex-col items-center text-center gap-4">
                <AlertTriangle className="text-rose-500" size={48} />
                <div>
                  <h3 className="text-lg font-bold text-rose-500">Ocorreu um problema</h3>
                  <p className="text-slate-400 max-w-md">{state.error}</p>
                </div>
                <button 
                  onClick={() => loadPredictions(state.selectedDate)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-semibold border border-slate-700"
                >
                  Tentar Novamente
                </button>
              </div>
            )}

            {/* Loading State */}
            {state.loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-slate-900 rounded-xl animate-pulse border border-slate-800" />
                ))}
              </div>
            )}

            {/* Results Grid */}
            {!state.loading && !state.error && state.currentSlip && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {state.currentSlip.matches.map((match, idx) => (
                  <MatchCard key={match.id} match={match} index={idx} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Summary & Sources */}
          <aside className="lg:w-80 space-y-6">
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <LayoutDashboard className="text-emerald-500" size={20} />
                Resumo da Ficha
              </h2>
              
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Jogos Selecionados</span>
                    <span className="text-sm font-bold text-slate-200">14 / 14</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-full" />
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-tighter mb-2 block">Top Pick da IA</span>
                  {state.currentSlip?.matches[0] && (
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-100">
                        {state.currentSlip.matches[0].homeTeam} vs {state.currentSlip.matches[0].awayTeam}
                      </p>
                      <p className="text-xs text-emerald-400 font-semibold">
                        {state.currentSlip.matches[0].customBet[0].name}
                      </p>
                    </div>
                  )}
                </div>

                {state.currentSlip?.groundingSources && state.currentSlip.groundingSources.length > 0 && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-tighter mb-3 block">Fontes de Dados (Real-time)</span>
                    <ul className="space-y-2">
                      {state.currentSlip.groundingSources.slice(0, 3).map((source, idx) => (
                        <li key={idx}>
                          <a 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center justify-between gap-2 group"
                          >
                            <span className="truncate">{source.title}</span>
                            <ExternalLink size={10} className="shrink-0 opacity-50 group-hover:opacity-100" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800">
                   <p className="text-[10px] text-slate-500 text-center leading-relaxed italic">
                    *As probabilidades são estimativas baseadas em IA. Jogue com responsabilidade.
                   </p>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
             <div className="bg-emerald-500 p-1 rounded">
               <LayoutDashboard size={16} className="text-slate-900" />
             </div>
             <span className="font-bold text-slate-200">CustomBet 14</span>
          </div>
          <p className="text-slate-500 text-xs">
            © 2024 CustomBet AI. Todos os direitos reservados. 
            Desenvolvido com tecnologia de ponta para análise preditiva de futebol.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;

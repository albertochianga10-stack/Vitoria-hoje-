
import React from 'react';
import { Match } from '../types';
import { Trophy, Clock, Target, TrendingUp, Info } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  index: number;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, index }) => {
  const getProbColor = (prob: number) => {
    if (prob >= 80) return 'text-emerald-400';
    if (prob >= 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getProbBg = (prob: number) => {
    if (prob >= 80) return 'bg-emerald-500/10 border-emerald-500/20';
    if (prob >= 60) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 transition-all hover:bg-slate-800 hover:border-slate-600 group relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 rotate-45 opacity-20 bg-gradient-to-br from-emerald-500 to-blue-500 transition-transform group-hover:scale-110`} />
      
      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-700 text-xs font-bold text-slate-300">
            {index + 1}
          </span>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {match.league}
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Clock size={12} />
          <span className="text-xs font-semibold">{match.time}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 mb-4 relative z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100 truncate flex-1">{match.homeTeam}</h3>
          <span className="text-xs text-slate-500 px-2 italic">vs</span>
          <h3 className="text-lg font-bold text-slate-100 truncate flex-1 text-right">{match.awayTeam}</h3>
        </div>
      </div>

      <div className="space-y-2 relative z-10">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-tighter mb-1">
          <Target size={14} />
          CustomBet Inteligente
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {match.customBet.map((market, mIdx) => (
            <div key={mIdx} className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3">
              <p className="text-sm font-semibold text-slate-200">{market.name}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{market.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={`mt-4 pt-3 border-t border-slate-700 flex flex-col gap-2 relative z-10`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={14} className={getProbColor(match.probability)} />
            <span className={`text-sm font-bold ${getProbColor(match.probability)}`}>
              {match.probability}% Confiança
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 cursor-help group/info">
            <Info size={14} />
            <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-900 text-[10px] text-slate-300 rounded shadow-xl opacity-0 group-hover/info:opacity-100 pointer-events-none transition-opacity border border-slate-700 z-50">
              Insight: {match.insight}
            </div>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 italic line-clamp-2">
          "{match.insight}"
        </p>
      </div>
    </div>
  );
};

export default MatchCard;

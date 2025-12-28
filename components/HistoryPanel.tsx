
import React from 'react';
import { HistoryItem } from '../types';

interface Props {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

const HistoryPanel: React.FC<Props> = ({ history, onSelect }) => {
  if (history.length === 0) {
    return (
      <div className="border-2 border-black p-24 text-center bg-slate-50">
        <i className="fas fa-history text-4xl text-slate-200 mb-6"></i>
        <h3 className="text-xl font-bold uppercase text-slate-400">Archive Empty</h3>
        <p className="text-xs font-mono text-slate-300 mt-2 uppercase">Completed simulations will be cataloged here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {history.map((item) => (
        <div key={item.id} className="border-2 border-black bg-white hover:shadow-[12px_12px_0px_rgba(0,0,0,0.05)] transition-all flex flex-col">
          <div className="p-4 border-b border-black bg-slate-50 flex justify-between items-center">
            <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">Run ID: {item.id}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              {new Date(item.timestamp).toLocaleDateString()}
            </span>
          </div>
          
          <div className="p-6 flex-1 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Objective</h4>
              <p className="text-sm font-serif italic line-clamp-2 text-black leading-snug">
                {item.input.description || "No objective stated."}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Main Product</h4>
                <p className="text-xs font-bold text-black truncate uppercase">{item.result.products[0]?.name || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Success Score</h4>
                <p className="text-xs font-bold text-black">{item.result.feasibilityScore}%</p>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-2">
              {item.input.reactants.slice(0, 3).map((r, i) => (
                <div key={i} className="w-6 h-6 border border-slate-200 bg-white flex items-center justify-center text-[8px] font-mono text-slate-400 uppercase" title={r.name}>
                  {r.name?.charAt(0)}
                </div>
              ))}
              {item.input.reactants.length > 3 && <span className="text-[9px] text-slate-300 font-bold">+{item.input.reactants.length - 3} More</span>}
            </div>
          </div>

          <button 
            onClick={() => onSelect(item)}
            className="w-full py-4 border-t-2 border-black text-xs font-bold uppercase tracking-widest bg-white hover:bg-black hover:text-white transition-all"
          >
            Restore Session
          </button>
        </div>
      ))}
    </div>
  );
};

export default HistoryPanel;


import React from 'react';
import { Molecule } from '../types';

interface Props {
  onAdd: (m: Molecule) => void;
  inventory: { [category: string]: Molecule[] };
}

const ChemicalLibrary: React.FC<Props> = ({ onAdd, inventory }) => {
  const handleSelect = (category: string, molIdx: number) => {
    const selectedMol = inventory[category][molIdx];
    if (selectedMol) {
      onAdd(selectedMol);
    }
  };

  return (
    <div className="bg-white border-2 border-black p-8 space-y-8 shadow-[8px_8px_0px_rgba(0,0,0,0.05)]">
      <div className="border-b-2 border-black pb-4 flex justify-between items-end">
        <div>
          <h3 className="text-xl font-bold uppercase tracking-tight italic">Reagent Console</h3>
          <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mt-1">Classification-Based Inventory Access</p>
        </div>
        <i className="fas fa-microchip text-slate-200 text-xl"></i>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {Object.entries(inventory).map(([category, chemicals]) => {
          const chemicalsList = chemicals as Molecule[];
          // Only show categories that have items, or the 'Synthesized' category even if empty to show progress
          if (chemicalsList.length === 0 && category !== 'Synthesized') return null;
          
          return (
            <div key={category} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-black uppercase tracking-[0.15em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-black rotate-45"></span>
                  {category}
                </label>
                <span className="text-[9px] font-mono text-slate-300 uppercase font-bold">STOCK: {chemicalsList.length}</span>
              </div>
              
              <div className="relative group">
                <select
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      handleSelect(category, parseInt(e.target.value, 10));
                      e.target.value = ""; // Auto-reset for repeat use
                    }
                  }}
                  defaultValue=""
                  className="w-full bg-slate-50 border border-slate-200 p-3 text-[11px] font-mono font-bold uppercase tracking-tighter focus:border-black focus:ring-0 focus:outline-none appearance-none cursor-pointer transition-all hover:bg-white hover:border-black"
                >
                  <option value="" disabled>-- DISPENSE {category.toUpperCase()} --</option>
                  {chemicalsList.map((m, idx) => (
                    <option key={idx} value={idx}>
                      {m.name} {m.properties.formula ? `[${m.properties.formula}]` : ''}
                    </option>
                  ))}
                  {chemicalsList.length === 0 && (
                    <option disabled>NO ITEMS IN LOG</option>
                  )}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-black transition-colors">
                  <i className="fas fa-chevron-down text-[10px]"></i>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
        <p className="text-[8px] text-slate-400 font-mono uppercase leading-tight max-w-[70%]">
          Dispensation protocol active. Selected reagents are immediately added to the primary reaction vessel.
        </p>
        <div className="flex gap-1">
          <div className="w-1 h-3 bg-slate-100"></div>
          <div className="w-1 h-3 bg-slate-200"></div>
          <div className="w-1 h-3 bg-slate-300"></div>
        </div>
      </div>
    </div>
  );
};

export default ChemicalLibrary;

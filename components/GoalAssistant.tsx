
import React, { useState } from 'react';
import { interpretGoal } from '../services/geminiService';
import { fetchMoleculeByIdentifier } from '../services/pubchemService';
import { Molecule, GoalInterpretation } from '../types';

interface Props {
  onAutoPopulate: (params: GoalInterpretation) => void;
  onAddReactant: (m: Molecule) => void;
}

const GoalAssistant: React.FC<Props> = ({ onAutoPopulate, onAddReactant }) => {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInspire = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    try {
      const suggestion = await interpretGoal(goal);
      onAutoPopulate(suggestion);
      
      // Auto-fetch reactants
      for (const name of suggestion.suggestedReactants) {
        // Fix: fetchMoleculeByIdentifier only expects one argument (id: string)
        const mol = await fetchMoleculeByIdentifier(name);
        if (mol) onAddReactant(mol);
      }
      setGoal('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white p-8 border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,0.1)]">
      <h3 className="text-lg font-bold uppercase tracking-widest mb-4 flex items-center gap-3">
        <i className="fas fa-magic text-yellow-400"></i>
        Synthesis Planner
      </h3>
      <p className="text-[10px] font-mono text-slate-400 uppercase mb-4 leading-relaxed">
        Describe a synthesis target or research aim. Gemini will resolve reagents and thermodynamic optimal states.
      </p>
      
      <div className="space-y-4">
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g. Synthesize a vanillin derivative starting from guaiacol..."
          className="w-full bg-slate-900 border border-slate-700 p-4 text-xs font-mono text-white focus:border-white focus:outline-none h-24 resize-none placeholder:text-slate-600"
        />
        <button
          onClick={handleInspire}
          disabled={loading || !goal.trim()}
          className="w-full bg-white text-black py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-slate-200 transition-all disabled:opacity-30"
        >
          {loading ? "RESOLVING TARGET..." : "GENERATE PROTOCOL"}
        </button>
      </div>
    </div>
  );
};

export default GoalAssistant;

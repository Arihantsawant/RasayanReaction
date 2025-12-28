
import React, { useState } from 'react';
import { fetchMoleculeByIdentifier } from '../services/pubchemService';
import { Molecule } from '../types';

interface Props {
  onAdd: (m: Molecule) => void;
}

const MoleculeSearch: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawInput = query.trim();
    if (!rawInput) return;

    setLoading(true);
    setError('');

    // Split by comma and clean up identifiers
    const identifiers = rawInput.split(',')
      .map(id => id.trim())
      .filter(id => id.length > 0);

    const failed: string[] = [];
    let addedCount = 0;

    // Process sequentially but with much fewer requests per item
    for (const id of identifiers) {
      try {
        const result = await fetchMoleculeByIdentifier(id);
        if (result) {
          onAdd(result);
          addedCount++;
        } else {
          failed.push(id);
        }
      } catch (err) {
        failed.push(id);
      }
    }

    if (failed.length > 0) {
      setError(`Failed to resolve: ${failed.join(', ')}`);
    }

    // Only clear if fully successful
    if (addedCount > 0 && failed.length === 0) {
      setQuery('');
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-white border-2 border-black p-6">
      <h3 className="text-xl font-bold mb-4 uppercase tracking-tight flex items-center gap-2">
        <i className="fas fa-magnifying-glass text-slate-400"></i>
        Compound Input
      </h3>
      <form onSubmit={handleSearch} className="flex flex-col gap-3">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="NAME, SMILES, CID (COMMA SEPARATED)"
            className="w-full bg-slate-50 border-2 border-slate-200 p-4 text-sm font-mono focus:border-black focus:outline-none transition-all placeholder:text-slate-300"
          />
          {loading && (
            <div className="absolute right-4 top-4">
              <i className="fas fa-spinner fa-spin text-black"></i>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 disabled:opacity-30 transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
        >
          {loading ? 'Consulting PubChem...' : 'Resolve & Add Compounds'}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200">
           <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider italic">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
           </p>
           <p className="text-[9px] text-red-400 mt-1 uppercase font-mono">Check spelling or use PubChem CIDs directly for better accuracy.</p>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 leading-normal uppercase tracking-tighter">
          Batch protocols active. Separate multiple entries with commas. 
          Example: <span className="text-slate-500 font-bold">Ethanol, 161, CCO</span>
        </p>
      </div>
    </div>
  );
};

export default MoleculeSearch;


import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import MoleculeSearch from './components/MoleculeSearch';
import ChemicalLibrary from './components/ChemicalLibrary';
import MoleculeDisplay from './components/MoleculeDisplay';
import SimulationResultPanel from './components/SimulationResultPanel';
import GoalAssistant from './components/GoalAssistant';
import HistoryPanel from './components/HistoryPanel';
import { Molecule, ReactionInput, ReactionSimulationResult, HistoryItem } from './types';
import { simulateReaction } from './services/geminiService';
import { COMMON_SOLVENTS, ACIDS_AND_BASES, ORGANIC_BUILDING_BLOCKS, CATALYSTS_AND_ADDITIVES } from './data/chemicalDb';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'WORKSPACE' | 'HISTORY'>('WORKSPACE');
  const [reactants, setReactants] = useState<Molecule[]>([]);
  const [catalysts, setCatalysts] = useState('');
  const [temp, setTemp] = useState(25);
  const [pressure, setPressure] = useState(1.0);
  const [objective, setObjective] = useState('');
  
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<ReactionSimulationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Master Inventory State
  const [inventory, setInventory] = useState<{ [category: string]: Molecule[] }>({
    'Solvents': COMMON_SOLVENTS,
    'Inorganic/Ionic': ACIDS_AND_BASES,
    'Precursors': ORGANIC_BUILDING_BLOCKS,
    'Catalysts/Additives': CATALYSTS_AND_ADDITIVES,
    'Synthesized': []
  });

  // Load history & synthesized items from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('rasaayan_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedSynthesized = localStorage.getItem('rasaayan_synthesized');
    if (savedSynthesized) {
      setInventory(prev => ({
        ...prev,
        'Synthesized': JSON.parse(savedSynthesized)
      }));
    }
  }, []);

  const saveToHistory = (input: ReactionInput, res: ReactionSimulationResult) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      timestamp: new Date().toISOString(),
      input,
      result: res
    };
    const newHistory = [newItem, ...history].slice(0, 20); // Keep last 20
    setHistory(newHistory);
    localStorage.setItem('rasaayan_history', JSON.stringify(newHistory));
  };

  const addToInventory = useCallback((m: Molecule) => {
    setInventory(prev => {
      const allMols = Object.values(prev).flat() as Molecule[];
      if (allMols.some(item => item.smiles === m.smiles || (m.cid && item.cid === m.cid))) {
        return prev;
      }
      
      const newSynthesized = [...prev['Synthesized'], m];
      localStorage.setItem('rasaayan_synthesized', JSON.stringify(newSynthesized));
      
      return {
        ...prev,
        'Synthesized': newSynthesized
      };
    });
  }, []);

  const addReactant = useCallback((m: Molecule) => {
    setReactants(prev => {
      if (m.cid && prev.some(r => r.cid === m.cid)) return prev;
      if (!m.cid && prev.some(r => r.smiles === m.smiles)) return prev;
      return [...prev, m];
    });
  }, []);

  const removeReactant = (index: number) => {
    setReactants(prev => prev.filter((_, i) => i !== index));
  };

  const handleSimulate = async () => {
    if (reactants.length === 0) return;
    setSimulating(true);
    setResult(null);
    try {
      const input: ReactionInput = {
        reactants,
        catalysts,
        temperature: temp,
        pressure,
        description: objective
      };
      const res = await simulateReaction(input);
      setResult(res);
      saveToHistory(input, res);
    } catch (err) {
      console.error(err);
      alert("Terminal Error: Simulation could not be instantiated.");
    } finally {
      setSimulating(false);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setReactants(item.input.reactants);
    setCatalysts(item.input.catalysts);
    setTemp(item.input.temperature);
    setPressure(item.input.pressure);
    setObjective(item.input.description);
    setResult(item.result);
    setActiveTab('WORKSPACE');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black selection:bg-black selection:text-white">
      <Header />

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 py-12">
        {/* Tab Controls */}
        <div className="flex border-b-2 border-black mb-10 gap-px bg-black">
          <button 
            onClick={() => setActiveTab('WORKSPACE')}
            className={`px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all ${activeTab === 'WORKSPACE' ? 'bg-black text-white' : 'bg-white text-slate-400 hover:text-black'}`}
          >
            I. Lab Workspace
          </button>
          <button 
            onClick={() => setActiveTab('HISTORY')}
            className={`px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all ${activeTab === 'HISTORY' ? 'bg-black text-white' : 'bg-white text-slate-400 hover:text-black'}`}
          >
            II. History Log ({history.length})
          </button>
        </div>

        {activeTab === 'WORKSPACE' ? (
          <div className="grid lg:grid-cols-12 gap-12">
            {/* LEFT: Parameters & Goal Assistant */}
            <div className="lg:col-span-4 space-y-10">
              <GoalAssistant 
                onAutoPopulate={(params) => {
                  setTemp(params.suggestedTemp);
                  setPressure(params.suggestedPressure);
                  setObjective(params.rationale);
                }} 
                onAddReactant={addReactant}
              />
              
              <MoleculeSearch onAdd={addReactant} />
              
              <div className="bg-white border-2 border-black p-8">
                <h3 className="text-xl font-bold mb-8 uppercase tracking-tight flex items-center gap-2">
                  <i className="fas fa-sliders-h text-slate-300"></i>
                  Terminal Parameters
                </h3>
                
                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Goal Specification</label>
                    <textarea 
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      placeholder="ENTER RESEARCH OBJECTIVE..."
                      className="w-full bg-slate-50 border-2 border-slate-200 p-4 text-xs font-mono focus:border-black focus:outline-none h-28 resize-none transition-all placeholder:text-slate-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-px bg-black border border-black">
                    <div className="bg-white p-4">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Temp (ºC)</label>
                      <input 
                        type="number" 
                        value={temp}
                        onChange={(e) => setTemp(Number(e.target.value))}
                        className="w-full bg-transparent text-lg font-bold font-mono focus:outline-none"
                      />
                    </div>
                    <div className="bg-white p-4">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Pres. (atm)</label>
                      <input 
                        type="number" 
                        value={pressure}
                        onChange={(e) => setPressure(Number(e.target.value))}
                        className="w-full bg-transparent text-lg font-bold font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Reagents & Catalysts</label>
                    <input 
                      type="text" 
                      value={catalysts}
                      onChange={(e) => setCatalysts(e.target.value)}
                      placeholder="NONE SPECIFIED"
                      className="w-full bg-slate-50 border-2 border-slate-200 p-4 text-xs font-mono focus:border-black focus:outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>

                  <button 
                    onClick={handleSimulate}
                    disabled={simulating || reactants.length === 0}
                    className="w-full py-5 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-slate-800 disabled:opacity-20 transition-all shadow-[6px_6px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                  >
                    {simulating ? "PROCESSING CALCULATIONS..." : "INITIATE IN SILICO RUN"}
                  </button>
                </div>
              </div>

              <ChemicalLibrary onAdd={addReactant} inventory={inventory} />
            </div>

            {/* RIGHT: Active Workspace & Analysis */}
            <div className="lg:col-span-8 space-y-12">
              <section>
                <div className="flex items-baseline justify-between mb-8 border-b-2 border-black pb-4">
                  <h2 className="text-3xl font-bold uppercase tracking-tight">
                    Experimental Setup
                  </h2>
                  <div className="flex gap-4 font-mono text-[10px] font-bold">
                    <span className="text-black uppercase">Active: {reactants.length} Units</span>
                    {reactants.length > 0 && (
                      <button 
                        onClick={() => setReactants([])}
                        className="text-slate-400 hover:text-red-600 uppercase transition-colors"
                      >
                        [ Purge Setup ]
                      </button>
                    )}
                  </div>
                </div>

                {reactants.length > 0 ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {reactants.map((m, idx) => (
                        <MoleculeDisplay 
                          key={idx} 
                          molecule={m} 
                          onRemove={() => removeReactant(idx)}
                        />
                      ))}
                    </div>

                    {!simulating && (
                      <div className="pt-4 flex justify-center">
                        <button 
                          onClick={handleSimulate}
                          className="group relative inline-flex items-center gap-4 px-12 py-6 bg-black text-white text-sm font-bold uppercase tracking-[0.4em] overflow-hidden transition-all hover:bg-slate-900 border-2 border-black"
                        >
                          <span className="relative z-10 flex items-center gap-3">
                            <i className="fas fa-play text-[10px]"></i>
                            Execute Reaction Sequence
                          </span>
                          <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-200 p-24 text-center">
                    <div className="w-16 h-16 border border-slate-200 flex items-center justify-center mx-auto mb-4 opacity-30">
                      <i className="fas fa-microscope text-slate-400"></i>
                    </div>
                    <h4 className="text-slate-300 font-bold uppercase tracking-widest">Workspace Idling</h4>
                    <p className="text-slate-200 text-[10px] font-mono mt-2 uppercase tracking-tighter">Add chemical identifiers to begin session.</p>
                  </div>
                )}
              </section>

              {simulating && (
                <div className="border-2 border-black p-16 text-center bg-white space-y-6">
                  <div className="flex justify-center items-center gap-4">
                    <div className="w-2 h-2 bg-black animate-ping"></div>
                    <div className="w-2 h-2 bg-black animate-ping [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-black animate-ping [animation-delay:0.4s]"></div>
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight italic font-serif">Compiling Molecular Trajectories</h3>
                  <p className="text-slate-400 text-xs font-mono max-w-sm mx-auto uppercase tracking-tighter">
                    Iterating through thermodynamic states... Calculating Gibbs Free Energy drifts... Resolving steric hindrance...
                  </p>
                </div>
              )}

              {result && (
                <SimulationResultPanel 
                  result={result} 
                  reactants={reactants} 
                  onSaveToInventory={addToInventory}
                />
              )}
            </div>
          </div>
        ) : (
          <HistoryPanel history={history} onSelect={loadFromHistory} />
        )}
      </main>

      <footer className="border-t-2 border-black bg-white p-10 text-center text-slate-400 text-[10px] font-mono font-bold uppercase tracking-[0.3em]">
        Physical Chemistry Analysis Unit • Build 822.5-B • Augmented Intelligence Active
      </footer>
    </div>
  );
};

export default App;

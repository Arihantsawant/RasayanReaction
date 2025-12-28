
import React from 'react';
import { Molecule, ReactionSimulationResult, PredictedChemical } from '../types';
import ReactionFlowDiagram from './ReactionFlowDiagram';

interface Props {
  result: ReactionSimulationResult;
  reactants: Molecule[];
  onSaveToInventory: (m: Molecule) => void;
}

const SimulationResultPanel: React.FC<Props> = ({ result, reactants, onSaveToInventory }) => {
  const getSafetyStyles = (severity: string) => {
    switch (severity) {
      case 'Critical':
      case 'High':
        return { card: 'bg-red-50 border-red-600 text-red-950', badge: 'bg-red-600 text-white', label: 'text-red-700' };
      case 'Medium':
        return { card: 'bg-yellow-50 border-yellow-600 text-yellow-950', badge: 'bg-yellow-500 text-black', label: 'text-yellow-700' };
      case 'Low':
        return { card: 'bg-green-50 border-green-600 text-green-950', badge: 'bg-green-600 text-white', label: 'text-green-700' };
      default:
        return { card: 'bg-white border-slate-200 text-slate-950', badge: 'bg-black text-white', label: 'text-slate-400' };
    }
  };

  const handleSaveToInventory = (chem: PredictedChemical) => {
    const molecule: Molecule = {
      name: chem.name,
      smiles: chem.smiles,
      properties: {
        molecularWeight: chem.molecularWeight,
        tpsa: chem.tpsa,
        // Formula prediction could be more complex, but using a placeholder or reasoning
        formula: chem.reasoning.match(/[A-Z][a-z]?\d*/g)?.join('') || 'N/A'
      }
    };
    onSaveToInventory(molecule);
  };

  const handleAddAllToInventory = () => {
    result.products.forEach(chem => handleSaveToInventory(chem));
  };

  const ChemicalCard: React.FC<{ chem: PredictedChemical, type: 'PRODUCT' | 'BYPRODUCT' }> = ({ chem, type }) => (
    <div className={`group border transition-all ${type === 'PRODUCT' ? 'border-black bg-white shadow-[6px_6px_0px_rgba(0,0,0,0.05)]' : 'border-slate-300 bg-slate-50 opacity-95'} p-6 space-y-4`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 mr-4">
          <span className={`text-[8px] font-bold px-2 py-0.5 border ${type === 'PRODUCT' ? 'bg-black text-white border-black' : 'bg-slate-200 text-slate-500 border-slate-300'} uppercase tracking-[0.2em]`}>
            {type}
          </span>
          <h4 className="text-xl font-bold text-black uppercase tracking-tight mt-2 truncate">{chem.name}</h4>
          <p className="text-[10px] font-mono text-slate-400 leading-none mt-1 uppercase italic truncate">{chem.iupacName}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-bold italic font-serif text-black">{chem.yieldEstimate}</div>
          <div className="text-[9px] font-mono font-bold text-slate-400 uppercase">Yield</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4">
        <div>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">MW & TPSA</p>
          <p className="text-xs font-mono font-bold text-black">
            {chem.molecularWeight.toFixed(5)} u | {chem.tpsa || 'N/A'} Å²
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">SMILES Vector</p>
          <p className="text-[9px] font-mono text-slate-500 truncate" title={chem.smiles}>{chem.smiles}</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs text-slate-600 leading-relaxed italic font-serif">
          <span className="font-bold text-black not-italic mr-2 font-sans text-[10px] uppercase">Analysis:</span>
          {chem.reasoning}
        </p>
        
        {chem.applications && chem.applications.length > 0 && (
          <div className="pt-2">
            <h5 className="text-[9px] font-bold text-black uppercase tracking-widest mb-2 border-l-2 border-black pl-2">Utilization & Utility</h5>
            <div className="flex flex-wrap gap-2">
              {chem.applications.map((app, i) => (
                <span key={i} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-1 font-mono uppercase tracking-tighter border border-slate-200">
                  {app}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={() => handleSaveToInventory(chem)}
        className="w-full mt-4 py-2 border border-black text-[10px] font-bold uppercase tracking-widest bg-white hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
      >
        <i className="fas fa-plus-circle"></i>
        Add to Master Inventory
      </button>
    </div>
  );

  return (
    <div className="space-y-12 bg-white border-2 border-black p-10 shadow-[10px_10px_0px_rgba(0,0,0,0.05)]">
      {/* Header & Feasibility */}
      <div className="border-b-2 border-black pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
         <div>
           <h2 className="text-4xl font-bold uppercase tracking-tighter">Simulation Report</h2>
           <p className="text-sm font-mono text-slate-500 mt-2 uppercase tracking-widest">Experimental Outcome Analysis • Kinetic Projection</p>
         </div>
         <div className="flex gap-4">
            <div className="text-right bg-slate-50 border-l-4 border-black p-4">
              <div className={`text-4xl font-bold italic font-serif ${result.feasibilityScore < 50 ? 'text-red-600' : 'text-black'}`}>
                {result.feasibilityScore}%
              </div>
              <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Feasibility</p>
            </div>
            {result.mlAccuracy && (
               <div className="text-right bg-black text-white p-4">
                <div className="text-4xl font-bold italic font-serif">
                  {result.mlAccuracy.confidenceScore}%
                </div>
                <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">ML Confidence</p>
              </div>
            )}
         </div>
      </div>

      {/* Accuracy Verification Dashboard */}
      {result.mlAccuracy && (
        <div className="bg-slate-50 border-2 border-black p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 border-r border-slate-200 pr-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2">Stoichiometric Integrity</h3>
            <div className={`flex items-center gap-2 font-mono text-xs font-bold ${result.mlAccuracy.massBalanceStatus === 'Verified' ? 'text-green-600' : 'text-red-600'}`}>
              <i className={`fas ${result.mlAccuracy.massBalanceStatus === 'Verified' ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
              {result.mlAccuracy.massBalanceStatus.toUpperCase()}
            </div>
          </div>
          <div className="md:col-span-2 space-y-3">
             <h3 className="text-[10px] font-bold uppercase tracking-widest">Ensemble Model Consensus</h3>
             <div className="flex gap-4">
                <StatusBadge label="Structural" active={result.mlAccuracy.modelConsensus.structural} />
                <StatusBadge label="Thermodynamic" active={result.mlAccuracy.modelConsensus.thermodynamic} />
                <StatusBadge label="Kinetic" active={result.mlAccuracy.modelConsensus.kinetic} />
             </div>
          </div>
          <div className="md:col-span-1 text-right">
             <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2">Error Margin</h3>
             <div className="font-mono text-xs font-bold text-slate-500">± {result.mlAccuracy.errorMargin}</div>
          </div>
        </div>
      )}

      {/* Environment Warnings */}
      {result.conditionWarnings && result.conditionWarnings.length > 0 && (
        <div className="bg-red-600 text-white p-6 border-4 border-black shadow-[8px_8px_0px_rgba(220,38,38,0.2)]">
          <h3 className="text-lg font-bold uppercase tracking-widest mb-3 flex items-center gap-3">
            <i className="fas fa-exclamation-triangle"></i>
            CONDITION MISMATCH DETECTED
          </h3>
          <ul className="space-y-2">
            {result.conditionWarnings.map((w, i) => (
              <li key={i} className="text-xs font-mono uppercase tracking-tight list-disc ml-5">{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Visual Pathway Representation */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] border-b border-slate-200 pb-2">I. Reaction Topology</h3>
        <ReactionFlowDiagram reactants={reactants} result={result} />
      </section>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-3 gap-px bg-black border border-black shadow-[8px_8px_0px_rgba(0,0,0,0.05)]">
        <div className="bg-white p-8">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <i className="fas fa-fire-alt text-slate-300"></i>
            Thermodynamics
          </p>
          <div className="text-3xl font-bold uppercase tracking-tighter border-2 border-black p-4 inline-block">
            {result.energyTrend}
          </div>
          <p className="text-[10px] font-mono text-slate-400 mt-4 uppercase">Delta-G Variance Analysis</p>
        </div>
        
        <div className="bg-white p-8">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <i className="fas fa-clock text-slate-300"></i>
            Duration (ML Predicted)
          </p>
          <div className="text-3xl font-bold uppercase tracking-tighter border-2 border-black p-4 inline-block">
            {result.approxTimeRequired || "TBD"}
          </div>
          <p className="text-[10px] font-mono text-slate-400 mt-4 uppercase">Projected Convergence Time</p>
        </div>

        <div className="bg-white p-8">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <i className="fas fa-microchip text-slate-300"></i>
            Mechanism Brief
          </p>
          <p className="text-xs text-black leading-relaxed italic font-serif text-justify border-l-4 border-black pl-4 h-[4.5rem] overflow-y-auto custom-scrollbar">
            {result.mechanismInsight}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-2">
            <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-3">
              <span className="w-6 h-6 bg-black text-white text-[10px] flex items-center justify-center">01</span>
              Validated Products
            </h3>
            <button 
              onClick={handleAddAllToInventory}
              className="px-4 py-2 border border-black text-[9px] font-bold uppercase tracking-widest bg-white hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <i className="fas fa-layer-group"></i>
              Add All Products to Inventory
            </button>
          </div>
          <div className="space-y-6">
            {result.products.map((p, i) => (
              <ChemicalCard key={i} chem={p} type="PRODUCT" />
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-xl font-bold uppercase tracking-tight border-b-2 border-black pb-2 flex items-center gap-3">
             <span className="w-6 h-6 bg-black text-white text-[10px] flex items-center justify-center">02</span>
             Hazards & Precautions
          </h3>
          <div className="space-y-4">
            {result.safetyAssessment.map((s, i) => {
              const styles = getSafetyStyles(s.severity);
              return (
                <div key={i} className={`border-2 p-5 transition-all ${styles.card}`}>
                  <div className={`flex items-center justify-between mb-2`}>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${styles.label}`}>{s.category}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 ${styles.badge}`}>
                      {s.severity}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm mb-2 uppercase tracking-tight">{s.description}</h4>
                  <p className="text-[12px] leading-relaxed italic font-serif opacity-90">{s.explanation}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 space-y-8">
            <h3 className="text-xl font-bold uppercase tracking-tight border-b-2 border-black pb-2 flex items-center gap-3">
              <span className="w-6 h-6 bg-slate-200 text-slate-500 text-[10px] flex items-center justify-center">03</span>
              Residual Byproducts
            </h3>
            <div className="space-y-6">
              {result.byproducts.map((p, i) => (
                <ChemicalCard key={i} chem={p} type="BYPRODUCT" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ label, active }: { label: string, active: boolean }) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-300'}`}></div>
    <span className={`text-[9px] font-bold uppercase tracking-tighter ${active ? 'text-black' : 'text-slate-400'}`}>{label}</span>
  </div>
);

export default SimulationResultPanel;

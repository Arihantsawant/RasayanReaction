
import React, { useState } from 'react';
import { Molecule } from '../types';
import { getMoleculeImage } from '../services/pubchemService';
import Molecule3DModal from './Molecule3DModal';

interface Props {
  molecule: Molecule;
  onRemove?: () => void;
  compact?: boolean;
}

const MoleculeDisplay: React.FC<Props> = ({ molecule, onRemove, compact = false }) => {
  const [show3D, setShow3D] = useState(false);
  const pubchemUrl = molecule.cid 
    ? `https://pubchem.ncbi.nlm.nih.gov/compound/${molecule.cid}` 
    : null;

  return (
    <>
      <div className={`bg-white border border-slate-300 flex flex-col transition-all hover:border-black shadow-sm hover:shadow-md ${compact ? 'max-w-xs' : ''}`}>
        <div className="relative aspect-square bg-white border-b border-slate-100 flex items-center justify-center p-6">
          {molecule.cid ? (
            <img 
              src={getMoleculeImage(molecule.cid)} 
              alt={molecule.name} 
              className="max-h-full max-w-full object-contain grayscale brightness-90 hover:grayscale-0 transition-all"
            />
          ) : (
            <div className="text-slate-400 text-xs font-mono break-all text-center px-4">
              [IMAGE UNAVAILABLE]<br/>{molecule.smiles}
            </div>
          )}
          
          <div className="absolute top-0 right-0 p-2 flex gap-1">
            <button 
              onClick={() => setShow3D(true)}
              className="w-6 h-6 bg-white border border-slate-200 text-slate-400 hover:text-black hover:border-black flex items-center justify-center transition-all"
              title="View 3D Atomic Structure"
            >
              <i className="fas fa-cube text-[10px]"></i>
            </button>
            {onRemove && (
              <button 
                onClick={onRemove}
                className="w-6 h-6 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-600 flex items-center justify-center transition-all"
              >
                <i className="fas fa-times text-[10px]"></i>
              </button>
            )}
          </div>
        </div>
        
        <div className="p-4 space-y-4 flex-1">
          <div>
            <h4 className="text-lg font-bold text-black line-clamp-2 leading-tight uppercase tracking-tight">{molecule.name}</h4>
            <div className="flex flex-wrap items-center gap-2 mt-1">
               {molecule.cid && (
                <span className="text-[9px] font-mono font-bold text-slate-400 border border-slate-200 px-1 py-0.5">CID:{molecule.cid}</span>
              )}
              <p className="text-[9px] font-mono text-slate-400 break-all truncate flex-1 uppercase tracking-tighter">{molecule.smiles}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-slate-200 border border-slate-200">
            <Property label="MW" value={molecule.properties.molecularWeight?.toFixed(2)} />
            <Property label="LogP" value={molecule.properties.logP?.toFixed(1)} />
            <Property label="H-Donor" value={molecule.properties.hBondDonors} />
            <Property label="H-Accept" value={molecule.properties.hBondAcceptors} />
          </div>

          <div className="pt-2 flex items-center justify-between mt-auto">
             <p className="text-[10px] font-mono font-bold text-black uppercase tracking-widest">{molecule.properties.formula || 'No Formula'}</p>
             {pubchemUrl && (
                <a 
                  href={pubchemUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[9px] text-slate-400 hover:text-black font-bold uppercase underline decoration-slate-200 underline-offset-4 transition-colors"
                >
                  External Record
                </a>
             )}
          </div>
        </div>
      </div>

      {show3D && (
        <Molecule3DModal 
          name={molecule.name || "Unknown Compound"} 
          cid={molecule.cid} 
          smiles={molecule.smiles} 
          onClose={() => setShow3D(false)} 
        />
      )}
    </>
  );
};

const Property = ({ label, value }: { label: string, value: any }) => (
  <div className="bg-white p-2">
    <p className="text-[8px] text-slate-400 uppercase font-bold tracking-tighter leading-none mb-1">{label}</p>
    <p className="text-[11px] font-mono font-medium text-black">
      {value ?? '-'}
    </p>
  </div>
);

export default MoleculeDisplay;

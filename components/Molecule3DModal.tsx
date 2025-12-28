
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  name: string;
  cid?: number;
  smiles?: string;
  onClose: () => void;
}

const Molecule3DModal: React.FC<Props> = ({ name, cid, smiles, onClose }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let viewer: any = null;
    let isMounted = true;

    const initViewer = async () => {
      setLoading(true);
      setError(null);

      const identifier = cid ? `cid/${cid}` : `smiles/${encodeURIComponent(smiles || '')}`;
      const sdfUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/${identifier}/SDF?record_type=3d`;

      try {
        const response = await fetch(sdfUrl);
        if (!response.ok) throw new Error("3D spatial data resolution failed.");

        const sdfData = await response.text();
        if (!isMounted) return;

        const anyWindow = window as any;
        if (anyWindow.$3Dmol && viewerRef.current) {
          viewerRef.current.innerHTML = '';
          viewer = anyWindow.$3Dmol.createViewer(viewerRef.current, { backgroundColor: 'white' });
          viewer.addModel(sdfData, "sdf");
          
          // Enhanced CPK/Jmol High-Contrast Colors
          viewer.setStyle({}, { 
            stick: { radius: 0.18, colorscheme: 'Jmol' }, 
            sphere: { scale: 0.28, colorscheme: 'Jmol' } 
          });

          viewer.zoomTo();
          viewer.render();
          
          setTimeout(() => {
            if (viewer) {
              viewer.resize();
              viewer.zoomTo();
              viewer.render();
            }
          }, 150);

          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to render structure.");
          setLoading(false);
        }
      }
    };

    initViewer();
    const handleResize = () => viewer?.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      if (viewer) viewer.clear();
    };
  }, [cid, smiles]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white border-2 border-black w-full max-w-5xl h-[85vh] flex flex-col shadow-[24px_24px_0px_rgba(0,0,0,0.25)] overflow-hidden">
        <div className="p-5 border-b-2 border-black flex justify-between items-center bg-slate-50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-black flex items-center justify-center text-white"><i className="fas fa-cube"></i></div>
            <div>
              <h3 className="text-xl font-bold uppercase tracking-tight leading-none">{name}</h3>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">3D Atomic Projection</p>
            </div>
          </div>
          <button onClick={onClose} className="px-6 py-2.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all">CLOSE VIEWER</button>
        </div>
        
        <div className="flex-1 bg-white relative flex flex-col overflow-hidden">
          <div ref={viewerRef} className="w-full h-full flex-1 touch-none cursor-move" />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/95 z-10">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-black rounded-full animate-spin mx-auto"></div>
                <p className="text-[11px] font-bold uppercase tracking-widest">Resolving Conformer...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-white p-12 z-20">
              <div className="text-center p-12 bg-slate-50 border-2 border-dashed border-slate-200">
                <i className="fas fa-microscope text-slate-200 text-3xl mb-4"></i>
                <p className="text-[11px] text-slate-500 uppercase tracking-tight">{error}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-6">
            <Legend color="bg-red-500" label="Oxygen" />
            <Legend color="bg-slate-800" label="Carbon" />
            <Legend color="bg-blue-500" label="Nitrogen" />
            <Legend color="bg-white border border-slate-300" label="Hydrogen" />
          </div>
          <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">CPK Coloring Standard</div>
        </div>
      </div>
    </div>
  );
};

const Legend = ({ color, label }: { color: string, label: string }) => (
  <div className="flex items-center gap-2">
    <span className={`w-2 h-2 rounded-full ${color}`}></span>
    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{label}</span>
  </div>
);

export default Molecule3DModal;

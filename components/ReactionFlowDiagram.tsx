
import React, { useMemo, useState } from 'react';
import ReactFlow, { 
  Node, 
  Edge, 
  Position, 
  Background, 
  Controls,
  MarkerType
} from 'reactflow';
import { Molecule, ReactionSimulationResult } from '../types';
import Molecule3DModal from './Molecule3DModal';

interface Props {
  reactants: Molecule[];
  result: ReactionSimulationResult;
}

const ReactionFlowDiagram: React.FC<Props> = ({ reactants, result }) => {
  const [selectedMolecule, setSelectedMolecule] = useState<{ name: string; smiles: string; cid?: number } | null>(null);

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const startX = 50;
    const yCenter = 100;
    const xInterval = 250;

    // 1. Reactants Node
    const reactantLabel = (
      <div className="text-center">
        <div className="text-[8px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Reactants</div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {reactants.map((r, i) => (
            <div key={i} className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-1.5 py-0.5">
              <span className="font-bold uppercase tracking-tight text-[10px]">{r.name || 'Unknown'}</span>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setSelectedMolecule({ name: r.name || "Reactant", smiles: r.smiles, cid: r.cid }); 
                }}
                className="w-4 h-4 flex items-center justify-center bg-white border border-black text-[8px] hover:bg-black hover:text-white transition-all"
                title="View 3D Model"
              >
                <i className="fas fa-cube"></i>
              </button>
              {i < reactants.length - 1 && <span className="text-[10px] ml-1 opacity-30">+</span>}
            </div>
          ))}
        </div>
      </div>
    );

    nodes.push({
      id: 'reactants',
      position: { x: startX, y: yCenter },
      data: { label: reactantLabel },
      style: { border: '2px solid #000', background: '#fff', borderRadius: '0', minWidth: '180px', padding: '12px' },
      sourcePosition: Position.Right,
    });

    let lastNodeId = 'reactants';
    let currentX = startX + xInterval;

    // 2. Intermediates Nodes (Linear)
    if (result.intermediates && result.intermediates.length > 0) {
      result.intermediates.forEach((intermediate, index) => {
        const id = `intermediate-${index}`;
        nodes.push({
          id,
          position: { x: currentX, y: yCenter },
          data: { label: (
            <div className="text-center">
              <div className="text-[8px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Intermediate</div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="font-bold uppercase tracking-tight italic text-[11px]">{intermediate.name}</div>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setSelectedMolecule({ name: intermediate.name, smiles: intermediate.smiles }); 
                  }}
                  className="w-5 h-5 flex items-center justify-center bg-white border border-black text-[9px] hover:bg-black hover:text-white transition-all"
                  title="View 3D Model"
                >
                  <i className="fas fa-cube"></i>
                </button>
              </div>
              <div className="text-[7px] text-slate-500 line-clamp-2 uppercase tracking-tighter leading-tight px-2">{intermediate.description}</div>
            </div>
          )},
          style: { border: '1px solid #000', background: '#fcfcfc', borderRadius: '0', minWidth: '160px', padding: '10px' },
          targetPosition: Position.Left,
          sourcePosition: Position.Right,
        });

        edges.push({
          id: `e-${lastNodeId}-${id}`,
          source: lastNodeId,
          target: id,
          animated: true,
          style: { stroke: '#000' },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#000' },
        });

        lastNodeId = id;
        currentX += xInterval;
      });
    }

    // 3. Products Nodes
    result.products.forEach((product, index) => {
      const id = `product-${index}`;
      nodes.push({
        id,
        position: { x: currentX, y: yCenter + (index * 100) - ((result.products.length - 1) * 50) },
        data: { label: (
          <div className="text-center">
            <div className="text-[8px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Major Product</div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="font-bold uppercase tracking-tight text-[11px]">{product.name}</div>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setSelectedMolecule({ name: product.name, smiles: product.smiles }); 
                }}
                className="w-5 h-5 flex items-center justify-center bg-white border border-black text-[9px] hover:bg-black hover:text-white transition-all"
                title="View 3D Model"
              >
                <i className="fas fa-cube"></i>
              </button>
            </div>
            <div className="text-[8px] font-bold text-slate-500 mb-1 font-mono">{product.yieldEstimate} Yield</div>
            <div className="text-[7px] text-slate-400 font-mono uppercase truncate px-2">{product.smiles}</div>
          </div>
        )},
        style: { border: '2px double #000', background: '#fff', borderRadius: '0', minWidth: '160px', padding: '10px' },
        targetPosition: Position.Left,
      });

      edges.push({
        id: `e-${lastNodeId}-${id}`,
        source: lastNodeId,
        target: id,
        animated: true,
        label: result.energyTrend.toUpperCase(),
        labelStyle: { fill: '#000', fontSize: 7, fontWeight: 'bold', fontFamily: 'monospace' },
        style: { stroke: '#000' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#000' },
      });
    });

    return { nodes, edges };
  }, [reactants, result]);

  return (
    <div className="w-full h-[400px] bg-white rounded-none border-2 border-black overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10">
        <h4 className="text-[10px] font-bold text-black uppercase tracking-[0.2em] flex items-center gap-2">
          <i className="fas fa-project-diagram"></i>
          II.B Reaction Map
        </h4>
        <p className="text-[8px] text-slate-400 uppercase mt-1">Stochastic pathway projection • Click cube for 3D atomic model</p>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        panOnScroll={false}
        zoomOnScroll={false}
        preventScrolling={false}
        nodesDraggable={true}
        className="touch-none"
      >
        <Background color="#eee" gap={20} size={1} />
        <Controls showInteractive={false} className="opacity-100 invert" />
      </ReactFlow>

      {selectedMolecule && (
        <Molecule3DModal 
          name={selectedMolecule.name}
          cid={selectedMolecule.cid}
          smiles={selectedMolecule.smiles}
          onClose={() => setSelectedMolecule(null)}
        />
      )}
    </div>
  );
};

export default ReactionFlowDiagram;

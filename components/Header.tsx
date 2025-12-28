
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="border-b-2 border-black bg-white sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border-2 border-black flex items-center justify-center">
            <i className="fas fa-flask text-black text-2xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tight leading-none">Rasaayan<span className="font-normal italic text-slate-600">Reaction</span></h1>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em] mt-1">Experimental Reaction Terminal v4.0</p>
          </div>
        </div>
        
        <nav className="hidden lg:flex items-center gap-10">
          <a href="#" className="text-xs font-bold uppercase tracking-widest text-black border-b-2 border-black pb-1">Workspace</a>
          <a href="#" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-colors">Archive</a>
          <a href="#" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-colors">Safety Protocols</a>
          <a href="#" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-colors">Data Export</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="px-5 py-2.5 border-2 border-black bg-white hover:bg-black hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
            System Log
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React, { useState } from 'react';
import { RECEPTORS } from '../data';
import { 
  Activity, Zap, Info, 
  MousePointerClick, 
  Heart, Wind, Eye, Brain, Layers, Droplet, CircleDot, Hexagon,
  Minimize2, Maximize2, HeartPulse, Moon, Flame, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

export const ReceptorModule: React.FC = () => {
  const [activeReceptor, setActiveReceptor] = useState(RECEPTORS[0]);
  const isAlpha = activeReceptor.id.includes('alpha');
  
  // Helper to map text location to an Icon
  const getLocationIcon = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes('cœur')) return <Heart className="w-5 h-5" />;
    if (t.includes('bronches')) return <Wind className="w-5 h-5" />;
    if (t.includes('œil')) return <Eye className="w-5 h-5" />;
    if (t.includes('snc') || t.includes('synaptique')) return <Brain className="w-5 h-5" />;
    if (t.includes('vaisseaux') || t.includes('vasculaire')) return <Activity className="w-5 h-5" />;
    if (t.includes('rein') || t.includes('vessie') || t.includes('urinaires')) return <Droplet className="w-5 h-5" />;
    if (t.includes('adipeux')) return <Layers className="w-5 h-5" />;
    if (t.includes('pancréas') || t.includes('foie')) return <Hexagon className="w-5 h-5" />;
    return <CircleDot className="w-5 h-5" />;
  };

  // Helper to map text effect to an Icon
  const getEffectIcon = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes('vasoconstriction') || t.includes('rvs') || t.includes('pa')) return <Minimize2 className="w-4 h-4" />;
    if (t.includes('vasodilatation')) return <Maximize2 className="w-4 h-4" />;
    if (t.includes('chronotrope') || t.includes('inotrope')) return <HeartPulse className="w-4 h-4" />;
    if (t.includes('mydriase')) return <Eye className="w-4 h-4" />;
    if (t.includes('sédation')) return <Moon className="w-4 h-4" />;
    if (t.includes('lipolyse')) return <Flame className="w-4 h-4" />;
    if (t.includes('broncho')) return <Wind className="w-4 h-4" />;
    if (t.includes('↑')) return <ArrowUpRight className="w-4 h-4" />;
    if (t.includes('↓')) return <ArrowDownRight className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };

  return (
    <div className="flex flex-col h-full gap-4 p-4 pb-24 md:pb-6 overflow-y-auto">
      
      {/* RECEPTOR SELECTOR - Horizontal Scroll on Mobile */}
      <div className="flex overflow-x-auto gap-3 pb-2 flex-shrink-0 no-scrollbar">
        {RECEPTORS.map(r => {
            const isActive = activeReceptor.id === r.id;
            const isRAlpha = r.id.includes('alpha');
            return (
                <button
                    key={r.id}
                    onClick={() => setActiveReceptor(r)}
                    className={`flex-shrink-0 px-6 py-4 rounded-xl font-bold text-sm shadow-sm transition-all border-2
                    ${isActive 
                        ? (isRAlpha ? 'bg-red-50 border-red-500 text-red-600' : 'bg-blue-50 border-blue-500 text-blue-600')
                        : 'bg-white border-slate-100 text-slate-500'}`}
                >
                    {r.name}
                </button>
            )
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Identity Card */}
        <div className="lg:w-5/12 medical-card p-6 flex flex-col items-center justify-center relative overflow-hidden bg-white">
           <div className={`absolute top-0 w-full h-2 ${isAlpha ? 'bg-red-500' : 'bg-blue-500'}`}></div>
           
           <h2 className={`text-5xl font-black mb-2 ${isAlpha ? 'text-red-600' : 'text-blue-600'}`}>
              {activeReceptor.name}
           </h2>
           
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-6">
                <Activity className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-mono font-bold text-slate-700">PROTÉINE {activeReceptor.protein}</span>
           </div>

           <div className="text-center p-4 bg-slate-50 rounded-xl w-full">
               <p className="text-lg font-medium text-slate-700 italic">
                  "{activeReceptor.anesthesiaRole}"
               </p>
           </div>
        </div>

        {/* Info Grid */}
        <div className="lg:w-7/12 flex flex-col gap-4">
            
            {/* Effects */}
            <div className="medical-card p-5">
                <h3 className="flex items-center text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                    <Zap className="w-4 h-4 mr-2" /> Effets Physiologiques
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeReceptor.effects.map((e,i) => (
                        <div key={i} className="flex items-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                            <div className={`mr-3 p-2 rounded-full ${isAlpha ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                {getEffectIcon(e)}
                            </div>
                            <span className="text-sm font-semibold text-slate-700">{e}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Locations */}
            <div className="medical-card p-5">
                <h3 className="flex items-center text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                    <MousePointerClick className="w-4 h-4 mr-2" /> Localisation
                </h3>
                <div className="flex flex-wrap gap-2">
                    {activeReceptor.location.map((loc, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100">
                            <span className="text-slate-400">{getLocationIcon(loc)}</span>
                            <span className="text-sm font-medium text-slate-600">{loc}</span>
                        </div>
                    ))}
                </div>
            </div>

             {/* Pathology */}
             <div className="medical-card p-5 border-l-4 border-red-400">
                <h3 className="flex items-center text-sm font-bold text-red-500 uppercase tracking-wider mb-2">
                    <Info className="w-4 h-4 mr-2" /> Pathologie Associée
                </h3>
                <p className="text-slate-700 font-medium">
                    {activeReceptor.pathology}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

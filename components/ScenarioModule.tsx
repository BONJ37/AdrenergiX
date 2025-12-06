
import React, { useState, useEffect } from 'react';
import { CLINICAL_CASES } from '../data';
import { ClinicalCase, CaseStep } from '../types';
import { Activity, PlayCircle, CheckCircle, XCircle, AlertOctagon, RefreshCw, Loader2, BrainCircuit, ChevronRight } from 'lucide-react';
import { generateClinicalCase } from '../services/geminiService';

const MonitorWaveform = ({ color, speed = 1 }: { color: string, speed?: number }) => {
    return (
        <div className="h-12 w-full bg-black/90 rounded border border-slate-700 relative overflow-hidden flex items-center">
            <svg viewBox="0 0 200 50" className="w-full h-full" preserveAspectRatio="none">
                <path 
                    d="M0,25 L10,25 L15,10 L20,40 L25,25 L40,25 L45,25 L50,25 M50,25 L60,25 L65,10 L70,40 L75,25 L90,25" 
                    fill="none" 
                    stroke={color} 
                    strokeWidth="2" 
                    vectorEffect="non-scaling-stroke"
                    strokeDasharray="200"
                    strokeDashoffset="0"
                >
                    <animate attributeName="stroke-dashoffset" from="200" to="0" dur={`${2/speed}s`} repeatCount="indefinite" />
                </path>
            </svg>
        </div>
    )
}

export const ScenarioModule: React.FC = () => {
  const [currentCase, setCurrentCase] = useState<ClinicalCase | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{step: number, correct: boolean}[]>([]);

  // Load a random static case on mount
  useEffect(() => {
    loadRandomStaticCase();
  }, []);

  const loadRandomStaticCase = () => {
    const randomIndex = Math.floor(Math.random() * CLINICAL_CASES.length);
    const newCase = CLINICAL_CASES[randomIndex];
    // Reset state
    setCurrentCase(newCase);
    setStepIndex(0);
    setSelectedOptionId(null);
    setFeedback(null);
    setHistory([]);
  };

  const generateAICase = async () => {
    setLoading(true);
    const newCase = await generateClinicalCase();
    setLoading(false);
    if (newCase) {
        setCurrentCase(newCase);
        setStepIndex(0);
        setSelectedOptionId(null);
        setFeedback(null);
        setHistory([]);
    } else {
        alert("Erreur de génération IA. Chargement d'un cas statique.");
        loadRandomStaticCase();
    }
  };

  const handleSelect = (opt: CaseStep['options'][0]) => {
    if (selectedOptionId) return;
    setSelectedOptionId(opt.id);
    setFeedback(opt.outcome);
    setHistory(prev => [...prev, { step: stepIndex, correct: opt.correct }]);
  };

  const nextStep = () => {
    if (!currentCase) return;
    if (stepIndex < currentCase.steps.length - 1) {
        setStepIndex(prev => prev + 1);
        setSelectedOptionId(null);
        setFeedback(null);
    } else {
        // End of case
        alert("Cas terminé ! Score : " + history.filter(h => h.correct).length + "/3");
        loadRandomStaticCase(); // Auto restart random
    }
  };

  if (!currentCase) return <div className="p-10 text-center flex h-full items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-primary-500" /></div>;

  const currentStep = currentCase.steps[stepIndex];
  const hr = parseInt(currentStep.vitals.hr);

  return (
    <div className="h-full overflow-y-auto w-full bg-slate-50">
      
      {/* Sticky Navigation Bar */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 py-3 flex justify-between items-center transition-all">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-600" /> 
              <span>Simulation</span>
          </h2>
          <div className="flex gap-2">
            <button 
                onClick={loadRandomStaticCase} 
                className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-600 transition-colors border border-slate-200"
                title="Cas Aléatoire (Statique)"
            >
                <RefreshCw className="w-4 h-4" />
            </button>
            <button 
                onClick={generateAICase} 
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-full font-bold text-xs hover:bg-slate-800 transition-all shadow-md disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <BrainCircuit className="w-3 h-3" />}
                <span className="hidden sm:inline">IA Générative</span>
                <span className="sm:hidden">IA</span>
            </button>
          </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 pb-24 md:pb-6 animate-in fade-in duration-500">

        {/* Patient Monitor Simulator */}
        <div className="bg-black rounded-2xl p-4 shadow-xl mb-6 border-4 border-slate-800 relative transition-all duration-500">
           {/* Monitor Header */}
           <div className="flex justify-between items-center mb-2 border-b border-slate-800 pb-1">
                <span className="text-[10px] text-slate-500 font-mono">PATIENT ID: {Math.floor(Math.random() * 99999)}</span>
                <div className="flex gap-2">
                    <span className="text-[10px] text-green-500 font-bold animate-pulse">● LIVE</span>
                    <span className="text-[10px] text-slate-400">{currentStep.timeOffset}</span>
                </div>
           </div>

           <div className="grid grid-cols-4 gap-4 font-mono text-xs items-center">
              {/* ECG */}
              <div className="col-span-3 h-12"><MonitorWaveform color="#22c55e" speed={hr > 100 ? 1.5 : 0.8} /></div>
              <div className="col-span-1 text-green-500 text-right">
                  <span className="text-3xl font-bold block leading-none">{currentStep.vitals.hr.split(' ')[0]}</span> 
                  <span className="text-[10px] opacity-70">BPM</span>
              </div>
              
              {/* BP */}
              <div className="col-span-3 flex items-center">
                   <div className="h-0.5 w-full bg-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-yellow-900/50 animate-pulse"></div>
                   </div>
              </div>
              <div className="col-span-1 text-yellow-500 text-right">
                  <span className="text-2xl font-bold block leading-none">{currentStep.vitals.bp.split(' ')[0]}</span> 
                  <span className="text-[10px] opacity-70">mmHg</span>
              </div>

               {/* SpO2 */}
               <div className="col-span-3 h-8 opacity-50"><MonitorWaveform color="#3b82f6" speed={1} /></div>
               <div className="col-span-1 text-blue-500 text-right">
                  <span className="text-2xl font-bold block leading-none">{currentStep.vitals.sats.replace('%','')}</span> 
                  <span className="text-[10px] opacity-70">%</span>
              </div>
           </div>
        </div>

        {/* Stepper Navigation */}
        <div className="flex items-center gap-2 mb-6 px-2">
          {[0, 1, 2].map(i => (
              <React.Fragment key={i}>
                <div className={`flex flex-col items-center gap-1 transition-all ${i === stepIndex ? 'flex-1' : ''}`}>
                    <div className={`h-2 w-full rounded-full transition-all duration-500 ${
                        i < stepIndex ? 'bg-emerald-500' : i === stepIndex ? 'bg-primary-500' : 'bg-slate-200'
                    }`}></div>
                    {i === stepIndex && <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">Étape {i+1}</span>}
                </div>
                {i < 2 && <div className="w-1 h-1 rounded-full bg-slate-300"></div>}
              </React.Fragment>
          ))}
        </div>

        {/* Case Card */}
        <div className="medical-card p-6 bg-white shadow-lg border-t-4 border-primary-500">
          
          {/* Context Header */}
          <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                  <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 border border-primary-100">
                      <AlertOctagon className="w-3 h-3" /> {currentCase.title}
                  </span>
              </div>
              
              {stepIndex === 0 && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Contexte Initial</h4>
                      <p className="text-slate-700 italic text-sm">
                          {currentCase.initialContext}
                      </p>
                  </div>
              )}
              
              <div className="flex items-start gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-xl animate-in slide-in-from-left-2 shadow-sm">
                  <Activity className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-blue-400 uppercase mb-1">Évolution {currentStep.timeOffset}</h4>
                    <p className="text-blue-900 font-medium text-sm leading-relaxed">
                        {currentStep.contextUpdate}
                    </p>
                  </div>
              </div>
          </div>

          <h3 className="font-bold text-slate-800 text-lg mb-6 leading-tight">{currentStep.question}</h3>

          <div className="space-y-3 mb-6">
            {currentStep.options.map((opt) => {
              let stateClass = "bg-white border-slate-200 hover:border-primary-300 hover:bg-slate-50";
              const isSelected = selectedOptionId === opt.id;
              
              if (selectedOptionId) {
                  if (isSelected) {
                      stateClass = opt.correct ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-100" : "bg-rose-50 border-rose-500 ring-2 ring-rose-100";
                  } else if (opt.correct) {
                      stateClass = "bg-emerald-50/50 border-emerald-200 border-dashed opacity-70";
                  } else {
                      stateClass = "opacity-40 grayscale border-slate-100";
                  }
              }

              return (
                <button
                  key={opt.id}
                  disabled={!!selectedOptionId}
                  onClick={() => handleSelect(opt)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all relative ${stateClass}`}
                >
                  <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-800 text-sm md:text-base pr-4">{opt.text}</span>
                      {isSelected && (opt.correct ? <CheckCircle className="text-emerald-500 w-5 h-5 shrink-0"/> : <XCircle className="text-rose-500 w-5 h-5 shrink-0"/>)}
                  </div>
                  {selectedOptionId && (isSelected || opt.correct) && (
                      <div className="mt-2 text-xs md:text-sm text-slate-600 border-t border-slate-200/50 pt-2 animate-in fade-in">
                          {opt.explanation}
                      </div>
                  )}
                </button>
              )
            })}
          </div>

          {selectedOptionId && (
              <div className="animate-in slide-in-from-bottom-4 fade-in pt-2">
                  {feedback && (
                      <div className="bg-slate-800 text-slate-200 p-4 rounded-xl mb-4 text-sm flex gap-3 shadow-lg items-center border border-slate-700">
                          <Activity className="shrink-0 text-primary-400 w-5 h-5" />
                          <p>{feedback}</p>
                      </div>
                  )}
                  <button 
                      onClick={nextStep} 
                      className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                      {stepIndex < 2 ? 'Étape Suivante' : 'Terminer le Cas'} <ChevronRight className="w-5 h-5" />
                  </button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

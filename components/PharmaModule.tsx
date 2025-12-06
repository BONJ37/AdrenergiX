
import React, { useState, useEffect } from 'react';
import { DRUGS } from '../data';
import { Pill, AlertTriangle, Scale, X, Check, ArrowRightLeft, Zap, Sparkles, Clock, Beaker, ShieldBan, Info, Loader2, Bot, Lightbulb, Target, Filter, SlidersHorizontal, Search, ChevronRight } from 'lucide-react';
import { DrugData } from '../types';
import { askGeminiTutor } from '../services/geminiService';

// --- COMPONENTS ---

const RadarChart = ({ profile, color, size = 120 }: { profile: DrugData['affinityProfile'], color: string, size?: number }) => {
    const [hoveredPoint, setHoveredPoint] = useState<{x: number, y: number, label: string, value: number} | null>(null);
    
    const center = size / 2;
    const maxRadius = size / 2 - 10;
    const scale = (val: number) => (val / 10) * maxRadius;
    
    const getPoint = (value: number, axisIndex: number) => {
        const angle = (axisIndex * 90 - 90) * (Math.PI / 180);
        return {
            x: center + Math.cos(angle) * scale(value),
            y: center + Math.sin(angle) * scale(value)
        };
    };

    // Construct point data objects
    const pointsData = [
        { label: 'α1', value: profile.alpha1, idx: 0 },
        { label: 'β1', value: profile.beta1, idx: 1 },
        { label: 'β2', value: profile.beta2, idx: 2 },
        { label: 'α2', value: profile.alpha2, idx: 3 }
    ];

    const calculatedPoints = pointsData.map(p => ({
        ...p,
        ...getPoint(p.value, p.idx)
    }));

    const polygonPoints = calculatedPoints.map(p => `${p.x},${p.y}`).join(' ');

    return (
        <svg width={size} height={size} className="overflow-visible select-none">
            {/* Grid Circles */}
            {[2.5, 5, 7.5, 10].map((val, i) => (
                 <circle key={i} cx={center} cy={center} r={scale(val)} fill="none" stroke="#e2e8f0" strokeWidth="1" />
            ))}
            
            {/* Axis Lines */}
            <line x1={center} y1={0} x2={center} y2={size} stroke="#cbd5e1" strokeWidth="1"/>
            <line x1={0} y1={center} x2={size} y2={center} stroke="#cbd5e1" strokeWidth="1"/>
            
            {/* Labels */}
            <text x={center} y={-8} textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="800">α1</text>
            <text x={size + 12} y={center + 4} textAnchor="start" fill="#3b82f6" fontSize="11" fontWeight="800">β1</text>
            <text x={center} y={size + 16} textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="800">β2</text>
            <text x={-12} y={center + 4} textAnchor="end" fill="#f43f5e" fontSize="11" fontWeight="800">α2</text>
            
            {/* Shape */}
            <polygon points={polygonPoints} fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2.5" className="transition-all duration-300 ease-out" />
            
            {/* Interactive Points */}
            {calculatedPoints.map((p, i) => (
                <g key={i}>
                    {/* Invisible larger hit area for easier hovering */}
                    <circle 
                        cx={p.x} cy={p.y} r="12" fill="transparent" 
                        onMouseEnter={() => setHoveredPoint(p)}
                        onMouseLeave={() => setHoveredPoint(null)}
                        className="cursor-pointer"
                    />
                    {/* Visible Dot */}
                    <circle 
                        cx={p.x} cy={p.y} 
                        r={hoveredPoint?.label === p.label ? "6" : "4"} 
                        fill="white" stroke={color} strokeWidth="2" 
                        className="pointer-events-none transition-all duration-200"
                    />
                </g>
            ))}

            {/* Tooltip */}
            {hoveredPoint && (
                <g pointerEvents="none" className="animate-in fade-in zoom-in-95 duration-150">
                    <rect
                        x={hoveredPoint.x - 22}
                        y={hoveredPoint.y - 32}
                        width="44"
                        height="20"
                        rx="4"
                        fill="#1e293b"
                        opacity="0.9"
                    />
                    <text
                        x={hoveredPoint.x}
                        y={hoveredPoint.y - 22}
                        textAnchor="middle"
                        fill="white"
                        fontSize="10"
                        fontWeight="bold"
                        dominantBaseline="middle"
                    >
                        {hoveredPoint.label}: {hoveredPoint.value}
                    </text>
                    {/* Triangle pointer */}
                    <path d={`M${hoveredPoint.x},${hoveredPoint.y - 12} L${hoveredPoint.x - 4},${hoveredPoint.y - 12} L${hoveredPoint.x},${hoveredPoint.y - 7} L${hoveredPoint.x + 4},${hoveredPoint.y - 12} Z`} fill="#1e293b" opacity="0.9" />
                </g>
            )}
        </svg>
    )
}

const PharmacokineticTimeline = ({ pk }: { pk: DrugData['pharmacokinetics'] }) => {
    return (
        <div className="mt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center">
                <Clock className="w-3 h-3 mr-1" /> Chronologie d'action
            </h4>
            <div className="relative h-2 bg-slate-100 rounded-full w-full mt-4 mb-8">
                {/* Timeline base */}
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-200"></div>
                
                {/* Points */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white shadow-sm"></div>
                    <span className="text-[10px] font-bold text-emerald-600 mt-2 whitespace-nowrap">Délai: {pk.onset}</span>
                </div>

                <div className="absolute left-1/3 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white shadow-sm"></div>
                    <span className="text-[10px] font-bold text-blue-600 mt-2 whitespace-nowrap">Pic: {pk.peak}</span>
                </div>

                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-slate-400 ring-4 ring-white shadow-sm"></div>
                    <span className="text-[10px] font-bold text-slate-500 mt-2 whitespace-nowrap">Durée: {pk.duration}</span>
                </div>
            </div>
            <div className="flex justify-between items-center text-xs bg-slate-50 p-2 rounded border border-slate-100">
                 <span className="text-slate-500 font-medium">Demi-vie d'élimination (T½)</span>
                 <span className="font-mono font-bold text-slate-700">{pk.halfLife}</span>
            </div>
        </div>
    )
}

const ComparisonModal = ({ drugIds, onClose }: { drugIds: string[], onClose: () => void }) => {
    const d1 = DRUGS.find(d => d.id === drugIds[0]);
    const d2 = DRUGS.find(d => d.id === drugIds[1]);
    
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
    const [loadingAi, setLoadingAi] = useState(false);

    useEffect(() => {
        const fetchAnalysis = async () => {
            if (!d1 || !d2) return;
            
            setLoadingAi(true);
            setAiAnalysis(null);
            
            const prompt = `Agis comme un expert senior en anesthésie-réanimation. Compare succinctement deux médicaments : ${d1.name} et ${d2.name}.
            Structure ta réponse en 2 points courts :
            1. Différences Hémodynamiques Clés (Vasoconstriction, FC, Contractilité).
            2. Choix Clinique (Quand choisir l'un vs l'autre).
            Reste concis (max 100 mots).`;

            try {
                const response = await askGeminiTutor(prompt, "Comparaison Pharmacologique");
                setAiAnalysis(response);
            } catch (error) {
                console.error("Failed to fetch AI analysis", error);
                setAiAnalysis("Analyse IA indisponible pour le moment.");
            } finally {
                setLoadingAi(false);
            }
        };

        fetchAnalysis();
    }, [d1, d2]);

    if (!d1 || !d2) return null;

    const generateComparisonAnalysis = () => {
        const points = [];
        if (d1.class !== d2.class) {
            points.push({ title: "Classe", text: `${d1.name} est ${d1.class}, ${d2.name} est ${d2.class}.`, icon: <ArrowRightLeft className="w-4 h-4 text-orange-500" /> });
        }
        const a1Diff = d1.affinityProfile.alpha1 - d2.affinityProfile.alpha1;
        if (Math.abs(a1Diff) >= 3) {
            points.push({ title: "Vasoconstriction", text: `${a1Diff > 0 ? d1.name : d2.name} est plus vasoconstricteur (α1).`, icon: <Zap className="w-4 h-4 text-red-500" /> });
        }
        return points;
    };

    const analysisPoints = generateComparisonAnalysis();

    const renderDrugColumn = (drug: DrugData) => {
        const isAgonist = drug.class === 'Agoniste';
        const color = isAgonist ? '#10b981' : '#f43f5e';
        return (
            <div className="flex flex-col gap-4">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-800">{drug.name}</h3>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold uppercase ${isAgonist ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {drug.class}
                    </span>
                </div>
                <div className="flex justify-center py-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <RadarChart profile={drug.affinityProfile} color={color} size={140} />
                </div>
                <div className="space-y-3 text-sm">
                     <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                        <span className="text-xs font-bold text-slate-400 block uppercase">Dose Usuelle</span>
                        <p className="text-slate-800 font-medium">{drug.dose}</p>
                     </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 md:p-6">
            <div className="bg-white w-full h-[90vh] md:h-auto md:max-h-[90vh] md:max-w-4xl rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                <div className="flex justify-between items-center p-5 border-b border-slate-100">
                     <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Scale className="text-primary-600" /> Comparateur
                     </h2>
                     <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-600 transition-colors">
                         <X className="w-6 h-6" />
                     </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                     
                     {/* Static Comparison Points */}
                     {analysisPoints.length > 0 && (
                        <div className="mb-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center">
                                <Sparkles className="w-3 h-3 mr-1" /> Différences Rapides
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {analysisPoints.map((p, i) => (
                                    <div key={i} className="flex gap-2 items-start">
                                        <div className="mt-1">{p.icon}</div>
                                        <p className="text-sm text-slate-700">{p.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                     )}

                     {/* AI Analysis Section */}
                     <div className="mb-6 bg-gradient-to-br from-primary-50 to-white p-5 rounded-2xl border border-primary-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Bot className="w-24 h-24 text-primary-500" />
                        </div>
                        <h4 className="text-sm font-bold text-primary-700 uppercase mb-3 flex items-center gap-2 relative z-10">
                             <Bot className="w-4 h-4" /> Analyse Clinique IA
                        </h4>
                        
                        {loadingAi ? (
                            <div className="flex items-center gap-3 py-4 text-primary-600">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="text-sm font-medium">Génération de l'analyse comparative...</span>
                            </div>
                        ) : aiAnalysis ? (
                            <div className="prose prose-sm text-slate-700 leading-relaxed relative z-10">
                                <div dangerouslySetInnerHTML={{ __html: aiAnalysis.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            </div>
                        ) : (
                            <div className="text-sm text-slate-400 italic">Analyse indisponible.</div>
                        )}
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {renderDrugColumn(d1)}
                         <div className="md:hidden border-t border-slate-200 my-2 relative">
                             <span className="absolute left-1/2 -top-3 -translate-x-1/2 bg-slate-50 px-2 text-slate-400 font-bold">VS</span>
                         </div>
                         {renderDrugColumn(d2)}
                     </div>
                </div>
            </div>
        </div>
    )
}

const DrugDetailModal = ({ drug, onClose }: { drug: DrugData, onClose: () => void }) => {
    const [aiSummary, setAiSummary] = useState<string | null>(null);
    const [loadingSummary, setLoadingSummary] = useState(false);

    useEffect(() => {
        if (!drug) return;
        
        const fetchSummary = async () => {
            setLoadingSummary(true);
            setAiSummary(null);

            const prompt = `Pour le médicament ${drug.name} (Anesthésie/Réanimation), génère 3 points clés essentiels sous forme de bullet points courts :
            1. Usage Principal (Indication majeure)
            2. Point Critique (Contre-indication absolue ou piège mortel)
            3. Effet Indésirable (Le plus fréquent ou dangereux)
            
            Reste très concis, style télégraphique. Utilise le format :
            • **Usage** : ...
            • **Danger** : ...
            • **Effet** : ...`;

            try {
                const response = await askGeminiTutor(prompt, "Fiche Médicament");
                setAiSummary(response);
            } catch (error) {
                console.error("AI Fetch Error", error);
                setAiSummary("Analyse IA indisponible.");
            } finally {
                setLoadingSummary(false);
            }
        };

        fetchSummary();
    }, [drug]);

    if (!drug) return null;
    const isAgonist = drug.class === 'Agoniste';
    const color = isAgonist ? '#10b981' : '#f43f5e';
    const themeClass = isAgonist ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-rose-600 bg-rose-50 border-rose-200';

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 md:p-6">
            <div className="bg-white w-full h-[95vh] md:h-[85vh] md:max-w-4xl rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-white z-10">
                    <div>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border mb-2 ${themeClass}`}>
                            {isAgonist ? <Zap className="w-3 h-3" /> : <ShieldBan className="w-3 h-3" />}
                            {drug.class}
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 leading-tight">{drug.name}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                        <X className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Left Column: Visuals */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Radar */}
                            <div className="medical-card p-6 flex flex-col items-center bg-white">
                                <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">Profil d'Affinité</h3>
                                <RadarChart profile={drug.affinityProfile} color={color} size={160} />
                                <div className="mt-6 text-center w-full">
                                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 mb-2 uppercase">
                                        <Target className="w-3 h-3" /> Sélectivité Récepteurs
                                    </div>
                                    <p className="text-sm text-slate-700 font-medium leading-tight px-2 bg-slate-50 py-3 rounded-lg border border-slate-100">
                                        {drug.selectiveAffinity}
                                    </p>
                                </div>
                            </div>

                            {/* Dosage */}
                            <div className="medical-card p-5 bg-white border-l-4 border-primary-500">
                                <h3 className="flex items-center text-sm font-bold text-slate-800 uppercase mb-2">
                                    <Beaker className="w-4 h-4 mr-2 text-primary-500" /> Posologie Usuelle
                                </h3>
                                <p className="text-lg font-mono font-bold text-slate-700">{drug.dose}</p>
                            </div>
                        </div>

                        {/* Right Column: Text Data */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* AI Summary Section */}
                            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 relative overflow-hidden shadow-sm">
                                <div className="absolute top-0 right-0 p-3 opacity-5">
                                    <Bot className="w-20 h-20 text-indigo-600" />
                                </div>
                                <h3 className="flex items-center text-sm font-bold text-indigo-700 uppercase mb-3 relative z-10">
                                    <Lightbulb className="w-4 h-4 mr-2" /> Synthèse Express (IA)
                                </h3>
                                
                                {loadingSummary ? (
                                    <div className="flex items-center gap-3 py-2 text-indigo-600/70">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span className="text-sm">Analyse clinique en cours...</span>
                                    </div>
                                ) : aiSummary ? (
                                    <div className="prose prose-sm text-indigo-900/90 leading-relaxed relative z-10">
                                        <div dangerouslySetInnerHTML={{ __html: aiSummary.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                    </div>
                                ) : (
                                    <div className="text-sm text-indigo-400 italic">Information non disponible.</div>
                                )}
                            </div>

                            {/* Mechanism */}
                            <div className="medical-card p-6 bg-white">
                                <h3 className="flex items-center text-sm font-bold text-slate-800 uppercase mb-3">
                                    <Info className="w-4 h-4 mr-2 text-primary-500" /> Mécanisme d'action
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                                    {drug.mechanism}
                                </p>
                            </div>

                            {/* Pharmacokinetics */}
                            <div className="medical-card p-6 bg-white">
                                <PharmacokineticTimeline pk={drug.pharmacokinetics} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Indications */}
                                <div className="medical-card p-5 bg-emerald-50/50 border-emerald-100">
                                    <h3 className="flex items-center text-sm font-bold text-emerald-700 uppercase mb-3">
                                        <Check className="w-4 h-4 mr-2" /> Indications Clés
                                    </h3>
                                    <ul className="space-y-2">
                                        {drug.clinicalUse.map((use, i) => (
                                            <li key={i} className="flex items-start text-sm text-emerald-900">
                                                <span className="mr-2">•</span> {use}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Contraindications/Precautions */}
                                <div className="medical-card p-5 bg-rose-50/50 border-rose-100">
                                    <h3 className="flex items-center text-sm font-bold text-rose-700 uppercase mb-3">
                                        <AlertTriangle className="w-4 h-4 mr-2" /> Précautions & CI
                                    </h3>
                                    <ul className="space-y-2">
                                        {drug.contraindications && drug.contraindications.map((ci, i) => (
                                            <li key={i} className="flex items-start text-sm text-rose-900 font-semibold">
                                                <span className="mr-2">×</span> {ci}
                                            </li>
                                        ))}
                                        <li className="flex items-start text-sm text-rose-800 italic mt-2 pt-2 border-t border-rose-200">
                                            <span className="mr-2">!</span> {drug.precautions}
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- FINDER MODULE ---

const FinderModule = ({ onSelectDrug }: { onSelectDrug: (id: string) => void }) => {
    const [targets, setTargets] = useState({ alpha1: 0, alpha2: 0, beta1: 0, beta2: 0 });
    const [matches, setMatches] = useState<{drug: DrugData, score: number}[]>([]);

    useEffect(() => {
        // Simple matching algorithm: Calculate Euclidean distance
        const results = DRUGS.map(drug => {
            const p = drug.affinityProfile;
            // Difference squared
            const diff = 
                Math.pow(p.alpha1 - targets.alpha1, 2) +
                Math.pow(p.alpha2 - targets.alpha2, 2) +
                Math.pow(p.beta1 - targets.beta1, 2) +
                Math.pow(p.beta2 - targets.beta2, 2);
            return { drug, score: Math.sqrt(diff) };
        });

        // Sort by lowest score (closest match)
        results.sort((a, b) => a.score - b.score);
        setMatches(results.slice(0, 6)); // Top 6
    }, [targets]);

    const handleSlider = (key: keyof typeof targets, val: string) => {
        setTargets(prev => ({...prev, [key]: parseInt(val)}));
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            {/* Input Section */}
            <div className="medical-card p-6 bg-white border-t-4 border-indigo-500">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <SlidersHorizontal className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Définir le Profil Cible</h3>
                        <p className="text-sm text-slate-500">Ajustez les curseurs pour trouver la molécule idéale.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {[
                        { key: 'alpha1', label: 'α1 (Vasoconstriction)', color: 'accent-red-500' },
                        { key: 'beta1', label: 'β1 (Inotrope/Chrono)', color: 'accent-blue-500' },
                        { key: 'beta2', label: 'β2 (Broncho/Vasodil)', color: 'accent-blue-400' },
                        { key: 'alpha2', label: 'α2 (Sédation/Modulation)', color: 'accent-red-400' },
                    ].map((item) => (
                        <div key={item.key}>
                            <div className="flex justify-between mb-2 text-sm font-bold text-slate-700">
                                <span>{item.label}</span>
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                                    {(targets as any)[item.key]}/10
                                </span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="10" 
                                value={(targets as any)[item.key]} 
                                onChange={(e) => handleSlider(item.key as any, e.target.value)}
                                className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${item.color}`}
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
                                <span>Nul</span>
                                <span>Modéré</span>
                                <span>Fort</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Search className="w-5 h-5 text-indigo-500" /> Meilleurs Résultats
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matches.map(({drug, score}) => {
                        const matchPercent = Math.max(0, 100 - (score * 5)); // Rough approximation
                        return (
                            <div 
                                key={drug.id}
                                onClick={() => onSelectDrug(drug.id)}
                                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                                        matchPercent > 80 ? 'bg-emerald-100 text-emerald-600' : 
                                        matchPercent > 50 ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {Math.round(matchPercent)}%
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{drug.name}</h4>
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${drug.class === 'Agoniste' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                            {drug.class}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-300" />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

// --- MAIN MODULE ---

export const PharmaModule: React.FC = () => {
  const [viewMode, setViewMode] = useState<'catalog' | 'finder'>('catalog');
  
  const [filterClass, setFilterClass] = useState<'All' | 'Agoniste' | 'Antagoniste'>('All');
  const [filterReceptor, setFilterReceptor] = useState<string>('All');
  const [filterIntensity, setFilterIntensity] = useState<'All' | 'High' | 'Moderate' | 'Low'>('All');
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewDetailId, setViewDetailId] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  // Advanced Filtering Logic for Catalog
  const filteredDrugs = DRUGS.filter(d => {
      // 1. Filter by Class
      const matchClass = filterClass === 'All' || d.class === filterClass;
      
      // 2. Filter by Receptor & Intensity
      let matchReceptor = true;
      if (filterReceptor !== 'All') {
          // @ts-ignore
          const affinity = d.affinityProfile[filterReceptor];
          
          if (filterIntensity === 'All') {
               matchReceptor = affinity >= 2; // Show anything relevant
          } else if (filterIntensity === 'High') {
               matchReceptor = affinity >= 8;
          } else if (filterIntensity === 'Moderate') {
               matchReceptor = affinity >= 5 && affinity < 8;
          } else if (filterIntensity === 'Low') {
               matchReceptor = affinity >= 1 && affinity < 5;
          }
      }

      return matchClass && matchReceptor;
  });

  const toggleSelect = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (selectedIds.includes(id)) {
          setSelectedIds(prev => prev.filter(item => item !== id));
      } else {
          if (selectedIds.length >= 2) setSelectedIds(prev => [prev[0], id]);
          else setSelectedIds(prev => [...prev, id]);
      }
  };

  const receptors = [
      { id: 'alpha1', label: 'α1', color: 'text-red-600 bg-red-50 border-red-200' },
      { id: 'alpha2', label: 'α2', color: 'text-red-600 bg-red-50 border-red-200' },
      { id: 'beta1', label: 'β1', color: 'text-blue-600 bg-blue-50 border-blue-200' },
      { id: 'beta2', label: 'β2', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  ];

  return (
    <div className="h-full overflow-y-auto pb-32 md:pb-6 px-4 pt-4">
      
      {/* MODE SWITCHER */}
      <div className="flex justify-center mb-6">
          <div className="bg-slate-100 p-1 rounded-xl flex">
              <button 
                  onClick={() => setViewMode('catalog')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'catalog' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
              >
                  <Beaker className="w-4 h-4" /> Catalogue
              </button>
              <button 
                  onClick={() => setViewMode('finder')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'finder' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
              >
                  <Target className="w-4 h-4" /> Drug Finder
              </button>
          </div>
      </div>

      {viewMode === 'finder' ? (
          <FinderModule onSelectDrug={setViewDetailId} />
      ) : (
          <>
            {/* FILTER TOOLBAR (CATALOG MODE) */}
            <div className="flex flex-col md:flex-row justify-center gap-4 mb-8 sticky top-0 z-20 pt-2 pb-2 bg-gradient-to-b from-slate-50 to-transparent">
                
                {/* Class Filter */}
                <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex self-center">
                {['All', 'Agoniste', 'Antagoniste'].map((f) => (
                    <button
                    key={f}
                    onClick={() => setFilterClass(f as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        filterClass === f ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                    >
                    {f === 'All' ? 'Tous' : f + 's'}
                    </button>
                ))}
                </div>

                {/* Receptor Filter */}
                <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex gap-1 self-center overflow-x-auto max-w-full items-center">
                    <button
                        onClick={() => {setFilterReceptor('All'); setFilterIntensity('All')}}
                        className={`px-3 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                            filterReceptor === 'All' ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:bg-slate-50'
                        }`}
                    >
                        <Filter className="w-4 h-4" />
                    </button>
                    {receptors.map(r => (
                        <button
                            key={r.id}
                            onClick={() => setFilterReceptor(r.id)}
                            className={`px-3 py-2 rounded-lg text-sm font-black font-mono border transition-all ${
                                filterReceptor === r.id ? r.color + ' ring-2 ring-offset-1 ring-slate-200' : 'border-transparent text-slate-400 hover:bg-slate-50'
                            }`}
                        >
                            {r.label}
                        </button>
                    ))}
                    
                    {/* Intensity Filter (Only visible if a receptor is selected) */}
                    {filterReceptor !== 'All' && (
                        <div className="flex items-center gap-1 border-l border-slate-200 pl-2 ml-1 animate-in fade-in slide-in-from-left-2">
                            {[
                                { id: 'All', label: 'Tout' },
                                { id: 'High', label: 'Fort >8' },
                                { id: 'Moderate', label: 'Modéré 5-7' },
                                { id: 'Low', label: 'Faible <5' },
                            ].map(lvl => (
                                <button
                                    key={lvl.id}
                                    onClick={() => setFilterIntensity(lvl.id as any)}
                                    className={`px-2 py-1.5 rounded text-xs font-bold transition-all ${
                                        filterIntensity === lvl.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-100'
                                    }`}
                                >
                                    {lvl.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* CLASS SUMMARY SECTION */}
            {filterClass !== 'All' && (
                <div className={`max-w-3xl mx-auto mb-8 p-6 rounded-2xl border flex flex-col md:flex-row items-center gap-6 shadow-sm animate-in fade-in slide-in-from-top-4
                    ${filterClass === 'Agoniste' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
                    
                    {/* Visual */}
                    <div className="shrink-0 bg-white p-4 rounded-full shadow-sm border border-slate-100">
                        <RadarChart 
                            profile={filterClass === 'Agoniste' 
                                ? { alpha1: 8, alpha2: 6, beta1: 9, beta2: 7 } 
                                : { alpha1: 2, alpha2: 0, beta1: 9, beta2: 9 }
                            } 
                            color={filterClass === 'Agoniste' ? '#10b981' : '#f43f5e'} 
                            size={100} 
                        />
                    </div>

                    {/* Text */}
                    <div className="text-center md:text-left">
                        <h3 className={`text-lg font-black uppercase tracking-wide mb-2 ${filterClass === 'Agoniste' ? 'text-emerald-700' : 'text-rose-700'}`}>
                            Profil Type : {filterClass}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {filterClass === 'Agoniste' 
                                ? "Les agonistes miment l'action des catécholamines endogènes. Le profil type montre une stimulation élevée (α et/ou β) entraînant une réponse physiologique positive (Vasoconstriction, Inotropisme)." 
                                : "Les antagonistes bloquent l'accès aux récepteurs. Le profil type montre une haute affinité (souvent β-bloquant ou α-bloquant) sans activité intrinsèque, empêchant l'action des catécholamines."}
                        </p>
                    </div>
                </div>
            )}

            {/* GRID DISPLAY */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in slide-in-from-bottom-4 duration-500">
                {filteredDrugs.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                        <Filter className="w-10 h-10 mx-auto mb-3 opacity-20" />
                        <p className="font-medium">Aucune molécule ne correspond.</p>
                        <p className="text-xs mt-1 opacity-70">Essayez de réduire le niveau d'intensité requis.</p>
                        <button onClick={() => {setFilterClass('All'); setFilterReceptor('All'); setFilterIntensity('All')}} className="mt-4 text-primary-600 underline text-sm font-bold">Réinitialiser les filtres</button>
                    </div>
                ) : (
                    filteredDrugs.map((drug) => {
                        const isAgonist = drug.class === 'Agoniste';
                        const isSelected = selectedIds.includes(drug.id);
                        return (
                        <div 
                            key={drug.id} 
                            onClick={() => setViewDetailId(drug.id)}
                            className={`medical-card relative overflow-hidden cursor-pointer group hover:shadow-xl hover:-translate-y-1 transition-all border-2 bg-white
                            ${isSelected ? 'border-primary-500 ring-2 ring-primary-100 shadow-primary-100' : 'border-transparent'}`}
                        >
                            {/* Header Color Bar */}
                            <div className={`h-1.5 w-full ${isAgonist ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                            
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${isAgonist ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                        {drug.class}
                                    </span>
                                    
                                    {/* Selection Checkbox */}
                                    <button 
                                        onClick={(e) => toggleSelect(e, drug.id)}
                                        className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary-600 border-primary-600 text-white' : 'bg-slate-50 border-slate-200 text-transparent hover:border-primary-300'}`}
                                    >
                                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                    </button>
                                </div>

                                <h3 className="text-xl font-black text-slate-800 mb-1 group-hover:text-primary-600 transition-colors">
                                    {drug.name}
                                </h3>
                                
                                <div className="flex gap-1 mb-3">
                                    {drug.affinityProfile.alpha1 >= 7 && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1 rounded">α1</span>}
                                    {drug.affinityProfile.beta1 >= 7 && <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-1 rounded">β1</span>}
                                    {drug.affinityProfile.beta2 >= 7 && <span className="text-[10px] font-bold text-blue-400 bg-blue-50 px-1 rounded">β2</span>}
                                    {drug.affinityProfile.alpha2 >= 7 && <span className="text-[10px] font-bold text-red-400 bg-red-50 px-1 rounded">α2</span>}
                                </div>
                                
                                <p className="text-xs text-slate-500 font-medium mb-4 h-8 line-clamp-2 leading-relaxed">
                                    {drug.mechanism}
                                </p>

                                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-slate-50">
                                    <Pill className="w-3 h-3 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-600 truncate">{drug.dose.split(' ')[0]}...</span>
                                </div>
                            </div>
                        </div>
                        )
                    })
                )}
            </div>

            {/* Comparison Floating Bar */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto z-40 animate-in slide-in-from-bottom-4">
                <div className="bg-slate-900 text-white p-2 pl-4 pr-2 rounded-full shadow-2xl flex items-center justify-between gap-6 border border-slate-700">
                    <span className="font-bold text-sm pl-2">{selectedIds.length} sélectionné(s)</span>
                    <div className="flex gap-2">
                        {selectedIds.length === 2 ? (
                            <button 
                                onClick={() => setShowComparison(true)}
                                className="bg-primary-500 hover:bg-primary-400 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-primary-500/25 flex items-center gap-2"
                            >
                                <Scale className="w-4 h-4" /> Comparer
                            </button>
                        ) : (
                            <span className="text-xs text-slate-400 py-2.5 px-2">Sélectionnez 2 items</span>
                        )}
                        <button onClick={() => {setSelectedIds([]); setShowComparison(false)}} className="p-2.5 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-300 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                </div>
            )}
          </>
      )}

      {/* Modals */}
      {viewDetailId && (
        <DrugDetailModal 
            drug={DRUGS.find(d => d.id === viewDetailId)!} 
            onClose={() => setViewDetailId(null)} 
        />
      )}
      
      {showComparison && (
        <ComparisonModal 
            drugIds={selectedIds} 
            onClose={() => setShowComparison(false)} 
        />
      )}
    </div>
  );
};

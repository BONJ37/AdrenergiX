import React, { useState, useEffect } from 'react';
import { ReceptorModule } from './components/ReceptorModule';
import { PharmaModule } from './components/PharmaModule';
import { ScenarioModule } from './components/ScenarioModule';
import { Activity, BookOpen, BrainCircuit, Table, CheckCircle, RefreshCw, Trophy, AlertCircle } from 'lucide-react';
import { QUIZ_QUESTIONS } from './data';
import { QuizQuestion } from './types';

// Helper function to shuffle and pick 20 questions
const generateQuizSession = (): QuizQuestion[] => {
    // Fisher-Yates shuffle
    const shuffled = [...QUIZ_QUESTIONS];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 20);
};

const QuizModule = () => {
    const [sessionQuestions, setSessionQuestions] = useState<QuizQuestion[]>([]);
    const [qIndex, setQIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);

    // Initial load
    useEffect(() => {
        startNewQuiz();
    }, []);

    const startNewQuiz = () => {
        const newQuestions = generateQuizSession();
        setSessionQuestions(newQuestions);
        setQIndex(0);
        setScore(0);
        setShowAnswer(false);
        setQuizFinished(false);
        setSelectedOptionIndex(null);
    };

    const handleOptionSelect = (idx: number) => {
        if (showAnswer) return;
        setSelectedOptionIndex(idx);
        setShowAnswer(true);
        if (idx === sessionQuestions[qIndex].correctIndex) {
            setScore(prev => prev + 1);
        }
    };

    const nextQuestion = () => {
        if (qIndex < sessionQuestions.length - 1) {
            setQIndex(prev => prev + 1);
            setShowAnswer(false);
            setSelectedOptionIndex(null);
        } else {
            setQuizFinished(true);
        }
    };

    if (sessionQuestions.length === 0) return <div>Chargement du quiz...</div>;

    // --- RESULT SCREEN ---
    if (quizFinished) {
        const percentage = Math.round((score / sessionQuestions.length) * 100);
        let feedback = "";
        let color = "";
        if (percentage >= 80) { feedback = "Excellent ! Expert en devenir."; color = "text-emerald-600"; }
        else if (percentage >= 50) { feedback = "Bien. Encore quelques révisions."; color = "text-blue-600"; }
        else { feedback = "Attention. Révisez les bases."; color = "text-red-600"; }

        return (
            <div className="p-4 h-full overflow-y-auto pb-24 md:pb-6 flex items-center justify-center">
                <div className="medical-card p-8 max-w-md w-full bg-white text-center animate-in zoom-in duration-300">
                    <div className="flex justify-center mb-6">
                        <div className={`p-6 rounded-full ${percentage >= 50 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                            <Trophy className={`w-12 h-12 ${percentage >= 50 ? 'text-emerald-600' : 'text-red-600'}`} />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 mb-2">Quiz Terminé</h2>
                    <div className="text-5xl font-black text-slate-900 mb-4">{score} <span className="text-2xl text-slate-400 font-medium">/ 20</span></div>
                    <p className={`text-lg font-bold mb-8 ${color}`}>{feedback}</p>
                    
                    <button 
                        onClick={startNewQuiz}
                        className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        <RefreshCw className="w-5 h-5" /> Nouveau Test (20 Q)
                    </button>
                </div>
            </div>
        );
    }

    // --- GAME SCREEN ---
    const question = sessionQuestions[qIndex];

    return (
        <div className="p-4 h-full overflow-y-auto pb-24 md:pb-6">
            <div className="medical-card p-6 max-w-2xl mx-auto bg-white min-h-[500px] flex flex-col">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <CheckCircle className="text-primary-500 w-6 h-6" /> 
                        <span className="hidden sm:inline">Test Dynamique</span>
                    </h3>
                    <div className="flex items-center gap-3">
                         <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-500 transition-all duration-500" style={{width: `${((qIndex + 1) / 20) * 100}%`}}></div>
                         </div>
                         <span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-500 font-bold">
                            {qIndex + 1} / 20
                        </span>
                    </div>
                </div>
                
                {/* Question */}
                <div className="flex-1">
                    <span className="inline-block px-2 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2 rounded border border-slate-100">
                        {question.category}
                    </span>
                    <p className="text-lg md:text-xl font-medium text-slate-800 mb-8 leading-relaxed">
                        {question.question}
                    </p>
                    
                    {/* Options */}
                    <div className="space-y-3 mb-8">
                        {question.options.map((opt, idx) => {
                            let btnClass = "border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-700";
                            if (showAnswer) {
                                if (idx === question.correctIndex) {
                                    btnClass = "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500 font-bold";
                                } else if (idx === selectedOptionIndex) {
                                    btnClass = "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500 opacity-70";
                                } else {
                                    btnClass = "border-slate-100 opacity-50";
                                }
                            }

                            return (
                                <button 
                                    key={idx}
                                    disabled={showAnswer}
                                    onClick={() => handleOptionSelect(idx)}
                                    className={`w-full p-4 rounded-xl text-left border-2 transition-all font-medium relative ${btnClass}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span>{opt}</span>
                                        {showAnswer && idx === question.correctIndex && <CheckCircle className="w-5 h-5 text-green-600" />}
                                        {showAnswer && idx === selectedOptionIndex && idx !== question.correctIndex && <AlertCircle className="w-5 h-5 text-red-600" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer / Explanation */}
                <div className="min-h-[100px]">
                    {showAnswer && (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            <div className="bg-primary-50 p-4 rounded-xl border border-primary-100 mb-4">
                                <p className="text-primary-700 font-bold text-xs uppercase mb-1 flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" /> Explication
                                </p>
                                <p className="text-primary-900 text-sm leading-relaxed">{question.explanation}</p>
                            </div>
                            <div className="flex justify-end">
                                <button 
                                    onClick={nextQuestion}
                                    className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg active:scale-95"
                                >
                                    {qIndex === 19 ? "Voir Résultats" : "Question Suivante"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const TablesModule = () => (
    <div className="p-4 h-full overflow-y-auto pb-24 md:pb-6">
        <div className="medical-card overflow-hidden bg-white max-w-4xl mx-auto">
            <div className="p-6 bg-slate-50 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Table className="text-primary-500" /> Données Rapides
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-white text-slate-400 uppercase text-xs tracking-wider border-b border-slate-100">
                            <th className="p-4 font-bold">Molécule</th>
                            <th className="p-4 font-bold">Cibles</th>
                            <th className="p-4 font-bold">Usage</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {[{n:'Noradrénaline',c:'α1, α2, β1',u:'Choc septique'},{n:'Adrénaline',c:'α1, β1, β2',u:'ACR, Choc'},{n:'Dobutamine',c:'β1 > β2',u:'Choc Cardio'},{n:'Phényléphrine',c:'α1 pur',u:'Hypotension AG'},{n:'Isoprénaline',c:'β1, β2',u:'Bradycardie'}].map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                                <td className="p-4 font-bold text-slate-700">{row.n}</td>
                                <td className="p-4 text-primary-600 font-mono text-xs bg-primary-50/50 rounded">{row.c}</td>
                                <td className="p-4 text-slate-500">{row.u}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
)

type View = 'receptors' | 'pharma' | 'scenarios' | 'quiz' | 'tables';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('receptors');

  const navItems = [
    { id: 'receptors', label: '3D', icon: <BrainCircuit className="w-6 h-6" /> },
    { id: 'pharma', label: 'Pharma', icon: <BookOpen className="w-6 h-6" /> },
    { id: 'scenarios', label: 'Simu', icon: <Activity className="w-6 h-6" /> },
    { id: 'quiz', label: 'Quiz', icon: <CheckCircle className="w-6 h-6" /> },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'receptors': return <ReceptorModule />;
      case 'pharma': return <PharmaModule />;
      case 'scenarios': return <ScenarioModule />;
      case 'quiz': return <QuizModule />;
      case 'tables': return <TablesModule />;
      default: return <ReceptorModule />;
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-background text-slate-800">
      
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shadow-sm z-20">
        <div className="p-6">
            <h1 className="text-2xl font-black text-primary-600 tracking-tight">MedEdu-AI</h1>
            <p className="text-xs text-slate-400 font-medium">Pharmacologie Interactive</p>
        </div>
        <div className="flex-1 px-3 space-y-1">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as View)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                        currentView === item.id 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    {item.icon}
                    <span>{item.label === '3D' ? 'Récepteurs' : item.label === 'Simu' ? 'Simulation' : item.label}</span>
                </button>
            ))}
            <button onClick={() => setCurrentView('tables')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-slate-500 hover:bg-slate-50 ${currentView === 'tables' ? 'bg-primary-50 text-primary-700' : ''}`}>
                <Table className="w-6 h-6" /> <span>Données</span>
            </button>
        </div>
      </nav>

      {/* Main Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
         {/* Desktop Header */}
         <header className="hidden md:flex h-16 bg-white/80 backdrop-blur border-b border-slate-200 items-center justify-between px-6 z-10">
             <h2 className="font-bold text-slate-700">Module {currentView.charAt(0).toUpperCase() + currentView.slice(1)}</h2>
         </header>

         {/* Content Scroll Area */}
         <div className="flex-1 overflow-hidden relative">
            {renderContent()}
         </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center p-2">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as View)}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                        currentView === item.id 
                        ? 'text-primary-600 scale-105' 
                        : 'text-slate-400'
                    }`}
                >
                    {item.icon}
                    <span className="text-[10px] font-bold mt-1">{item.label}</span>
                </button>
            ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
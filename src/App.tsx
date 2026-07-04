import React, { useState } from 'react';
import { Participant, TabType } from './types';
import { INITIAL_PARTICIPANTS } from './data';
import ExcelGrid from './components/ExcelGrid';
import Dashboard from './components/Dashboard';
import ProfileReport from './components/ProfileReport';
import Questionnaire from './components/Questionnaire';
import { LayoutDashboard, FileSpreadsheet, ClipboardList, FileText, Compass, Sparkles } from 'lucide-react';

export default function App() {
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [selectedId, setSelectedId] = useState<string>('p-1');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Handle active participant selection
  const handleSelectParticipant = (id: string) => {
    setSelectedId(id);
  };

  // Handle spreadsheet updates
  const handleUpdateParticipants = (updated: Participant[]) => {
    setParticipants(updated);
  };

  // Handle direct notes/observations editing in report tab
  const handleUpdateNotes = (id: string, notes: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, notes } : p))
    );
  };

  // Handle new questionnaire completions
  const handleCompleteQuestionnaire = (newParticipant: Participant) => {
    setParticipants((prev) => [...prev, newParticipant]);
    setSelectedId(newParticipant.id);
    setActiveTab('dashboard'); // Redirect to dashboard to see results
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800 antialiased font-sans" id="app-root-container">
      
      {/* Top Navigation Bar (Excel / Professional Blue Style) - Hidden on Print */}
      <nav className="bg-[#2b579a] text-white px-6 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden" id="app-header">
        <div className="flex items-center gap-4">
          <div className="bg-white p-1.5 rounded shadow-sm flex items-center justify-center shrink-0">
            <Compass className="h-6 w-6 text-[#2b579a]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight">Analizador CIPC-R</h1>
              <span className="bg-white/15 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                Automatización de Intereses
              </span>
            </div>
            <p className="text-xs text-blue-100/80 font-medium mt-0.5">
              Plataforma de Diagnóstico y Baremo Vocacional Cooperativo
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="text-[11px] bg-[#1e3e6d] text-blue-100 px-3 py-1 rounded border border-blue-400/20 font-mono">
            Registros Activos: {participants.length}
          </span>
          <span className="text-[11px] bg-white text-[#2b579a] px-3 py-1 rounded font-bold shadow-sm font-sans">
            Base de Datos: Conectada
          </span>
        </div>
      </nav>

      {/* Professional Tab System Bar - Hidden on Print */}
      <div className="bg-white border-b border-slate-300 flex px-6 overflow-x-auto scrollbar-none print:hidden" id="app-tabs">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`py-3.5 px-5 text-sm font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'dashboard'
              ? 'border-b-3 border-[#2b579a] text-[#2b579a]'
              : 'border-b-3 border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
          id="tab-btn-dashboard"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard Principal
        </button>
        
        <button
          onClick={() => setActiveTab('spreadsheet')}
          className={`py-3.5 px-5 text-sm font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'spreadsheet'
              ? 'border-b-3 border-[#2b579a] text-[#2b579a]'
              : 'border-b-3 border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
          id="tab-btn-spreadsheet"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Matriz de Cálculo
        </button>
        
        <button
          onClick={() => setActiveTab('questionnaire')}
          className={`py-3.5 px-5 text-sm font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'questionnaire'
              ? 'border-b-3 border-[#2b579a] text-[#2b579a]'
              : 'border-b-3 border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
          id="tab-btn-questionnaire"
        >
          <ClipboardList className="h-4 w-4" />
          Cuestionario Respondido
        </button>
        
        <button
          onClick={() => setActiveTab('report')}
          className={`py-3.5 px-5 text-sm font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'report'
              ? 'border-b-3 border-[#2b579a] text-[#2b579a]'
              : 'border-b-3 border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
          id="tab-btn-report"
        >
          <FileText className="h-4 w-4" />
          Configuración e Informe
        </button>
      </div>

      {/* Main Working Space Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 print:p-0" id="app-main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            participants={participants}
            selectedId={selectedId}
            onSelect={handleSelectParticipant}
          />
        )}

        {activeTab === 'spreadsheet' && (
          <ExcelGrid
            participants={participants}
            selectedId={selectedId}
            onSelect={handleSelectParticipant}
            onUpdate={handleUpdateParticipants}
          />
        )}

        {activeTab === 'questionnaire' && (
          <Questionnaire onComplete={handleCompleteQuestionnaire} />
        )}

        {activeTab === 'report' && (
          <ProfileReport
            participants={participants}
            selectedId={selectedId}
            onUpdateNotes={handleUpdateNotes}
          />
        )}
      </main>

      {/* Bottom Status Bar (Dark Slated) - Hidden on Print */}
      <footer className="bg-slate-800 text-slate-400 px-6 py-2.5 text-[10px] flex justify-between items-center print:hidden" id="app-footer">
        <div className="flex gap-4">
          <span>Registros: {participants.length}</span>
          <span>Base de Datos: Conectada (Local Sim)</span>
          <span>Versión: 2.1.0-CIPC</span>
        </div>
        <div>
          © 2026 ProQuest Systems | Generado automáticamente
        </div>
      </footer>
    </div>
  );
}

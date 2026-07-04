import React, { useMemo, useState } from 'react';
import { Participant, InterestArea } from '../types';
import { INTEREST_AREAS } from '../data';
import { Printer, FileText, Check, Plus, Edit3, ArrowRight, MapPin, Building, GraduationCap, FileCheck } from 'lucide-react';

interface ProfileReportProps {
  participants: Participant[];
  selectedId: string;
  onUpdateNotes: (id: string, notes: string) => void;
}

export default function ProfileReport({
  participants,
  selectedId,
  onUpdateNotes
}: ProfileReportProps) {
  const [evaluatorName, setEvaluatorName] = useState('Lic. En Orientación Vocacional');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  
  const currentParticipant = useMemo(() => {
    return participants.find((p) => p.id === selectedId) || participants[0];
  }, [participants, selectedId]);

  const [notesDraft, setNotesDraft] = useState('');

  // Sync draft notes when active participant changes
  React.useEffect(() => {
    if (currentParticipant) {
      setNotesDraft(currentParticipant.notes || '');
    }
  }, [currentParticipant]);

  const handleSaveNotes = () => {
    onUpdateNotes(currentParticipant.id, notesDraft);
    setIsEditingNotes(false);
  };

  // Helper to get score categorization
  const getClassification = (pct: number) => {
    if (pct >= 75) return { label: 'ALTO INTERÉS', style: 'text-green-700 bg-green-50 font-bold border-green-200' };
    if (pct >= 30) return { label: 'INTERÉS MODERADO', style: 'text-blue-700 bg-blue-50 border-blue-200' };
    return { label: 'BAJO INTERÉS', style: 'text-neutral-500 bg-neutral-50 border-neutral-100' };
  };

  // Sort interests
  const sortedInterests = useMemo(() => {
    if (!currentParticipant) return [];
    return INTEREST_AREAS.map((area) => ({
      area,
      pct: currentParticipant.percentiles[area.id] || 50,
      raw: currentParticipant.rawScores[area.id] || 9
    })).sort((a, b) => b.pct - a.pct);
  }, [currentParticipant]);

  // Top 3 interests for detailed career display
  const top3 = useMemo(() => {
    return sortedInterests.slice(0, 3);
  }, [sortedInterests]);

  const handlePrint = () => {
    window.print();
  };

  if (!currentParticipant) {
    return (
      <div className="p-8 text-center text-neutral-500 font-sans">
        Selecciona un participante para generar el informe.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="profile-report-tab-content">
      {/* Top Controls Toolbar - Hidden on Print */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 flex flex-wrap gap-3 items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-slate-500" />
          <span className="text-xs text-slate-600 font-medium">
            Informe oficial listo para impresión y guardado como PDF comercial.
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="text-xs text-slate-500">Evaluador:</span>
            <input
              type="text"
              value={evaluatorName}
              onChange={(e) => setEvaluatorName(e.target.value)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-700 outline-none focus:ring-1 focus:ring-[#2b579a] transition-colors"
              placeholder="Nombre del evaluador"
            />
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-[#2b579a] hover:bg-[#1e3e6d] active:bg-[#152e52] text-xs text-white px-4 py-2 rounded font-semibold transition-colors shadow-xs cursor-pointer"
            id="print-report-btn"
          >
            <Printer className="h-3.5 w-3.5" />
            Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      {/* Printable Paper Sheet Layout */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 sm:p-12 print:border-none print:shadow-none print:p-0 font-sans text-slate-800" id="printable-report-sheet">
        
        {/* Header Block */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
              Informe de Intereses Profesionales
            </h1>
            <p className="text-xs text-slate-500 font-mono tracking-wider uppercase mt-1">
              Baremación basada en el CIP-R (Fogliatto & Pérez)
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-4 rounded text-xs font-mono text-slate-600 space-y-1 min-w-[200px]">
            <div><span className="font-bold text-slate-800">Código ID:</span> {currentParticipant.id}</div>
            <div><span className="font-bold text-slate-800">Fecha Evaluac:</span> {currentParticipant.date}</div>
            <div><span className="font-bold text-slate-800">Baremos:</span> Secundarios/Universitarios</div>
          </div>
        </div>

        {/* Candidate Information Card */}
        <div className="mt-6 bg-slate-50 rounded p-5 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Nombre del Evaluado</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{currentParticipant.name}</p>
          </div>
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Profesional Evaluador</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{evaluatorName || 'Lic. En Psicología/Orientación'}</p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mt-8 space-y-3">
          <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase border-b border-slate-300 pb-1 flex items-center gap-1.5">
            <FileCheck className="h-4.5 w-4.5 text-[#2b579a] shrink-0" />
            1. Resumen Diagnóstico Vocacional
          </h3>
          <p className="text-xs leading-relaxed text-slate-700">
            De acuerdo con las respuestas dadas al cuestionario de intereses profesionales computarizado, el evaluado presenta un perfil con inclinación predominante hacia las siguientes áreas. A continuación se detalla el análisis de orientación.
          </p>
        </div>

        {/* Top 3 Detailed Competence Cards */}
        <div className="mt-8 space-y-5">
          <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase border-b border-slate-300 pb-1">
            2. Detalle de Áreas Dominantes (Top 3)
          </h3>
          
          <div className="grid grid-cols-1 gap-4" id="report-top-areas-list">
            {top3.map((item, idx) => {
              const { area, pct, raw } = item;
              const place = idx + 1;
              return (
                <div key={area.id} className="border border-slate-200 rounded-lg overflow-hidden shadow-xs flex flex-col md:flex-row">
                  {/* Left rank column */}
                  <div className="md:w-36 bg-slate-50 p-4 border-r border-slate-200 flex flex-col items-center justify-center text-center shrink-0">
                    <span className="bg-[#2b579a] text-white font-bold text-xs h-6 w-6 rounded-full flex items-center justify-center">
                      {place}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-2">Área de Interés</span>
                    <span className="font-mono text-xl font-black text-[#2b579a] mt-0.5">{pct}%</span>
                    <span className="text-[10px] text-slate-500 font-medium">Percentil</span>
                  </div>

                  {/* Right description column */}
                  <div className="p-4 flex-1 space-y-3">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: area.color }}></span>
                        {area.fullName}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {area.description}
                      </p>
                    </div>

                    {/* Careers and Environments lists */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-dashed border-slate-200">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <GraduationCap className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          Carreras / Títulos Afines:
                        </span>
                        <ul className="text-[11px] text-slate-700 mt-1 list-disc pl-4 space-y-0.5">
                          {area.careers.map((career, i) => (
                            <li key={i}>{career}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Building className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          Entornos de Trabajo:
                        </span>
                        <ul className="text-[11px] text-slate-700 mt-1 list-disc pl-4 space-y-0.5">
                          {area.environments.map((env, i) => (
                            <li key={i}>{env}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visual Percentile Profile Bars */}
        <div className="mt-8 space-y-4 page-break-before">
          <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase border-b border-slate-300 pb-1">
            3. Histograma Visual de Competencias
          </h3>
          
          <div className="space-y-2.5 pt-2" id="report-histogram">
            {sortedInterests.map((item) => {
              const { area, pct } = item;
              return (
                <div key={area.id} className="flex items-center gap-3 text-[11px]">
                  {/* Label */}
                  <div className="w-24 font-semibold text-slate-800 truncate" title={area.fullName}>
                    {area.name}
                  </div>
                  {/* Bar */}
                  <div className="flex-1 bg-slate-100 h-3.5 rounded overflow-hidden flex">
                    <div
                       className="h-full rounded transition-all duration-500"
                       style={{
                         width: `${pct}%`,
                         backgroundColor: area.color
                       }}
                    ></div>
                  </div>
                  {/* Percentile value */}
                  <div className="w-10 text-right font-mono font-bold text-slate-700">
                    {pct}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Scores Reference Table */}
        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase border-b border-slate-300 pb-1">
            4. Tabla General de Puntuaciones
          </h3>
          
          <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm" id="report-scores-table">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-bold border-b border-slate-800 uppercase text-[9px] tracking-wider">
                  <th className="py-2.5 px-3">Sigla</th>
                  <th className="py-2.5 px-3">Área de Vocación / Interés</th>
                  <th className="py-2.5 px-3 text-center">Puntaje Bruto</th>
                  <th className="py-2.5 px-3 text-center">Percentil CIP-R</th>
                  <th className="py-2.5 px-3 text-center">Rango Clasificado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {INTEREST_AREAS.map((area) => {
                  const raw = currentParticipant.rawScores[area.id] || 9;
                  const pct = currentParticipant.percentiles[area.id] || 50;
                  const cat = getClassification(pct);
                  return (
                    <tr key={area.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-mono font-bold text-slate-500">{area.id}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900">{area.fullName}</td>
                      <td className="py-2 px-3 text-center font-mono">{raw} <span className="text-[10px] text-slate-400">/ 15</span></td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-slate-800">{pct}%</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] border ${cat.style}`}>
                          {cat.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive / Formal Notes & Observations */}
        <div className="mt-8 space-y-3" id="report-notes-section">
          <div className="flex items-center justify-between border-b border-slate-300 pb-1">
            <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase">
              5. Observaciones Clínicas y Recomendaciones de Campo
            </h3>
            <button
              onClick={() => setIsEditingNotes(!isEditingNotes)}
              className="text-xs text-[#2b579a] hover:text-blue-800 flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 border border-blue-200 print:hidden transition-colors cursor-pointer"
            >
              <Edit3 className="h-3 w-3" />
              {isEditingNotes ? 'Cerrar Edición' : 'Editar Observaciones'}
            </button>
          </div>

          {isEditingNotes ? (
            <div className="space-y-2 mt-2 print:hidden">
              <textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                rows={4}
                className="w-full text-xs p-3 border border-slate-300 rounded focus:ring-1 focus:ring-[#2b579a] outline-none font-sans"
                placeholder="Escribe el dictamen del psicólogo orientador, sugerencias de entrevistas y plan vocacional..."
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveNotes}
                  className="bg-[#2b579a] text-white px-3.5 py-1.5 rounded text-xs font-semibold hover:bg-blue-800 transition-colors cursor-pointer"
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={() => {
                    setNotesDraft(currentParticipant.notes || '');
                    setIsEditingNotes(false);
                  }}
                  className="bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded text-xs font-semibold hover:bg-slate-300 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs leading-relaxed text-slate-700 bg-slate-50 border border-slate-200 p-4 rounded-lg italic">
              {currentParticipant.notes
                ? `"${currentParticipant.notes}"`
                : 'No se han registrado observaciones adicionales en esta evaluación. Haz click en "Editar Observaciones" para agregar notas clínicas personalizadas para este estudiante.'}
            </p>
          )}
        </div>

        {/* Signature Blocks - Vital for vocational printouts */}
        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-12 text-center text-xs" id="report-signatures">
          <div className="space-y-1">
            <div className="border-b border-slate-400 w-48 mx-auto h-12"></div>
            <p className="font-bold text-slate-800">{evaluatorName || 'Firma de Profesional Evaluador'}</p>
            <p className="text-[10px] text-slate-500">Psicólogo Orientador / Coordinador Académico</p>
          </div>
          <div className="space-y-1">
            <div className="border-b border-slate-400 w-48 mx-auto h-12"></div>
            <p className="font-bold text-slate-800">{currentParticipant.name}</p>
            <p className="text-[10px] text-slate-500">Estudiante / Postulante Evaluado</p>
          </div>
        </div>

      </div>
    </div>
  );
}

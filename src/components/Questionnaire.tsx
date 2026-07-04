import React, { useState } from 'react';
import { Question, Participant } from '../types';
import { QUESTIONS, calculateParticipantScores } from '../data';
import { ChevronLeft, ChevronRight, Sparkles, Check, Play, UserPlus, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuestionnaireProps {
  onComplete: (newParticipant: Participant) => void;
}

export default function Questionnaire({ onComplete }: QuestionnaireProps) {
  const [candidateName, setCandidateName] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const QUESTIONS_PER_PAGE = 5;
  const totalPages = Math.ceil(QUESTIONS.length / QUESTIONS_PER_PAGE);

  // Get questions for the current page
  const currentPageQuestions = QUESTIONS.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim()) {
      alert('Por favor, ingresa tu nombre completo para comenzar.');
      return;
    }
    setIsStarted(true);
  };

  const handleSelectAnswer = (questionId: number, score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: score
    }));
  };

  const handleNextPage = () => {
    // Check if all questions on current page are answered
    const unanswered = currentPageQuestions.some((q) => !answers[q.id]);
    if (unanswered) {
      alert('Por favor, responde todas las preguntas de esta página antes de continuar.');
      return;
    }

    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
      // scroll back up
      document.getElementById('questionnaire-container')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Finished!
      setIsFinished(true);
      triggerConfetti();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const triggerConfetti = () => {
    // Shoot celebratory confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const handleSaveResults = () => {
    // Compile and calculate scores
    const { rawScores, percentiles } = calculateParticipantScores(answers);
    
    const newParticipant: Participant = {
      id: `p-${Date.now()}`,
      name: candidateName,
      date: new Date().toISOString().split('T')[0],
      answers,
      rawScores,
      percentiles,
      notes: `Evaluación completada de forma autónoma mediante el cuestionario online. Perfil autogenerado.`
    };

    onComplete(newParticipant);
  };

  // Progress Bar percentage calculation
  const progressPercent = Math.round(
    (Object.keys(answers).length / QUESTIONS.length) * 100
  );

  // Answer scale options in Spanish
  const scaleOptions = [
    { value: 1, label: 'Desagrado Total', color: 'bg-red-100 hover:bg-red-200 text-red-800 border-red-300' },
    { value: 2, label: 'Desagrado', color: 'bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-300' },
    { value: 3, label: 'Indiferente', color: 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300' },
    { value: 4, label: 'Agrado', color: 'bg-green-100 hover:bg-green-200 text-green-800 border-green-300' },
    { value: 5, label: 'Agrado Total', color: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300' }
  ];

  return (
    <div className="max-w-3xl mx-auto" id="questionnaire-container">
      {!isStarted ? (
        /* Welcome Screen and Registration - Clean Polish Styling */
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-slate-50 text-[#2b579a] rounded-full flex items-center justify-center border border-slate-200">
            <Sparkles className="h-8 w-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Cuestionario de Intereses Profesionales (CIPC)
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Descubre tus inclinaciones profesionales respondiendo a 45 sencillas preguntas sobre tus gustos y preferencias en actividades laborales cotidianas.
            </p>
          </div>

          <form onSubmit={handleStart} className="max-w-sm mx-auto space-y-4 pt-4">
            <div className="text-left space-y-1.5">
              <label htmlFor="candidate-name" className="text-xs font-bold text-slate-600">
                Ingresa tu Nombre Completo:
              </label>
              <input
                id="candidate-name"
                type="text"
                required
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Ej. Juan Gómez Pérez"
                className="w-full text-sm px-4 py-3 border border-slate-300 rounded outline-none focus:ring-1 focus:ring-[#2b579a] bg-slate-50 hover:bg-slate-100 transition-colors"
              />
            </div>

            <div className="bg-blue-50/70 p-4 rounded border border-blue-100/50 text-left text-xs text-[#1e3e6d] flex gap-2.5">
              <Info className="h-4.5 w-4.5 text-[#2b579a] mt-0.5 shrink-0" />
              <p className="leading-normal">
                Tu cuestionario evaluará tus inclinaciones vocacionales sobre 15 áreas científicas, artísticas y comerciales. Al finalizar, verás tu reporte con carreras sugeridas.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2b579a] hover:bg-[#1e3e6d] active:bg-[#152e52] text-sm text-white py-3 rounded font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              id="start-survey-btn"
            >
              <Play className="h-4 w-4 fill-current" />
              Comenzar Evaluación
            </button>
          </form>
        </div>
      ) : !isFinished ? (
        /* Questionnaire Wizard Screen */
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
          {/* Header Progress Bar */}
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#2b579a] font-mono">
                Página {currentPage + 1} de {totalPages}
              </span>
              <span className="text-slate-500 font-mono">
                {Object.keys(answers).length} de {QUESTIONS.length} respondidas ({progressPercent}%)
              </span>
            </div>
            
            {/* Progress Bar Graphic */}
            <div className="w-full bg-slate-100 h-2.5 rounded overflow-hidden">
              <div
                className="bg-[#2b579a] h-full rounded transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Questions Group */}
          <div className="space-y-8" id="questions-list-block">
            {currentPageQuestions.map((q, idx) => {
              const currentRating = answers[q.id];
              const qNumber = currentPage * QUESTIONS_PER_PAGE + idx + 1;
              return (
                <div key={q.id} className="space-y-3.5 p-5 rounded border border-slate-100 hover:border-slate-200 transition-all bg-slate-50/40">
                  <div className="flex gap-2">
                    <span className="font-mono font-bold text-slate-400 text-sm pt-0.5">{qNumber}.</span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
                      ¿Qué tanto te agradaría: <span className="text-slate-900 font-extrabold">{q.text}</span>?
                    </h3>
                  </div>

                  {/* Horizontal Choice Radio Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
                    {scaleOptions.map((opt) => {
                      const isSelected = currentRating === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelectAnswer(q.id, opt.value)}
                          className={`px-3 py-2 text-xs rounded font-semibold border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#2b579a] text-white border-[#2b579a] ring-1 ring-blue-100 scale-[1.01] shadow-xs'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                          }`}
                        >
                          <div className="font-mono text-[10px] opacity-75">Nivel {opt.value}</div>
                          <div className="mt-0.5">{opt.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-100">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs rounded font-bold border transition-colors cursor-pointer ${
                currentPage === 0
                  ? 'text-slate-300 border-slate-200 cursor-not-allowed'
                  : 'text-slate-700 hover:bg-slate-50 border-slate-300 active:bg-slate-100'
              }`}
              id="survey-prev-btn"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>

            <button
              onClick={handleNextPage}
              className="flex items-center gap-1.5 bg-[#2b579a] hover:bg-[#1e3e6d] active:bg-[#152e52] text-xs text-white px-5 py-2.5 rounded font-bold transition-colors shadow-xs cursor-pointer"
              id="survey-next-btn"
            >
              {currentPage === totalPages - 1 ? 'Finalizar y Procesar' : 'Siguiente Página'}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Finished Celebration Screen */
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100">
            <Check className="h-8 w-8 stroke-[3]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              ¡Cuestionario Completado con Éxito!
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Felicitaciones, <span className="font-bold text-slate-800">{candidateName}</span>. Hemos procesado tus respuestas y calculado tus puntuaciones para las 15 áreas competenciales de la metodología CIPC.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-4 max-w-sm mx-auto text-xs text-slate-600">
            <p className="font-semibold text-slate-800">Cálculos Completados:</p>
            <ul className="text-left mt-2 pl-4 list-disc space-y-1">
              <li>Puntaje Bruto para cada escala (Rango 3-15)</li>
              <li>Percentiles ponderados de vocación</li>
              <li>Asignación de perfiles profesionales sugeridos</li>
            </ul>
          </div>

          <button
            onClick={handleSaveResults}
            className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-sm text-white px-8 py-3.5 rounded font-bold transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
            id="save-survey-results-btn"
          >
            <UserPlus className="h-4 w-4" />
            Guardar y Ver Resultados
          </button>
        </div>
      )}
    </div>
  );
}

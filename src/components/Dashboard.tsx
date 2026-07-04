import React, { useState, useMemo } from 'react';
import { Participant, InterestArea } from '../types';
import { INTEREST_AREAS } from '../data';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import { Sparkles, Compass, Award, Brain, BarChart2, CheckCircle2, TrendingUp, RefreshCw } from 'lucide-react';

interface DashboardProps {
  participants: Participant[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function Dashboard({
  participants,
  selectedId,
  onSelect
}: DashboardProps) {
  const [filterLevel, setFilterLevel] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Find currently active candidate
  const currentParticipant = useMemo(() => {
    return participants.find((p) => p.id === selectedId) || participants[0];
  }, [participants, selectedId]);

  // Map data for Recharts Radar & Bar Charts
  const chartData = useMemo(() => {
    if (!currentParticipant) return [];
    return INTEREST_AREAS.map((area) => {
      const raw = currentParticipant.rawScores[area.id] || 9;
      const pct = currentParticipant.percentiles[area.id] || 50;
      return {
        areaId: area.id,
        name: area.name,
        fullName: area.fullName,
        'Puntaje Bruto': raw,
        'Percentil (%)': pct,
        color: area.color
      };
    });
  }, [currentParticipant]);

  // Sort and filter data for Bar Chart
  const sortedAndFilteredData = useMemo(() => {
    let data = [...chartData];
    
    // Sort descending by Percentil
    data.sort((a, b) => b['Percentil (%)'] - a['Percentil (%)']);

    if (filterLevel === 'high') {
      data = data.filter(d => d['Percentil (%)'] >= 75);
    } else if (filterLevel === 'medium') {
      data = data.filter(d => d['Percentil (%)'] >= 30 && d['Percentil (%)'] < 75);
    } else if (filterLevel === 'low') {
      data = data.filter(d => d['Percentil (%)'] < 30);
    }

    return data;
  }, [chartData, filterLevel]);

  // Get Top 3 areas of interest
  const top3Areas = useMemo(() => {
    if (!currentParticipant) return [];
    const scores = INTEREST_AREAS.map((area) => ({
      area,
      pct: currentParticipant.percentiles[area.id] || 50,
      raw: currentParticipant.rawScores[area.id] || 9
    }));
    scores.sort((a, b) => b.pct - a.pct);
    return scores.slice(0, 3);
  }, [currentParticipant]);

  // Generate dynamic profile diagnostic
  const diagnostic = useMemo(() => {
    if (!currentParticipant) return { title: 'Cargando...', desc: '', style: '' };
    
    const highCount = INTEREST_AREAS.filter(a => (currentParticipant.percentiles[a.id] || 0) >= 75).length;
    const lowCount = INTEREST_AREAS.filter(a => (currentParticipant.percentiles[a.id] || 0) < 30).length;

    if (highCount >= 6) {
      return {
        title: 'Perfil de Intereses Múltiples (Multipotencial)',
        desc: 'Demuestras un rango muy amplio y variado de intereses vocacionales elevados. Te atraen múltiples campos de estudio diferentes, lo cual indica gran curiosidad e inquietud intelectual. Te beneficiaría buscar carreras interdisciplinarias o combinar un campo principal con pasatiempos fuertes.',
        style: 'bg-purple-50 text-purple-900 border-purple-200'
      };
    } else if (highCount >= 1 && highCount <= 3) {
      return {
        title: 'Perfil de Intereses Especializado (Focalizado)',
        desc: 'Posees intereses muy definidos y focalizados en unas pocas áreas específicas de competencia. Esta es una configuración ideal para la toma de decisiones rápidas, ya que tus talentos y pasiones convergen de manera contundente hacia un conjunto claro de carreras profesionales.',
        style: 'bg-emerald-50 text-emerald-900 border-emerald-200'
      };
    } else if (highCount === 0 && lowCount >= 12) {
      return {
        title: 'Perfil de Intereses Indefinido / Exploratorio',
        desc: 'Actualmente tus intereses se encuentran en una etapa exploratoria o neutra (puntuaciones concentradas en valores medios o bajos). Esto es sumamente normal en etapas de transición vocacional. Se aconseja profundizar mediante test de aptitudes o visitas directas a universidades para activar nuevas curiosidades.',
        style: 'bg-amber-50 text-amber-900 border-amber-200'
      };
    } else {
      return {
        title: 'Perfil de Intereses Equilibrado (Moderado)',
        desc: 'Presentas una inclinación equilibrada en varios frentes, con puntuaciones predominantemente medias-altas. Cuentas con una estructura de personalidad estable y adaptable, capaz de encontrar agrado en tareas tanto lógicas como asistenciales o administrativas de forma integrada.',
        style: 'bg-blue-50 text-blue-900 border-blue-200'
      };
    }
  }, [currentParticipant]);

  if (!currentParticipant) {
    return (
      <div className="p-8 text-center text-neutral-500 font-sans">
        No se encontraron datos para mostrar el dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-6" id="dashboard-tab-content">
      {/* Top Selector Card - Clean Slate Professional Styling */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 text-[#2b579a] p-2.5 rounded shrink-0 border border-slate-200">
            <Compass className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Analizando Aspirante Activo</span>
            <h3 className="font-sans font-bold text-lg text-slate-800 leading-tight">
              {currentParticipant.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Ver otro perfil:</span>
          <select
            value={selectedId}
            onChange={(e) => onSelect(e.target.value)}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-700 font-medium outline-none focus:ring-1 focus:ring-[#2b579a] transition-colors"
            id="dashboard-student-select"
          >
            {participants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.date})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Summary Cards - Excel Style Dominant Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="dashboard-metric-cards">
        {/* Dominant Interest - Main Premium Blue Highlight Card */}
        <div className="bg-[#2b579a] text-white rounded-lg p-5 shadow-sm flex items-start gap-4">
          <div className="bg-white/10 text-white p-2.5 rounded">
            <Award className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-[10px] text-blue-100 uppercase font-bold tracking-wider">Interés Dominante</span>
            <h4 className="font-sans font-bold text-lg text-white mt-1 truncate max-w-[200px]" title={top3Areas[0]?.area.fullName}>
              {top3Areas[0]?.area.name}
            </h4>
            <p className="text-xs text-blue-200 mt-1 font-mono font-semibold">
              Percentil: {top3Areas[0]?.pct}% (Puntaje: {top3Areas[0]?.raw}/15)
            </p>
          </div>
        </div>

        {/* Second Interest - Elegant Polish White Card */}
        <div className="bg-white text-slate-800 p-5 border border-slate-200 rounded-lg shadow-sm flex items-start gap-4">
          <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded border border-emerald-100">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Segundo Interés</span>
            <h4 className="font-sans font-bold text-base text-slate-800 mt-1 truncate max-w-[200px]" title={top3Areas[1]?.area.fullName}>
              {top3Areas[1]?.area.name}
            </h4>
            <p className="text-xs text-emerald-600 mt-1 font-mono font-semibold">
              Percentil: {top3Areas[1]?.pct}% (Puntaje: {top3Areas[1]?.raw}/15)
            </p>
          </div>
        </div>

        {/* Third Interest - Elegant Polish White Card */}
        <div className="bg-white text-slate-800 p-5 border border-slate-200 rounded-lg shadow-sm flex items-start gap-4">
          <div className="bg-indigo-50 text-indigo-700 p-2.5 rounded border border-indigo-100">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tercer Interés</span>
            <h4 className="font-sans font-bold text-base text-slate-800 mt-1 truncate max-w-[200px]" title={top3Areas[2]?.area.fullName}>
              {top3Areas[2]?.area.name}
            </h4>
            <p className="text-xs text-indigo-600 mt-1 font-mono font-semibold">
              Percentil: {top3Areas[2]?.pct}% (Puntaje: {top3Areas[2]?.raw}/15)
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Charts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-charts-grid">
        {/* Radar Chart Panel - taking 5 cols */}
        <div className="lg:col-span-5 bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4 justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-[#2b579a]" />
              <h4 className="font-sans font-bold text-sm text-slate-800">
                Mapeo de Áreas de Interés (CIPC)
              </h4>
            </div>
            <span className="bg-slate-100 text-[#2b579a] font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">
              Gráfico Radial
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[300px]" id="radar-chart-container">
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                <Radar
                  name="Percentil"
                  dataKey="Percentil (%)"
                  stroke="#2b579a"
                  fill="#2b579a"
                  fillOpacity={0.15}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded text-xs shadow-lg font-sans border border-slate-800">
                          <p className="font-bold">{data.fullName}</p>
                          <p className="text-blue-300 mt-1">Percentil: {data['Percentil (%)']}%</p>
                          <p className="text-slate-400">Puntaje Bruto: {data['Puntaje Bruto']}/15</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <p className="text-[10px] text-slate-400 mt-2 text-center italic">
            *El gráfico radial representa la vocación en 15 áreas de estudio. Un mayor radio equivale a un interés más fuerte.
          </p>
        </div>

        {/* Bar Chart Panel - taking 7 cols */}
        <div className="lg:col-span-7 bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-emerald-600" />
              <h4 className="font-sans font-bold text-sm text-slate-800">
                Comparativo de Competencias (Ordenado)
              </h4>
            </div>

            {/* Filter toolbar */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-200">
              <button
                onClick={() => setFilterLevel('all')}
                className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                  filterLevel === 'all' ? 'bg-white text-slate-800 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterLevel('high')}
                className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                  filterLevel === 'high' ? 'bg-[#2b579a] text-white shadow-xs' : 'text-slate-500 hover:text-[#2b579a]'
                }`}
              >
                Altos
              </button>
              <button
                onClick={() => setFilterLevel('medium')}
                className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                  filterLevel === 'medium' ? 'bg-[#2b579a] text-white shadow-xs' : 'text-slate-500 hover:text-[#2b579a]'
                }`}
              >
                Medios
              </button>
              <button
                onClick={() => setFilterLevel('low')}
                className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                  filterLevel === 'low' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-500 hover:text-red-600'
                }`}
              >
                Bajos
              </button>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="flex-1 min-h-[300px]" id="bar-chart-container">
            {sortedAndFilteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs py-12">
                <Compass className="h-8 w-8 text-slate-300 mb-2 stroke-1" />
                No hay áreas que coincidan con el nivel de filtro seleccionado.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={sortedAndFilteredData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 25, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: '#334155', fontSize: 10, fontWeight: 500 }}
                    width={80}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded text-xs shadow-xl font-sans">
                            <p className="font-bold">{data.fullName}</p>
                            <p className="text-emerald-400 mt-1">Percentil: {data['Percentil (%)']}%</p>
                            <p className="text-slate-400">Puntaje Bruto: {data['Puntaje Bruto']}/15</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="Percentil (%)" radius={[0, 2, 2, 0]} barSize={12}>
                    {sortedAndFilteredData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Profile Diagnostic & Recommendations - Polished White Card with Left Primary Accent Indicator */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 border-l-4 border-l-[#2b579a] shadow-sm" id="dashboard-diagnostic-panel">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 bg-slate-100 p-2 rounded border border-slate-200 text-slate-700 shrink-0">
            <Brain className="h-5.5 w-5.5" />
          </div>
          <div>
            <h4 className="font-sans font-bold text-sm text-slate-500 uppercase tracking-wider">
              Análisis Vocacional de Orientación ({currentParticipant.name})
            </h4>
            <p className="font-sans font-black text-xl text-slate-800 mt-1.5 flex items-center gap-2">
              <CheckCircle2 className="h-5.5 w-5.5 shrink-0 text-emerald-600" />
              {diagnostic.title}
            </p>
            <p className="text-sm mt-3 leading-relaxed text-slate-600 max-w-4xl">
              {diagnostic.desc}
            </p>
            
            {/* Notes display */}
            {currentParticipant.notes && (
              <div className="mt-5 pt-4 border-t border-dashed border-slate-200">
                <span className="text-[10px] uppercase font-bold tracking-wider block text-slate-400">Observaciones del Evaluador Clínico:</span>
                <p className="text-xs italic mt-1.5 font-sans text-slate-600 bg-slate-50 p-3 rounded border border-slate-100">
                  "{currentParticipant.notes}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Participant, InterestArea } from '../types';
import { INTEREST_AREAS, calculateParticipantScores } from '../data';
import { Plus, Trash2, FileSpreadsheet, Eye, Info, Check, HelpCircle } from 'lucide-react';

interface ExcelGridProps {
  participants: Participant[];
  selectedId: string;
  onSelect: (id: string) => void;
  onUpdate: (updated: Participant[]) => void;
}

export default function ExcelGrid({
  participants,
  selectedId,
  onSelect,
  onUpdate
}: ExcelGridProps) {
  const [activeCell, setActiveCell] = useState<{ rowId: string; colId: string } | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [formulaBarText, setFormulaBarText] = useState<string>('Selecciona una celda para ver la fórmula...');
  const [cellAddress, setCellAddress] = useState<string>('A1');

  // Convert column index to letter (A, B, C...)
  const getColLetter = (index: number): string => {
    return String.fromCharCode(65 + index);
  };

  // Handle cell click and update formula bar
  const handleCellClick = (rowId: string, colId: string, value: string | number, isFormula: boolean, formula?: string) => {
    setActiveCell({ rowId, colId });
    setEditingValue(String(value));
    
    // Find row number (1-based index)
    const rowIndex = participants.findIndex(p => p.id === rowId) + 2; // +1 for header, +1 for 1-based index
    const colIndex = colId === 'name' ? 0 : colId === 'date' ? 1 : INTEREST_AREAS.findIndex(a => a.id === colId) + 2;
    setCellAddress(`${getColLetter(colIndex)}${rowIndex}`);

    if (isFormula && formula) {
      setFormulaBarText(formula);
    } else {
      setFormulaBarText(String(value));
    }
  };

  // Inline edit change
  const handleValueChange = (rowId: string, colId: string, newValue: string) => {
    setEditingValue(newValue);
    
    const updated = participants.map((p) => {
      if (p.id === rowId) {
        if (colId === 'name') {
          return { ...p, name: newValue };
        } else if (colId === 'date') {
          return { ...p, date: newValue };
        } else {
          // Numeric interest score (3 - 15)
          const num = parseInt(newValue, 10);
          if (!isNaN(num)) {
            const clamped = Math.max(3, Math.min(15, num));
            const newAnswers = { ...p.answers };
            
            // Distribute score evenly among the 3 questions of this area
            // Q1, Q2, Q3 will sum to "clamped"
            const areaQuestions = [1, 2, 3]; // Mock indexes or derived
            // To be precise, let's update rawScores directly and calculate percentiles, keeping individual answers updated
            const newRawScores = { ...p.rawScores, [colId]: clamped };
            const newPercentiles = { ...p.percentiles, [colId]: Math.round(((clamped - 3) / 12) * 100) };
            
            return {
              ...p,
              rawScores: newRawScores,
              percentiles: newPercentiles
            };
          }
        }
      }
      return p;
    });
    
    onUpdate(updated);
  };

  // Key press on cell edit
  const handleKeyDown = (e: React.KeyboardEvent, rowId: string, colId: string) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setActiveCell(null);
    }
  };

  // Add new participant
  const handleAddParticipant = () => {
    const newId = `p-${Date.now()}`;
    const defaultAnswers: Record<number, number> = {};
    for (let i = 1; i <= 45; i++) {
      defaultAnswers[i] = 3; // default to neutral (3)
    }
    
    const { rawScores, percentiles } = calculateParticipantScores(defaultAnswers);

    const newParticipant: Participant = {
      id: newId,
      name: `Nuevo Aspirante ${participants.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      answers: defaultAnswers,
      rawScores,
      percentiles,
      notes: 'Estudiante ingresado manualmente desde la tabla de datos. Edita sus puntuaciones para ver las actualizaciones.'
    };

    onUpdate([...participants, newParticipant]);
    onSelect(newId);
  };

  // Delete participant
  const handleDeleteParticipant = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (participants.length <= 1) {
      alert('Debe quedar al menos un registro en la tabla de datos.');
      return;
    }
    const filtered = participants.filter(p => p.id !== id);
    onUpdate(filtered);
    // If deleted row was selected, select the first remaining
    if (selectedId === id && filtered.length > 0) {
      onSelect(filtered[0].id);
    }
  };

  // Export as CSV
  const handleExportCSV = () => {
    // Escape helper for CSV values to handle semicolons, quotes, and newlines
    const escapeCSVValue = (val: string | number): string => {
      const str = String(val);
      if (str.includes(';') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Generate headers
    const headers = [
      'Nombre',
      'Fecha',
      ...INTEREST_AREAS.map(a => `${a.name} (Puntaje)`),
      ...INTEREST_AREAS.map(a => `${a.name} (Percentil)`)
    ].map(escapeCSVValue);

    // Generate rows
    const rows = participants.map(p => [
      p.name,
      p.date,
      ...INTEREST_AREAS.map(a => p.rawScores[a.id] || 9),
      ...INTEREST_AREAS.map(a => p.percentiles[a.id] || 50)
    ].map(escapeCSVValue));

    // Combine headers and rows, prepending the UTF-8 BOM (\uFEFF) so Excel parses accented letters correctly
    const csvContent = "\uFEFF" + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    
    // Create blob with explicit UTF-8 encoding
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "CIPC_Automatizacion_Intereses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden" id="excel-grid-section">
      {/* Spreadsheet Title and Actions Toolbar - Deep Corporate Blue */}
      <div className="bg-[#2b579a] text-white p-4 flex flex-wrap gap-3 items-center justify-between border-b border-blue-900">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="h-6 w-6 text-blue-200" id="excel-icon" />
          <div>
            <h2 className="font-sans font-bold tracking-tight text-base" id="excel-title">
              CIPC Hoja de Datos & Automatización
            </h2>
            <p className="text-[11px] text-blue-200 font-mono">
              Microsoft Excel / Google Sheets Simulator v2.1
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddParticipant}
            className="flex items-center gap-1.5 bg-[#1e3e6d] hover:bg-[#152e52] active:bg-[#112440] text-xs text-white px-3.5 py-1.5 rounded font-semibold border border-blue-400/20 transition-colors cursor-pointer"
            id="add-row-btn"
          >
            <Plus className="h-3.5 w-3.5" />
            Añadir Aspirante
          </button>
          
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-[#2b579a] text-xs font-bold px-3.5 py-1.5 rounded transition-colors shadow-xs cursor-pointer"
            id="export-csv-btn"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-[#2b579a]" />
            Descargar Excel (.csv)
          </button>
        </div>
      </div>

      {/* Excel Formula Bar - Premium Slate Style */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center gap-2.5 font-mono text-xs text-slate-700">
        <div className="bg-white border border-slate-300 px-3 py-1 rounded text-center text-slate-800 font-bold min-w-[50px] shadow-xs select-none">
          {cellAddress}
        </div>
        <div className="text-slate-400 font-serif italic font-semibold text-sm px-1 select-none">
          fx
        </div>
        <div className="flex-1 bg-white border border-slate-300 px-3 py-1 rounded text-slate-600 overflow-x-auto whitespace-nowrap shadow-xs">
          {formulaBarText}
        </div>
      </div>

      {/* Instructions Overlay Banner */}
      <div className="bg-blue-50/70 text-[#1e3e6d] px-4 py-2.5 border-b border-blue-100/50 flex items-start gap-2.5 text-xs">
        <Info className="h-4 w-4 text-[#2b579a] mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold">Instrucciones de Simulación:</span> Puedes editar el <span className="font-semibold text-slate-900">Nombre</span>, <span className="font-semibold text-slate-900">Fecha</span> o los <span className="font-semibold text-slate-900">Puntajes Brutos (valores entre 3 y 15)</span> directamente haciendo click en las celdas de la tabla. Al seleccionar una fila, el <span className="font-semibold text-slate-900">Dashboard</span> y el <span className="font-semibold text-slate-900">Informe</span> se actualizarán de forma inmediata y automática con los nuevos resultados clasificados.
        </div>
      </div>

      {/* Spreadsheet Container */}
      <div className="flex-1 overflow-auto max-h-[550px]">
        <table className="w-full text-left border-collapse font-sans text-xs">
          {/* Row Indicators Columns */}
          <thead>
            <tr className="bg-slate-100 text-slate-600 font-mono text-center border-b border-slate-300 divide-x divide-slate-200">
              <th className="w-10 bg-slate-200 select-none sticky left-0 z-20">#</th>
              <th className="w-16 select-none py-1.5 px-2">Acción</th>
              <th className="min-w-[150px] text-left px-3 select-none">Nombre de Aspirante</th>
              <th className="min-w-[100px] text-left px-3 select-none">Fecha Evaluac.</th>
              {INTEREST_AREAS.map((area, i) => (
                <th key={area.id} className="min-w-[75px] px-1 select-none relative group" title={area.fullName}>
                  <div className="text-[10px] font-bold text-slate-700 truncate">{area.name}</div>
                  <div className="text-[9px] text-slate-400 font-mono font-normal">
                    {getColLetter(i + 2)} (Bruto)
                  </div>
                  {/* Tooltip on hover */}
                  <div className="absolute hidden group-hover:block bg-slate-900 text-white text-[10px] p-2.5 rounded shadow z-50 top-10 left-1/2 -translate-x-1/2 w-48 text-left whitespace-normal font-sans">
                    <p className="font-semibold">{area.fullName}</p>
                    <p className="text-[9px] text-slate-300 mt-0.5">{area.description}</p>
                  </div>
                </th>
              ))}
              {INTEREST_AREAS.map((area, i) => (
                <th key={`pct-${area.id}`} className="min-w-[75px] px-1 select-none bg-blue-50/40 relative group" title={`Percentil en ${area.fullName}`}>
                  <div className="text-[10px] font-bold text-blue-800 truncate">% {area.name}</div>
                  <div className="text-[9px] text-blue-600 font-mono font-normal">
                    {getColLetter(i + 17)} (Pct)
                  </div>
                  {/* Tooltip on hover */}
                  <div className="absolute hidden group-hover:block bg-blue-900 text-white text-[10px] p-2.5 rounded shadow z-50 top-10 left-1/2 -translate-x-1/2 w-48 text-left whitespace-normal font-sans">
                    <p className="font-semibold">% Percentil {area.name}</p>
                    <p className="text-[9px] text-blue-200 mt-0.5">Calculado automáticamente mediante fórmula lineal: =REDONDEAR((Bruto-3)/12*100; 0)</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {participants.map((p, idx) => {
              const isRowSelected = p.id === selectedId;
              const rowNum = idx + 1;
              return (
                <tr
                  key={p.id}
                  onClick={() => onSelect(p.id)}
                  className={`border-b border-slate-200 divide-x divide-slate-200 hover:bg-slate-50 transition-colors cursor-pointer ${
                    isRowSelected ? 'bg-blue-50/70 hover:bg-blue-100/50' : ''
                  }`}
                >
                  {/* Row Indicator Column */}
                  <td className="bg-slate-100 text-slate-500 font-mono font-medium text-center py-2 px-1 sticky left-0 z-10 select-none border-r border-slate-300">
                    <div className="flex items-center justify-center gap-1">
                      {isRowSelected && <div className="w-1.5 h-1.5 bg-[#2b579a] rounded-full shrink-0"></div>}
                      {rowNum}
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="text-center py-1 px-1">
                    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelect(p.id)}
                        className={`p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors`}
                        title="Ver Dashboard e Informe"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteParticipant(p.id, e)}
                        className="p-1 rounded hover:bg-red-50 text-red-600 transition-colors"
                        title="Eliminar Aspirante"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Name cell */}
                  <td
                    className="p-1 px-3 relative min-w-[150px] font-medium text-slate-800"
                    onClick={() => handleCellClick(p.id, 'name', p.name, false)}
                  >
                    {activeCell?.rowId === p.id && activeCell?.colId === 'name' ? (
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => handleValueChange(p.id, 'name', e.target.value)}
                        onBlur={() => setActiveCell(null)}
                        onKeyDown={(e) => handleKeyDown(e, p.id, 'name')}
                        autoFocus
                        className="absolute inset-0 w-full h-full px-2.5 py-1 text-xs border-2 border-[#2b579a] bg-white outline-none font-sans rounded-none focus:ring-0 z-30"
                      />
                    ) : (
                      <div className="truncate">{p.name}</div>
                    )}
                  </td>

                  {/* Date cell */}
                  <td
                    className="p-1 px-3 relative min-w-[100px] text-slate-600 font-mono"
                    onClick={() => handleCellClick(p.id, 'date', p.date, false)}
                  >
                    {activeCell?.rowId === p.id && activeCell?.colId === 'date' ? (
                      <input
                        type="date"
                        value={editingValue}
                        onChange={(e) => handleValueChange(p.id, 'date', e.target.value)}
                        onBlur={() => setActiveCell(null)}
                        onKeyDown={(e) => handleKeyDown(e, p.id, 'date')}
                        autoFocus
                        className="absolute inset-0 w-full h-full px-2.5 py-1 text-xs border-2 border-[#2b579a] bg-white outline-none font-mono rounded-none focus:ring-0 z-30"
                      />
                    ) : (
                      <div>{p.date}</div>
                    )}
                  </td>

                  {/* 15 raw scores cells (Editable) */}
                  {INTEREST_AREAS.map((area, i) => {
                    const score = p.rawScores[area.id] || 9;
                    const isCellSelected = activeCell?.rowId === p.id && activeCell?.colId === area.id;
                    const cellLetter = getColLetter(i + 2);
                    const cellAddressStr = `${cellLetter}${rowNum + 1}`;
                    return (
                      <td
                        key={area.id}
                        className={`p-1 relative text-center font-mono text-xs transition-all ${
                          score >= 12 ? 'bg-green-50 text-green-800 font-semibold border-b border-green-200' : score <= 6 ? 'bg-red-50 text-red-800 border-b border-red-200' : 'text-slate-700'
                        } ${isCellSelected ? 'ring-2 ring-[#2b579a] z-30' : ''}`}
                        onClick={() => handleCellClick(p.id, area.id, score, false)}
                      >
                        {isCellSelected ? (
                          <input
                            type="number"
                            min="3"
                            max="15"
                            value={editingValue}
                            onChange={(e) => handleValueChange(p.id, area.id, e.target.value)}
                            onBlur={() => setActiveCell(null)}
                            onKeyDown={(e) => handleKeyDown(e, p.id, area.id)}
                            autoFocus
                            className="absolute inset-0 w-full h-full text-center border-2 border-[#2b579a] bg-white outline-none font-mono rounded-none focus:ring-0 z-30"
                          />
                        ) : (
                          <div className="w-full h-full py-1">{score}</div>
                        )}
                      </td>
                    );
                  })}

                  {/* 15 percentiles cells (Formula-based calculated, read-only) */}
                  {INTEREST_AREAS.map((area, i) => {
                    const rawScore = p.rawScores[area.id] || 9;
                    const pctValue = p.percentiles[area.id] || 50;
                    const isCellSelected = activeCell?.rowId === p.id && activeCell?.colId === `pct-${area.id}`;
                    
                    const brutoCol = getColLetter(i + 2);
                    const formula = `=REDONDEAR((${brutoCol}${rowNum + 1}-3)/12*100; 0)`;

                    return (
                      <td
                        key={`pct-${area.id}`}
                        className={`p-1 text-center font-mono text-xs bg-blue-50/10 text-slate-700 relative ${
                          pctValue >= 75 ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200' : pctValue <= 30 ? 'text-amber-700 bg-amber-50/10' : ''
                        } ${isCellSelected ? 'ring-2 ring-blue-500 z-30' : ''}`}
                        onClick={() => handleCellClick(p.id, `pct-${area.id}`, pctValue, true, formula)}
                      >
                        <div>{pctValue}%</div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Spreadsheet Status Bar / Footer */}
      <div className="bg-slate-50 border-t border-slate-200 px-3 py-2 flex flex-wrap gap-4 items-center justify-between text-[11px] text-slate-500 font-sans select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold text-[#2b579a]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2b579a] shrink-0"></span>
            Listo
          </span>
          <span className="border-l border-slate-200 pl-3">
            Total Aspirantes: <span className="font-bold text-slate-700">{participants.length}</span>
          </span>
          <span className="border-l border-slate-200 pl-3">
            Celdas editables en columnas: <span className="font-bold text-slate-700">C a Q (Puntajes Brutos)</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-green-50 border border-green-200 rounded"></div>
            <span>Alto (12-15)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-white border border-slate-200 rounded"></div>
            <span>Medio (7-11)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-red-50 border border-red-200 rounded"></div>
            <span>Bajo (3-6)</span>
          </div>
          <div className="text-slate-400 font-mono text-[10px]">
            SUMA=fx(C:Q)
          </div>
        </div>
      </div>
    </div>
  );
}

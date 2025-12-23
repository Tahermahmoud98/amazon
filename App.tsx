
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Plus, Trash2, Download, Printer, RefreshCw, 
  HelpCircle, FileText, ImageIcon, Bold, Italic, 
  Underline, Eraser, Settings, Calendar, Save,
  Maximize2, Minus, X, MousePointer2, Layout
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { TableState, CellData, CellStyle, ThemeKey } from './types';
import { THEMES } from './themes';

const STORAGE_KEY = 'tableStudio_v3';

const App: React.FC = () => {
  const [table, setTable] = useState<TableState>({
    title: 'مشروع جدول جديد',
    rows: [],
    theme: ThemeKey.DEFAULT_BLUE
  });
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, visible: boolean } | null>(null);

  // Date Logic
  const [startDate, setStartDate] = useState('');
  const [targetCol, setTargetCol] = useState(1);
  const [workDays, setWorkDays] = useState<number[]>([0, 1, 2, 3, 4]);

  const tableRef = useRef<HTMLDivElement>(null);

  // --- Initializers ---
  const initializeTable = useCallback((rows: number = 8, cols: number = 5) => {
    const newRows: CellData[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: CellData[] = [];
      for (let c = 0; c < cols; c++) {
        row.push({
          id: Math.random().toString(36).substr(2, 9),
          content: r === 0 ? `رأس ${c + 1}` : '',
          style: {}
        });
      }
      newRows.push(row);
    }
    setTable(prev => ({ ...prev, rows: newRows }));
  }, []);

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleShortcuts = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            exportCSV();
            break;
          case 'p':
            e.preventDefault();
            window.print();
            break;
          case 'enter':
            e.preventDefault();
            addRow();
            break;
        }
      }
    };
    window.addEventListener('keydown', handleShortcuts);
    return () => window.removeEventListener('keydown', handleShortcuts);
  }, [table]);

  // --- Load/Save ---
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setTable(JSON.parse(saved)); } catch (e) { initializeTable(); }
    } else {
      initializeTable();
    }
  }, [initializeTable]);

  useEffect(() => {
    if (table.rows.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(table));
    }
  }, [table]);

  // --- Table Actions ---
  const handleCellChange = (rIdx: number, cIdx: number, content: string) => {
    setTable(prev => {
      const next = { ...prev };
      next.rows[rIdx][cIdx].content = content;
      return next;
    });
  };

  const applyStyle = (styleKey: keyof CellStyle, value: any) => {
    if (!activeCell) return;
    setTable(prev => {
      const next = { ...prev };
      const cell = next.rows[activeCell.row][activeCell.col];
      cell.style = { ...cell.style, [styleKey]: value };
      return next;
    });
  };

  const addRow = () => {
    setTable(prev => {
      const colCount = prev.rows[0]?.length || 5;
      const newRow = Array(colCount).fill(null).map(() => ({
        id: Math.random().toString(36).substr(2, 9),
        content: '',
        style: {}
      }));
      return { ...prev, rows: [...prev.rows, newRow] };
    });
  };

  const addColumn = () => {
    setTable(prev => {
      const newRows = prev.rows.map((row, rIdx) => [
        ...row, 
        { id: Math.random().toString(36).substr(2, 9), content: rIdx === 0 ? `رأس ${row.length + 1}` : '', style: {} }
      ]);
      return { ...prev, rows: newRows };
    });
  };

  const deleteRow = (rIdx: number) => {
    if (table.rows.length <= 1) return;
    setTable(prev => ({ ...prev, rows: prev.rows.filter((_, idx) => idx !== rIdx) }));
    setActiveCell(null);
  };

  const deleteColumn = (cIdx: number) => {
    if (table.rows[0].length <= 1) return;
    setTable(prev => ({ ...prev, rows: prev.rows.map(row => row.filter((_, idx) => idx !== cIdx)) }));
    setActiveCell(null);
  };

  const exportCSV = () => {
    let csv = "\uFEFF";
    table.rows.forEach(row => {
      csv += row.map(c => `"${c.content.replace(/"/g, '""')}"`).join(',') + "\r\n";
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${table.title}.csv`;
    link.click();
  };

  const exportPNG = async () => {
    if (!tableRef.current) return;
    const canvas = await html2canvas(tableRef.current, { scale: 2, backgroundColor: '#ffffff' });
    const link = document.createElement('a');
    link.download = `${table.title}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const generateDates = () => {
    if (!startDate) return alert('اختر تاريخ البدء');
    const newRows = [...table.rows];
    let curr = new Date(startDate);
    const fmt = new Intl.DateTimeFormat('ar-EG', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' });
    for (let r = 1; r < newRows.length; r++) {
      while (!workDays.includes(curr.getDay())) curr.setDate(curr.getDate() + 1);
      newRows[r][targetCol - 1].content = fmt.format(curr);
      curr.setDate(curr.getDate() + 1);
    }
    setTable({ ...table, rows: newRows });
  };

  // --- UI Handlers ---
  const onContextMenu = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    setActiveCell({ row: r, col: c });
    setContextMenu({ x: e.pageX, y: e.pageY, visible: true });
  };

  useEffect(() => {
    const hideMenu = () => setContextMenu(prev => prev ? { ...prev, visible: false } : null);
    window.addEventListener('click', hideMenu);
    return () => window.removeEventListener('click', hideMenu);
  }, []);

  const currentTheme = THEMES[table.theme] || THEMES[ThemeKey.DEFAULT_BLUE];

  return (
    <div className="app-window bg-slate-200">
      
      {/* 1. Desktop Mock Title Bar */}
      <div className="no-print h-10 bg-slate-800 flex items-center justify-between px-4 text-slate-300 text-sm select-none border-b border-slate-700">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5 mr-2">
            <div className="w-3.5 h-3.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors cursor-pointer" />
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors cursor-pointer" />
          </div>
          <span className="font-semibold flex items-center gap-2">
            <Layout size={14} className="text-blue-400" />
            {table.title} - Table Studio Pro
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <button className="hover:text-white transition-colors">ملف</button>
            <button className="hover:text-white transition-colors">تحرير</button>
            <button className="hover:text-white transition-colors">عرض</button>
            <button className="hover:text-white transition-colors" onClick={() => setShowHelp(true)}>مساعدة</button>
          </div>
        </div>
      </div>

      <div className="main-content">
        {/* 2. Sidebar Tools */}
        <aside className="sidebar no-print bg-white p-6 shadow-2xl z-10 flex flex-col gap-8">
          
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">التصميم والهيكل</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-600">القالب اللوني:</label>
                <select 
                  value={table.theme}
                  onChange={(e) => setTable({ ...table, theme: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                >
                  {Object.entries(THEMES).map(([k, t]) => <option key={k} value={k}>{t.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={addRow} className="flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-bold text-sm transition-all border border-blue-200">
                  <Plus size={16} /> إضافة صف
                </button>
                <button onClick={addColumn} className="flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-bold text-sm transition-all border border-blue-200">
                  <Plus size={16} /> إضافة عمود
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">الجدولة الذكية</h3>
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2 border rounded-lg text-sm mb-2" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">العمود #</span>
                <input type="number" min="1" value={targetCol} onChange={e => setTargetCol(parseInt(e.target.value))} className="w-12 p-1 border rounded text-sm text-center" />
              </div>
              <button onClick={generateDates} className="w-full py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-black transition-all flex items-center justify-center gap-2">
                <Calendar size={14} /> توليد التواريخ
              </button>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-2">
            <button onClick={exportPNG} className="flex items-center gap-2 w-full p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
              <ImageIcon size={18} /> <span className="font-bold">حفظ كصورة</span>
            </button>
            <button onClick={exportCSV} className="flex items-center gap-2 w-full p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              <Save size={18} /> <span className="font-bold text-sm">تصدير CSV (Ctrl+S)</span>
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 w-full p-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all">
              <Printer size={18} /> <span className="font-bold text-sm">طباعة (Ctrl+P)</span>
            </button>
          </div>
        </aside>

        {/* 3. Workspace */}
        <main className="workspace">
          
          {/* Floating Formatting Tool (Modernized) */}
          {activeCell && toolbarPos && !contextMenu?.visible && (
            <div className="absolute z-50 no-print" style={{ top: toolbarPos.top, left: toolbarPos.left, transform: 'translateX(-50%)' }}>
              <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-full p-1.5 shadow-2xl flex items-center gap-1 border border-white/20">
                <button onClick={() => applyStyle('bold', !table.rows[activeCell.row][activeCell.col].style.bold)} className={`p-1.5 rounded-full ${table.rows[activeCell.row][activeCell.col].style.bold ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-300'}`}><Bold size={14} /></button>
                <button onClick={() => applyStyle('italic', !table.rows[activeCell.row][activeCell.col].style.italic)} className={`p-1.5 rounded-full ${table.rows[activeCell.row][activeCell.col].style.italic ? 'bg-blue-600' : 'hover:bg-slate-700'}`}><Italic size={14} /></button>
                <button onClick={() => applyStyle('underline', !table.rows[activeCell.row][activeCell.col].style.underline)} className={`p-1.5 rounded-full ${table.rows[activeCell.row][activeCell.col].style.underline ? 'bg-blue-600' : 'hover:bg-slate-700'}`}><Underline size={14} /></button>
                <div className="w-[1px] h-4 bg-slate-700 mx-1" />
                <input type="color" className="w-5 h-5 rounded-full cursor-pointer p-0 border-none bg-transparent" title="لون النص" onChange={e => applyStyle('textColor', e.target.value)} value={table.rows[activeCell.row][activeCell.col].style.textColor || '#ffffff'} />
                <button onClick={() => { localStorage.removeItem(STORAGE_KEY); initializeTable(); }} className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors"><Eraser size={14} /></button>
              </div>
            </div>
          )}

          {/* Context Menu */}
          {contextMenu?.visible && (
            <div className="fixed z-[100] bg-white shadow-2xl border rounded-lg py-2 w-48 text-sm" style={{ top: contextMenu.y, left: contextMenu.x }}>
              <button onClick={() => deleteRow(activeCell!.row)} className="w-full text-right px-4 py-2 hover:bg-red-50 text-red-600 flex items-center justify-between">حذف الصف <Trash2 size={14} /></button>
              <button onClick={() => deleteColumn(activeCell!.col)} className="w-full text-right px-4 py-2 hover:bg-red-50 text-red-600 flex items-center justify-between">حذف العمود <Trash2 size={14} /></button>
              <div className="h-[1px] bg-slate-100 my-1" />
              <button onClick={() => applyStyle('bold', true)} className="w-full text-right px-4 py-2 hover:bg-slate-50 flex items-center justify-between">تغميق الخط <Bold size={14} /></button>
              <button onClick={() => applyStyle('backgroundColor', '#fef3c7')} className="w-full text-right px-4 py-2 hover:bg-slate-50 flex items-center justify-between">تمييز باللون <MousePointer2 size={14} /></button>
            </div>
          )}

          <div ref={tableRef} className="max-w-5xl mx-auto bg-white rounded-lg shadow-2xl p-12 min-h-[800px] print:p-0 print:shadow-none print:min-h-0">
             <div className="flex flex-col items-center mb-12">
               <h1 
                contentEditable 
                suppressContentEditableWarning
                onBlur={e => setTable({ ...table, title: e.currentTarget.innerText })}
                className="text-4xl font-black text-slate-800 outline-none hover:bg-slate-50 px-4 py-2 rounded-lg text-center"
               >{table.title}</h1>
               <div className="w-24 h-1 bg-blue-600 mt-4 rounded-full" />
             </div>

             <div className="w-full overflow-x-auto">
               <table className={`w-full border-collapse border ${currentTheme.border} rounded-lg overflow-hidden`}>
                 <thead>
                   <tr className={currentTheme.header}>
                     {table.rows[0]?.map((cell, cIdx) => (
                       <th key={cell.id} className={`p-4 border ${currentTheme.border} relative group`}>
                         <div 
                           contentEditable 
                           suppressContentEditableWarning
                           className={`outline-none min-h-[1.5em] ${cell.style.bold ? 'font-bold' : ''} ${cell.style.italic ? 'italic' : ''}`}
                           style={{ color: cell.style.textColor, backgroundColor: cell.style.backgroundColor }}
                           onBlur={e => handleCellChange(0, cIdx, e.currentTarget.innerText)}
                           onContextMenu={e => onContextMenu(e, 0, cIdx)}
                           onFocus={e => {
                             setActiveCell({ row: 0, col: cIdx });
                             const rect = e.currentTarget.getBoundingClientRect();
                             setToolbarPos({ top: rect.top + window.scrollY - 50, left: rect.left + rect.width / 2 });
                           }}
                         >{cell.content}</div>
                         <button onClick={() => deleteColumn(cIdx)} className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 no-print transition-all"><X size={10} /></button>
                       </th>
                     ))}
                   </tr>
                 </thead>
                 <tbody>
                   {table.rows.slice(1).map((row, rIdx) => (
                     <tr key={rIdx} className={rIdx % 2 === 0 ? currentTheme.rowEven : currentTheme.rowOdd}>
                       {row.map((cell, cIdx) => (
                         <td key={cell.id} className={`p-3 border ${currentTheme.border} relative group text-center`}>
                           <div 
                             contentEditable 
                             suppressContentEditableWarning
                             className={`outline-none min-h-[1em] ${cell.style.bold ? 'font-bold' : ''}`}
                             style={{ color: cell.style.textColor, backgroundColor: cell.style.backgroundColor }}
                             onBlur={e => handleCellChange(rIdx + 1, cIdx, e.currentTarget.innerText)}
                             onContextMenu={e => onContextMenu(e, rIdx + 1, cIdx)}
                             onFocus={e => {
                               setActiveCell({ row: rIdx + 1, col: cIdx });
                               const rect = e.currentTarget.getBoundingClientRect();
                               setToolbarPos({ top: rect.top + window.scrollY - 45, left: rect.left + rect.width / 2 });
                             }}
                           >{cell.content}</div>
                           {cIdx === 0 && <button onClick={() => deleteRow(rIdx + 1)} className="absolute top-1/2 -right-3 -translate-y-1/2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 no-print transition-all"><X size={10} /></button>}
                         </td>
                       ))}
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
             <p className="hidden print:block text-[10px] text-slate-400 mt-8 text-center italic">Document generated by Table Studio Pro Desktop</p>
          </div>
        </main>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-8 relative">
            <button onClick={() => setShowHelp(false)} className="absolute top-4 left-4 text-slate-400 hover:text-slate-900"><X size={24} /></button>
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <HelpCircle className="text-blue-600" size={30} /> دليل الاختصارات والتشغيل
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700">تصدير وحفظ سريع</span>
                <kbd className="px-2 py-1 bg-white border border-slate-300 rounded-md font-mono text-xs shadow-sm">Ctrl + S</kbd>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700">طباعة الجدول</span>
                <kbd className="px-2 py-1 bg-white border border-slate-300 rounded-md font-mono text-xs shadow-sm">Ctrl + P</kbd>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700">إضافة صف جديد</span>
                <kbd className="px-2 py-1 bg-white border border-slate-300 rounded-md font-mono text-xs shadow-sm">Ctrl + Enter</kbd>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border-2 border-blue-100">
                <span className="text-slate-700">التحكم المتقدم</span>
                <span className="text-blue-600 text-xs font-bold">انقر بيمين الفأرة على أي خلية</span>
              </div>
            </div>
            <button onClick={() => setShowHelp(false)} className="mt-8 w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">استكمال العمل</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

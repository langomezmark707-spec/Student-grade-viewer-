import React, { useState, useRef, useEffect } from 'react';
import { Search, UserCheck, Sparkles, Check } from 'lucide-react';
import { Student, GradingSystem } from '../types';
import { calculateCumulativeGpa, calculateCumulativeGwa } from '../utils/gradeUtils';

interface StudentLookupProps {
  students: Student[];
  selectedStudent?: Student;
  selectedStudentId?: string;
  gradingSystem?: GradingSystem;
  onSelectStudent: (student: Student) => void;
}

export const StudentLookup: React.FC<StudentLookupProps> = ({
  students,
  selectedStudent,
  selectedStudentId,
  gradingSystem = 'college',
  onSelectStudent,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeStudent =
    selectedStudent ||
    students.find((s) => s.id === selectedStudentId) ||
    students[0];
  const activeStudentId = activeStudent?.id || '';

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.studentId.toLowerCase().includes(query.toLowerCase()) ||
      s.program.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>Instant Student Lookup</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Fast Search
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Type any Student ID or name for instant grade report retrieval.
          </p>
        </div>

        {/* Quick Demo Switcher Pills */}
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-xs font-medium text-slate-400 mr-1 hidden md:inline">Quick Demo:</span>
          {students.map((s) => {
            const isCurrent = s.id === activeStudentId;
            return (
              <button
                key={s.id}
                id={`quick-student-${s.id}`}
                onClick={() => onSelectStudent(s)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all duration-150 flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{s.name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-75 font-mono">({s.studentId.replace('STU-2024-', '#')})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Search Input */}
      <div ref={containerRef} className="relative w-full">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="student-search-input"
            type="text"
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            placeholder="Search by Student ID (e.g. 101, STU-2024-101) or Student Name..."
            className="w-full pl-10 pr-24 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
              }}
              className="absolute inset-y-0 right-12 pr-2 flex items-center text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded">
              ENTER
            </kbd>
          </div>
        </div>

        {/* Dropdown Results */}
        {isOpen && (
          <div className="absolute z-30 mt-1.5 w-full bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 max-h-72 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((s) => {
                const isCurrent = s.id === activeStudentId;
                const cumGpa = calculateCumulativeGpa(s);
                const cumGwa = calculateCumulativeGwa(s);
                return (
                  <button
                    key={s.id}
                    id={`search-item-${s.id}`}
                    onClick={() => {
                      onSelectStudent(s);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between transition-colors ${
                      isCurrent ? 'bg-indigo-50/80 text-indigo-950' : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={s.avatar}
                        alt={s.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                          <span>{s.name}</span>
                          <span className="text-[11px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {s.studentId}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
                          {s.program} • {s.gradeLevel}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {gradingSystem === 'college'
                          ? `GWA ${cumGwa.gwa.toFixed(2)}`
                          : `GPA ${cumGpa.gpa.toFixed(2)}`}
                      </span>
                      {isCurrent && <Check className="w-4 h-4 text-indigo-600" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-4 text-center text-xs text-slate-500">
                No student records found matching "{query}". Try "Alex" or "101".
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


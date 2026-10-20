import React, { useState } from 'react';
import { Award, Calendar, Check, Copy, FileText, Sparkles, TrendingUp, UserCheck, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, TermData, GradingSystem } from '../types';
import {
  calculateCumulativeGpa,
  calculateTermGpa,
  getAcademicStanding,
  calculateCumulativeGwa,
  calculateTermGwa,
  getCollegeAcademicStanding,
  percentageToCollegeGrade,
} from '../utils/gradeUtils';

interface StudentProfileCardProps {
  student: Student;
  activeTerm: TermData;
  gradingSystem: GradingSystem;
  onSelectTerm: (term: TermData) => void;
  onOpenWhatIf: () => void;
  onOpenPrint: () => void;
  onOpenCollegeGuide?: () => void;
}

export const StudentProfileCard: React.FC<StudentProfileCardProps> = ({
  student,
  activeTerm,
  gradingSystem,
  onSelectTerm,
  onOpenWhatIf,
  onOpenPrint,
  onOpenCollegeGuide,
}) => {
  const [copiedId, setCopiedId] = useState(false);

  // US GPA metrics
  const cumGpa = calculateCumulativeGpa(student);
  const termGpa = calculateTermGpa(activeTerm?.courses || []);
  const standingGpa = getAcademicStanding(cumGpa.gpa);

  // College GWA metrics (1.00 - 5.00 scale, lower is better)
  const cumGwa = calculateCumulativeGwa(student);
  const termGwa = calculateTermGwa(activeTerm?.courses || []);
  const standingGwa = getCollegeAcademicStanding(cumGwa.gwa, termGwa.hasFailingGrade);
  const termCollegeGrade = percentageToCollegeGrade(termGwa.averagePercentage);

  const handleCopyId = () => {
    navigator.clipboard.writeText(student.studentId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const isHonors =
    gradingSystem === 'college' ? cumGwa.gwa <= 1.5 : cumGpa.gpa >= 3.8;

  const triggerCelebrate = () => {
    confetti({
      particleCount: 90,
      spread: 65,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Top Banner with subtle academic slate gradient accent */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Student Identity */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-white/20 shadow-md bg-slate-800"
              />
              <span
                className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full border-2 border-slate-900 text-white"
                title="Enrolled & Active Student"
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {student.name}
                </h1>
                <button
                  onClick={handleCopyId}
                  title="Click to copy Student ID"
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-indigo-200 text-xs font-mono font-medium transition-colors border border-white/10"
                >
                  <span>{student.studentId}</span>
                  {copiedId ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>

                {gradingSystem === 'college' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    College 1.00 – 5.00
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
                {student.program}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-400">
                <span>{student.gradeLevel}</span>
                <span>•</span>
                <span>{student.email}</span>
                <span>•</span>
                <span className="font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  🕒 1-Hour Schedule: 0 Conflicts
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Tools */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            {onOpenCollegeGuide && gradingSystem === 'college' && (
              <button
                onClick={onOpenCollegeGuide}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 text-xs font-semibold border border-white/15 transition-all duration-150"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>1.00 – 5.00 Legend</span>
              </button>
            )}

            <button
              id="whatif-simulator-button"
              onClick={onOpenWhatIf}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-all duration-150"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>What-If Simulator</span>
            </button>

            <button
              id="print-report-card-button"
              onClick={onOpenPrint}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-all duration-150"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Official Transcript</span>
            </button>

            {isHonors && (
              <button
                onClick={triggerCelebrate}
                title="Celebrate Academic Excellence!"
                className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50/70 border-b border-slate-200/80">
        {/* Cumulative GPA / GWA */}
        <div className="p-4 sm:p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>{gradingSystem === 'college' ? 'Cumulative GWA' : 'Cumulative GPA'}</span>
            <Award className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {gradingSystem === 'college' ? cumGwa.gwa.toFixed(2) : cumGpa.gpa.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {gradingSystem === 'college' ? '/ 5.00 (1.00 = Top)' : '/ 4.00'}
            </span>
          </div>
          <div className="mt-1">
            <span
              className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded border ${
                gradingSystem === 'college'
                  ? standingGwa.badgeClass
                  : standingGpa.badgeClass
              }`}
            >
              {gradingSystem === 'college' ? standingGwa.title : standingGpa.title}
            </span>
          </div>
        </div>

        {/* Current Term GPA / GWA */}
        <div className="p-4 sm:p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>{gradingSystem === 'college' ? 'Term GWA' : 'Term GPA'}</span>
            <span className="text-[10px] text-slate-400 font-mono">WEIGHTED</span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-700 font-mono">
              {gradingSystem === 'college'
                ? termGwa.gwa.toFixed(2)
                : termGpa.gpa.toFixed(2)}
            </span>
            <span className="text-xs font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
              {gradingSystem === 'college'
                ? termCollegeGrade.grade
                : termGpa.letterGrade}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Term Average:{' '}
            <span className="font-semibold text-slate-700">
              {termGwa.averagePercentage}%
            </span>
            {gradingSystem === 'college' && (
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {termCollegeGrade.description}
              </span>
            )}
          </p>
        </div>

        {/* Total Credits / Units */}
        <div className="p-4 sm:p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Total Units</span>
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {cumGwa.totalCredits}
            </span>
            <span className="text-xs text-slate-500 font-medium">units</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {termGwa.totalCredits} units in current term
          </p>
        </div>

        {/* Attendance */}
        <div className="p-4 sm:p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Attendance</span>
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
              {student.attendanceRate}%
            </span>
            <span className="text-xs text-emerald-600 font-semibold">Present</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(student.attendanceRate, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Term Selector Bar */}
      <div className="px-5 py-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Active Academic Term:</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {student.terms.map((term) => {
            const isSelected = term.termId === activeTerm.termId;
            return (
              <button
                key={term.termId}
                id={`term-btn-${term.termId}`}
                onClick={() => onSelectTerm(term)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {term.termName}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

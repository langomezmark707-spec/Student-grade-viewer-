import React, { useState } from 'react';
import {
  X,
  Award,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Calculator,
  BookOpen,
  GraduationCap,
  Calendar,
} from 'lucide-react';
import { COLLEGE_GRADE_SCALE, percentageToCollegeGrade, getCollegeGradeColorClass } from '../utils/gradeUtils';

interface CollegeScaleModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

export const CollegeScaleModal: React.FC<CollegeScaleModalProps> = ({ isOpen = true, onClose }) => {
  const [testScore, setTestScore] = useState<number>(86);
  const evaluatedGrade = percentageToCollegeGrade(testScore);
  const color = getCollegeGradeColorClass(evaluatedGrade.numeric);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>College Numerical Grading System & 4-Period Structure</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  1.00 – 5.00 Scale
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Prelim • Midterm • Semi-Final • Final Exams leading to Semester GWA
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* 4 Exam Periods Breakdown Card */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-indigo-300">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>The 4 Collegiate Grading Periods</span>
              </span>
              <span className="text-emerald-400 font-mono">Total = 100% of Course</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-white/10 border border-white/10">
                <div className="font-extrabold text-white">1. Prelim Exam</div>
                <div className="text-[11px] text-indigo-200 mt-0.5">25% Weight</div>
                <div className="text-[10px] text-slate-300 mt-0.5">Exam + Quizzes</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white/10 border border-white/10">
                <div className="font-extrabold text-white">2. Midterm Exam</div>
                <div className="text-[11px] text-indigo-200 mt-0.5">25% Weight</div>
                <div className="text-[10px] text-slate-300 mt-0.5">Exam + Midterm Tasks</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white/10 border border-white/10">
                <div className="font-extrabold text-white">3. Semi-Final Exam</div>
                <div className="text-[11px] text-indigo-200 mt-0.5">25% Weight</div>
                <div className="text-[10px] text-slate-300 mt-0.5">Exam + Case Studies</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white/10 border border-white/10">
                <div className="font-extrabold text-white">4. Final Exam</div>
                <div className="text-[11px] text-indigo-200 mt-0.5">25% Weight</div>
                <div className="text-[10px] text-slate-300 mt-0.5">Exam + Capstone</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-indigo-200 font-mono">
              Final Subject % = (Prelim % + Midterm % + Semi-Final % + Final %) ÷ 4
            </div>
          </div>

          {/* Quick Interactive Grade Checker */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950 uppercase tracking-wider">
                <Calculator className="w-3.5 h-3.5 text-indigo-600" />
                <span>Instant College Grade Converter</span>
              </div>
              <p className="text-xs text-indigo-900/80">
                Type any score percentage to test its college grade equivalent:
              </p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={testScore}
                  onChange={(e) => setTestScore(Math.min(100, Math.max(0, Number(e.target.value))))}
                  className="w-24 px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                <span className="text-xs font-bold text-indigo-950">% Score</span>
              </div>
            </div>

            {/* Result Badge */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl border ${color.bg} ${color.text} ${color.border}`}>
                {evaluatedGrade.grade}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {evaluatedGrade.description}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                  <span className={`font-semibold px-1.5 py-0.2 rounded text-[10px] ${evaluatedGrade.remarks === 'Passed' ? 'bg-emerald-100 text-emerald-800' : evaluatedGrade.remarks === 'Conditional' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
                    {evaluatedGrade.remarks}
                  </span>
                  <span>US: {evaluatedGrade.usLetter}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full College Grading Scale Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                College Grade Equivalency Table
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Passing Mark: 3.00 (75%)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">College Grade</th>
                    <th className="px-4 py-2.5">Percentage Bracket</th>
                    <th className="px-4 py-2.5">Descriptive Rating</th>
                    <th className="px-4 py-2.5">Remarks</th>
                    <th className="px-4 py-2.5 text-center">US Letter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {COLLEGE_GRADE_SCALE.map((item) => {
                    const isTested = evaluatedGrade.grade === item.grade;
                    const itemColor = getCollegeGradeColorClass(item.numeric);
                    return (
                      <tr
                        key={item.grade}
                        className={`transition-colors ${isTested ? 'bg-indigo-50/60 font-semibold' : 'hover:bg-slate-50'}`}
                      >
                        <td className="px-4 py-2.5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-md font-black font-mono border ${itemColor.bg} ${itemColor.text} ${itemColor.border}`}>
                            {item.grade}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-medium text-slate-700 font-mono">
                          {item.percentageRange}
                        </td>
                        <td className="px-4 py-2.5 text-slate-900 font-medium">
                          {item.description}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                              item.remarks === 'Passed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : item.remarks === 'Conditional'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {item.remarks}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-center font-bold text-slate-600">
                          {item.usLetter}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Academic Honors Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>President's List</span>
              </div>
              <div className="text-lg font-black text-emerald-800 mt-1 font-mono">
                1.00 – 1.25 GWA
              </div>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Summa Cum Laude standing. Minimum passing marks across all 4 periods.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                <span>Dean's List (1st Honors)</span>
              </div>
              <div className="text-lg font-black text-blue-800 mt-1 font-mono">
                1.26 – 1.50 GWA
              </div>
              <p className="text-[11px] text-blue-700 mt-0.5">
                Magna Cum Laude standing. No period exam grade below 2.00.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
                <Award className="w-3.5 h-3.5 text-sky-600" />
                <span>Dean's List (2nd Honors)</span>
              </div>
              <div className="text-lg font-black text-sky-800 mt-1 font-mono">
                1.51 – 1.75 GWA
              </div>
              <p className="text-[11px] text-sky-700 mt-0.5">
                Cum Laude standing. Full regular academic load.
              </p>
            </div>
          </div>

          {/* GWA Formula Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>How College GWA (General Weighted Average) is Calculated:</span>
            </div>
            <p className="font-mono text-slate-800 bg-white p-2 rounded border border-slate-200 text-[11px]">
              GWA = Sum(Course Final Grade × Units) ÷ Total Enrolled Units
            </p>
            <p className="text-[11px] text-slate-500">
              <strong>Note:</strong> In college, a <strong>lower numerical GWA indicates higher academic ranking</strong> (1.00 is top). A student with a 1.25 GWA ranks higher than a student with a 2.50 GWA.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

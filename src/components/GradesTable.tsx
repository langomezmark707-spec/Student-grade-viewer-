import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Award,
  Layers,
  HelpCircle,
  Table,
  LayoutGrid,
} from 'lucide-react';
import { SubjectGrade, GradingSystem } from '../types';
import {
  calculateCoursePercentage,
  percentageToCollegeGrade,
  percentageToLetterGrade,
  getGradeColorClass,
  getCollegeGradeColorClass,
  getCoursePeriodScores,
  calculateTermGwa,
  getCollegeAcademicStanding,
} from '../utils/gradeUtils';

interface GradesTableProps {
  courses: SubjectGrade[];
  gradingSystem?: GradingSystem;
  onOpenWhatIfForCourse?: (course: SubjectGrade) => void;
  onOpenCollegeGuide?: () => void;
  onOpenWhyGrade?: (courseCode?: string) => void;
}

export const GradesTable: React.FC<GradesTableProps> = ({
  courses,
  gradingSystem = 'college',
  onOpenWhatIfForCourse,
  onOpenCollegeGuide,
  onOpenWhyGrade,
}) => {
  const [viewMode, setViewMode] = useState<'matrix' | 'cards'>('matrix');
  const safeCourses = Array.isArray(courses) ? courses : [];
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({
    [safeCourses[0]?.courseCode || '']: true,
  });

  const termGwaCalc = calculateTermGwa(safeCourses);
  const collegeStanding = getCollegeAcademicStanding(
    termGwaCalc.gwa,
    termGwaCalc.hasFailingGrade
  );

  const toggleCourse = (courseCode: string) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseCode]: !prev[courseCode],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    safeCourses.forEach((c) => (all[c.courseCode] = true));
    setExpandedCourses(all);
  };

  const collapseAll = () => {
    setExpandedCourses({});
  };

  return (
    <div className="space-y-4">
      {/* Collegiate GWA & 4-Period Exam Summary Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
              Collegiate Semester Summary
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              4 Exam Periods: Prelim • Midterm • Semi-Final • Final
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-baseline gap-2">
            <span>General Weighted Average (GWA):</span>
            <span className="font-mono text-emerald-400 text-3xl font-black underline decoration-emerald-500/50 underline-offset-4">
              {termGwaCalc.gwa.toFixed(2)}
            </span>
          </h2>
          <p className="text-xs text-indigo-200/80">
            Formula: GWA = Sum(Course Final Grade × Units) ÷ Total Units ({termGwaCalc.totalCredits} enrolled units)
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-right">
            <div className="text-[10px] uppercase font-semibold text-indigo-200">
              Academic Standing
            </div>
            <div className="text-sm font-black text-white mt-0.5">
              {collegeStanding.title.split('/')[0]}
            </div>
            <div className="text-[10px] text-emerald-300 font-medium">
              {termGwaCalc.allPassed ? '✓ All Subjects Passed' : '⚠ Deficiency Noted'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 flex-wrap">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Collegiate Period Grades & Course GWA</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 font-mono">
                {courses.length} Enrolled Courses
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>
                Computed from Prelim Exam, Midterm Exam, Semi-Final Exam, and Final Exam.
              </span>
              {gradingSystem === 'college' && onOpenCollegeGuide && (
                <button
                  onClick={onOpenCollegeGuide}
                  className="text-indigo-600 hover:text-indigo-800 underline font-medium inline-flex items-center gap-0.5"
                >
                  <span>1.00 – 5.00 Scale Guide</span>
                </button>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle: Matrix vs Cards */}
            <div className="p-1 bg-slate-200/70 rounded-xl flex items-center text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('matrix')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                  viewMode === 'matrix'
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="4-Period Exam Grid View (Prelim, Midterm, Semi-Final, Final)"
              >
                <Table className="w-3.5 h-3.5" />
                <span>4-Period Table</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Detailed Cards & Assessment Drawer View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Detailed Cards</span>
              </button>
            </div>

            {viewMode === 'cards' && (
              <div className="hidden sm:flex items-center gap-2 text-xs">
                <button
                  onClick={expandAll}
                  className="text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50"
                >
                  Expand
                </button>
                <span className="text-slate-300">•</span>
                <button
                  onClick={collapseAll}
                  className="text-slate-500 hover:text-slate-700 font-medium px-2 py-1 rounded hover:bg-slate-100"
                >
                  Collapse
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 4-Period Collegiate Matrix View (Primary Table) */}
        {viewMode === 'matrix' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3.5">Course Code</th>
                  <th className="py-3 px-3.5 min-w-44">Course Title & Instructor</th>
                  <th className="py-3 px-2 text-center">Units</th>
                  <th className="py-3 px-3 text-center bg-indigo-50/50 border-x border-slate-200/80">
                    <div className="font-extrabold text-indigo-950">Prelim Exam</div>
                    <div className="text-[10px] font-normal text-indigo-700/80">Exam & Grade</div>
                  </th>
                  <th className="py-3 px-3 text-center bg-indigo-50/50 border-r border-slate-200/80">
                    <div className="font-extrabold text-indigo-950">Midterm Exam</div>
                    <div className="text-[10px] font-normal text-indigo-700/80">Exam & Grade</div>
                  </th>
                  <th className="py-3 px-3 text-center bg-indigo-50/50 border-r border-slate-200/80">
                    <div className="font-extrabold text-indigo-950">Semi-Final Exam</div>
                    <div className="text-[10px] font-normal text-indigo-700/80">Exam & Grade</div>
                  </th>
                  <th className="py-3 px-3 text-center bg-indigo-50/50 border-r border-slate-200/80">
                    <div className="font-extrabold text-indigo-950">Final Exam</div>
                    <div className="text-[10px] font-normal text-indigo-700/80">Exam & Grade</div>
                  </th>
                  <th className="py-3 px-3 text-center bg-slate-200/60 font-black">
                    Final Grade
                  </th>
                  <th className="py-3 px-3 text-center">Remarks</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((course) => {
                  const period = getCoursePeriodScores(course);
                  const p1Color = getCollegeGradeColorClass(period.prelim.collegeGrade);
                  const p2Color = getCollegeGradeColorClass(period.midterm.collegeGrade);
                  const p3Color = getCollegeGradeColorClass(period.semiFinal.collegeGrade);
                  const p4Color = getCollegeGradeColorClass(period.final.collegeGrade);
                  const finalColor = getCollegeGradeColorClass(period.finalCollegeGrade.numeric);

                  return (
                    <tr
                      key={course.courseCode}
                      className="hover:bg-indigo-50/30 transition-colors"
                    >
                      {/* Code */}
                      <td className="py-3 px-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-md bg-slate-100 border border-slate-200">
                          {course.courseCode}
                        </span>
                      </td>

                      {/* Course Title & Instructor */}
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">
                          {course.courseName}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                          <span>{course.instructor}</span>
                          {course.room && <span>• {course.room}</span>}
                          {course.schedule && (
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                              🕒 {course.schedule} (1 hr)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Units */}
                      <td className="py-3 px-2 text-center font-mono font-bold text-slate-700">
                        {course.credits}.0
                      </td>

                      {/* Prelim Exam */}
                      <td className="py-3 px-3 text-center bg-indigo-50/30 border-x border-slate-100">
                        <div className="font-mono font-bold text-slate-900">
                          {period.prelim.examScore}%
                        </div>
                        <span
                          className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-black font-mono border ${p1Color.bg} ${p1Color.text} ${p1Color.border}`}
                        >
                          {period.prelim.collegeGrade}
                        </span>
                      </td>

                      {/* Midterm Exam */}
                      <td className="py-3 px-3 text-center bg-indigo-50/30 border-r border-slate-100">
                        <div className="font-mono font-bold text-slate-900">
                          {period.midterm.examScore}%
                        </div>
                        <span
                          className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-black font-mono border ${p2Color.bg} ${p2Color.text} ${p2Color.border}`}
                        >
                          {period.midterm.collegeGrade}
                        </span>
                      </td>

                      {/* Semi-Final Exam */}
                      <td className="py-3 px-3 text-center bg-indigo-50/30 border-r border-slate-100">
                        <div className="font-mono font-bold text-slate-900">
                          {period.semiFinal.examScore}%
                        </div>
                        <span
                          className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-black font-mono border ${p3Color.bg} ${p3Color.text} ${p3Color.border}`}
                        >
                          {period.semiFinal.collegeGrade}
                        </span>
                      </td>

                      {/* Final Exam */}
                      <td className="py-3 px-3 text-center bg-indigo-50/30 border-r border-slate-100">
                        <div className="font-mono font-bold text-slate-900">
                          {period.final.examScore}%
                        </div>
                        <span
                          className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-black font-mono border ${p4Color.bg} ${p4Color.text} ${p4Color.border}`}
                        >
                          {period.final.collegeGrade}
                        </span>
                      </td>

                      {/* Final Course Grade */}
                      <td className="py-3 px-3 text-center bg-slate-50 font-mono">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-sm font-black border shadow-2xs ${finalColor.bg} ${finalColor.text} ${finalColor.border}`}
                        >
                          {period.finalCollegeGrade.grade}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-sans font-medium">
                          {period.finalPercentage.toFixed(1)}% Avg
                        </div>
                      </td>

                      {/* Remarks */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            period.finalCollegeGrade.remarks === 'Passed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : period.finalCollegeGrade.remarks === 'Conditional'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {period.finalCollegeGrade.remarks}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {onOpenWhyGrade && (
                            <button
                              type="button"
                              onClick={() => onOpenWhyGrade(course.courseCode)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors"
                              title="View why this grade was computed based on exams, attendance, and coursework"
                            >
                              <HelpCircle className="w-3 h-3 text-indigo-600" />
                              <span>Why?</span>
                            </button>
                          )}

                          {onOpenWhatIfForCourse && (
                            <button
                              type="button"
                              onClick={() => onOpenWhatIfForCourse(course)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                              title="Simulate needed exam scores"
                            >
                              <TrendingUp className="w-3 h-3" />
                              <span>Simulate</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Collegiate Matrix Footer: Totals & Semester GWA */}
              <tfoot className="bg-slate-900 text-white font-bold border-t-2 border-slate-900">
                <tr>
                  <td colSpan={2} className="py-3.5 px-3.5 uppercase tracking-wider text-xs text-indigo-200">
                    Semester Totals & General Weighted Average:
                  </td>
                  <td className="py-3.5 px-2 text-center font-mono text-sm text-white">
                    {termGwaCalc.totalCredits} Units
                  </td>
                  <td
                    colSpan={4}
                    className="py-3.5 px-3 text-center text-xs text-indigo-200 border-x border-slate-700"
                  >
                    4 Periods Completed: Prelim + Midterm + Semi-Final + Final
                  </td>
                  <td className="py-3.5 px-3 text-center bg-indigo-800 text-white font-mono">
                    <div className="text-[10px] uppercase font-semibold text-indigo-200">
                      SEMESTER GWA
                    </div>
                    <div className="text-xl font-black text-emerald-300">
                      {termGwaCalc.gwa.toFixed(2)}
                    </div>
                  </td>
                  <td colSpan={2} className="py-3.5 px-3 text-center text-xs text-emerald-300 font-semibold">
                    {collegeStanding.title}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          /* Detailed Cards View with 4 Period Cards per subject */
          <div className="divide-y divide-slate-100">
            {courses.map((course) => {
              const period = getCoursePeriodScores(course);
              const isExpanded = !!expandedCourses[course.courseCode];
              const finalColor = getCollegeGradeColorClass(period.finalCollegeGrade.numeric);

              return (
                <div key={course.courseCode} className="transition-colors hover:bg-slate-50/40">
                  {/* Card Header Row */}
                  <div
                    onClick={() => toggleCourse(course.courseCode)}
                    className="p-4 sm:p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 font-mono text-xs font-bold shrink-0 border border-slate-200">
                        {course.courseCode}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base hover:text-indigo-600 transition-colors truncate">
                            {course.courseName}
                          </h4>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium font-mono">
                            {course.credits} Units
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              period.finalCollegeGrade.remarks === 'Passed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {period.finalCollegeGrade.remarks}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                          <span>Instructor: <strong>{course.instructor}</strong></span>
                          {course.room && <span>• Room: {course.room}</span>}
                          {course.schedule && (
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                              🕒 {course.schedule} (1 hr)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick 4-Period Badges in Row */}
                    <div className="flex items-center gap-3 shrink-0 flex-wrap justify-between md:justify-end">
                      <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                        <div className="px-2 py-1 bg-slate-100 rounded-lg border border-slate-200">
                          <div className="text-[9px] uppercase font-bold text-slate-500">Prelim</div>
                          <div className="font-mono font-bold text-slate-900">{period.prelim.collegeGrade}</div>
                        </div>
                        <div className="px-2 py-1 bg-slate-100 rounded-lg border border-slate-200">
                          <div className="text-[9px] uppercase font-bold text-slate-500">Midterm</div>
                          <div className="font-mono font-bold text-slate-900">{period.midterm.collegeGrade}</div>
                        </div>
                        <div className="px-2 py-1 bg-slate-100 rounded-lg border border-slate-200">
                          <div className="text-[9px] uppercase font-bold text-slate-500">Semi</div>
                          <div className="font-mono font-bold text-slate-900">{period.semiFinal.collegeGrade}</div>
                        </div>
                        <div className="px-2 py-1 bg-slate-100 rounded-lg border border-slate-200">
                          <div className="text-[9px] uppercase font-bold text-slate-500">Final</div>
                          <div className="font-mono font-bold text-slate-900">{period.final.collegeGrade}</div>
                        </div>
                      </div>

                      {/* Final Course Grade Badge */}
                      <div
                        className={`min-w-16 h-12 px-2.5 rounded-xl flex flex-col items-center justify-center font-black border shadow-2xs ${finalColor.bg} ${finalColor.text} ${finalColor.border}`}
                      >
                        <span className="text-lg leading-none font-mono font-black">
                          {period.finalCollegeGrade.grade}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider font-semibold opacity-75 mt-0.5">
                          Final Grade
                        </span>
                      </div>

                      <button
                        type="button"
                        aria-label="Toggle details"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Drawer */}
                  {isExpanded && (
                    <div className="px-4 pb-5 pt-1 sm:px-6 bg-slate-50/70 border-t border-slate-100 space-y-4">
                      {/* 4 Period Cards Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        {/* Prelim Card */}
                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            1. Prelim Exam Period
                          </div>
                          <div className="text-xl font-black text-slate-900 font-mono mt-1">
                            {period.prelim.examScore}%
                          </div>
                          <div className="flex items-center justify-between text-xs mt-1">
                            <span className="font-bold text-indigo-700 font-mono">
                              Grade {period.prelim.collegeGrade}
                            </span>
                            <span className="text-[10px] text-slate-400">25% Weight</span>
                          </div>
                        </div>

                        {/* Midterm Card */}
                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            2. Midterm Exam Period
                          </div>
                          <div className="text-xl font-black text-slate-900 font-mono mt-1">
                            {period.midterm.examScore}%
                          </div>
                          <div className="flex items-center justify-between text-xs mt-1">
                            <span className="font-bold text-indigo-700 font-mono">
                              Grade {period.midterm.collegeGrade}
                            </span>
                            <span className="text-[10px] text-slate-400">25% Weight</span>
                          </div>
                        </div>

                        {/* Semi-Final Card */}
                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            3. Semi-Final Exam Period
                          </div>
                          <div className="text-xl font-black text-slate-900 font-mono mt-1">
                            {period.semiFinal.examScore}%
                          </div>
                          <div className="flex items-center justify-between text-xs mt-1">
                            <span className="font-bold text-indigo-700 font-mono">
                              Grade {period.semiFinal.collegeGrade}
                            </span>
                            <span className="text-[10px] text-slate-400">25% Weight</span>
                          </div>
                        </div>

                        {/* Final Card */}
                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            4. Final Exam Period
                          </div>
                          <div className="text-xl font-black text-slate-900 font-mono mt-1">
                            {period.final.examScore}%
                          </div>
                          <div className="flex items-center justify-between text-xs mt-1">
                            <span className="font-bold text-indigo-700 font-mono">
                              Grade {period.final.collegeGrade}
                            </span>
                            <span className="text-[10px] text-slate-400">25% Weight</span>
                          </div>
                        </div>
                      </div>

                      {/* Instructor Remarks */}
                      {course.teacherRemarks && (
                        <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs flex items-start gap-2.5">
                          <MessageSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-indigo-950">
                              Instructor Remarks ({course.instructor}):{' '}
                            </span>
                            <span className="text-indigo-900 italic">
                              "{course.teacherRemarks}"
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Action to simulate */}
                      {onOpenWhatIfForCourse && (
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenWhatIfForCourse(course);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition-colors"
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>Simulate Final Exam Score Needed</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

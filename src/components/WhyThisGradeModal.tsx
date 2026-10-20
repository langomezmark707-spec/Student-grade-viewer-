import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  Award,
  CheckCircle2,
  Calendar,
  Compass,
  FileText,
  UserCheck,
  TrendingUp,
  Percent,
  BookOpen,
  AlertCircle,
  Calculator,
  Sparkles,
} from 'lucide-react';
import { SubjectGrade, Student, CollegeGrade } from '../types';
import {
  explainCourseGradeComposition,
  getCollegeGradeColorClass,
  getCoursePeriodScores,
} from '../utils/gradeUtils';

interface WhyThisGradeModalProps {
  isOpen?: boolean;
  student?: Student;
  courses?: SubjectGrade[];
  attendanceRate?: number;
  initialCourseCode?: string;
  onClose: () => void;
}

export const WhyThisGradeModal: React.FC<WhyThisGradeModalProps> = ({
  isOpen = true,
  student,
  courses = [],
  attendanceRate,
  initialCourseCode,
  onClose,
}) => {
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>(
    initialCourseCode || courses[0]?.courseCode || ''
  );

  if (!isOpen) return null;

  const effectiveAttendance =
    attendanceRate ?? student?.attendanceRate ?? 95;
  const studentId = student?.studentId || 'N/A';

  const selectedCourse =
    courses.find((c) => c.courseCode === selectedCourseCode) || courses[0];

  if (!selectedCourse) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl w-fit mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-800">No Enrolled Courses</h3>
          <p className="text-xs text-slate-500">
            There are no enrolled subjects or courses listed for this student yet.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const breakdown = explainCourseGradeComposition(
    selectedCourse,
    effectiveAttendance
  );

  const periodScores = getCoursePeriodScores(selectedCourse);
  const collegeColor = getCollegeGradeColorClass(breakdown.collegeGrade.numeric);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Transparent Grade Breakdown Engine
              </span>
              <span className="text-[10px] font-mono text-indigo-300">
                Student ID: {studentId}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Why This Grade? (Detailed Grade Breakdown)
            </h3>
            <p className="text-xs text-indigo-200/80 max-w-xl">
              Detailed breakdown of your performance across major exams, quizzes/quests, activities, and attendance to explain how your final college grade is computed.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-indigo-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Course Selector Dropdown / Tabs */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Select Enrolled Subject to Inspect:
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {courses.map((c) => (
                <button
                  key={c.courseCode}
                  onClick={() => setSelectedCourseCode(c.courseCode)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    selectedCourseCode === c.courseCode
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <span className="font-mono">{c.courseCode}</span>: {c.courseName.slice(0, 18)}...
                </button>
              ))}
            </div>
          </div>

          {/* Result Card: Final Computed Grade */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                  {selectedCourse.courseCode}
                </span>
                <h4 className="font-bold text-slate-900 text-base">
                  {selectedCourse.courseName}
                </h4>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Instructor: <strong>{selectedCourse.instructor}</strong> • {selectedCourse.credits} Academic Units
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase text-slate-400">Total Computed</div>
                <div className="text-lg font-black text-slate-900 font-mono">
                  {breakdown.finalPercentage}%
                </div>
              </div>

              <div
                className={`px-4 py-2 rounded-2xl border text-center font-black shadow-xs ${collegeColor.bg} ${collegeColor.text} ${collegeColor.border}`}
              >
                <div className="text-2xl font-mono leading-none">
                  {breakdown.collegeGrade.grade}
                </div>
                <div className="text-[9px] uppercase tracking-wider font-semibold opacity-80 mt-1">
                  {breakdown.collegeGrade.remarks}
                </div>
              </div>
            </div>
          </div>

          {/* Exact Formula Weights & Components */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-indigo-600" />
              Official 4-Component Collegiate Grading Formula
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Component 1: 4 Period Major Exams (50%) */}
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-950 text-xs">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>1. Major Exams (4 Periods)</span>
                  </div>
                  <span className="text-xs font-mono font-black text-indigo-700 px-2 py-0.5 bg-white rounded-md border border-indigo-200">
                    50% Weight
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xs text-slate-600">4-Period Exam Average:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {breakdown.examAvg.toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-xs border-t border-indigo-100 pt-1 font-semibold text-indigo-900">
                  <span>Grade Contribution:</span>
                  <span className="font-mono text-emerald-700 font-black">
                    +{breakdown.examContribution}%
                  </span>
                </div>

                <div className="text-[10px] text-slate-500 pt-1 border-t border-indigo-100">
                  Prelim: <strong>{periodScores.prelim.examScore}%</strong> ({periodScores.prelim.collegeGrade}) •
                  Midterm: <strong>{periodScores.midterm.examScore}%</strong> ({periodScores.midterm.collegeGrade}) •
                  Semi: <strong>{periodScores.semiFinal.examScore}%</strong> ({periodScores.semiFinal.collegeGrade}) •
                  Final: <strong>{periodScores.final.examScore}%</strong> ({periodScores.final.collegeGrade})
                </div>
              </div>

              {/* Component 2: Quizzes & Quests (20%) */}
              <div className="p-4 rounded-xl bg-violet-50/60 border border-violet-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-violet-950 text-xs">
                    <Compass className="w-4 h-4 text-violet-600" />
                    <span>2. Quests & Quizzes</span>
                  </div>
                  <span className="text-xs font-mono font-black text-violet-700 px-2 py-0.5 bg-white rounded-md border border-violet-200">
                    20% Weight
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xs text-slate-600">Quizzes / Quests Average:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {breakdown.quizzesAvg.toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-xs border-t border-violet-100 pt-1 font-semibold text-violet-900">
                  <span>Grade Contribution:</span>
                  <span className="font-mono text-emerald-700 font-black">
                    +{breakdown.quizContribution}%
                  </span>
                </div>

                <p className="text-[10px] text-slate-500 pt-1 border-t border-violet-100">
                  Computed from weekly pop quizzes, period assessments, and code challenge quests.
                </p>
              </div>

              {/* Component 3: Activities & Lab Work (20%) */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span>3. Activities & Lab Work</span>
                  </div>
                  <span className="text-xs font-mono font-black text-amber-700 px-2 py-0.5 bg-white rounded-md border border-amber-200">
                    20% Weight
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xs text-slate-600">Activities & Problem Sets:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {breakdown.activitiesAvg.toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-xs border-t border-amber-100 pt-1 font-semibold text-amber-900">
                  <span>Grade Contribution:</span>
                  <span className="font-mono text-emerald-700 font-black">
                    +{breakdown.activityContribution}%
                  </span>
                </div>

                <p className="text-[10px] text-slate-500 pt-1 border-t border-amber-100">
                  Laboratory exercises, problem set submissions, and collaborative term projects.
                </p>
              </div>

              {/* Component 4: Attendance & Punctuality (10%) */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-xs">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>4. Attendance & Sign-ins</span>
                  </div>
                  <span className="text-xs font-mono font-black text-emerald-700 px-2 py-0.5 bg-white rounded-md border border-emerald-200">
                    10% Weight
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xs text-slate-600">Student Attendance Rate:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {breakdown.attendanceScore.toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-xs border-t border-emerald-100 pt-1 font-semibold text-emerald-900">
                  <span>Grade Contribution:</span>
                  <span className="font-mono text-emerald-700 font-black">
                    +{breakdown.attendanceContribution}%
                  </span>
                </div>

                <p className="text-[10px] text-slate-500 pt-1 border-t border-emerald-100">
                  Base 10% awarded for perfect attendance, punctual class arrivals, and participation.
                </p>
              </div>
            </div>
          </div>

          {/* Summary Math Breakdown Formula */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
              Complete Mathematical Formula
            </div>
            <div className="font-mono text-xs sm:text-sm text-emerald-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
              Total = ({breakdown.examContribution}) + ({breakdown.quizContribution}) + ({breakdown.activityContribution}) + ({breakdown.attendanceContribution}) = <strong className="text-white text-base">{breakdown.finalPercentage}%</strong>
            </div>
            <div className="text-xs text-slate-300 flex items-center justify-between pt-1">
              <span>Equivalent College Grade:</span>
              <span className="font-bold font-mono text-emerald-400 text-sm">
                {breakdown.collegeGrade.grade} ({breakdown.collegeGrade.description})
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

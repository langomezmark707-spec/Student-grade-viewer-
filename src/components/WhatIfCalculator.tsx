import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  Target,
  Calculator,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SubjectGrade, GradingSystem, CollegeGrade } from '../types';
import {
  calculateCoursePercentage,
  percentageToCollegeGrade,
  percentageToLetterGrade,
  getGradeColorClass,
  getCollegeGradeColorClass,
  COLLEGE_GRADE_SCALE,
  getCoursePeriodScores,
  calculate4PeriodFinal,
  calculateNeededFinalExam,
  calculateTermGwa,
} from '../utils/gradeUtils';

interface WhatIfCalculatorProps {
  courses: SubjectGrade[];
  initialCourse?: SubjectGrade;
  gradingSystem?: GradingSystem;
  onClose: () => void;
}

export const WhatIfCalculator: React.FC<WhatIfCalculatorProps> = ({
  courses,
  initialCourse,
  gradingSystem = 'college',
  onClose,
}) => {
  const safeCourses = Array.isArray(courses) ? courses : [];
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>(
    initialCourse?.courseCode || safeCourses[0]?.courseCode || ''
  );

  const activeCourse = safeCourses.find((c) => c.courseCode === selectedCourseCode) || safeCourses[0];
  const activePeriod = getCoursePeriodScores(activeCourse);

  // 4-Period Exam Score States (initialized from activeCourse)
  const [prelimScore, setPrelimScore] = useState<number>(activePeriod?.prelim?.examScore ?? 90);
  const [midtermScore, setMidtermScore] = useState<number>(activePeriod?.midterm?.examScore ?? 90);
  const [semiFinalScore, setSemiFinalScore] = useState<number>(activePeriod?.semiFinal?.examScore ?? 90);
  const [finalScore, setFinalScore] = useState<number>(activePeriod?.final?.examScore ?? 90);

  // Target College Grade selection (1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 2.75, 3.00)
  const [targetCollegeGrade, setTargetCollegeGrade] = useState<string>('1.25');

  // Handle course switch
  const handleSelectCourse = (code: string) => {
    setSelectedCourseCode(code);
    const c = safeCourses.find((item) => item.courseCode === code) || safeCourses[0];
    if (c) {
      const p = getCoursePeriodScores(c);
      setPrelimScore(p.prelim.examScore);
      setMidtermScore(p.midterm.examScore);
      setSemiFinalScore(p.semiFinal.examScore);
      setFinalScore(p.final.examScore);
    }
  };

  // Calculate simulated 4-period course final
  const simulated4Period = calculate4PeriodFinal(
    prelimScore,
    midtermScore,
    semiFinalScore,
    finalScore
  );
  const simGradeColor = getCollegeGradeColorClass(simulated4Period.collegeGrade.numeric);

  // Calculate required Final Exam score to hit targetCollegeGrade
  const neededSolver = calculateNeededFinalExam(
    prelimScore,
    midtermScore,
    semiFinalScore,
    targetCollegeGrade
  );

  // Compute what the semester GWA would be with this simulated course
  const simulatedCourses = safeCourses.map((c) => {
    if (activeCourse && c.courseCode !== activeCourse.courseCode) return c;
    return {
      ...c,
      prelimScore: {
        ...activePeriod.prelim,
        examScore: prelimScore,
        periodPercentage: prelimScore,
      },
      midtermScore: {
        ...activePeriod.midterm,
        examScore: midtermScore,
        periodPercentage: midtermScore,
      },
      semiFinalScore: {
        ...activePeriod.semiFinal,
        examScore: semiFinalScore,
        periodPercentage: semiFinalScore,
      },
      finalScore: {
        ...activePeriod.final,
        examScore: finalScore,
        periodPercentage: finalScore,
      },
    };
  });

  const simulatedGwa = calculateTermGwa(simulatedCourses);

  const COLLEGE_PRESETS = [
    { grade: '1.00', label: '1.00 (97% Top)' },
    { grade: '1.25', label: '1.25 (94% Superior)' },
    { grade: '1.50', label: '1.50 (91% Very Good)' },
    { grade: '1.75', label: '1.75 (88% Good)' },
    { grade: '2.00', label: '2.00 (85% Satisfactory)' },
    { grade: '2.25', label: '2.25 (82% Fairly Good)' },
    { grade: '2.50', label: '2.50 (79% Fair)' },
    { grade: '3.00', label: '3.00 (75% Passing)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>4-Period Exam & GWA Simulator</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Prelim • Midterm • Semi • Final
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Simulate your 4 term exams and forecast your resulting Final Grade & Semester GWA.
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

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Course Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Select Subject to Simulate
            </label>
            <select
              value={selectedCourseCode}
              onChange={(e) => handleSelectCourse(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {safeCourses.map((c) => {
                const p = getCoursePeriodScores(c);
                return (
                  <option key={c.courseCode} value={c.courseCode}>
                    {c.courseCode} - {c.courseName} ({c.credits} Units • Final Grade {p.finalCollegeGrade.grade} - {p.finalCollegeGrade.description})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Interactive 4-Period Exam Sliders */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 border-b border-slate-200 pb-2">
              <span>Adjust 4-Period Exam Scores:</span>
              <span className="text-indigo-600 font-mono text-[11px]">
                Each period = 25% of Subject Grade
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Prelim Exam */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-700">1. Prelim Exam</span>
                  <span className="font-mono font-bold text-indigo-700">{prelimScore}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="1"
                  value={prelimScore}
                  onChange={(e) => setPrelimScore(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="text-[10px] text-slate-500 flex justify-between font-mono">
                  <span>50%</span>
                  <span>Grade: {percentageToCollegeGrade(prelimScore).grade}</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Midterm Exam */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-700">2. Midterm Exam</span>
                  <span className="font-mono font-bold text-indigo-700">{midtermScore}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="1"
                  value={midtermScore}
                  onChange={(e) => setMidtermScore(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="text-[10px] text-slate-500 flex justify-between font-mono">
                  <span>50%</span>
                  <span>Grade: {percentageToCollegeGrade(midtermScore).grade}</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Semi-Final Exam */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-700">3. Semi-Final Exam</span>
                  <span className="font-mono font-bold text-indigo-700">{semiFinalScore}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="1"
                  value={semiFinalScore}
                  onChange={(e) => setSemiFinalScore(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="text-[10px] text-slate-500 flex justify-between font-mono">
                  <span>50%</span>
                  <span>Grade: {percentageToCollegeGrade(semiFinalScore).grade}</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Final Exam */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-700">4. Final Exam</span>
                  <span className="font-mono font-bold text-indigo-700">{finalScore}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="1"
                  value={finalScore}
                  onChange={(e) => setFinalScore(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="text-[10px] text-slate-500 flex justify-between font-mono">
                  <span>50%</span>
                  <span>Grade: {percentageToCollegeGrade(finalScore).grade}</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-Time Result: Course Final Grade & Resulting Semester GWA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Projected Subject Final */}
            <div className={`p-4 rounded-xl border ${simGradeColor.bg} ${simGradeColor.border}`}>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Projected Subject Grade
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-3xl font-black font-mono ${simGradeColor.text}`}>
                  Grade {simulated4Period.collegeGrade.grade}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  ({simulated4Period.finalPercentage}% Avg)
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                {simulated4Period.collegeGrade.description} • {simulated4Period.collegeGrade.remarks}
              </p>
            </div>

            {/* Projected Semester GWA */}
            <div className="p-4 rounded-xl bg-indigo-900 text-white border border-indigo-950">
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">
                Resulting Semester GWA
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-mono text-emerald-400">
                  {simulatedGwa.gwa.toFixed(2)}
                </span>
                <span className="text-xs text-indigo-200">GWA (1.00 is top)</span>
              </div>
              <p className="text-xs text-indigo-200 mt-1 font-medium">
                Weighted across {simulatedGwa.totalCredits} enrolled units
              </p>
            </div>
          </div>

          {/* Final Exam Solver: "What score do I need on my Final Exam to get Grade X?" */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>Target Final Exam Solver</span>
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Given Prelim ({prelimScore}%), Midterm ({midtermScore}%), & Semi-Final ({semiFinalScore}%)
              </span>
            </div>

            <div className="text-xs text-slate-600">
              Select your target course grade to calculate the exact Final Exam score required:
            </div>

            {/* Target Chips */}
            <div className="flex flex-wrap gap-1.5">
              {COLLEGE_PRESETS.map((p) => {
                const isSelected = targetCollegeGrade === p.grade;
                return (
                  <button
                    key={p.grade}
                    type="button"
                    onClick={() => setTargetCollegeGrade(p.grade)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* Solver Outcome Card */}
            <div
              className={`p-3.5 rounded-xl border text-center ${
                neededSolver.neededFinalPercentage <= 100
                  ? neededSolver.neededFinalPercentage <= 75
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                    : neededSolver.neededFinalPercentage <= 92
                    ? 'bg-sky-50 text-sky-950 border-sky-200'
                    : 'bg-amber-50 text-amber-950 border-amber-200'
                  : 'bg-rose-50 text-rose-950 border-rose-200'
              }`}
            >
              <div className="text-[11px] font-bold uppercase tracking-wider opacity-75">
                Score Needed on Final Exam for Grade {neededSolver.targetDetail.grade} ({neededSolver.targetDetail.description})
              </div>
              <div className="text-3xl font-black font-mono my-1">
                {neededSolver.neededFinalPercentage}%
              </div>
              <div className="text-xs font-medium">
                {neededSolver.neededFinalPercentage <= 75 && (
                  <span className="text-emerald-700 font-semibold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Very achievable! High probability of finishing with Grade {neededSolver.targetDetail.grade}.
                  </span>
                )}
                {neededSolver.neededFinalPercentage > 75 &&
                  neededSolver.neededFinalPercentage <= 92 && (
                    <span className="text-sky-700 font-semibold flex items-center justify-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Within reachable scope! Requires steady study for the Final Exam.
                    </span>
                  )}
                {neededSolver.neededFinalPercentage > 92 &&
                  neededSolver.neededFinalPercentage <= 100 && (
                    <span className="text-amber-700 font-semibold flex items-center justify-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Demanding! Requires scoring {neededSolver.neededFinalPercentage}% on the Final Exam.
                    </span>
                  )}
                {neededSolver.neededFinalPercentage > 100 && (
                  <span className="text-rose-700 font-semibold flex items-center justify-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Mathematically exceeds 100%. Maximize retention by targeting adjacent grade bracket.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
};

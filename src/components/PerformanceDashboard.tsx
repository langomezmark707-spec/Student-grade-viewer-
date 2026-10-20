import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { Student, TermData, GradingSystem } from '../types';
import {
  calculateCoursePercentage,
  calculateCumulativeGpa,
  calculateTermGpa,
  calculateCumulativeGwa,
  calculateTermGwa,
  percentageToCollegeGrade,
  getGradeColorClass,
  getCollegeGradeColorClass,
} from '../utils/gradeUtils';

interface PerformanceDashboardProps {
  student?: Student;
  activeTerm?: TermData;
  gradingSystem?: GradingSystem;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  student,
  activeTerm,
  gradingSystem = 'college',
}) => {
  const courses = activeTerm?.courses || [];
  const cumGpa = calculateCumulativeGpa(student);
  const termGpa = calculateTermGpa(courses);

  const cumGwa = calculateCumulativeGwa(student);
  const termGwa = calculateTermGwa(courses);

  // Compute subject comparisons
  const subjectStats = courses.map((course) => {
    const score = calculateCoursePercentage(course.assessments);
    const avg = course.classAverage || 80;
    const diff = score - avg;
    const collegeGrade = percentageToCollegeGrade(score);
    return {
      name: course.courseCode,
      fullName: course.courseName,
      score,
      collegeGrade,
      avg,
      diff,
      credits: course.credits,
    };
  });

  // Find highest and lowest subjects
  const sortedByScore = [...subjectStats].sort((a, b) => b.score - a.score);
  const highestCourse = sortedByScore[0];
  const lowestCourse = sortedByScore[sortedByScore.length - 1];

  // Combined GPA / GWA history timeline
  const fullTimeline = [
    ...(student?.history || []).map((h) => ({
      term: h.termName,
      gpa: h.gpa,
      gwa:
        h.gwa !== undefined
          ? h.gwa
          : Math.max(1.0, Math.min(5.0, Math.round((5.0 - (h.gpa / 4.0) * 4.0 + 1.0) * 100) / 100)),
      credits: h.creditsEarned,
      isCurrent: false,
    })),
    {
      term: (activeTerm?.termName || 'Current Term').replace(' (Current)', ''),
      gpa: termGpa.gpa,
      gwa: termGwa.gwa,
      credits: termGwa.totalCredits,
      isCurrent: true,
    },
  ];

  // Collegiate Grade Distribution:
  // Count: 1.00-1.25 (Superior), 1.50-1.75 (Very Good), 2.00-2.50 (Fair/Good), 2.75-3.00 (Passing), 4.00-5.00 (Failing)
  let countSuperior = 0; // 1.00 - 1.25
  let countVeryGood = 0; // 1.50 - 1.75
  let countFairGood = 0; // 2.00 - 2.50
  let countPassing = 0;  // 2.75 - 3.00
  let countFailing = 0;  // 4.00 - 5.00

  // US scale counts
  let countA = 0;
  let countB = 0;
  let countC = 0;
  let countBelow = 0;

  courses.forEach((c) => {
    const s = calculateCoursePercentage(c.assessments);
    const cg = percentageToCollegeGrade(s);
    if (cg.numeric <= 1.25) countSuperior++;
    else if (cg.numeric <= 1.75) countVeryGood++;
    else if (cg.numeric <= 2.50) countFairGood++;
    else if (cg.numeric <= 3.00) countPassing++;
    else countFailing++;

    if (s >= 90) countA++;
    else if (s >= 80) countB++;
    else if (s >= 70) countC++;
    else countBelow++;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Course Performance vs Class Average Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span>
                  {gradingSystem === 'college'
                    ? 'Course Standing & College Mark Benchmark'
                    : 'Subject Score vs. Class Average'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time benchmark of individual subject achievement against enrolled class mean.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-indigo-600 inline-block" />
                <span className="text-slate-600 font-medium">Your Score</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-slate-300 inline-block" />
                <span className="text-slate-500 font-medium">Class Avg</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="space-y-4">
            {subjectStats.map((item) => {
              const usColor = getGradeColorClass(item.score);
              const collegeColor = getCollegeGradeColorClass(item.collegeGrade.numeric);
              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate max-w-xs">
                      {item.name} <span className="font-normal text-slate-500">({item.fullName})</span>
                    </span>
                    <div className="flex items-center gap-2">
                      {gradingSystem === 'college' && (
                        <span
                          className={`font-black font-mono px-2 py-0.2 rounded border ${collegeColor.bg} ${collegeColor.text} ${collegeColor.border}`}
                        >
                          Grade {item.collegeGrade.grade}
                        </span>
                      )}
                      <span className={`font-bold ${usColor.text}`}>
                        {item.score.toFixed(1)}%
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-1.5 py-0.2 rounded ${
                          item.diff >= 0
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {item.diff >= 0 ? `+${item.diff.toFixed(1)}%` : `${item.diff.toFixed(1)}%`}
                      </span>
                    </div>
                  </div>

                  {/* Dual comparative progress track */}
                  <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    {/* Class average marker bar */}
                    <div
                      className="absolute top-0 bottom-0 bg-slate-300 rounded-full"
                      style={{ width: `${Math.min(item.avg, 100)}%` }}
                    />
                    {/* Student actual score bar */}
                    <div
                      className={`absolute top-0 bottom-0 ${usColor.bar} rounded-full transition-all duration-700 opacity-90`}
                      style={{ width: `${Math.min(item.score, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grade Breakdown & Academic Trajectory Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>
                {gradingSystem === 'college' ? 'Collegiate Grade Mix' : 'Current Grade Mix'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Grade count distribution for {activeTerm.termName}.
            </p>

            {gradingSystem === 'college' ? (
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                  <div className="text-2xl font-black text-emerald-700 font-mono">{countSuperior}</div>
                  <div className="text-xs font-semibold text-emerald-800 mt-0.5">1.00 – 1.25</div>
                  <div className="text-[10px] text-emerald-600">Superior / Top</div>
                </div>

                <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 text-center">
                  <div className="text-2xl font-black text-sky-700 font-mono">{countVeryGood}</div>
                  <div className="text-xs font-semibold text-sky-800 mt-0.5">1.50 – 1.75</div>
                  <div className="text-[10px] text-sky-600">Very Good</div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-center">
                  <div className="text-2xl font-black text-indigo-700 font-mono">{countFairGood}</div>
                  <div className="text-xs font-semibold text-indigo-800 mt-0.5">2.00 – 2.50</div>
                  <div className="text-[10px] text-indigo-600">Satisfactory / Fair</div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-center">
                  <div className="text-2xl font-black text-amber-700 font-mono">{countPassing}</div>
                  <div className="text-xs font-semibold text-amber-800 mt-0.5">2.75 – 3.00</div>
                  <div className="text-[10px] text-amber-600">Passing Line</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                  <div className="text-2xl font-black text-emerald-700">{countA}</div>
                  <div className="text-xs font-semibold text-emerald-800 mt-0.5">A Grades (90+)</div>
                  <div className="text-[11px] text-emerald-600">Honors level</div>
                </div>

                <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 text-center">
                  <div className="text-2xl font-black text-sky-700">{countB}</div>
                  <div className="text-xs font-semibold text-sky-800 mt-0.5">B Grades (80-89)</div>
                  <div className="text-[11px] text-sky-600">Solid mastery</div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100 text-center">
                  <div className="text-2xl font-black text-amber-700">{countC}</div>
                  <div className="text-xs font-semibold text-amber-800 mt-0.5">C Grades (70-79)</div>
                  <div className="text-[11px] text-amber-600">Passing credit</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-2xl font-black text-slate-700">{countBelow}</div>
                  <div className="text-xs font-semibold text-slate-600 mt-0.5">Under 70%</div>
                  <div className="text-[11px] text-slate-500">Needs review</div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Highlight insight */}
          {highestCourse && (
            <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-indigo-950 mb-1">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                <span>
                  Top Subject: {highestCourse.name}{' '}
                  {gradingSystem === 'college' && (
                    <span className="font-mono font-bold text-indigo-700">
                      (Grade {highestCourse.collegeGrade.grade})
                    </span>
                  )}
                </span>
              </div>
              <p className="text-indigo-900 leading-relaxed">
                You are outperforming class average by{' '}
                <strong>+{highestCourse.diff.toFixed(1)}%</strong> in{' '}
                {highestCourse.fullName}!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Historical GPA / GWA Trendline */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>
                {gradingSystem === 'college'
                  ? 'Multi-Semester GWA Progression (General Weighted Average)'
                  : 'Multi-Semester GPA Progression Timeline'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {gradingSystem === 'college'
                ? 'Term and Cumulative GWA tracking across semesters (1.00 is highest academic standing).'
                : 'Cumulative and semester GPA development across your academic enrollment.'}
            </p>
          </div>

          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {gradingSystem === 'college'
                ? `Cumulative: ${cumGwa.gwa.toFixed(2)} GWA`
                : `Cumulative: ${cumGpa.gpa.toFixed(2)} GPA`}
            </span>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {fullTimeline.map((item, index) => {
            const isLatest = item.isCurrent;
            return (
              <div
                key={item.term}
                className={`p-4 rounded-xl border transition-all ${
                  isLatest
                    ? 'bg-indigo-50/60 border-indigo-300 ring-1 ring-indigo-400/20'
                    : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                  <span>Semester {index + 1}</span>
                  {isLatest && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-600 text-white">
                      Current
                    </span>
                  )}
                </div>

                <div className="font-bold text-slate-900 text-xs truncate mb-2" title={item.term}>
                  {item.term}
                </div>

                <div className="text-2xl font-black text-slate-900 font-mono">
                  {gradingSystem === 'college' ? item.gwa.toFixed(2) : item.gpa.toFixed(2)}
                </div>

                <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                  <span>{item.credits} Units</span>
                  {gradingSystem === 'college' ? (
                    <span
                      className={`font-mono font-bold ${
                        item.gwa <= 1.5 ? 'text-emerald-600' : 'text-slate-600'
                      }`}
                    >
                      {item.gwa <= 1.25 ? "Pres. List" : item.gwa <= 1.75 ? "Dean's List" : "Passed"}
                    </span>
                  ) : (
                    <span className="font-mono text-emerald-600 font-bold">
                      {item.gpa >= 3.8 ? '4.00 Max' : `${((item.gpa / 4.0) * 100).toFixed(0)}%`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

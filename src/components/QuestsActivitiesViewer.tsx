import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  Zap,
  HelpCircle,
  TrendingUp,
  FileText,
  Filter,
  Check,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Student, StudentQuestActivity, SubjectGrade, PeriodName, TermData } from '../types';

interface QuestsActivitiesViewerProps {
  student?: Student | null;
  courses?: SubjectGrade[];
  activeTerm?: TermData | null;
  onOpenWhyGrade?: (courseCode?: string) => void;
}

export const QuestsActivitiesViewer: React.FC<QuestsActivitiesViewerProps> = ({
  student,
  courses,
  activeTerm,
  onOpenWhyGrade,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodName | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  const safeCourses: SubjectGrade[] =
    Array.isArray(courses) && courses.length > 0
      ? courses
      : Array.isArray(activeTerm?.courses)
      ? activeTerm.courses
      : [];

  // Fallback quests if not set on student
  const quests: StudentQuestActivity[] =
    student?.questsAndActivities && student.questsAndActivities.length > 0
      ? student.questsAndActivities
      : [
          {
            id: 'q-1',
            courseCode: safeCourses[0]?.courseCode || 'CS-201',
            courseName: safeCourses[0]?.courseName || 'Data Structures & Algorithms',
            title: 'Quest: Binary Search Tree Balancing Engine',
            type: 'Quest / Challenge',
            period: 'Prelim',
            dateGiven: '2024-09-08',
            dateSubmitted: '2024-09-12',
            score: 98,
            maxScore: 100,
            passingScore: 75,
            weight: 5,
            status: 'Completed',
            feedback: 'Outstanding tree rotation algorithm with minimal memory overhead.',
            xpPoints: 250,
          },
          {
            id: 'q-2',
            courseCode: safeCourses[0]?.courseCode || 'CS-201',
            courseName: safeCourses[0]?.courseName || 'Data Structures & Algorithms',
            title: 'Pop Quiz #1: Asymptotic Time Complexities',
            type: 'Quiz',
            period: 'Prelim',
            dateGiven: '2024-09-15',
            dateSubmitted: '2024-09-15',
            score: 19,
            maxScore: 20,
            passingScore: 15,
            weight: 5,
            status: 'Completed',
            feedback: 'Clear proof for Master Theorem Case 2.',
            xpPoints: 100,
          },
          {
            id: 'q-3',
            courseCode: safeCourses[1]?.courseCode || 'MATH-102',
            courseName: safeCourses[1]?.courseName || 'Differential & Integral Calculus',
            title: 'Activity #2: Integration by Partial Fractions Drill',
            type: 'Activity',
            period: 'Prelim',
            dateGiven: '2024-09-18',
            dateSubmitted: '2024-09-20',
            score: 48,
            maxScore: 50,
            passingScore: 37,
            weight: 5,
            status: 'Completed',
            feedback: 'Accurate algebraic decomposition and definite integrals.',
            xpPoints: 150,
          },
          {
            id: 'q-4',
            courseCode: safeCourses[0]?.courseCode || 'CS-201',
            courseName: safeCourses[0]?.courseName || 'Data Structures & Algorithms',
            title: 'Quest: Dijkstra Shortest Path Map Solver',
            type: 'Quest / Challenge',
            period: 'Midterm',
            dateGiven: '2024-10-10',
            dateSubmitted: '2024-10-14',
            score: 95,
            maxScore: 100,
            passingScore: 75,
            weight: 5,
            status: 'Completed',
            feedback: 'Priority queue implementation was well-optimized.',
            xpPoints: 300,
          },
          {
            id: 'q-5',
            courseCode: safeCourses[0]?.courseCode || 'CS-201',
            courseName: safeCourses[0]?.courseName || 'Data Structures & Algorithms',
            title: 'Midterm Quiz #2: Minimum Spanning Trees (Kruskal vs Prim)',
            type: 'Quiz',
            period: 'Midterm',
            dateGiven: '2024-10-18',
            dateSubmitted: '2024-10-18',
            score: 28,
            maxScore: 30,
            passingScore: 22,
            weight: 5,
            status: 'Completed',
            feedback: 'Disjoint set union cycle detection is correct.',
            xpPoints: 120,
          },
          {
            id: 'q-6',
            courseCode: safeCourses[2]?.courseCode || 'PHYS-101',
            courseName: safeCourses[2]?.courseName || 'University Physics I',
            title: 'Lab Exercise: Rotational Dynamics & Moment of Inertia',
            type: 'Lab Exercise',
            period: 'Semi-Final',
            dateGiven: '2024-11-05',
            dateSubmitted: '2024-11-07',
            score: 96,
            maxScore: 100,
            passingScore: 75,
            weight: 10,
            status: 'Completed',
            feedback: 'Precise error analysis with low variance.',
            xpPoints: 200,
          },
          {
            id: 'q-7',
            courseCode: safeCourses[0]?.courseCode || 'CS-201',
            courseName: safeCourses[0]?.courseName || 'Data Structures & Algorithms',
            title: 'Quest: Dynamic Programming Knapsack 0/1 Challenge',
            type: 'Quest / Challenge',
            period: 'Semi-Final',
            dateGiven: '2024-11-10',
            dateSubmitted: '2024-11-14',
            score: 94,
            maxScore: 100,
            passingScore: 75,
            weight: 5,
            status: 'Completed',
            feedback: 'Space-optimized 1D array table used successfully.',
            xpPoints: 250,
          },
          {
            id: 'q-8',
            courseCode: safeCourses[1]?.courseCode || 'MATH-102',
            courseName: safeCourses[1]?.courseName || 'Differential & Integral Calculus',
            title: 'Final Period Quiz: Stokes & Divergence Theorem',
            type: 'Quiz',
            period: 'Final',
            dateGiven: '2024-11-28',
            dateSubmitted: '2024-11-28',
            score: 47,
            maxScore: 50,
            passingScore: 37,
            weight: 5,
            status: 'Completed',
            feedback: 'Surface parameterization completely resolved.',
            xpPoints: 150,
          },
        ];

  const totalQuests = quests.length;
  const completedCount = quests.filter((q) => q.status === 'Completed').length;
  const totalXp = quests.reduce((acc, q) => acc + (q.xpPoints || 100), 0);

  // Compute average percentage score on quizzes & quests
  let totalScorePct = 0;
  quests.forEach((q) => {
    if (q.maxScore > 0) {
      totalScorePct += (q.score / q.maxScore) * 100;
    }
  });
  const avgQuestScore = totalQuests > 0 ? (totalScorePct / totalQuests).toFixed(1) : '0';

  const filteredQuests = quests.filter((q) => {
    if (selectedPeriod !== 'all' && q.period !== selectedPeriod) return false;
    if (selectedType !== 'all' && q.type !== selectedType) return false;
    if (selectedCourse !== 'all' && q.courseCode !== selectedCourse) return false;
    return true;
  });

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      {/* Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 text-white shadow-sm border border-violet-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Quests, Quizzes & Academic Activities
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-200 border border-violet-400/30">
                40% Combined Weight to College Grade
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-baseline gap-2.5">
              <span>Overall Quest & Quiz Average:</span>
              <span className="font-mono text-3xl text-emerald-400 font-extrabold">
                {avgQuestScore}%
              </span>
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Here students can track all <strong>Quests</strong>, <strong>Quizzes</strong>, <strong>Lab Exercises</strong>, and <strong>Activities</strong>. These explain why overall grades can rise or fall alongside major exam results.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onOpenWhyGrade && (
              <button
                onClick={() => onOpenWhyGrade()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white text-xs font-bold shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Why This Grade?</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Cards Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-bold uppercase text-violet-300 flex items-center justify-between">
              <span>Total Quests & Tasks</span>
              <FileText className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {totalQuests} <span className="text-xs text-violet-300/80 font-normal">items</span>
            </div>
            <div className="text-[11px] text-violet-200/80 mt-0.5">
              100% submission rate
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-bold uppercase text-emerald-300 flex items-center justify-between">
              <span>Completed / Passed</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {completedCount} <span className="text-xs text-emerald-300/80 font-normal">completed</span>
            </div>
            <div className="text-[11px] text-emerald-200/80 mt-0.5">
              Above passing threshold
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-bold uppercase text-amber-300 flex items-center justify-between">
              <span>Quest XP Earned</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {totalXp} <span className="text-xs text-amber-300/80 font-normal">XP</span>
            </div>
            <div className="text-[11px] text-amber-200/80 mt-0.5">
              Bonus academic effort
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-bold uppercase text-indigo-300 flex items-center justify-between">
              <span>Grade Contribution</span>
              <Award className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono mt-1">
              40% <span className="text-xs text-indigo-300/80 font-normal">of GWA</span>
            </div>
            <div className="text-[11px] text-indigo-200/80 mt-0.5">
              Quizzes (20%) + Activities (20%)
            </div>
          </div>
        </div>
      </div>

      {/* Main List Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-violet-600" />
              <span>Grades on Quests, Quizzes, Problem Sets & Activities</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono font-bold">
                {filteredQuests.length} Items
              </span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Detailed list of student scores on quizzes, coding challenges, and coursework across each exam period.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Period filter */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Exam Periods</option>
              <option value="Prelim">Prelim Period</option>
              <option value="Midterm">Midterm Period</option>
              <option value="Semi-Final">Semi-Final Period</option>
              <option value="Final">Final Period</option>
            </select>

            {/* Course filter */}
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Courses</option>
              {safeCourses.map((c) => (
                <option key={c.courseCode} value={c.courseCode}>
                  {c.courseCode}
                </option>
              ))}
            </select>

            {/* Type filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Task Types</option>
              <option value="Quiz">Quizzes</option>
              <option value="Quest / Challenge">Quests / Challenges</option>
              <option value="Activity">Activities</option>
              <option value="Lab Exercise">Lab Exercises</option>
            </select>
          </div>
        </div>

        {/* Quests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5">Task / Quest Title</th>
                <th className="py-3 px-3.5">Course Subject</th>
                <th className="py-3 px-3 text-center">Period</th>
                <th className="py-3 px-3 text-center">Type</th>
                <th className="py-3 px-3.5 text-center">Score / Total</th>
                <th className="py-3 px-3.5 text-center">Percentage</th>
                <th className="py-3 px-3.5">Professor Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No quests or activities found for this filter.
                  </td>
                </tr>
              ) : (
                filteredQuests.map((quest) => {
                  const pct = Math.round((quest.score / quest.maxScore) * 100);
                  const isPassing = pct >= 75;

                  return (
                    <tr key={quest.id} className="hover:bg-violet-50/20 transition-colors">
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {quest.title}
                          {quest.xpPoints && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                              +{quest.xpPoints} XP
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Given: {quest.dateGiven}</span>
                          {quest.dateSubmitted && (
                            <span>• Submitted: {quest.dateSubmitted}</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-800">{quest.courseCode}</span>
                        <span className="block text-[11px] text-slate-500 truncate max-w-36">
                          {quest.courseName}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full font-semibold text-[11px] bg-slate-100 text-slate-700">
                          {quest.period}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md font-medium text-[11px] bg-violet-50 text-violet-700 border border-violet-200">
                          {quest.type}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 text-center font-mono font-bold text-slate-900 whitespace-nowrap">
                        <span className="text-sm font-black">{quest.score}</span>
                        <span className="text-slate-400 font-normal"> / {quest.maxScore}</span>
                      </td>

                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <span
                          className={`inline-block font-mono font-black px-2 py-0.5 rounded text-xs ${
                            isPassing
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {pct}%
                        </span>
                      </td>

                      <td className="py-3 px-3.5 text-slate-600 text-xs italic max-w-xs">
                        {quest.feedback || 'Completed with full mark credit.'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

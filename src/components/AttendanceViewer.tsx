import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Filter,
  UserCheck,
  TrendingUp,
  Percent,
  BookOpen,
  Award,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { Student, AttendanceRecord, SubjectGrade } from '../types';

interface AttendanceViewerProps {
  student?: Student | null;
  courses?: SubjectGrade[];
  onOpenWhyGrade?: (courseCode?: string) => void;
}

export const AttendanceViewer: React.FC<AttendanceViewerProps> = ({
  student,
  courses = [],
  onOpenWhyGrade,
}) => {
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Present' | 'Late' | 'Absent' | 'Excused'>('all');

  const safeCourses = Array.isArray(courses) ? courses : [];

  // Logs fallback generator if not directly defined
  const logs: AttendanceRecord[] = student?.attendanceLogs && student.attendanceLogs.length > 0
    ? student.attendanceLogs
    : [
        {
          id: 'att-1',
          date: '2024-11-28',
          courseCode: safeCourses[0]?.courseCode || 'CS-201',
          courseName: safeCourses[0]?.courseName || 'Data Structures & Algorithms',
          status: 'Present',
          topicOrSession: 'Graph Theory & Dijkstra Shortest Path Lab',
          durationHours: 3,
          remarks: 'On time, active participation in coding exercises',
        },
        {
          id: 'att-2',
          date: '2024-11-26',
          courseCode: safeCourses[1]?.courseCode || 'MATH-102',
          courseName: safeCourses[1]?.courseName || 'Differential Calculus',
          status: 'Present',
          topicOrSession: 'Multivariable Integration & Green\'s Theorem',
          durationHours: 2,
          remarks: 'Present with solved problem sets',
        },
        {
          id: 'att-3',
          date: '2024-11-22',
          courseCode: safeCourses[0]?.courseCode || 'CS-201',
          courseName: safeCourses[0]?.courseName || 'Data Structures & Algorithms',
          status: (student?.attendanceRate ?? 95) < 92 ? 'Absent' : 'Present',
          topicOrSession: 'Red-Black Balanced Trees & Rotations',
          durationHours: 3,
          remarks: (student?.attendanceRate ?? 95) < 92 ? 'Unexcused absence (-1 attendance point)' : 'Completed recitation',
        },
        {
          id: 'att-4',
          date: '2024-11-20',
          courseCode: safeCourses[2]?.courseCode || 'PHYS-101',
          courseName: safeCourses[2]?.courseName || 'University Physics I',
          status: 'Present',
          topicOrSession: 'Wave Interference & Doppler Effect Experiment',
          durationHours: 3,
          remarks: 'Submitted laboratory data sheet',
        },
        {
          id: 'att-5',
          date: '2024-11-15',
          courseCode: safeCourses[1]?.courseCode || 'MATH-102',
          courseName: safeCourses[1]?.courseName || 'Differential Calculus',
          status: 'Late',
          topicOrSession: 'Series & Taylor Approximations',
          durationHours: 2,
          remarks: 'Arrived 15 mins late due to campus transit delay',
        },
        {
          id: 'att-6',
          date: '2024-11-12',
          courseCode: safeCourses[0]?.courseCode || 'CS-201',
          courseName: safeCourses[0]?.courseName || 'Data Structures & Algorithms',
          status: 'Present',
          topicOrSession: 'Hash Table Collision Resolution & Robin Hood Hashing',
          durationHours: 3,
          remarks: 'Perfect recitation score',
        },
        {
          id: 'att-7',
          date: '2024-11-08',
          courseCode: safeCourses[2]?.courseCode || 'PHYS-101',
          courseName: safeCourses[2]?.courseName || 'University Physics I',
          status: 'Present',
          topicOrSession: 'Thermodynamics & Heat Capacities',
          durationHours: 3,
          remarks: 'Present for quiz review',
        },
        {
          id: 'att-8',
          date: '2024-11-05',
          courseCode: safeCourses[0]?.courseCode || 'CS-201',
          courseName: safeCourses[0]?.courseName || 'Data Structures & Algorithms',
          status: 'Present',
          topicOrSession: 'Algorithm Complexity & Big-O Master Theorem',
          durationHours: 3,
          remarks: 'Submitted assignment on time',
        },
      ];

  // Compute metrics
  const totalLogs = logs.length;
  const presentCount = logs.filter((l) => l.status === 'Present').length;
  const lateCount = logs.filter((l) => l.status === 'Late').length;
  const absentCount = logs.filter((l) => l.status === 'Absent').length;
  const excusedCount = logs.filter((l) => l.status === 'Excused').length;

  const filteredLogs = logs.filter((l) => {
    if (selectedCourseFilter !== 'all' && l.courseCode !== selectedCourseFilter) {
      return false;
    }
    if (statusFilter !== 'all' && l.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      {/* Attendance & Grade Impact Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white shadow-sm border border-emerald-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                Attendance & Punctuality Tracker
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                10% Direct Weight to Final Grade
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-baseline gap-2.5">
              <span>Overall Attendance:</span>
              <span className="font-mono text-3xl text-emerald-400 font-extrabold">
                {student.attendanceRate.toFixed(1)}%
              </span>
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Understand your grade impact: Class attendance constitutes <strong>10%</strong> of the overall collegiate grade. Absences or late arrivals directly affect recitation standing and examination eligibility.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onOpenWhyGrade && (
              <button
                onClick={() => onOpenWhyGrade()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>View Why This Grade Breakdown</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Attendance Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-bold uppercase text-emerald-300 flex items-center justify-between">
              <span>Present Sessions</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {presentCount} <span className="text-xs text-emerald-300/80 font-normal">sessions</span>
            </div>
            <div className="text-[11px] text-emerald-300/80 mt-0.5">
              Full attendance credit (100%)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-bold uppercase text-amber-300 flex items-center justify-between">
              <span>Late / Tardy</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {lateCount} <span className="text-xs text-amber-300/80 font-normal">sessions</span>
            </div>
            <div className="text-[11px] text-amber-300/80 mt-0.5">
              80% credit (partial deduction)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-bold uppercase text-rose-300 flex items-center justify-between">
              <span>Unexcused Absences</span>
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {absentCount} <span className="text-xs text-rose-300/80 font-normal">sessions</span>
            </div>
            <div className="text-[11px] text-rose-300/80 mt-0.5">
              0% credit (risk of FDA if &gt; 3)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-bold uppercase text-indigo-300 flex items-center justify-between">
              <span>Excused Absences</span>
              <AlertCircle className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {excusedCount} <span className="text-xs text-indigo-300/80 font-normal">sessions</span>
            </div>
            <div className="text-[11px] text-indigo-300/80 mt-0.5">
              Excused with medical/official slip
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Official Class Attendance Logs & Session Sign-Ins</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono font-bold">
                {filteredLogs.length} Records
              </span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              View session dates, class topics, timestamps, and instructor remarks for every lecture and laboratory session.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Subject filter */}
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Enrolled Subjects</option>
              {safeCourses.map((c) => (
                <option key={c.courseCode} value={c.courseCode}>
                  {c.courseCode} - {c.courseName?.slice(0, 24) || ''}...
                </option>
              ))}
            </select>

            {/* Status filter */}
            <div className="p-1 bg-slate-200/70 rounded-xl flex items-center text-xs font-semibold">
              {(['all', 'Present', 'Late', 'Absent'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                    statusFilter === st
                      ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'all' ? 'All' : st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5">Date</th>
                <th className="py-3 px-3.5">Course Subject</th>
                <th className="py-3 px-3.5">Topic / Activity Covered</th>
                <th className="py-3 px-3 text-center">Duration</th>
                <th className="py-3 px-3.5 text-center">Status</th>
                <th className="py-3 px-3.5">Instructor Remarks / Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No attendance logs match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  let badge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  let icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;

                  if (log.status === 'Late') {
                    badge = 'bg-amber-50 text-amber-700 border-amber-200';
                    icon = <Clock className="w-3.5 h-3.5 text-amber-600" />;
                  } else if (log.status === 'Absent') {
                    badge = 'bg-rose-50 text-rose-700 border-rose-200';
                    icon = <XCircle className="w-3.5 h-3.5 text-rose-600" />;
                  } else if (log.status === 'Excused') {
                    badge = 'bg-indigo-50 text-indigo-700 border-indigo-200';
                    icon = <AlertCircle className="w-3.5 h-3.5 text-indigo-600" />;
                  }

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5 font-mono font-semibold text-slate-900 whitespace-nowrap">
                        {log.date}
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="font-bold text-slate-900">{log.courseCode}</span>
                        <span className="text-slate-500 block text-[11px] truncate max-w-44">
                          {log.courseName}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 font-medium text-slate-800">
                        {log.topicOrSession}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-600">
                        {log.durationHours || 3} hrs
                      </td>
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge}`}
                        >
                          {icon}
                          <span>{log.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-slate-600 italic">
                        {log.remarks || 'Signed in via biometric / class roll-call'}
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

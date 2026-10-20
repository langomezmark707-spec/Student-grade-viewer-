import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  Award,
  TrendingUp,
  Search,
  Plus,
  Edit3,
  Eye,
  CheckCircle2,
  AlertCircle,
  Filter,
  Save,
  BookOpen,
  Calendar,
  Sparkles,
  ChevronDown,
  Trash2,
  Sliders,
  Check,
} from 'lucide-react';
import { Student, SubjectGrade, GradingSystem, PeriodScore, Assessment } from '../types';
import {
  calculateTermGwa,
  getCollegeAcademicStanding,
  getCoursePeriodScores,
  percentageToCollegeGrade,
  getCollegeGradeColorClass,
} from '../utils/gradeUtils';

interface TeacherDashboardProps {
  students: Student[];
  teacherName?: string;
  teacherDepartment?: string;
  gradingSystem?: GradingSystem;
  onSelectStudentForViewer: (student: Student) => void;
  onOpenEditGradeModal: (studentId?: string) => void;
  onOpenAddStudentModal: () => void;
  onOpenAddCourseModal: (studentId: string) => void;
  onUpdateStudents: (updatedStudents: Student[]) => void;
  onDeleteStudent: (studentId: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  students,
  teacherName = 'Prof. Alexander Vance, PhD',
  teacherDepartment = 'Department of Computer Science',
  gradingSystem = 'college',
  onSelectStudentForViewer,
  onOpenEditGradeModal,
  onOpenAddStudentModal,
  onOpenAddCourseModal,
  onUpdateStudents,
  onDeleteStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('all');
  const [standingFilter, setStandingFilter] = useState('all');

  // Quick Grade Encoder state
  const [quickStudentId, setQuickStudentId] = useState<string>(students[0]?.id || '');
  const [quickCourseCode, setQuickCourseCode] = useState<string>('');
  const [quickPrelim, setQuickPrelim] = useState<number>(90);
  const [quickMidterm, setQuickMidterm] = useState<number>(90);
  const [quickSemiFinal, setQuickSemiFinal] = useState<number>(90);
  const [quickFinal, setQuickFinal] = useState<number>(90);
  const [quickQuizzes, setQuickQuizzes] = useState<number>(92);
  const [quickAttendance, setQuickAttendance] = useState<number>(95);
  const [quickRemarks, setQuickRemarks] = useState<string>('');
  const [quickSaveFeedback, setQuickSaveFeedback] = useState(false);

  // Selected student for quick grade encoder
  const selectedStudent = students.find((s) => s.id === quickStudentId) || students[0];
  const activeTerm = selectedStudent?.terms?.[0];
  const courses = activeTerm?.courses || [];
  const currentCourse =
    courses.find((c) => c.courseCode === quickCourseCode) || courses[0];

  // Sync quick encoder fields when student or course changes
  const handleSelectQuickStudent = (studentId: string) => {
    setQuickStudentId(studentId);
    const stud = students.find((s) => s.id === studentId);
    if (stud && stud.terms?.[0]?.courses?.[0]) {
      const crs = stud.terms[0].courses[0];
      setQuickCourseCode(crs.courseCode);
      const periods = getCoursePeriodScores(crs);
      setQuickPrelim(periods.prelim.examScore);
      setQuickMidterm(periods.midterm.examScore);
      setQuickSemiFinal(periods.semiFinal.examScore);
      setQuickFinal(periods.final.examScore);
      setQuickQuizzes(periods.prelim.quizzesScore || 90);
      setQuickAttendance(stud.attendanceRate || 95);
      setQuickRemarks(crs.teacherRemarks || '');
    }
  };

  const handleSelectQuickCourse = (courseCode: string) => {
    setQuickCourseCode(courseCode);
    const crs = courses.find((c) => c.courseCode === courseCode);
    if (crs) {
      const periods = getCoursePeriodScores(crs);
      setQuickPrelim(periods.prelim.examScore);
      setQuickMidterm(periods.midterm.examScore);
      setQuickSemiFinal(periods.semiFinal.examScore);
      setQuickFinal(periods.final.examScore);
      setQuickQuizzes(periods.prelim.quizzesScore || 90);
      setQuickRemarks(crs.teacherRemarks || '');
    }
  };

  // Save quick grade changes
  const handleSaveQuickGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !currentCourse) return;

    const clamp = (val: number) => Math.max(0, Math.min(100, val));
    const pVal = clamp(Number(quickPrelim));
    const mVal = clamp(Number(quickMidterm));
    const sVal = clamp(Number(quickSemiFinal));
    const fVal = clamp(Number(quickFinal));

    const p1: PeriodScore = {
      name: 'Prelim',
      examScore: pVal,
      examMax: 100,
      quizzesScore: Number(quickQuizzes),
      quizzesMax: 100,
      periodPercentage: pVal,
      collegeGrade: percentageToCollegeGrade(pVal).grade,
      isCompleted: true,
    };
    const p2: PeriodScore = {
      name: 'Midterm',
      examScore: mVal,
      examMax: 100,
      quizzesScore: Number(quickQuizzes),
      quizzesMax: 100,
      periodPercentage: mVal,
      collegeGrade: percentageToCollegeGrade(mVal).grade,
      isCompleted: true,
    };
    const p3: PeriodScore = {
      name: 'Semi-Final',
      examScore: sVal,
      examMax: 100,
      quizzesScore: Number(quickQuizzes),
      quizzesMax: 100,
      periodPercentage: sVal,
      collegeGrade: percentageToCollegeGrade(sVal).grade,
      isCompleted: true,
    };
    const p4: PeriodScore = {
      name: 'Final',
      examScore: fVal,
      examMax: 100,
      quizzesScore: Number(quickQuizzes),
      quizzesMax: 100,
      periodPercentage: fVal,
      collegeGrade: percentageToCollegeGrade(fVal).grade,
      isCompleted: true,
    };

    const updatedAssessments: Assessment[] = [
      {
        id: 'ass-prelim',
        name: 'Prelim Examination',
        category: 'Prelim Exam',
        score: pVal,
        maxScore: 100,
        weight: 25,
        date: '2026-10-01',
        period: 'Prelim',
      },
      {
        id: 'ass-midterm',
        name: 'Midterm Examination',
        category: 'Midterm Exam',
        score: mVal,
        maxScore: 100,
        weight: 25,
        date: '2026-10-15',
        period: 'Midterm',
      },
      {
        id: 'ass-semi',
        name: 'Semi-Final Examination',
        category: 'Semi-Final Exam',
        score: sVal,
        maxScore: 100,
        weight: 25,
        date: '2026-11-05',
        period: 'Semi-Final',
      },
      {
        id: 'ass-final',
        name: 'Final Examination',
        category: 'Final Exam',
        score: fVal,
        maxScore: 100,
        weight: 25,
        date: '2026-12-01',
        period: 'Final',
      },
    ];

    const updatedCourses = courses.map((c) => {
      if (c.courseCode === currentCourse.courseCode) {
        return {
          ...c,
          prelimScore: p1,
          midtermScore: p2,
          semiFinalScore: p3,
          finalScore: p4,
          assessments: updatedAssessments,
          teacherRemarks: quickRemarks,
        };
      }
      return c;
    });

    const updatedStudentsList = students.map((s) => {
      if (s.id === selectedStudent.id) {
        return {
          ...s,
          attendanceRate: Number(quickAttendance),
          terms: s.terms.map((t, idx) => (idx === 0 ? { ...t, courses: updatedCourses } : t)),
        };
      }
      return s;
    });

    onUpdateStudents(updatedStudentsList);
    setQuickSaveFeedback(true);
    setTimeout(() => setQuickSaveFeedback(false), 2500);
  };

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProgram =
      programFilter === 'all' || student.program.toLowerCase().includes(programFilter.toLowerCase());

    const termGwa = calculateTermGwa(student.terms?.[0]?.courses || []);
    const standing = getCollegeAcademicStanding(termGwa.gwa, termGwa.hasFailingGrade);

    let matchesStanding = true;
    if (standingFilter === 'deans') {
      matchesStanding = termGwa.gwa <= 1.75 && termGwa.allPassed;
    } else if (standingFilter === 'passed') {
      matchesStanding = termGwa.allPassed;
    } else if (standingFilter === 'warning') {
      matchesStanding = termGwa.hasFailingGrade || termGwa.gwa >= 3.0;
    }

    return matchesSearch && matchesProgram && matchesStanding;
  });

  // Calculate overview metrics across all students
  const totalStudents = students.length;
  let totalGwaSum = 0;
  let deansListCount = 0;
  let atRiskCount = 0;

  students.forEach((s) => {
    const calc = calculateTermGwa(s.terms?.[0]?.courses || []);
    totalGwaSum += calc.gwa;
    if (calc.gwa <= 1.75 && calc.allPassed) {
      deansListCount += 1;
    }
    if (calc.hasFailingGrade || calc.gwa >= 3.0) {
      atRiskCount += 1;
    }
  });

  const averageClassGwa =
    totalStudents > 0 ? (totalGwaSum / totalStudents).toFixed(2) : '1.50';

  // Preview computation for the quick encoder
  const quickAveragePct = Math.round(
    ((Number(quickPrelim) + Number(quickMidterm) + Number(quickSemiFinal) + Number(quickFinal)) /
      4) *
      10
  ) / 10;
  const quickTransmuted = percentageToCollegeGrade(quickAveragePct);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Teacher Profile & Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-900/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 border-2 border-indigo-400/40 flex items-center justify-center text-white shadow-lg shrink-0">
              <GraduationCap className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Faculty Grade Encoder Portal
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Official Grade Encoder
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                {teacherName}
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200/80 font-medium mt-0.5">
                {teacherDepartment} • Academic Term: 1st Semester 2024-2025
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={onOpenAddStudentModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Add / Enroll new student to class roster"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Enroll / Add Student</span>
            </button>

            <button
              onClick={() => onOpenEditGradeModal(students[0]?.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-950/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Open full modal grade editor"
            >
              <Edit3 className="w-4 h-4" />
              <span>Encode / Edit All Grades</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Class Analytics Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalStudents}</span>
            <span className="text-xs text-slate-500 font-medium">Students</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Class Roster Active</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Class Average GWA</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">{averageClassGwa}</span>
            <span className="text-xs text-slate-500 font-medium">1.00 – 5.00 Scale</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Lower GWA is superior</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Dean's / Honors Listers</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">{deansListCount}</span>
            <span className="text-xs text-slate-500 font-medium">GWA ≤ 1.75</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Honors Candidates</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Needs Intervention / Warning</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-600">{atRiskCount}</span>
            <span className="text-xs text-slate-500 font-medium">Students</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">At-risk or with failing marks</p>
        </div>
      </div>

      {/* Interactive Quick-Grade Encoder Station (Fast Inline Grade Entry) */}
      <div className="bg-white rounded-3xl border border-indigo-100 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-50/80 via-white to-slate-50 border-b border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Fast Grade Encoder</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  4-Period Standard
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Directly input or update exam scores for Prelim, Midterm, Semi-Final, Final, Quizzes, and Attendance.
              </p>
            </div>
          </div>

          {quickSaveFeedback && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Grade saved and updated in the Student Grade Viewer!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSaveQuickGrade} className="p-5 sm:p-6 space-y-5">
          {/* Student and Subject Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Student
              </label>
              <select
                value={quickStudentId}
                onChange={(e) => handleSelectQuickStudent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.studentId}) - {st.program}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Course / Subject
              </label>
              <select
                value={quickCourseCode || currentCourse?.courseCode}
                onChange={(e) => handleSelectQuickCourse(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {courses.map((crs) => (
                  <option key={crs.courseCode} value={crs.courseCode}>
                    {crs.courseCode}: {crs.courseName} {crs.schedule ? `[${crs.schedule} (1 hr)]` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => onOpenAddCourseModal(selectedStudent.id)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Course for {selectedStudent?.name.split(' ')[0]}</span>
              </button>
            </div>
          </div>

          {currentCourse && (
            <div className="flex items-center gap-2.5 text-xs text-slate-600 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 flex-wrap">
              <span className="font-semibold text-slate-800">{currentCourse.courseCode} Class Schedule:</span>
              <span className="font-mono text-indigo-700 font-bold">
                {currentCourse.schedule || 'MWF 08:00 AM - 09:00 AM (1 hr)'}
              </span>
              <span>• Room: <strong>{currentCourse.room || 'TBA'}</strong></span>
              <span>• Instructor: <strong>{currentCourse.instructor}</strong></span>
              <span className="ml-auto px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                ✓ 1-Hour Conflict-Free
              </span>
            </div>
          )}

          {/* 4-Period Exam Score Inputs */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>4-Period Major Exam Scores (0 - 100 Scale)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {/* Prelim */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-indigo-700">1. Prelim Exam</span>
                  <span className="text-[10px] text-slate-400">25%</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={quickPrelim}
                    onChange={(e) => setQuickPrelim(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-base font-black text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-center"
                  />
                  <span className="text-xs text-slate-400 font-bold">/100</span>
                </div>
                <div className="mt-1 text-[10px] text-slate-500 text-center">
                  Grade: {percentageToCollegeGrade(quickPrelim).grade}
                </div>
              </div>

              {/* Midterm */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-indigo-700">2. Midterm Exam</span>
                  <span className="text-[10px] text-slate-400">25%</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={quickMidterm}
                    onChange={(e) => setQuickMidterm(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-base font-black text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-center"
                  />
                  <span className="text-xs text-slate-400 font-bold">/100</span>
                </div>
                <div className="mt-1 text-[10px] text-slate-500 text-center">
                  Grade: {percentageToCollegeGrade(quickMidterm).grade}
                </div>
              </div>

              {/* Semi-Final */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-indigo-700">3. Semi-Final</span>
                  <span className="text-[10px] text-slate-400">25%</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={quickSemiFinal}
                    onChange={(e) => setQuickSemiFinal(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-base font-black text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-center"
                  />
                  <span className="text-xs text-slate-400 font-bold">/100</span>
                </div>
                <div className="mt-1 text-[10px] text-slate-500 text-center">
                  Grade: {percentageToCollegeGrade(quickSemiFinal).grade}
                </div>
              </div>

              {/* Final Exam */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-indigo-700">4. Final Exam</span>
                  <span className="text-[10px] text-slate-400">25%</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={quickFinal}
                    onChange={(e) => setQuickFinal(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-base font-black text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-center"
                  />
                  <span className="text-xs text-slate-400 font-bold">/100</span>
                </div>
                <div className="mt-1 text-[10px] text-slate-500 text-center">
                  Grade: {percentageToCollegeGrade(quickFinal).grade}
                </div>
              </div>
            </div>
          </div>

          {/* Supplementary: Quizzes, Attendance rate, and Teacher Feedback */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Quizzes & Quests Average (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={quickQuizzes}
                onChange={(e) => setQuickQuizzes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Student Attendance Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={quickAttendance}
                onChange={(e) => setQuickAttendance(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teacher Remarks / Advisory
              </label>
              <input
                type="text"
                value={quickRemarks}
                onChange={(e) => setQuickRemarks(e.target.value)}
                placeholder="e.g. Excellent recitation & consistent scores."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Transmuted Grade Preview and Save Button */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1.5 rounded-xl font-mono text-base font-black ${getCollegeGradeColorClass(
                  quickTransmuted.grade
                )}`}
              >
                {quickTransmuted.grade}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Transmuted Grade: {quickTransmuted.grade} ({quickAveragePct}%) • {quickTransmuted.description}
                </p>
                <p className="text-[11px] text-slate-500">
                  Standing: {quickTransmuted.remarks} • Transmutation: 4-Period Equal Average
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectStudentForViewer(selectedStudent)}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 transition-colors flex items-center gap-1.5"
                title="Preview how student sees this in Grade Viewer"
              >
                <Eye className="w-4 h-4 text-slate-500" />
                <span>View in Grade Viewer</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save & Update Grade</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Student Roster Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Roster Header and Filters */}
        <div className="p-5 sm:p-6 border-b border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Official Class Roster & Student Records</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  {filteredStudents.length} of {students.length} Students
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click "Encode Grades" to record grades or "View" to open the student grade viewer.
              </p>
            </div>

            <button
              onClick={onOpenAddStudentModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Enroll New Student</span>
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Name or Student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="all">All Programs</option>
                <option value="Computer Science">BS Computer Science</option>
                <option value="Information Technology">BS Information Technology</option>
                <option value="Information Systems">BS Information Systems</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={standingFilter}
                onChange={(e) => setStandingFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="all">All Academic Standings</option>
                <option value="deans">Dean's / President's List (≤ 1.75)</option>
                <option value="passed">Regular Passed (No 5.00)</option>
                <option value="warning">At-Risk / Warning (≥ 3.00 or 5.00)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Student Name & ID</th>
                <th className="py-3 px-4">Program & Year</th>
                <th className="py-3 px-4 text-center">Prelim Avg</th>
                <th className="py-3 px-4 text-center">Midterm Avg</th>
                <th className="py-3 px-4 text-center">Semi Avg</th>
                <th className="py-3 px-4 text-center">Final Avg</th>
                <th className="py-3 px-4 text-center">Sem GWA</th>
                <th className="py-3 px-4 text-center">Standing</th>
                <th className="py-3 px-4 text-center">Attendance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const studentCourses = student.terms[0]?.courses || [];
                  const termGwa = calculateTermGwa(studentCourses);
                  const standing = getCollegeAcademicStanding(termGwa.gwa, termGwa.hasFailingGrade);

                  // Calculate average exam scores across subjects
                  let pTotal = 0;
                  let mTotal = 0;
                  let sTotal = 0;
                  let fTotal = 0;
                  const cCount = studentCourses.length || 1;

                  studentCourses.forEach((c) => {
                    const p = getCoursePeriodScores(c);
                    pTotal += p.prelim.examScore;
                    mTotal += p.midterm.examScore;
                    sTotal += p.semiFinal.examScore;
                    fTotal += p.final.examScore;
                  });

                  const pAvg = Math.round(pTotal / cCount);
                  const mAvg = Math.round(mTotal / cCount);
                  const sAvg = Math.round(sTotal / cCount);
                  const fAvg = Math.round(fTotal / cCount);

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Name & ID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {student.name}
                            </p>
                            <p className="text-[11px] font-mono text-slate-500">
                              {student.studentId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Program & Year */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{student.program}</p>
                        <p className="text-[11px] text-slate-500">{student.gradeLevel}</p>
                      </td>

                      {/* Prelim */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                        {pAvg}%
                      </td>

                      {/* Midterm */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                        {mAvg}%
                      </td>

                      {/* Semi-Final */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                        {sAvg}%
                      </td>

                      {/* Final */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                        {fAvg}%
                      </td>

                      {/* GWA */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg font-mono font-black text-xs ${getCollegeGradeColorClass(
                            percentageToCollegeGrade(termGwa.averagePercentage).grade
                          )}`}
                        >
                          {termGwa.gwa.toFixed(2)}
                        </span>
                      </td>

                      {/* Standing Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${standing.badgeClass}`}
                        >
                          {standing.title}
                        </span>
                      </td>

                      {/* Attendance */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`font-semibold ${
                            (student.attendanceRate || 95) >= 80
                              ? 'text-emerald-700'
                              : 'text-rose-600 font-bold'
                          }`}
                        >
                          {student.attendanceRate || 95}%
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Encode Grades button */}
                          <button
                            onClick={() => onOpenEditGradeModal(student.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors"
                            title="Encode / Edit exam scores and grades for this student"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Encode Grades</span>
                          </button>

                          {/* View as Student */}
                          <button
                            onClick={() => onSelectStudentForViewer(student)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                            title="Preview how student sees their Grade Viewer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          {/* Add Course */}
                          <button
                            onClick={() => onOpenAddCourseModal(student.id)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors"
                            title="Add subject to this student"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Student */}
                          {students.length > 1 && (
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Are you sure you want to remove ${student.name} (${student.studentId}) from the roster?`
                                  )
                                ) {
                                  onDeleteStudent(student.id);
                                }
                              }}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                              title="Remove this student"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No students found matching your search filter or keyword.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

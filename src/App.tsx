import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  BarChart3,
  TrendingUp,
  FileText,
  Clock,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  HelpCircle,
  UserCheck,
  Compass,
  Lock,
  ArrowRight,
  Search,
  Eye,
  LogOut,
  Edit3,
  Briefcase,
  UserPlus,
  Sliders,
} from 'lucide-react';
import { Student, TeacherProfile, TermData, SubjectGrade, GradingSystem, ViewRole } from './types';
import { INITIAL_STUDENTS } from './data/mockStudents';
import { INITIAL_TEACHERS } from './data/mockTeachers';
import { Navbar } from './components/Navbar';
import { StudentLookup } from './components/StudentLookup';
import { StudentProfileCard } from './components/StudentProfileCard';
import { GradesTable } from './components/GradesTable';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import { WhatIfCalculator } from './components/WhatIfCalculator';
import { PrintableReportCard } from './components/PrintableReportCard';
import { EditGradeModal } from './components/EditGradeModal';
import { CollegeScaleModal } from './components/CollegeScaleModal';
import { AttendanceViewer } from './components/AttendanceViewer';
import { QuestsActivitiesViewer } from './components/QuestsActivitiesViewer';
import { ClassScheduleViewer } from './components/ClassScheduleViewer';
import { WhyThisGradeModal } from './components/WhyThisGradeModal';
import { AccountRulesModal } from './components/AccountRulesModal';
import { AuthLoginModal } from './components/AuthLoginModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AddStudentModal } from './components/AddStudentModal';
import { AddCourseModal } from './components/AddCourseModal';
import { SourceCodeModal } from './components/SourceCodeModal';
import { assignConflictFree1HourSchedule } from './utils/scheduleUtils';

const STORAGE_KEY = 'student_grade_viewer_roster_v5';
const TEACHER_STORAGE_KEY = 'teacher_faculty_roster_v2';
const AUTH_SESSION_KEY = 'collegiate_portal_session_v2';
const ROLE_SESSION_KEY = 'collegiate_active_role_v1';

export default function App() {
  // Persistence for student records
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s: Student, idx: number) => ({
            ...s,
            terms: (s.terms || []).map((term) => ({
              ...term,
              courses: assignConflictFree1HourSchedule(
                term.courses || [],
                idx % 2 === 0 ? ['Monday', 'Wednesday', 'Friday'] : ['Tuesday', 'Thursday']
              ),
            })),
          }));
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_STUDENTS;
  });

  // Persistence for faculty teachers
  const [teachers, setTeachers] = useState<TeacherProfile[]>(() => {
    try {
      const saved = localStorage.getItem(TEACHER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_TEACHERS;
  });

  // Active Role: 'student' | 'teacher'
  const [currentRole, setCurrentRole] = useState<ViewRole>(() => {
    try {
      const savedRole = localStorage.getItem(ROLE_SESSION_KEY) as ViewRole;
      if (savedRole === 'teacher' || savedRole === 'student') {
        return savedRole;
      }
    } catch {
      // Fallback
    }
    return 'student';
  });

  // Selected student
  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_SESSION_KEY);
      if (savedAuth && savedAuth !== 'logged_out' && savedAuth.startsWith('stu-')) {
        return savedAuth;
      }
    } catch {
      // Fallback
    }
    return INITIAL_STUDENTS[0].id;
  });

  // Selected teacher
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_SESSION_KEY);
      if (savedAuth && savedAuth !== 'logged_out' && savedAuth.startsWith('fac-')) {
        return savedAuth;
      }
    } catch {
      // Fallback
    }
    return INITIAL_TEACHERS[0].id;
  });

  // Authentication session state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_SESSION_KEY);
      return savedAuth !== 'logged_out';
    } catch {
      return true;
    }
  });

  // Active viewing tab in student grade viewer
  const [activeTab, setActiveTab] = useState<'grades' | 'schedule' | 'quests' | 'attendance' | 'analytics'>('grades');

  // Grading system: Defaults to College 1.00 – 5.00 Numerical Scale
  const [gradingSystem, setGradingSystem] = useState<GradingSystem>('college');

  // Modals
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
  const [whatIfCourse, setWhatIfCourse] = useState<SubjectGrade | undefined>(undefined);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isEditGradeOpen, setIsEditGradeOpen] = useState(false);
  const [editStudentIdTarget, setEditStudentIdTarget] = useState<string | undefined>(undefined);
  const [isCollegeGuideOpen, setIsCollegeGuideOpen] = useState(false);
  const [isWhyGradeOpen, setIsWhyGradeOpen] = useState(false);
  const [whyGradeCourseCode, setWhyGradeCourseCode] = useState<string | undefined>(undefined);
  const [isStudentRulesOpen, setIsStudentRulesOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalTab, setLoginModalTab] = useState<'login' | 'register'>('login');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [addCourseTargetStudentId, setAddCourseTargetStudentId] = useState<string>('');
  const [isSourceCodeOpen, setIsSourceCodeOpen] = useState(false);

  // Fast custom search input for the signed-out screen
  const [quickSearchInput, setQuickSearchInput] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Currently active student & teacher objects
  const currentStudent =
    students.find((s) => s.id === selectedStudentId) || students[0];

  const currentTeacher =
    teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  // Active term of the student
  const [activeTermId, setActiveTermId] = useState<string>(
    currentStudent?.terms[0]?.termId || '1st-sem-2024'
  );

  useEffect(() => {
    if (currentStudent && !currentStudent.terms.some((t) => t.termId === activeTermId)) {
      setActiveTermId(currentStudent.terms[0]?.termId || '');
    }
  }, [selectedStudentId, currentStudent, activeTermId]);

  const activeTerm: TermData =
    currentStudent?.terms.find((t) => t.termId === activeTermId) ||
    currentStudent?.terms[0];

  // Update students & localStorage
  const handleUpdateStudents = (updated: Student[]) => {
    setStudents(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save students to localStorage', e);
    }
    showToast('Grades updated successfully.');
  };

  // Update teachers & localStorage
  const handleUpdateTeachers = (updated: TeacherProfile[]) => {
    setTeachers(updated);
    try {
      localStorage.setItem(TEACHER_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save teachers to localStorage', e);
    }
  };

  // Change active view role
  const handleChangeRole = (newRole: ViewRole) => {
    setCurrentRole(newRole);
    try {
      localStorage.setItem(ROLE_SESSION_KEY, newRole);
    } catch (e) {
      console.error('Failed to save role', e);
    }
    if (newRole === 'teacher') {
      showToast(`Switched to Faculty Grade Encoder (${currentTeacher.salutation} ${currentTeacher.name}).`);
    } else {
      showToast(`Switched to Student Grade Viewer (${currentStudent.name}).`);
    }
  };

  // Log in as student
  const handleSelectStudentAndLogin = (student: Student) => {
    setSelectedStudentId(student.id);
    setCurrentRole('student');
    setIsLoggedIn(true);
    try {
      localStorage.setItem(AUTH_SESSION_KEY, student.id);
      localStorage.setItem(ROLE_SESSION_KEY, 'student');
    } catch (e) {
      console.error('Failed to save session', e);
    }
    showToast(`Welcome! Loaded grades for ${student.name} (${student.studentId}).`);
  };

  // Log in as teacher
  const handleSelectTeacherAndLogin = (teacher: TeacherProfile) => {
    setSelectedTeacherId(teacher.id);
    setCurrentRole('teacher');
    setIsLoggedIn(true);
    try {
      localStorage.setItem(AUTH_SESSION_KEY, teacher.id);
      localStorage.setItem(ROLE_SESSION_KEY, 'teacher');
    } catch (e) {
      console.error('Failed to save session', e);
    }
    showToast(`Welcome, ${teacher.salutation} ${teacher.name}! Opened Faculty Grade Encoder.`);
  };

  // Create & Register Student Account
  const handleCreateStudent = (newStudent: Student) => {
    const updated = [newStudent, ...students];
    handleUpdateStudents(updated);
    setSelectedStudentId(newStudent.id);
    setCurrentRole('student');
    setIsLoggedIn(true);
    try {
      localStorage.setItem(AUTH_SESSION_KEY, newStudent.id);
      localStorage.setItem(ROLE_SESSION_KEY, 'student');
    } catch (e) {
      console.error('Failed to save new student session', e);
    }
    showToast(`Account for ${newStudent.name} (${newStudent.studentId}) created and logged in!`);
  };

  // Create & Register Teacher Account
  const handleCreateTeacher = (newTeacher: TeacherProfile) => {
    const updated = [newTeacher, ...teachers];
    handleUpdateTeachers(updated);
    setSelectedTeacherId(newTeacher.id);
    setCurrentRole('teacher');
    setIsLoggedIn(true);
    try {
      localStorage.setItem(AUTH_SESSION_KEY, newTeacher.id);
      localStorage.setItem(ROLE_SESSION_KEY, 'teacher');
    } catch (e) {
      console.error('Failed to save new teacher session', e);
    }
    showToast(`Faculty account for ${newTeacher.salutation} ${newTeacher.name} created successfully!`);
  };

  // Add course to student
  const handleAddCourseToStudent = (studentId: string, newCourse: SubjectGrade) => {
    const updated = students.map((s) => {
      if (s.id === studentId) {
        return {
          ...s,
          terms: s.terms.map((t, idx) =>
            idx === 0 ? { ...t, courses: [...t.courses, newCourse] } : t
          ),
        };
      }
      return s;
    });
    handleUpdateStudents(updated);
    showToast(`Course ${newCourse.courseCode} added successfully!`);
  };

  // Delete student
  const handleDeleteStudent = (studentId: string) => {
    const updated = students.filter((s) => s.id !== studentId);
    handleUpdateStudents(updated);
    if (selectedStudentId === studentId && updated.length > 0) {
      setSelectedStudentId(updated[0].id);
    }
    showToast('Student removed from the roster.');
  };

  // Log out
  const handleLogout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.setItem(AUTH_SESSION_KEY, 'logged_out');
    } catch (e) {
      console.error('Failed to clear session', e);
    }
    showToast('Logged out successfully.');
  };

  // Browse Demo without logging in
  const handleBrowseAsGuest = () => {
    setIsLoggedIn(true);
    setSelectedStudentId(students[0].id);
    setCurrentRole('student');
    showToast('Browsing Student Grade Viewer in Public Demo Mode.');
  };

  // Reset demo data
  const handleResetData = () => {
    if (window.confirm('Reset all data (students, faculty, and grades) back to default demo records?')) {
      setStudents(INITIAL_STUDENTS);
      setTeachers(INITIAL_TEACHERS);
      setSelectedStudentId(INITIAL_STUDENTS[0].id);
      setSelectedTeacherId(INITIAL_TEACHERS[0].id);
      setCurrentRole('student');
      setIsLoggedIn(true);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TEACHER_STORAGE_KEY);
      localStorage.removeItem(AUTH_SESSION_KEY);
      localStorage.removeItem(ROLE_SESSION_KEY);
      showToast('Data reset to standard university demo records.');
    }
  };

  const handleOpenWhatIfForCourse = (course: SubjectGrade) => {
    setWhatIfCourse(course);
    setIsWhatIfOpen(true);
  };

  const handleOpenEditModal = (targetId?: string) => {
    setEditStudentIdTarget(targetId || selectedStudentId);
    setIsEditGradeOpen(true);
  };

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = quickSearchInput.trim().toLowerCase();
    if (!q) return;

    // Check student match
    const studentMatch = students.find(
      (s) => s.studentId.toLowerCase() === q || s.name.toLowerCase().includes(q)
    );
    if (studentMatch) {
      handleSelectStudentAndLogin(studentMatch);
      setQuickSearchInput('');
      return;
    }

    // Check teacher match
    const teacherMatch = teachers.find(
      (t) => t.employeeId.toLowerCase() === q || t.name.toLowerCase().includes(q)
    );
    if (teacherMatch) {
      handleSelectTeacherAndLogin(teacherMatch);
      setQuickSearchInput('');
      return;
    }

    showToast(`No student or faculty found matching: "${quickSearchInput}"`);
  };

  const targetAddCourseStudent =
    students.find((s) => s.id === addCourseTargetStudentId) || currentStudent;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-lg border border-slate-700 animate-in slide-in-from-bottom-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header / Navigation */}
      <Navbar
        currentRole={currentRole}
        onChangeRole={handleChangeRole}
        currentStudent={isLoggedIn ? currentStudent : null}
        currentTeacher={isLoggedIn ? currentTeacher : null}
        gradingSystem={gradingSystem}
        onChangeGradingSystem={setGradingSystem}
        onOpenCollegeGuide={() => setIsCollegeGuideOpen(true)}
        onOpenWhatIf={() => {
          setWhatIfCourse(undefined);
          setIsWhatIfOpen(true);
        }}
        onOpenPrint={() => setIsPrintOpen(true)}
        onOpenStudentRules={() => setIsStudentRulesOpen(true)}
        onOpenEditGrades={() => handleOpenEditModal(selectedStudentId)}
        onOpenAddStudent={() => setIsAddStudentOpen(true)}
        onResetData={handleResetData}
        isLoggedIn={isLoggedIn}
        onOpenLoginModal={(tab = 'login') => {
          setLoginModalTab(tab);
          setIsLoginModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenSourceCode={() => setIsSourceCodeOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {!isLoggedIn ? (
          /* Official Logged-Out Portal Gate */
          <div className="max-w-3xl mx-auto py-8 sm:py-12 space-y-6 animate-fadeIn">
            {/* Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-900/60 text-center relative overflow-hidden">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-bold uppercase tracking-wider mb-3">
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>Signed Out • Authentication Required</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
                Collegiate Grade Viewer & Teacher Grade Encoder
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200/80 max-w-xl mx-auto leading-relaxed">
                Sign in using your Student ID or Faculty Employee ID to access 4-Period exam grades, GWA, or encode course grades. You can also create a new account.
              </p>

              {/* Fast Direct ID Lookup Search */}
              <form
                onSubmit={handleQuickSearchSubmit}
                className="mt-6 max-w-md mx-auto flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/20 backdrop-blur-md"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={quickSearchInput}
                    onChange={(e) => setQuickSearchInput(e.target.value)}
                    placeholder="Enter Student ID (e.g. 2024-00101)..."
                    className="w-full pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-400 bg-transparent focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold transition-colors shrink-0 shadow-sm flex items-center gap-1"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </form>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setLoginModalTab('login');
                    setIsLoginModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginModalTab('register');
                    setIsLoginModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Create New Account (Sign Up)</span>
                </button>

                <button
                  type="button"
                  onClick={handleBrowseAsGuest}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-100 font-semibold text-xs border border-white/20 transition-all flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>View as Demo Guest</span>
                </button>
              </div>
            </div>

            {/* Quick Demo Access Grid */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>Quick Student Access (1-Click Demo)</span>
                </h2>
                <span className="text-xs text-slate-500 font-medium">1-Click Fast Preview</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {students.slice(0, 4).map((student) => (
                  <button
                    key={student.id}
                    onClick={() => handleSelectStudentAndLogin(student)}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/40 text-left transition-all flex items-center gap-3 group shadow-2xs"
                  >
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200 group-hover:ring-indigo-400"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-slate-900 text-xs sm:text-sm truncate group-hover:text-indigo-600 transition-colors">
                        {student.name}
                      </p>
                      <p className="text-[11px] font-mono text-slate-500">{student.studentId}</p>
                      <p className="text-[10px] text-slate-500 font-medium truncate">
                        {student.program} • {student.gradeLevel}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                ))}
              </div>

              {/* Faculty Quick Access */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Faculty Member Access:</span>
                </span>
                <button
                  onClick={() => handleSelectTeacherAndLogin(teachers[0])}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors flex items-center gap-1.5"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Sign in as {teachers[0].salutation} {teachers[0].name} (Faculty Portal)</span>
                </button>
              </div>
            </div>
          </div>
        ) : currentRole === 'teacher' ? (
          /* ========================================================= */
          /* TEACHER MODE: Faculty Grade Encoder & Student Roster Portal */
          /* ========================================================= */
          <TeacherDashboard
            students={students}
            teacherName={`${currentTeacher.salutation} ${currentTeacher.name}`}
            teacherDepartment={currentTeacher.department}
            gradingSystem={gradingSystem}
            onSelectStudentForViewer={(student) => {
              setSelectedStudentId(student.id);
              setCurrentRole('student');
              showToast(`Opened Student Grade Viewer for ${student.name}.`);
            }}
            onOpenEditGradeModal={(studentId) => handleOpenEditModal(studentId)}
            onOpenAddStudentModal={() => setIsAddStudentOpen(true)}
            onOpenAddCourseModal={(studentId) => {
              setAddCourseTargetStudentId(studentId);
              setIsAddCourseOpen(true);
            }}
            onUpdateStudents={handleUpdateStudents}
            onDeleteStudent={handleDeleteStudent}
          />
        ) : (
          /* ========================================================= */
          /* STUDENT MODE: Student Grade Viewer                        */
          /* ========================================================= */
          <>
            {/* Student Search & Quick Lookup Bar */}
            <StudentLookup
              students={students}
              selectedStudent={currentStudent}
              selectedStudentId={selectedStudentId}
              gradingSystem={gradingSystem}
              onSelectStudent={(student) => setSelectedStudentId(student.id)}
            />

            {/* Student Profile & Academic Summary Card */}
            <StudentProfileCard
              student={currentStudent}
              activeTerm={activeTerm}
              gradingSystem={gradingSystem}
              onSelectTerm={(term) => setActiveTermId(term.termId)}
              onOpenWhatIf={() => {
                setWhatIfCourse(undefined);
                setIsWhatIfOpen(true);
              }}
              onOpenPrint={() => setIsPrintOpen(true)}
              onOpenCollegeGuide={() => setIsCollegeGuideOpen(true)}
            />

            {/* Content Tabs (Grades vs Quests/Activities vs Attendance vs Analytics) */}
            <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-2xs flex items-center gap-1 overflow-x-auto">
              <button
                type="button"
                id="tab-grades"
                onClick={() => setActiveTab('grades')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === 'grades'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Official Grades (4-Period Exams)</span>
              </button>

              <button
                type="button"
                id="tab-schedule"
                onClick={() => setActiveTab('schedule')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === 'schedule'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Class Schedule (1-Hour Slots)</span>
              </button>

              <button
                type="button"
                id="tab-quests"
                onClick={() => setActiveTab('quests')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === 'quests'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Quests & Activities Breakdown</span>
              </button>

              <button
                type="button"
                id="tab-attendance"
                onClick={() => setActiveTab('attendance')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === 'attendance'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Daily Attendance Log</span>
              </button>

              <button
                type="button"
                id="tab-analytics"
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Performance Analytics</span>
              </button>
            </div>

            {/* Tab Panels */}
            {activeTab === 'grades' && (
              <GradesTable
                courses={activeTerm?.courses || []}
                gradingSystem={gradingSystem}
                onOpenWhatIfForCourse={handleOpenWhatIfForCourse}
                onOpenCollegeGuide={() => setIsCollegeGuideOpen(true)}
                onOpenWhyGrade={(code) => {
                  setWhyGradeCourseCode(code);
                  setIsWhyGradeOpen(true);
                }}
              />
            )}

            {activeTab === 'schedule' && (
              <ClassScheduleViewer
                student={currentStudent}
                courses={activeTerm?.courses || []}
                activeTerm={activeTerm}
                onOpenWhyGrade={(code) => {
                  setWhyGradeCourseCode(code);
                  setIsWhyGradeOpen(true);
                }}
                onOpenWhatIf={() => {
                  setWhatIfCourse(undefined);
                  setIsWhatIfOpen(true);
                }}
                onUpdateCoursesSchedule={(updatedCourses) => {
                  if (!currentStudent || !activeTerm) return;
                  setStudents((prev) =>
                    prev.map((s) => {
                      if (s.id !== currentStudent.id) return s;
                      return {
                        ...s,
                        terms: (s.terms || []).map((t) => {
                          if (t.termId !== activeTerm.termId) return t;
                          return {
                            ...t,
                            courses: updatedCourses,
                          };
                        }),
                      };
                    })
                  );
                  setToastMessage('Schedule updated! All subjects have conflict-free 1-hour slots.');
                }}
              />
            )}

            {activeTab === 'quests' && (
              <QuestsActivitiesViewer
                student={currentStudent}
                courses={activeTerm?.courses || []}
                activeTerm={activeTerm}
                onOpenWhyGrade={(code) => {
                  setWhyGradeCourseCode(code);
                  setIsWhyGradeOpen(true);
                }}
              />
            )}

            {activeTab === 'attendance' && (
              <AttendanceViewer
                student={currentStudent}
                courses={activeTerm?.courses || []}
                onOpenWhyGrade={(code) => {
                  setWhyGradeCourseCode(code);
                  setIsWhyGradeOpen(true);
                }}
              />
            )}

            {activeTab === 'analytics' && (
              <PerformanceDashboard
                student={currentStudent}
                activeTerm={activeTerm}
                gradingSystem={gradingSystem}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-2">
          <p className="font-semibold text-slate-700">
            University Student Grade Viewer & Teacher Grade Encoder • Philippine Higher Education Collegiate Standard
          </p>
          <p className="text-[11px] text-slate-400">
            Prelim (25%) • Midterm (25%) • Semi-Final (25%) • Final Exam (25%) • 1.00 - 5.00 Numerical GWA
          </p>
        </div>
      </footer>

      {/* MODALS */}
      {/* What-If Grade Simulator */}
      {isWhatIfOpen && (
        <WhatIfCalculator
          isOpen={isWhatIfOpen}
          onClose={() => setIsWhatIfOpen(false)}
          courses={activeTerm?.courses || []}
          initialCourse={whatIfCourse}
          gradingSystem={gradingSystem}
        />
      )}

      {/* Printable Report Card & Certificate */}
      {isPrintOpen && (
        <PrintableReportCard
          isOpen={isPrintOpen}
          onClose={() => setIsPrintOpen(false)}
          student={currentStudent}
          activeTerm={activeTerm}
          gradingSystem={gradingSystem}
        />
      )}

      {/* Teacher Grade Editor Modal */}
      {isEditGradeOpen && (
        <EditGradeModal
          students={students}
          initialStudentId={editStudentIdTarget || selectedStudentId}
          gradingSystem={gradingSystem}
          onSaveStudents={handleUpdateStudents}
          onClose={() => setIsEditGradeOpen(false)}
        />
      )}

      {/* College Scale Guide Modal */}
      {isCollegeGuideOpen && (
        <CollegeScaleModal
          isOpen={isCollegeGuideOpen}
          onClose={() => setIsCollegeGuideOpen(false)}
        />
      )}

      {/* Why This Grade Breakdown Modal */}
      {isWhyGradeOpen && (
        <WhyThisGradeModal
          isOpen={isWhyGradeOpen}
          onClose={() => setIsWhyGradeOpen(false)}
          student={currentStudent}
          courses={activeTerm?.courses || []}
          attendanceRate={currentStudent?.attendanceRate || 95}
          initialCourseCode={whyGradeCourseCode}
        />
      )}

      {/* Institutional Account & Grading Rules Modal */}
      {isStudentRulesOpen && (
        <AccountRulesModal
          isOpen={isStudentRulesOpen}
          onClose={() => setIsStudentRulesOpen(false)}
        />
      )}

      {/* Authentication & Account Creation Modal */}
      <AuthLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        students={students}
        teachers={teachers}
        currentStudent={isLoggedIn ? currentStudent : null}
        currentTeacher={isLoggedIn ? currentTeacher : null}
        currentRole={currentRole}
        isLoggedIn={isLoggedIn}
        onSelectStudent={handleSelectStudentAndLogin}
        onSelectTeacher={handleSelectTeacherAndLogin}
        onCreateStudent={handleCreateStudent}
        onCreateTeacher={handleCreateTeacher}
        onLogout={handleLogout}
        onOpenRules={() => {
          setIsLoginModalOpen(false);
          setIsStudentRulesOpen(true);
        }}
        initialTab={loginModalTab}
        initialRole={currentRole}
      />

      {/* Add / Enroll Student Modal */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddStudent={(newSt) => {
          const updated = [newSt, ...students];
          handleUpdateStudents(updated);
          setSelectedStudentId(newSt.id);
          showToast(`Student ${newSt.name} (${newSt.studentId}) successfully enrolled!`);
        }}
        existingCount={students.length}
      />

      {/* Add Course / Subject Modal */}
      <AddCourseModal
        isOpen={isAddCourseOpen}
        onClose={() => setIsAddCourseOpen(false)}
        student={targetAddCourseStudent}
        onAddCourse={handleAddCourseToStudent}
      />

      {/* Full Ready-to-Run Source Code & Project Files Modal */}
      <SourceCodeModal
        isOpen={isSourceCodeOpen}
        onClose={() => setIsSourceCodeOpen(false)}
      />
    </div>
  );
}

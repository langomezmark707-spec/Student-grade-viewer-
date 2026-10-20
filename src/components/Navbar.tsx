import React from 'react';
import {
  GraduationCap,
  RefreshCw,
  FileText,
  Calculator,
  HelpCircle,
  ShieldCheck,
  LogIn,
  LogOut,
  Edit3,
  User,
  Briefcase,
  UserPlus,
  Users,
  Code,
} from 'lucide-react';
import { Student, TeacherProfile, ViewRole, GradingSystem } from '../types';

interface NavbarProps {
  currentRole: ViewRole;
  onChangeRole: (role: ViewRole) => void;
  currentStudent: Student | null;
  currentTeacher: TeacherProfile | null;
  gradingSystem: GradingSystem;
  onChangeGradingSystem: (system: GradingSystem) => void;
  onOpenCollegeGuide: () => void;
  onOpenWhatIf: () => void;
  onOpenPrint: () => void;
  onOpenStudentRules: () => void;
  onOpenEditGrades: () => void;
  onOpenAddStudent: () => void;
  onResetData: () => void;
  isLoggedIn: boolean;
  onOpenLoginModal: (tab?: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenSourceCode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onChangeRole,
  currentStudent,
  currentTeacher,
  gradingSystem,
  onChangeGradingSystem,
  onOpenCollegeGuide,
  onOpenWhatIf,
  onOpenPrint,
  onOpenStudentRules,
  onOpenEditGrades,
  onOpenAddStudent,
  onResetData,
  isLoggedIn,
  onOpenLoginModal,
  onLogout,
  onOpenSourceCode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
          {/* Logo & Portal Branding */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              {currentRole === 'teacher' ? (
                <Briefcase className="w-6 h-6 stroke-[2.2]" />
              ) : (
                <GraduationCap className="w-6 h-6 stroke-[2.2]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-base md:text-lg">
                  {currentRole === 'teacher'
                    ? 'Faculty Grade Encoder'
                    : 'Student Grade Viewer'}
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Collegiate 1.00 – 5.00
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                {currentRole === 'teacher'
                  ? 'Official Faculty Portal • Encode Exam Scores, Quests & Manage Rosters'
                  : 'Prelim • Midterm • Semi-Final • Final Exams • Quests • Attendance & GWA'}
              </p>
            </div>
          </div>

          {/* Role Switcher Pill (Student Grade Viewer vs Teacher Grade Encoder) */}
          <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => onChangeRole('student')}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                currentRole === 'student'
                  ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="View Student Grade Viewer"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Student Viewer</span>
              <span className="xs:hidden">Student</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeRole('teacher')}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                currentRole === 'teacher'
                  ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Faculty Portal • Encode Grades & Roster"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Faculty (Encode Grades)</span>
              <span className="xs:hidden">Faculty</span>
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
            {/* Grading System Selector */}
            <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => onChangeGradingSystem('college')}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  gradingSystem === 'college'
                    ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="1.00 - 5.00 Scale"
              >
                <span>1.00 – 5.00</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeGradingSystem('us')}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  gradingSystem === 'us'
                    ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="4.0 GPA Scale"
              >
                <span>4.0 GPA</span>
              </button>
            </div>

            {/* Scale Guide */}
            <button
              onClick={onOpenCollegeGuide}
              className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors shadow-2xs"
              title="View 1.00 to 5.00 Equivalency Table"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Scale Guide</span>
            </button>

            {/* Student Rules */}
            <button
              onClick={onOpenStudentRules}
              className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs"
              title="View Academic GWA & Attendance Rules"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Rules</span>
            </button>

            {/* View Source Code Button */}
            {onOpenSourceCode && (
              <button
                type="button"
                onClick={onOpenSourceCode}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold border border-slate-700 transition-all shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
                title="View and Copy Complete Ready-to-Run Code"
              >
                <Code className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Source Code</span>
                <span className="sm:hidden">Code</span>
              </button>
            )}

            {/* Teacher Specific Action: Add Student */}
            {currentRole === 'teacher' && (
              <button
                onClick={onOpenAddStudent}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors shadow-2xs"
                title="Enroll new student"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+ Student</span>
              </button>
            )}

            {/* Create Account Button (Open register tab) */}
            <button
              onClick={() => onOpenLoginModal('register')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
              title="Create New Account (Sign Up)"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Up</span>
            </button>

            {/* Authentication Active Pill & Switch */}
            {isLoggedIn ? (
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenLoginModal('login')}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-left transition-all"
                  title="Click to switch account or sign in"
                >
                  <img
                    src={
                      currentRole === 'teacher' && currentTeacher
                        ? currentTeacher.avatar
                        : currentStudent?.avatar
                    }
                    alt="User Avatar"
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-300"
                  />
                  <div className="hidden lg:block leading-tight">
                    <p className="text-[11px] font-extrabold text-slate-900 truncate max-w-[110px]">
                      {currentRole === 'teacher' && currentTeacher
                        ? currentTeacher.name
                        : currentStudent?.name}
                    </p>
                    <p className="text-[9px] text-slate-500 font-mono">
                      {currentRole === 'teacher' && currentTeacher
                        ? currentTeacher.employeeId
                        : currentStudent?.studentId}
                    </p>
                  </div>
                </button>

                {/* Direct Log Out Button */}
                <button
                  type="button"
                  id="navbar-logout-btn"
                  onClick={onLogout}
                  className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
                  title="Log Out session"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                id="navbar-login-btn"
                onClick={() => onOpenLoginModal('login')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
                title="Log In sa Portal"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            )}

            {/* Quick action tools (What-if, Print Transcript, Reset) */}
            {currentRole === 'student' && (
              <div className="hidden xl:flex items-center gap-0.5">
                <button
                  onClick={onOpenWhatIf}
                  title="Open Grade What-If Calculator"
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenPrint}
                  title="Print Official Grade Certificate / Transcript"
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors"
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={onResetData}
              title="Reset data back to university demo records"
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

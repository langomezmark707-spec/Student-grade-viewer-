import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  LogOut,
  Sparkles,
  UserCheck,
  UserPlus,
  Briefcase,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { Student, TeacherProfile, ViewRole } from '../types';

interface AuthLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  teachers: TeacherProfile[];
  currentStudent: Student | null;
  currentTeacher: TeacherProfile | null;
  currentRole: ViewRole;
  isLoggedIn: boolean;
  onSelectStudent: (student: Student) => void;
  onSelectTeacher: (teacher: TeacherProfile) => void;
  onCreateStudent: (newStudent: Student) => void;
  onCreateTeacher: (newTeacher: TeacherProfile) => void;
  onLogout: () => void;
  onOpenRules: () => void;
  initialTab?: 'login' | 'register';
  initialRole?: ViewRole;
}

export const AuthLoginModal: React.FC<AuthLoginModalProps> = ({
  isOpen,
  onClose,
  students,
  teachers,
  currentStudent,
  currentTeacher,
  currentRole,
  isLoggedIn,
  onSelectStudent,
  onSelectTeacher,
  onCreateStudent,
  onCreateTeacher,
  onLogout,
  onOpenRules,
  initialTab = 'login',
  initialRole,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [roleTab, setRoleTab] = useState<ViewRole>(initialRole || currentRole || 'student');

  // Search input for login
  const [loginSearchInput, setLoginSearchInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Registration Form - Student
  const [regStudentName, setRegStudentName] = useState('');
  const [regStudentId, setRegStudentId] = useState(`2024-00${105 + students.length}`);
  const [regStudentProgram, setRegStudentProgram] = useState('BS Computer Science');
  const [regStudentYear, setRegStudentYear] = useState('1st Year • Freshman');
  const [regStudentEmail, setRegStudentEmail] = useState('');
  const [regStudentSeedSubjects, setRegStudentSeedSubjects] = useState(true);

  // Registration Form - Teacher
  const [regTeacherName, setRegTeacherName] = useState('');
  const [regTeacherId, setRegTeacherId] = useState(`FAC-CS-00${teachers.length + 1}`);
  const [regTeacherSalutation, setRegTeacherSalutation] = useState('Prof.');
  const [regTeacherRank, setRegTeacherRank] = useState('Associate Professor');
  const [regTeacherDept, setRegTeacherDept] = useState('Department of Computer Science');
  const [regTeacherCollege, setRegTeacherCollege] = useState('College of Computer Studies');
  const [regTeacherEmail, setRegTeacherEmail] = useState('');

  if (!isOpen) return null;

  // Student Login Click
  const handleChooseStudent = (student: Student) => {
    setSuccessMessage(`Naka-Log In na si ${student.name} (${student.studentId})`);
    setTimeout(() => {
      onSelectStudent(student);
      onClose();
    }, 350);
  };

  // Teacher Login Click
  const handleChooseTeacher = (teacher: TeacherProfile) => {
    setSuccessMessage(`Naka-Log In na si ${teacher.salutation} ${teacher.name} (${teacher.employeeId})`);
    setTimeout(() => {
      onSelectTeacher(teacher);
      onClose();
    }, 350);
  };

  // Custom Search Login
  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const query = loginSearchInput.trim().toLowerCase();
    if (!query) {
      setErrorMessage('Please enter your ID or Name.');
      return;
    }

    if (roleTab === 'student') {
      const matched = students.find(
        (s) =>
          s.studentId.toLowerCase() === query ||
          s.name.toLowerCase().includes(query)
      );
      if (matched) {
        handleChooseStudent(matched);
      } else {
        setErrorMessage(
          `No student found with ID: "${loginSearchInput}". Please verify your Student ID or create an account above.`
        );
      }
    } else {
      const matched = teachers.find(
        (t) =>
          t.employeeId.toLowerCase() === query ||
          t.name.toLowerCase().includes(query)
      );
      if (matched) {
        handleChooseTeacher(matched);
      } else {
        setErrorMessage(
          `No faculty found with ID: "${loginSearchInput}". Please verify your Employee ID.`
        );
      }
    }
  };

  // Submit Student Account Creation
  const handleRegisterStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regStudentName.trim()) {
      setErrorMessage('Please enter the student full name.');
      return;
    }
    if (!regStudentId.trim()) {
      setErrorMessage('Please enter the Student ID.');
      return;
    }

    const avatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    ];
    const pickedAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const newStudent: Student = {
      id: `stu-${Date.now()}`,
      studentId: regStudentId.trim(),
      name: regStudentName.trim(),
      avatar: pickedAvatar,
      gradeLevel: regStudentYear,
      program: regStudentProgram,
      email:
        regStudentEmail.trim() ||
        `${regStudentId.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}@student.edu`,
      attendanceRate: 96,
      presentCount: 29,
      absentCount: 1,
      lateCount: 0,
      excusedCount: 0,
      totalSessions: 30,
      terms: [
        {
          termId: '1st-sem-2024',
          termName: '1st Semester 2024-2025',
          courses: regStudentSeedSubjects
            ? [
                {
                  courseCode: 'CS 101',
                  courseName: 'Introduction to Computing & Logic',
                  credits: 3,
                  instructor: 'Prof. Alexander Vance, PhD',
                  room: 'Lab 2',
                  prelimScore: {
                    name: 'Prelim',
                    examScore: 92,
                    examMax: 100,
                    quizzesScore: 90,
                    quizzesMax: 100,
                    periodPercentage: 92,
                    collegeGrade: '1.50',
                    isCompleted: true,
                  },
                  midtermScore: {
                    name: 'Midterm',
                    examScore: 94,
                    examMax: 100,
                    quizzesScore: 95,
                    quizzesMax: 100,
                    periodPercentage: 94,
                    collegeGrade: '1.25',
                    isCompleted: true,
                  },
                  semiFinalScore: {
                    name: 'Semi-Final',
                    examScore: 90,
                    examMax: 100,
                    quizzesScore: 92,
                    quizzesMax: 100,
                    periodPercentage: 90,
                    collegeGrade: '1.75',
                    isCompleted: true,
                  },
                  finalScore: {
                    name: 'Final',
                    examScore: 95,
                    examMax: 100,
                    quizzesScore: 96,
                    quizzesMax: 100,
                    periodPercentage: 95,
                    collegeGrade: '1.25',
                    isCompleted: true,
                  },
                  assessments: [
                    {
                      id: 'ass-1',
                      name: 'Prelim Exam',
                      category: 'Prelim Exam',
                      score: 92,
                      maxScore: 100,
                      weight: 25,
                      date: '2026-10-01',
                      period: 'Prelim',
                    },
                    {
                      id: 'ass-2',
                      name: 'Midterm Exam',
                      category: 'Midterm Exam',
                      score: 94,
                      maxScore: 100,
                      weight: 25,
                      date: '2026-10-15',
                      period: 'Midterm',
                    },
                    {
                      id: 'ass-3',
                      name: 'Semi-Final Exam',
                      category: 'Semi-Final Exam',
                      score: 90,
                      maxScore: 100,
                      weight: 25,
                      date: '2026-11-05',
                      period: 'Semi-Final',
                    },
                    {
                      id: 'ass-4',
                      name: 'Final Exam',
                      category: 'Final Exam',
                      score: 95,
                      maxScore: 100,
                      weight: 25,
                      date: '2026-12-01',
                      period: 'Final',
                    },
                  ],
                  teacherRemarks: 'Excellent analytical comprehension and lab submissions.',
                },
                {
                  courseCode: 'IT 102',
                  courseName: 'Computer Programming 1',
                  credits: 3,
                  instructor: 'Engr. Maria Elena Santos, MEng',
                  room: 'Lab 1',
                  prelimScore: {
                    name: 'Prelim',
                    examScore: 90,
                    examMax: 100,
                    quizzesScore: 88,
                    quizzesMax: 100,
                    periodPercentage: 90,
                    collegeGrade: '1.75',
                    isCompleted: true,
                  },
                  midtermScore: {
                    name: 'Midterm',
                    examScore: 93,
                    examMax: 100,
                    quizzesScore: 91,
                    quizzesMax: 100,
                    periodPercentage: 93,
                    collegeGrade: '1.50',
                    isCompleted: true,
                  },
                  semiFinalScore: {
                    name: 'Semi-Final',
                    examScore: 91,
                    examMax: 100,
                    quizzesScore: 90,
                    quizzesMax: 100,
                    periodPercentage: 91,
                    collegeGrade: '1.50',
                    isCompleted: true,
                  },
                  finalScore: {
                    name: 'Final',
                    examScore: 94,
                    examMax: 100,
                    quizzesScore: 95,
                    quizzesMax: 100,
                    periodPercentage: 94,
                    collegeGrade: '1.25',
                    isCompleted: true,
                  },
                  assessments: [],
                  teacherRemarks: 'Clean syntax and consistent quiz participation.',
                },
                {
                  courseCode: 'MATH 101',
                  courseName: 'Discrete Mathematics',
                  credits: 3,
                  instructor: 'Instructor David Lim, MIT',
                  room: 'Hall 302',
                  prelimScore: {
                    name: 'Prelim',
                    examScore: 88,
                    examMax: 100,
                    quizzesScore: 87,
                    quizzesMax: 100,
                    periodPercentage: 88,
                    collegeGrade: '1.75',
                    isCompleted: true,
                  },
                  midtermScore: {
                    name: 'Midterm',
                    examScore: 89,
                    examMax: 100,
                    quizzesScore: 88,
                    quizzesMax: 100,
                    periodPercentage: 89,
                    collegeGrade: '1.75',
                    isCompleted: true,
                  },
                  semiFinalScore: {
                    name: 'Semi-Final',
                    examScore: 88,
                    examMax: 100,
                    quizzesScore: 86,
                    quizzesMax: 100,
                    periodPercentage: 88,
                    collegeGrade: '1.75',
                    isCompleted: true,
                  },
                  finalScore: {
                    name: 'Final',
                    examScore: 92,
                    examMax: 100,
                    quizzesScore: 93,
                    quizzesMax: 100,
                    periodPercentage: 92,
                    collegeGrade: '1.50',
                    isCompleted: true,
                  },
                  assessments: [],
                  teacherRemarks: 'Good grasp of predicate logic and truth tables.',
                },
              ]
            : [],
        },
      ],
      history: [
        {
          termName: 'Freshman 1st Term',
          gpa: 3.8,
          gwa: 1.45,
          creditsEarned: 18,
        },
      ],
    };

    setSuccessMessage(`Account created successfully! Loading Student Grade Viewer for ${newStudent.name}...`);
    setTimeout(() => {
      onCreateStudent(newStudent);
      onClose();
    }, 500);
  };

  // Submit Teacher Account Creation
  const handleRegisterTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regTeacherName.trim()) {
      setErrorMessage('Please enter the faculty member full name.');
      return;
    }
    if (!regTeacherId.trim()) {
      setErrorMessage('Please enter the Employee ID.');
      return;
    }

    const newTeacher: TeacherProfile = {
      id: `fac-${Date.now()}`,
      employeeId: regTeacherId.trim(),
      name: regTeacherName.trim(),
      salutation: regTeacherSalutation,
      rank: regTeacherRank,
      department: regTeacherDept,
      college: regTeacherCollege,
      email:
        regTeacherEmail.trim() ||
        `${regTeacherId.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}@university.edu`,
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      officeRoom: 'Faculty Wing Rm 302',
      employmentStatus: 'Permanent / Full-Time Faculty',
      shiftSchedule: '08:00 AM - 05:00 PM (Monday - Friday)',
      teachingLoadUnits: 18,
      consultationHours: 'TTh 01:00 PM - 03:00 PM',
      leaveCredits: {
        vacationLeave: 15,
        sickLeave: 15,
        emergencyLeave: 3,
        serviceCredits: 5,
      },
      isClockedIn: true,
      dtrLogs: [],
    };

    setSuccessMessage(
      `Faculty account created successfully! Loading Faculty Grade Encoder for ${newTeacher.salutation} ${newTeacher.name}...`
    );
    setTimeout(() => {
      onCreateTeacher(newTeacher);
      onClose();
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 border border-indigo-400/40 flex items-center justify-center text-white shadow-lg">
              {roleTab === 'student' ? (
                <GraduationCap className="w-6 h-6 stroke-[2.2]" />
              ) : (
                <Briefcase className="w-6 h-6 stroke-[2.2]" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Collegiate Portal Gateway
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                {activeTab === 'login' ? 'Sign In to Portal' : 'Create New Account'}
              </h2>
            </div>
          </div>

          {/* Top-level Tabs: Log In vs Create Account */}
          <div className="flex items-center gap-2 mt-5 p-1 bg-white/10 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'login'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-indigo-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Log In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'register'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-indigo-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Create Account</span>
            </button>
          </div>
        </div>

        {/* Currently Active User Strip (if logged in) */}
        {isLoggedIn && (currentStudent || currentTeacher) && (
          <div className="p-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <img
                src={
                  currentRole === 'teacher' && currentTeacher
                    ? currentTeacher.avatar
                    : currentStudent?.avatar
                }
                alt="Avatar"
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-300"
              />
              <div className="text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  Currently Logged In ({currentRole === 'teacher' ? 'Faculty' : 'Student'}):
                </span>
                <p className="font-extrabold text-slate-900 leading-tight">
                  {currentRole === 'teacher' && currentTeacher
                    ? `${currentTeacher.salutation} ${currentTeacher.name}`
                    : currentStudent?.name}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        )}

        {/* Role Toggle Selector (Student vs Teacher) */}
        <div className="px-6 pt-4 pb-1 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setRoleTab('student');
                setErrorMessage(null);
              }}
              className={`flex-1 pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 ${
                roleTab === 'student'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student (Grade Viewer)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRoleTab('teacher');
                setErrorMessage(null);
              }}
              className={`flex-1 pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 ${
                roleTab === 'teacher'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Faculty (Grade Encoder)</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: LOG IN */}
          {activeTab === 'login' ? (
            <div className="space-y-5">
              {/* Custom Search / ID Log-in input */}
              <form onSubmit={handleCustomLogin} className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  {roleTab === 'student'
                    ? 'Type Student ID or Name to log in:'
                    : 'Type Faculty / Employee ID to log in:'}
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={
                        roleTab === 'student'
                          ? 'e.g. 2024-00101 or Jordan Smith...'
                          : 'e.g. FAC-CS-001 or Alexander Vance...'
                      }
                      value={loginSearchInput}
                      onChange={(e) => setLoginSearchInput(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5"
                  >
                    <span>Log In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* One-Click Account Roster Selection */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {roleTab === 'student'
                      ? `Select Student Account (${students.length})`
                      : `Select Faculty Account (${teachers.length})`}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">One-Click Fast Switch</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {roleTab === 'student'
                    ? students.map((student) => {
                        const isCurrent = currentStudent?.id === student.id && currentRole === 'student';
                        return (
                          <button
                            key={student.id}
                            type="button"
                            onClick={() => handleChooseStudent(student)}
                            className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                              isCurrent
                                ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-2xs'
                                : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50/80 shadow-2xs'
                            }`}
                          >
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-extrabold text-slate-900 truncate">
                                {student.name}
                              </p>
                              <p className="text-[11px] font-mono text-slate-500">
                                {student.studentId}
                              </p>
                              <p className="text-[10px] text-indigo-600 font-semibold truncate">
                                {student.program}
                              </p>
                            </div>
                            {isCurrent && (
                              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                            )}
                          </button>
                        );
                      })
                    : teachers.map((teacher) => {
                        const isCurrent = currentTeacher?.id === teacher.id && currentRole === 'teacher';
                        return (
                          <button
                            key={teacher.id}
                            type="button"
                            onClick={() => handleChooseTeacher(teacher)}
                            className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                              isCurrent
                                ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-2xs'
                                : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50/80 shadow-2xs'
                            }`}
                          >
                            <img
                              src={teacher.avatar}
                              alt={teacher.name}
                              className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-extrabold text-slate-900 truncate">
                                {teacher.salutation} {teacher.name}
                              </p>
                              <p className="text-[11px] font-mono text-slate-500">
                                {teacher.employeeId}
                              </p>
                              <p className="text-[10px] text-indigo-600 font-semibold truncate">
                                {teacher.rank}
                              </p>
                            </div>
                            {isCurrent && (
                              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: CREATE ACCOUNT (REGISTER) */
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-950 leading-relaxed">
                  Create an account to access the Student Grade Viewer or encode grades as a faculty member.
                </p>
              </div>

              {roleTab === 'student' ? (
                /* Student Registration Form */
                <form onSubmit={handleRegisterStudent} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maria Angela Santos"
                      value={regStudentName}
                      onChange={(e) => setRegStudentName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Student ID *
                      </label>
                      <input
                        type="text"
                        required
                        value={regStudentId}
                        onChange={(e) => setRegStudentId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Year Level
                      </label>
                      <select
                        value={regStudentYear}
                        onChange={(e) => setRegStudentYear(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 bg-white"
                      >
                        <option value="1st Year • Freshman">1st Year • Freshman</option>
                        <option value="2nd Year • Sophomore">2nd Year • Sophomore</option>
                        <option value="3rd Year • Junior">3rd Year • Junior</option>
                        <option value="4th Year • Senior">4th Year • Senior</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Degree Program *
                    </label>
                    <select
                      value={regStudentProgram}
                      onChange={(e) => setRegStudentProgram(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="BS Computer Science">BS Computer Science (BSCS)</option>
                      <option value="BS Information Technology">BS Information Technology (BSIT)</option>
                      <option value="BS Information Systems">BS Information Systems (BSIS)</option>
                      <option value="BS Computer Engineering">BS Computer Engineering (BSCpE)</option>
                      <option value="BS Nursing">BS Nursing (BSN)</option>
                      <option value="BS Accountancy">BS Accountancy (BSA)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. maria.santos@student.edu"
                      value={regStudentEmail}
                      onChange={(e) => setRegStudentEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Seed subjects toggle */}
                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="reg-seed-subjects"
                      checked={regStudentSeedSubjects}
                      onChange={(e) => setRegStudentSeedSubjects(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-emerald-300 focus:ring-emerald-500"
                    />
                    <label
                      htmlFor="reg-seed-subjects"
                      className="text-xs text-slate-700 leading-relaxed cursor-pointer"
                    >
                      <span className="font-bold text-emerald-950 block">
                        Include standard sample courses and exam grades
                      </span>
                      Immediately populates Prelim, Midterm, Semi-Final, and Final scores in your Grade Viewer.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account & Open Grade Viewer</span>
                  </button>
                </form>
              ) : (
                /* Teacher Registration Form */
                <form onSubmit={handleRegisterTeacher} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Salutation
                      </label>
                      <select
                        value={regTeacherSalutation}
                        onChange={(e) => setRegTeacherSalutation(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        <option value="Prof.">Prof.</option>
                        <option value="Dr.">Dr.</option>
                        <option value="Engr.">Engr.</option>
                        <option value="Instructor">Inst.</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Ms.">Ms.</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Faculty Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Roberto Tan, PhD"
                        value={regTeacherName}
                        onChange={(e) => setRegTeacherName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Employee ID *
                      </label>
                      <input
                        type="text"
                        required
                        value={regTeacherId}
                        onChange={(e) => setRegTeacherId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Faculty Rank
                      </label>
                      <select
                        value={regTeacherRank}
                        onChange={(e) => setRegTeacherRank(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        <option value="Instructor I">Instructor I</option>
                        <option value="Assistant Professor II">Assistant Professor II</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Full Professor">Full Professor</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Department & College *
                    </label>
                    <input
                      type="text"
                      required
                      value={regTeacherDept}
                      onChange={(e) => setRegTeacherDept(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. r.tan@university.edu"
                      value={regTeacherEmail}
                      onChange={(e) => setRegTeacherEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Create Faculty Account & Open Grade Encoder</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer Policy Link */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <button
            onClick={() => {
              onClose();
              onOpenRules();
            }}
            className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>View Account & Grading Rules</span>
          </button>
          <span>University Portal Gateway</span>
        </div>
      </div>
    </div>
  );
};

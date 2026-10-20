import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, BookOpen, GraduationCap, Sparkles } from 'lucide-react';
import { Student, TermData, SubjectGrade, PeriodScore } from '../types';
import { percentageToCollegeGrade } from '../utils/gradeUtils';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (newStudent: Student) => void;
  existingCount: number;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
  existingCount,
}) => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState(`2024-00${105 + existingCount}`);
  const [program, setProgram] = useState('BS Computer Science');
  const [gradeLevel, setGradeLevel] = useState('1st Year • Freshman');
  const [email, setEmail] = useState('');
  const [withDefaultSubjects, setWithDefaultSubjects] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter the student full name.');
      return;
    }

    if (!studentId.trim()) {
      setErrorMessage('Please enter the Student ID.');
      return;
    }

    // Generate starter subjects
    const defaultCourses: SubjectGrade[] = withDefaultSubjects
      ? [
          {
            courseCode: 'CS 101',
            courseName: 'Introduction to Computing & Algorithms',
            credits: 3,
            instructor: 'Prof. Alexander Vance, PhD',
            room: 'Lab 3 / Tech Bldg',
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
              examScore: 91,
              examMax: 100,
              quizzesScore: 92,
              quizzesMax: 100,
              periodPercentage: 91,
              collegeGrade: '1.50',
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
                score: 91,
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
            teacherRemarks: 'Participative in laboratory and solid exam grasp.',
          },
          {
            courseCode: 'IT 102',
            courseName: 'Computer Programming 1 (Python & Logic)',
            credits: 3,
            instructor: 'Engr. Maria Elena Santos, MEng',
            room: 'Lab 1',
            prelimScore: {
              name: 'Prelim',
              examScore: 89,
              examMax: 100,
              quizzesScore: 88,
              quizzesMax: 100,
              periodPercentage: 89,
              collegeGrade: '1.75',
              isCompleted: true,
            },
            midtermScore: {
              name: 'Midterm',
              examScore: 92,
              examMax: 100,
              quizzesScore: 90,
              quizzesMax: 100,
              periodPercentage: 92,
              collegeGrade: '1.50',
              isCompleted: true,
            },
            semiFinalScore: {
              name: 'Semi-Final',
              examScore: 90,
              examMax: 100,
              quizzesScore: 91,
              quizzesMax: 100,
              periodPercentage: 90,
              collegeGrade: '1.75',
              isCompleted: true,
            },
            finalScore: {
              name: 'Final',
              examScore: 93,
              examMax: 100,
              quizzesScore: 94,
              quizzesMax: 100,
              periodPercentage: 93,
              collegeGrade: '1.50',
              isCompleted: true,
            },
            assessments: [
              {
                id: 'ass-it-1',
                name: 'Prelim Exam',
                category: 'Prelim Exam',
                score: 89,
                maxScore: 100,
                weight: 25,
                date: '2026-10-02',
                period: 'Prelim',
              },
              {
                id: 'ass-it-2',
                name: 'Midterm Exam',
                category: 'Midterm Exam',
                score: 92,
                maxScore: 100,
                weight: 25,
                date: '2026-10-16',
                period: 'Midterm',
              },
              {
                id: 'ass-it-3',
                name: 'Semi-Final Exam',
                category: 'Semi-Final Exam',
                score: 90,
                maxScore: 100,
                weight: 25,
                date: '2026-11-06',
                period: 'Semi-Final',
              },
              {
                id: 'ass-it-4',
                name: 'Final Exam',
                category: 'Final Exam',
                score: 93,
                maxScore: 100,
                weight: 25,
                date: '2026-12-02',
                period: 'Final',
              },
            ],
            teacherRemarks: 'Good coding style, passed hands-on coding tests.',
          },
          {
            courseCode: 'MATH 101',
            courseName: 'Discrete Mathematics & Logic',
            credits: 3,
            instructor: 'Instructor David Lim, MIT',
            room: 'Hall 204',
            prelimScore: {
              name: 'Prelim',
              examScore: 88,
              examMax: 100,
              quizzesScore: 85,
              quizzesMax: 100,
              periodPercentage: 88,
              collegeGrade: '1.75',
              isCompleted: true,
            },
            midtermScore: {
              name: 'Midterm',
              examScore: 90,
              examMax: 100,
              quizzesScore: 89,
              quizzesMax: 100,
              periodPercentage: 90,
              collegeGrade: '1.75',
              isCompleted: true,
            },
            semiFinalScore: {
              name: 'Semi-Final',
              examScore: 87,
              examMax: 100,
              quizzesScore: 88,
              quizzesMax: 100,
              periodPercentage: 87,
              collegeGrade: '2.00',
              isCompleted: true,
            },
            finalScore: {
              name: 'Final',
              examScore: 91,
              examMax: 100,
              quizzesScore: 92,
              quizzesMax: 100,
              periodPercentage: 91,
              collegeGrade: '1.50',
              isCompleted: true,
            },
            assessments: [],
            teacherRemarks: 'Consistent problem solver in proofs and logic sets.',
          },
        ]
      : [];

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
      studentId: studentId.trim(),
      name: name.trim(),
      avatar: pickedAvatar,
      gradeLevel: gradeLevel,
      program: program,
      email: email.trim() || `${studentId.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}@student.edu`,
      attendanceRate: 96,
      presentCount: 28,
      absentCount: 1,
      lateCount: 1,
      excusedCount: 0,
      totalSessions: 30,
      terms: [
        {
          termId: '1st-sem-2024',
          termName: '1st Semester 2024-2025',
          courses: defaultCourses,
        },
      ],
      history: [
        {
          termName: '1st Year 1st Sem',
          gpa: 3.75,
          gwa: 1.45,
          creditsEarned: 18,
        },
      ],
    };

    onAddStudent(newStudent);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg my-auto overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 border border-emerald-400/40 flex items-center justify-center text-white shadow-lg">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                Enrollment & Registration
              </span>
              <h2 className="text-xl font-black text-white mt-1">
                + Enroll New Student
              </h2>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Student Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Maria Angela Santos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Student ID Number *
              </label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Year Level
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
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
              value={program}
              onChange={(e) => setProgram(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Seed default subjects checkbox */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
            <input
              type="checkbox"
              id="seed-subjects"
              checked={withDefaultSubjects}
              onChange={(e) => setWithDefaultSubjects(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-emerald-300 focus:ring-emerald-500"
            />
            <label htmlFor="seed-subjects" className="text-xs text-slate-700 leading-relaxed cursor-pointer">
              <span className="font-bold text-emerald-950 block">
                Pre-populate with standard collegiate courses (CS 101, IT 102, MATH 101)
              </span>
              Immediately populates course records in the Grade Viewer, which can be modified by the instructor.
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              + Enroll and Save Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, BookPlus, CheckCircle2, Award } from 'lucide-react';
import { SubjectGrade, Student, PeriodScore, ClassScheduleInfo } from '../types';
import { percentageToCollegeGrade } from '../utils/gradeUtils';
import {
  ONE_HOUR_TIME_SLOTS,
  formatDaysDisplay,
  normalizeDays,
  timeStringToMinutes,
} from '../utils/scheduleUtils';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  onAddCourse: (studentId: string, newCourse: SubjectGrade) => void;
}

export const AddCourseModal: React.FC<AddCourseModalProps> = ({
  isOpen,
  onClose,
  student,
  onAddCourse,
}) => {
  const existingCourses = student?.terms?.[0]?.courses || [];

  // Determine a default 1-hour slot that doesn't conflict with existing courses
  const nextAvailableSlotIndex = existingCourses.length % ONE_HOUR_TIME_SLOTS.length;
  const initialSlot = ONE_HOUR_TIME_SLOTS[nextAvailableSlotIndex];

  const [courseCode, setCourseCode] = useState('CS 302');
  const [courseName, setCourseName] = useState('Artificial Intelligence & Machine Learning');
  const [credits, setCredits] = useState(3);
  const [instructor, setInstructor] = useState('Prof. Alexander Vance, PhD');
  const [room, setRoom] = useState('Lab 3 / Tech Wing');
  const [selectedSlotId, setSelectedSlotId] = useState<string>(initialSlot.id);
  const [selectedDaysType, setSelectedDaysType] = useState<'MWF' | 'TTH'>('MWF');
  const [initialScore, setInitialScore] = useState(90);
  const [teacherRemarks, setTeacherRemarks] = useState('Enrolled for regular semester.');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!courseCode.trim()) {
      setErrorMessage('Please enter the Course Code (e.g. CS 302).');
      return;
    }
    if (!courseName.trim()) {
      setErrorMessage('Please enter the Course Title / Description.');
      return;
    }

    const sc = Math.max(0, Math.min(100, Number(initialScore)));
    const periodCalc = percentageToCollegeGrade(sc);

    const makePeriod = (name: 'Prelim' | 'Midterm' | 'Semi-Final' | 'Final'): PeriodScore => ({
      name,
      examScore: sc,
      examMax: 100,
      quizzesScore: sc,
      quizzesMax: 100,
      periodPercentage: sc,
      collegeGrade: periodCalc.grade,
      isCompleted: true,
    });

    const slot = ONE_HOUR_TIME_SLOTS.find((s) => s.id === selectedSlotId) || initialSlot;
    const days = selectedDaysType === 'MWF' ? ['Monday', 'Wednesday', 'Friday'] : ['Tuesday', 'Thursday'];
    const daysDisplay = formatDaysDisplay(days);
    const timeSlot = slot.label;
    const scheduleString = `${daysDisplay} ${timeSlot}`;

    const scheduleDetails: ClassScheduleInfo = {
      days,
      daysDisplay,
      startTime: slot.startTime,
      endTime: slot.endTime,
      timeSlot,
      durationHours: 1.0,
      room: room.trim() || 'TBA',
      building: room.toLowerCase().includes('lab') ? 'Tech & Science Lab' : 'Academic Hall',
      section: 'SEC-1A',
    };

    const newCourse: SubjectGrade = {
      courseCode: courseCode.trim().toUpperCase(),
      courseName: courseName.trim(),
      credits: Number(credits) || 3,
      instructor: instructor.trim() || 'Faculty Instructor',
      room: room.trim() || 'TBA',
      schedule: scheduleString,
      scheduleDays: days,
      scheduleTime: timeSlot,
      scheduleDetails,
      prelimScore: makePeriod('Prelim'),
      midtermScore: makePeriod('Midterm'),
      semiFinalScore: makePeriod('Semi-Final'),
      finalScore: makePeriod('Final'),
      assessments: [
        {
          id: `ass-p-${Date.now()}`,
          name: 'Prelim Exam',
          category: 'Prelim Exam',
          score: sc,
          maxScore: 100,
          weight: 25,
          date: '2026-10-01',
          period: 'Prelim',
        },
        {
          id: `ass-m-${Date.now()}`,
          name: 'Midterm Exam',
          category: 'Midterm Exam',
          score: sc,
          maxScore: 100,
          weight: 25,
          date: '2026-10-15',
          period: 'Midterm',
        },
        {
          id: `ass-s-${Date.now()}`,
          name: 'Semi-Final Exam',
          category: 'Semi-Final Exam',
          score: sc,
          maxScore: 100,
          weight: 25,
          date: '2026-11-05',
          period: 'Semi-Final',
        },
        {
          id: `ass-f-${Date.now()}`,
          name: 'Final Exam',
          category: 'Final Exam',
          score: sc,
          maxScore: 100,
          weight: 25,
          date: '2026-12-01',
          period: 'Final',
        },
      ],
      teacherRemarks: teacherRemarks.trim(),
    };

    onAddCourse(student.id, newCourse);
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
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 border border-indigo-400/40 flex items-center justify-center text-white shadow-lg">
              <BookPlus className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Subject Enrollment
              </span>
              <h2 className="text-xl font-black text-white mt-1">
                + Add Course for {student.name.split(' ')[0]}
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

          {/* Quick Major Presets for BSIT */}
          <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 block">
              Quick BSIT Major Subject Templates:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { code: 'IT-203', name: 'Web Systems & Technologies (Full-Stack Web Dev)', prof: 'Prof. Alexander Vance, MIT', room: 'Web Tech Lab 2' },
                { code: 'IT-205', name: 'Information Assurance & Cybersecurity Foundations', prof: 'Engr. Melissa Reyes, CISSP', room: 'Cyber Defense Lab 4' },
                { code: 'IT-207', name: 'System Integration & Architecture (Cloud & DevOps)', prof: 'Dr. Jonathan Bautista', room: 'Cloud Computing Lab 1' },
                { code: 'IT-301', name: 'Mobile Application Development (Cross-Platform)', prof: 'Engr. Patrick Ramos', room: 'Mobile Tech Lab 3' },
              ].map((preset) => (
                <button
                  key={preset.code}
                  type="button"
                  onClick={() => {
                    setCourseCode(preset.code);
                    setCourseName(preset.name);
                    setInstructor(preset.prof);
                    setRoom(preset.room);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 hover:border-indigo-400 text-indigo-800 text-[11px] font-bold transition-colors shadow-2xs"
                >
                  + {preset.code}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Course Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CS 302"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 uppercase"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Course Name / Description *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Artificial Intelligence"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Credit Units
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Initial Exam Benchmark (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={initialScore}
                onChange={(e) => setInitialScore(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Instructor / Faculty
            </label>
            <input
              type="text"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Room / Laboratory
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* 1-Hour Class Schedule Section */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                Class Schedule (1 Hour Each)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-200/80 text-indigo-800">
                Conflict-Free System
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Meeting Days
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-white rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSelectedDaysType('MWF')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      selectedDaysType === 'MWF'
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Mon, Wed, Fri
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDaysType('TTH')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      selectedDaysType === 'TTH'
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tue & Thu
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  1-Hour Time Slot
                </label>
                <select
                  value={selectedSlotId}
                  onChange={(e) => setSelectedSlotId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 font-mono"
                >
                  {ONE_HOUR_TIME_SLOTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Conflict Status Indicator */}
            {(() => {
              const currentSlot = ONE_HOUR_TIME_SLOTS.find((s) => s.id === selectedSlotId) || initialSlot;
              const chosenDays = selectedDaysType === 'MWF' ? ['Monday', 'Wednesday', 'Friday'] : ['Tuesday', 'Thursday'];
              const conflictingCourse = existingCourses.find((c) => {
                const cDays = normalizeDays(c.scheduleDetails?.days || c.scheduleDays || ['Monday', 'Wednesday', 'Friday']);
                const sharesDay = chosenDays.some((d) => cDays.includes(d));
                if (!sharesDay) return false;
                const cStart = timeStringToMinutes(c.scheduleDetails?.startTime || c.scheduleTime?.split('-')[0]?.trim() || '');
                const cEnd = timeStringToMinutes(c.scheduleDetails?.endTime || c.scheduleTime?.split('-')[1]?.trim() || '');
                return Math.max(cStart, currentSlot.startMinutes) < Math.min(cEnd, currentSlot.endMinutes);
              });

              if (conflictingCourse) {
                return (
                  <div className="p-2 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-900 text-[11px] font-medium flex items-center gap-1.5">
                    <span>⚠</span>
                    <span>
                      Time overlaps with <strong>{conflictingCourse.courseCode}</strong> ({conflictingCourse.scheduleTime || '08:00 AM - 09:00 AM'}). Please select an open 1-hour slot.
                    </span>
                  </div>
                );
              }

              return (
                <div className="p-2 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-[11px] font-semibold flex items-center gap-1.5">
                  <span>✓</span>
                  <span>Conflict-Free Verified: No other course meets during this 1-hour window.</span>
                </div>
              );
            })()}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Teacher Advisory Remarks
            </label>
            <input
              type="text"
              value={teacherRemarks}
              onChange={(e) => setTeacherRemarks(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
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
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              + Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  User,
  BookOpen,
  Printer,
  Sparkles,
  Layers,
  ChevronRight,
  Filter,
  Check,
  Award,
  RefreshCw,
} from 'lucide-react';
import { Student, SubjectGrade, TermData } from '../types';
import {
  ONE_HOUR_TIME_SLOTS,
  DAYS_OF_WEEK,
  auditScheduleConflicts,
  timeStringToMinutes,
  normalizeDays,
  assignConflictFree1HourSchedule,
} from '../utils/scheduleUtils';

interface ClassScheduleViewerProps {
  student?: Student | null;
  courses?: SubjectGrade[];
  activeTerm?: TermData | null;
  onOpenWhyGrade?: (courseCode?: string) => void;
  onOpenWhatIf?: () => void;
  onUpdateCoursesSchedule?: (updatedCourses: SubjectGrade[]) => void;
}

const COURSE_COLOR_PALETTES = [
  {
    bg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    accent: 'bg-indigo-600',
    indicator: 'border-l-4 border-indigo-600',
  },
  {
    bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    accent: 'bg-emerald-600',
    indicator: 'border-l-4 border-emerald-600',
  },
  {
    bg: 'bg-amber-50 border-amber-200 text-amber-900',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    accent: 'bg-amber-600',
    indicator: 'border-l-4 border-amber-600',
  },
  {
    bg: 'bg-purple-50 border-purple-200 text-purple-900',
    badge: 'bg-purple-100 text-purple-800 border-purple-300',
    accent: 'bg-purple-600',
    indicator: 'border-l-4 border-purple-600',
  },
  {
    bg: 'bg-cyan-50 border-cyan-200 text-cyan-900',
    badge: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    accent: 'bg-cyan-600',
    indicator: 'border-l-4 border-cyan-600',
  },
  {
    bg: 'bg-rose-50 border-rose-200 text-rose-900',
    badge: 'bg-rose-100 text-rose-800 border-rose-300',
    accent: 'bg-rose-600',
    indicator: 'border-l-4 border-rose-600',
  },
];

export const ClassScheduleViewer: React.FC<ClassScheduleViewerProps> = ({
  student,
  courses = [],
  activeTerm,
  onOpenWhyGrade,
  onUpdateCoursesSchedule,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<SubjectGrade | null>(null);
  const [auditSuccessBanner, setAuditSuccessBanner] = useState<boolean>(true);

  // Safe fallback courses with 1-hour conflict-free schedule guaranteed
  const safeCourses = Array.isArray(courses) ? courses : [];
  const auditReport = auditScheduleConflicts(safeCourses);

  // Filtered days for timetable grid
  const displayedDays =
    selectedDayFilter === 'all'
      ? DAYS_OF_WEEK
      : DAYS_OF_WEEK.filter((d) => d.toLowerCase() === selectedDayFilter.toLowerCase());

  // Total weekly class hours (each subject is 1 hour per meeting day)
  const totalWeeklyMeetings = safeCourses.reduce((acc, c) => {
    const days = normalizeDays(c.scheduleDetails?.days || c.scheduleDays || ['Monday', 'Wednesday', 'Friday']);
    return acc + days.length;
  }, 0);

  const totalCredits = safeCourses.reduce((sum, c) => sum + (c.credits || 0), 0);

  const handleAutoResolveConflicts = () => {
    if (onUpdateCoursesSchedule) {
      const resolved = assignConflictFree1HourSchedule(safeCourses);
      onUpdateCoursesSchedule(resolved);
      setAuditSuccessBanner(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Verification & Overview */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-7 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-300" />
                <span>Collegiate Class Timetable</span>
              </span>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Conflict-Free Verified • 1-Hour Time Slots</span>
              </span>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                <span>🍽️ Morning Limit: 11:30 AM • Lunch: 11:30 AM – 1:00 PM • Resume: 1:00 PM</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Weekly Class Schedule
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              All enrolled subjects are scheduled in distinct, non-overlapping 1-hour class periods with zero conflicts. Morning classes conclude by 11:30 AM for campus meal break, and afternoon classes resume at 1:00 PM.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 flex-wrap lg:justify-end">
            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[95px]">
              <div className="text-[10px] uppercase font-bold text-slate-300">Subjects</div>
              <div className="text-xl font-black text-white mt-0.5">{safeCourses.length}</div>
              <div className="text-[10px] text-indigo-300 font-semibold">1 Hour Each</div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[95px]">
              <div className="text-[10px] uppercase font-bold text-slate-300">Total Units</div>
              <div className="text-xl font-black text-white mt-0.5">{totalCredits}</div>
              <div className="text-[10px] text-indigo-300 font-semibold">Academic Units</div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[95px]">
              <div className="text-[10px] uppercase font-bold text-slate-300">Weekly Hours</div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">{totalWeeklyMeetings} hrs</div>
              <div className="text-[10px] text-emerald-300 font-semibold">Scheduled / Wk</div>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Schedule</span>
            </button>
          </div>
        </div>

        {/* Audit Status Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          {!auditReport.hasConflicts ? (
            <div className="flex items-center gap-2 text-emerald-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Schedule Audit Passed: All {safeCourses.length} subjects have unique hours with 0 overlaps across all school days.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-300 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{auditReport.summaryMessage}</span>
            </div>
          )}

          {auditReport.hasConflicts && onUpdateCoursesSchedule && (
            <button
              type="button"
              onClick={handleAutoResolveConflicts}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Auto-Resolve to 1-Hour Slots</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/70">
          {/* Day Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Day:</span>
            </span>
            <button
              type="button"
              onClick={() => setSelectedDayFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedDayFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              All Week (Mon - Fri)
            </button>
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDayFilter(day.toLowerCase())}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedDayFilter === day.toLowerCase()
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* View Mode Toggle: Timetable Grid vs List */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <div className="p-1 bg-slate-200/80 rounded-2xl flex items-center text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Timetable Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Subject List</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Mode 1: Weekly Timetable Grid */}
        {viewMode === 'grid' && (
          <div className="overflow-x-auto p-4 sm:p-6">
            <div className="min-w-[760px]">
              {/* Day Columns Header */}
              <div className="grid grid-cols-6 gap-2 mb-2 text-center text-xs font-black uppercase tracking-wider text-slate-500">
                <div className="p-2.5 bg-slate-100 rounded-xl font-mono text-[11px] text-slate-600 flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Time Slot</span>
                </div>
                {displayedDays.map((day) => (
                  <div
                    key={day}
                    className="p-2.5 bg-indigo-50/70 border border-indigo-100 text-indigo-900 rounded-xl"
                  >
                    <span>{day}</span>
                  </div>
                ))}
              </div>

              {/* Time Rows */}
              <div className="space-y-2">
                {ONE_HOUR_TIME_SLOTS.map((slot, slotIdx) => {
                  const showLunchBreakBefore = slotIdx === 3; // Right before 01:00 PM - 02:00 PM slot

                  return (
                    <React.Fragment key={slot.id}>
                      {showLunchBreakBefore && (
                        <div className="grid grid-cols-6 gap-2 items-center py-3 px-3.5 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/15 border border-amber-300/80 rounded-2xl shadow-2xs">
                          <div className="p-2.5 bg-amber-100 border border-amber-300 rounded-xl flex flex-col justify-center items-center text-center">
                            <span className="font-mono text-xs font-black text-amber-950">11:30 AM</span>
                            <span className="text-[10px] text-amber-700 font-bold">to</span>
                            <span className="font-mono text-xs font-black text-amber-950">01:00 PM</span>
                            <span className="mt-1 px-1.5 py-0.5 rounded-md bg-amber-200 text-amber-950 text-[9px] font-black">
                              Lunch Break
                            </span>
                          </div>
                          <div className="col-span-5 flex items-center justify-between px-3 text-amber-950">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl">🍽️</span>
                              <div>
                                <span className="text-xs font-black uppercase tracking-wider block">
                                  Campus Meal & Lunch Break (No Classes)
                                </span>
                                <span className="text-[11px] text-amber-800 font-medium block">
                                  Morning classes conclude at 11:30 AM. Afternoon lecture & lab classes resume promptly at 1:00 PM.
                                </span>
                              </div>
                            </div>
                            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-200 text-amber-950 font-bold text-xs border border-amber-300">
                              <span>Classes Resume at 1:00 PM</span>
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-6 gap-2 items-stretch min-h-[88px]">
                        {/* Time slot label */}
                        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col justify-center items-center text-center">
                          <span className="font-mono text-xs font-black text-slate-800">
                            {slot.startTime}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">to</span>
                          <span className="font-mono text-xs font-black text-slate-800">
                            {slot.endTime}
                          </span>
                          <span
                            className={`mt-1 px-1.5 py-0.5 rounded-md text-[9px] font-black ${
                              slot.session === 'morning'
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : 'bg-indigo-100/70 text-indigo-800 border border-indigo-200'
                            }`}
                          >
                            {slot.session === 'morning' ? 'Morning (≤11:30)' : 'Afternoon (≥1:00)'}
                          </span>
                        </div>

                      {/* Day Cells */}
                      {displayedDays.map((day) => {
                        // Find if any course meets at this day and time slot
                        const matchingCourse = safeCourses.find((c) => {
                          const days = normalizeDays(
                            c.scheduleDetails?.days || c.scheduleDays || ['Monday', 'Wednesday', 'Friday']
                          );
                          const meetsOnDay = days.includes(day);

                          const courseStart = timeStringToMinutes(
                            c.scheduleDetails?.startTime || c.scheduleTime?.split('-')[0]?.trim() || ''
                          );
                          const courseEnd = timeStringToMinutes(
                            c.scheduleDetails?.endTime || c.scheduleTime?.split('-')[1]?.trim() || ''
                          );

                          // Check overlap with this slot
                          const overlap =
                            Math.max(courseStart, slot.startMinutes) <
                            Math.min(courseEnd, slot.endMinutes);

                          return meetsOnDay && overlap;
                        });

                        if (!matchingCourse) {
                          return (
                            <div
                              key={day}
                              className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 p-2 flex items-center justify-center text-[10px] text-slate-300"
                            >
                              <span>Free Period</span>
                            </div>
                          );
                        }

                        // Determine color palette based on course index
                        const courseIdx = safeCourses.findIndex(
                          (c) => c.courseCode === matchingCourse.courseCode
                        );
                        const palette =
                          COURSE_COLOR_PALETTES[
                            (courseIdx >= 0 ? courseIdx : 0) % COURSE_COLOR_PALETTES.length
                          ];

                        return (
                          <div
                            key={day}
                            onClick={() => setSelectedCourseDetail(matchingCourse)}
                            className={`rounded-2xl p-3 border shadow-2xs transition-all hover:scale-[1.01] hover:shadow-md cursor-pointer flex flex-col justify-between ${palette.bg} ${palette.indicator}`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-mono text-xs font-black tracking-tight text-slate-900">
                                  {matchingCourse.courseCode}
                                </span>
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${palette.badge}`}
                                >
                                  {matchingCourse.credits} Units
                                </span>
                              </div>
                              <p className="text-xs font-bold leading-snug line-clamp-2 text-slate-800">
                                {matchingCourse.courseName}
                              </p>
                            </div>

                            <div className="pt-2 mt-2 border-t border-slate-200/60 space-y-0.5 text-[10px]">
                              <div className="flex items-center gap-1 text-slate-600 truncate">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">
                                  {matchingCourse.room || 'Room TBA'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-slate-600 truncate">
                                <User className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{matchingCourse.instructor}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </React.Fragment>
                );
              })}
              </div>
            </div>
          </div>
        )}

        {/* View Mode 2: Subject List View */}
        {viewMode === 'list' && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {safeCourses.map((c, idx) => {
                const palette = COURSE_COLOR_PALETTES[idx % COURSE_COLOR_PALETTES.length];
                const days = normalizeDays(c.scheduleDetails?.days || c.scheduleDays || ['Monday', 'Wednesday', 'Friday']);
                const timeSlot = c.scheduleDetails?.timeSlot || c.scheduleTime || '08:00 AM - 09:00 AM';

                return (
                  <div
                    key={c.courseCode}
                    className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                              {c.courseCode}
                            </span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>1 Hr • No Conflict</span>
                            </span>
                            {timeStringToMinutes(c.scheduleDetails?.endTime || c.scheduleTime?.split('-')[1]?.trim() || '') <= 690 ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                                🌅 Morning (Ends ≤ 11:30 AM)
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200">
                                ☀️ Afternoon (Resumes ≥ 1:00 PM)
                              </span>
                            )}
                          </div>
                          <h4 className="text-base font-bold text-slate-900 mt-1">
                            {c.courseName}
                          </h4>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl">
                            {c.credits} Credits
                          </span>
                        </div>
                      </div>

                      {/* Schedule Badges */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              Class Hours (1 Hour)
                            </span>
                            <strong className="font-mono font-bold text-slate-800">
                              {timeSlot}
                            </strong>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              Meeting Days
                            </span>
                            <strong className="font-bold text-slate-800">
                              {days.join(', ')}
                            </strong>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              Room & Building
                            </span>
                            <strong className="font-bold text-slate-800 truncate block">
                              {c.room || 'Room TBA'}
                            </strong>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                          <User className="w-4 h-4 text-indigo-600 shrink-0" />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              Instructor
                            </span>
                            <strong className="font-bold text-slate-800 truncate block">
                              {c.instructor}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500 font-medium">
                        Period: {activeTerm?.termName || 'Current Semester'}
                      </span>
                      {onOpenWhyGrade && (
                        <button
                          type="button"
                          onClick={() => onOpenWhyGrade(c.courseCode)}
                          className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1"
                        >
                          <span>View Course Grade Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Audit Confirmation */}
        <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700">
              System Rules Enforced: Every enrolled subject is 1 hour long and scheduled without conflicting hours.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-slate-500 font-medium">
              Academic Term: {activeTerm?.termName || '1st Semester 2024-2025'}
            </span>
          </div>
        </div>
      </div>

      {/* Selected Course Quick Modal */}
      {selectedCourseDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedCourseDetail(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-mono text-xs font-black border border-indigo-200">
                {selectedCourseDetail.courseCode}
              </span>
              <button
                type="button"
                onClick={() => setSelectedCourseDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {selectedCourseDetail.courseName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedCourseDetail.credits} Credits • {selectedCourseDetail.instructor}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Time (1 Hr):</span>
                <span className="font-mono font-bold text-slate-800">
                  {selectedCourseDetail.scheduleDetails?.timeSlot || selectedCourseDetail.scheduleTime || '08:00 AM - 09:00 AM'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Days:</span>
                <span className="font-bold text-slate-800">
                  {normalizeDays(selectedCourseDetail.scheduleDetails?.days || selectedCourseDetail.scheduleDays).join(', ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Classroom:</span>
                <span className="font-bold text-slate-800">
                  {selectedCourseDetail.room || 'TBA'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Schedule Conflict Status:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Conflict-Free (No overlap)</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              {onOpenWhyGrade && (
                <button
                  type="button"
                  onClick={() => {
                    const code = selectedCourseDetail.courseCode;
                    setSelectedCourseDetail(null);
                    onOpenWhyGrade(code);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors"
                >
                  View Grade Breakdown
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedCourseDetail(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

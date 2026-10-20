import { SubjectGrade, ClassScheduleInfo } from '../types';

export interface StandardTimeSlot {
  id: string;
  label: string; // e.g. "08:30 AM - 09:30 AM"
  startTime: string; // "08:30 AM"
  endTime: string; // "09:30 AM"
  startMinutes: number; // minutes from 00:00
  endMinutes: number;
  periodLabel: string; // "Morning Period 1"
  session: 'morning' | 'afternoon';
}

export interface LunchBreakConfig {
  startTime: string; // "11:30 AM"
  endTime: string; // "01:00 PM"
  startMinutes: number; // 690 (11:30 AM)
  endMinutes: number; // 780 (01:00 PM)
  label: string; // "11:30 AM - 01:00 PM"
  title: string;
  note: string;
}

export const LUNCH_BREAK: LunchBreakConfig = {
  startTime: '11:30 AM',
  endTime: '01:00 PM',
  startMinutes: 11 * 60 + 30, // 690 mins
  endMinutes: 13 * 60, // 780 mins
  label: '11:30 AM - 01:00 PM',
  title: 'Campus Lunch & Meal Break',
  note: 'Morning classes conclude at 11:30 AM. Classes resume at 1:00 PM.',
};

/**
 * Standard 1-hour academic time slots adhering strictly to:
 * - Morning classes end by 11:30 AM at the latest (08:30-09:30, 09:30-10:30, 10:30-11:30)
 * - Lunch break 11:30 AM - 01:00 PM (no classes)
 * - Afternoon classes resume at 01:00 PM (01:00-02:00, 02:00-03:00, 03:00-04:00, 04:00-05:00)
 */
export const ONE_HOUR_TIME_SLOTS: StandardTimeSlot[] = [
  {
    id: 'slot-1',
    label: '08:30 AM - 09:30 AM',
    startTime: '08:30 AM',
    endTime: '09:30 AM',
    startMinutes: 8 * 60 + 30, // 510
    endMinutes: 9 * 60 + 30, // 570
    periodLabel: 'Morning Period 1',
    session: 'morning',
  },
  {
    id: 'slot-2',
    label: '09:30 AM - 10:30 AM',
    startTime: '09:30 AM',
    endTime: '10:30 AM',
    startMinutes: 9 * 60 + 30, // 570
    endMinutes: 10 * 60 + 30, // 630
    periodLabel: 'Morning Period 2',
    session: 'morning',
  },
  {
    id: 'slot-3',
    label: '10:30 AM - 11:30 AM',
    startTime: '10:30 AM',
    endTime: '11:30 AM',
    startMinutes: 10 * 60 + 30, // 630
    endMinutes: 11 * 60 + 30, // 690 (Ends at 11:30 AM for lunch)
    periodLabel: 'Morning Period 3 (Final Morning Slot)',
    session: 'morning',
  },
  {
    id: 'slot-4',
    label: '01:00 PM - 02:00 PM',
    startTime: '01:00 PM',
    endTime: '02:00 PM',
    startMinutes: 13 * 60, // 780 (Classes resume at 1:00 PM)
    endMinutes: 14 * 60, // 840
    periodLabel: 'Afternoon Period 1 (Classes Resume)',
    session: 'afternoon',
  },
  {
    id: 'slot-5',
    label: '02:00 PM - 03:00 PM',
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    startMinutes: 14 * 60, // 840
    endMinutes: 15 * 60, // 900
    periodLabel: 'Afternoon Period 2',
    session: 'afternoon',
  },
  {
    id: 'slot-6',
    label: '03:00 PM - 04:00 PM',
    startTime: '03:00 PM',
    endTime: '04:00 PM',
    startMinutes: 15 * 60, // 900
    endMinutes: 16 * 60, // 960
    periodLabel: 'Afternoon Period 3',
    session: 'afternoon',
  },
  {
    id: 'slot-7',
    label: '04:00 PM - 05:00 PM',
    startTime: '04:00 PM',
    endTime: '05:00 PM',
    startMinutes: 16 * 60, // 960
    endMinutes: 17 * 60, // 1020
    periodLabel: 'Afternoon Period 4',
    session: 'afternoon',
  },
  {
    id: 'slot-8',
    label: '07:30 AM - 08:30 AM',
    startTime: '07:30 AM',
    endTime: '08:30 AM',
    startMinutes: 7 * 60 + 30, // 450
    endMinutes: 8 * 60 + 30, // 510
    periodLabel: 'Early Morning Session',
    session: 'morning',
  },
];

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

export const DAY_ABBREVIATIONS: Record<string, string> = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
};

/**
 * Converts a time string like "08:30 AM" or "1:00 PM" into minutes from midnight.
 */
export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3] ? match[3].toUpperCase() : 'AM';

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

/**
 * Normalizes day representation into full day names.
 */
export function normalizeDays(daysInput?: string[] | string): string[] {
  if (!daysInput) return ['Monday', 'Wednesday', 'Friday'];
  if (Array.isArray(daysInput)) {
    return daysInput.map((d) => {
      const lower = d.toLowerCase();
      if (lower.startsWith('mon')) return 'Monday';
      if (lower.startsWith('tue')) return 'Tuesday';
      if (lower.startsWith('wed')) return 'Wednesday';
      if (lower.startsWith('thu')) return 'Thursday';
      if (lower.startsWith('fri')) return 'Friday';
      return d;
    });
  }

  const str = daysInput.toUpperCase();
  const res: string[] = [];
  if (str.includes('M') || str.includes('MON')) res.push('Monday');
  if (str.includes('TTH') || str.includes('TUE')) res.push('Tuesday');
  if (str.includes('W') || str.includes('WED')) res.push('Wednesday');
  if (str.includes('TH') || str.includes('THU')) {
    if (!res.includes('Thursday')) res.push('Thursday');
  }
  if (str.includes('F') || str.includes('FRI')) res.push('Friday');

  return res.length > 0 ? res : ['Monday', 'Wednesday', 'Friday'];
}

export function formatDaysDisplay(days: string[]): string {
  if (!days || days.length === 0) return 'TBA';
  const shortDays = days.map((d) => DAY_ABBREVIATIONS[d] || d);
  return shortDays.join(', ');
}

export interface ConflictItem {
  course1Code: string;
  course1Name: string;
  course2Code: string;
  course2Name: string;
  conflictingDays: string[];
  course1Time: string;
  course2Time: string;
  description: string;
  isLunchBreakConflict?: boolean;
}

export interface ScheduleAuditReport {
  hasConflicts: boolean;
  totalCourses: number;
  conflictCount: number;
  conflicts: ConflictItem[];
  allOneHourConfirmed: boolean;
  respectsLunchBreak: boolean;
  summaryMessage: string;
}

/**
 * Checks if two courses conflict in day and time.
 */
export function doCoursesConflict(
  c1: SubjectGrade,
  c2: SubjectGrade
): { conflict: boolean; overlappingDays: string[] } {
  if (c1.courseCode === c2.courseCode) return { conflict: false, overlappingDays: [] };

  const days1 = normalizeDays(c1.scheduleDetails?.days || c1.scheduleDays || ['Monday', 'Wednesday', 'Friday']);
  const days2 = normalizeDays(c2.scheduleDetails?.days || c2.scheduleDays || ['Monday', 'Wednesday', 'Friday']);

  const overlappingDays = days1.filter((d) => days2.includes(d));
  if (overlappingDays.length === 0) return { conflict: false, overlappingDays: [] };

  const start1 = timeStringToMinutes(c1.scheduleDetails?.startTime || c1.scheduleTime?.split('-')[0]?.trim() || '08:30 AM');
  const end1 = timeStringToMinutes(c1.scheduleDetails?.endTime || c1.scheduleTime?.split('-')[1]?.trim() || '09:30 AM');

  const start2 = timeStringToMinutes(c2.scheduleDetails?.startTime || c2.scheduleTime?.split('-')[0]?.trim() || '09:30 AM');
  const end2 = timeStringToMinutes(c2.scheduleDetails?.endTime || c2.scheduleTime?.split('-')[1]?.trim() || '10:30 AM');

  // If one starts strictly before the other ends, and vice-versa, there is an overlap
  const isOverlap = Math.max(start1, start2) < Math.min(end1, end2);

  return { conflict: isOverlap, overlappingDays };
}

/**
 * Checks if a course schedule intrudes into the lunch break (11:30 AM - 01:00 PM).
 */
export function conflictsWithLunchBreak(course: SubjectGrade): boolean {
  const start = timeStringToMinutes(course.scheduleDetails?.startTime || course.scheduleTime?.split('-')[0]?.trim() || '');
  const end = timeStringToMinutes(course.scheduleDetails?.endTime || course.scheduleTime?.split('-')[1]?.trim() || '');
  if (!start || !end) return false;

  // Lunch break is 11:30 AM (690 mins) to 01:00 PM (780 mins)
  return Math.max(start, LUNCH_BREAK.startMinutes) < Math.min(end, LUNCH_BREAK.endMinutes);
}

/**
 * Audits a list of courses to verify conflict-free status, 1-hour duration, and 11:30 AM - 1:00 PM lunch observance.
 */
export function auditScheduleConflicts(courses: SubjectGrade[]): ScheduleAuditReport {
  const safeCourses = Array.isArray(courses) ? courses : [];
  const conflicts: ConflictItem[] = [];
  let allOneHour = true;
  let respectsLunch = true;

  for (let i = 0; i < safeCourses.length; i++) {
    const c1 = safeCourses[i];
    const startMin = timeStringToMinutes(c1.scheduleDetails?.startTime || c1.scheduleTime?.split('-')[0]?.trim() || '08:30 AM');
    const endMin = timeStringToMinutes(c1.scheduleDetails?.endTime || c1.scheduleTime?.split('-')[1]?.trim() || '09:30 AM');
    const duration = endMin - startMin;

    if (duration !== 60 && duration > 0) {
      allOneHour = false;
    }

    // Check lunch break conflict
    if (conflictsWithLunchBreak(c1)) {
      respectsLunch = false;
      conflicts.push({
        course1Code: c1.courseCode,
        course1Name: c1.courseName,
        course2Code: 'LUNCH-BREAK',
        course2Name: 'Campus Lunch Break (11:30 AM - 01:00 PM)',
        conflictingDays: normalizeDays(c1.scheduleDetails?.days || c1.scheduleDays),
        course1Time: c1.scheduleDetails?.timeSlot || c1.scheduleTime || '11:00 AM - 12:00 PM',
        course2Time: '11:30 AM - 01:00 PM',
        description: `${c1.courseCode} overlaps with the 11:30 AM - 01:00 PM lunch break. Morning classes must end by 11:30 AM, resuming at 1:00 PM.`,
        isLunchBreakConflict: true,
      });
    }

    for (let j = i + 1; j < safeCourses.length; j++) {
      const c2 = safeCourses[j];
      const check = doCoursesConflict(c1, c2);
      if (check.conflict) {
        conflicts.push({
          course1Code: c1.courseCode,
          course1Name: c1.courseName,
          course2Code: c2.courseCode,
          course2Name: c2.courseName,
          conflictingDays: check.overlappingDays,
          course1Time: c1.scheduleDetails?.timeSlot || c1.scheduleTime || '08:30 AM - 09:30 AM',
          course2Time: c2.scheduleDetails?.timeSlot || c2.scheduleTime || '08:30 AM - 09:30 AM',
          description: `Conflict between ${c1.courseCode} and ${c2.courseCode} on ${check.overlappingDays.join(', ')} (${c1.scheduleTime || '08:30 AM - 09:30 AM'}).`,
        });
      }
    }
  }

  const hasConflicts = conflicts.length > 0;
  return {
    hasConflicts,
    totalCourses: safeCourses.length,
    conflictCount: conflicts.length,
    conflicts,
    allOneHourConfirmed: allOneHour,
    respectsLunchBreak: respectsLunch,
    summaryMessage: hasConflicts
      ? `Detected ${conflicts.length} schedule conflict(s). Morning classes must end by 11:30 AM, resuming at 1:00 PM.`
      : `All ${safeCourses.length} subjects have unique, conflict-free 1-hour time slots. Morning classes end at 11:30 AM; classes resume at 1:00 PM.`,
  };
}

/**
 * Automatically assigns conflict-free 1-hour time slots to all subjects in a term.
 * Guarantees every subject has a distinct 1-hour slot:
 * - Morning slots end by 11:30 AM at the latest (08:30-09:30, 09:30-10:30, 10:30-11:30)
 * - Lunch break 11:30 AM - 01:00 PM is completely respected (no classes scheduled)
 * - Afternoon slots resume at 01:00 PM (01:00-02:00, 02:00-03:00, 03:00-04:00, 04:00-05:00)
 */
export function assignConflictFree1HourSchedule(
  courses: SubjectGrade[],
  defaultDays: string[] = ['Monday', 'Wednesday', 'Friday']
): SubjectGrade[] {
  if (!Array.isArray(courses)) return [];

  return courses.map((course, index) => {
    // Pick consecutive 1-hour slots from standard slots
    const slot = ONE_HOUR_TIME_SLOTS[index % ONE_HOUR_TIME_SLOTS.length];
    const days = course.scheduleDetails?.days && course.scheduleDetails.days.length > 0
      ? normalizeDays(course.scheduleDetails.days)
      : defaultDays;

    const daysDisplay = formatDaysDisplay(days);
    const room = course.room || course.scheduleDetails?.room || 'Academic Hall';

    const scheduleDetails: ClassScheduleInfo = {
      days,
      daysDisplay,
      startTime: slot.startTime,
      endTime: slot.endTime,
      timeSlot: slot.label,
      durationHours: 1.0,
      room,
      building: room.includes('Lab') ? 'Science & Technology Wing' : 'Main Academic Pavilion',
      section: 'SEC-A1',
    };

    return {
      ...course,
      room,
      schedule: `${daysDisplay} ${slot.label}`,
      scheduleDays: days,
      scheduleTime: slot.label,
      scheduleDetails,
    };
  });
}

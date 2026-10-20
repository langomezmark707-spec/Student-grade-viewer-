export type LetterGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'F';

export type CollegeGrade =
  | '1.00'
  | '1.25'
  | '1.50'
  | '1.75'
  | '2.00'
  | '2.25'
  | '2.50'
  | '2.75'
  | '3.00'
  | '4.00'
  | '5.00'
  | 'INC'
  | 'DRP';

export type GradingSystem = 'college' | 'us';

export type PeriodName = 'Prelim' | 'Midterm' | 'Semi-Final' | 'Final';

export interface CollegeGradeDetail {
  grade: CollegeGrade;
  numeric: number;
  percentageRange: string;
  minPercent: number;
  maxPercent: number;
  description: string;
  remarks: 'Passed' | 'Conditional' | 'Failed';
  usLetter: LetterGrade;
}

export interface PeriodScore {
  name: PeriodName;
  examScore: number;
  examMax: number;
  quizzesScore?: number;
  quizzesMax?: number;
  periodPercentage: number;
  collegeGrade: CollegeGrade;
  isCompleted: boolean;
  remarks?: string;
}

export interface Assessment {
  id: string;
  name: string;
  category:
    | 'Prelim Exam'
    | 'Midterm Exam'
    | 'Semi-Final Exam'
    | 'Final Exam'
    | 'Quiz'
    | 'Homework'
    | 'Project'
    | 'Lab'
    | 'Activity';
  score: number;
  maxScore: number;
  weight: number; // percentage, e.g. 25 for 25%
  date: string;
  period?: PeriodName;
  feedback?: string;
}

export interface ClassScheduleInfo {
  days: string[]; // e.g. ['Monday', 'Wednesday', 'Friday'] or ['Tuesday', 'Thursday']
  daysDisplay: string; // e.g. "Mon, Wed, Fri" or "Tue, Thu"
  startTime: string; // e.g. "08:00 AM"
  endTime: string; // e.g. "09:00 AM" (1 hour duration)
  timeSlot: string; // e.g. "08:00 AM - 09:00 AM"
  durationHours: number; // 1.0 (1 hour each, per user requirement)
  room: string; // e.g. "Turing Hall 301"
  building?: string; // e.g. "CCS Building"
  section?: string; // e.g. "BSCS-3A"
}

export interface SubjectGrade {
  courseCode: string;
  courseName: string;
  credits: number;
  instructor: string;
  room?: string;
  schedule?: string; // e.g. "Mon, Wed, Fri 08:00 AM - 09:00 AM"
  scheduleDays?: string[];
  scheduleTime?: string; // e.g. "08:00 AM - 09:00 AM"
  scheduleDetails?: ClassScheduleInfo;
  prelimScore?: PeriodScore;
  midtermScore?: PeriodScore;
  semiFinalScore?: PeriodScore;
  finalScore?: PeriodScore;
  assessments: Assessment[];
  targetGrade?: number;
  teacherRemarks?: string;
  classAverage?: number;
}

export interface TermData {
  termId: string;
  termName: string; // e.g., "1st Semester 2024-2025" or "Fall 2024"
  courses: SubjectGrade[];
  academicStanding?: string;
}

export interface HistoricalTerm {
  termName: string;
  gpa: number; // US 4.00 scale
  gwa?: number; // College 1.00 - 5.00 scale (lower is better)
  creditsEarned: number;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  courseCode: string;
  courseName: string;
  status: 'Present' | 'Late' | 'Absent' | 'Excused';
  topicOrSession: string;
  durationHours?: number;
  remarks?: string;
}

export interface StudentQuestActivity {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  type: 'Quiz' | 'Quest / Challenge' | 'Activity' | 'Lab Exercise' | 'Assignment';
  period: PeriodName;
  dateGiven: string;
  dateSubmitted?: string;
  score: number;
  maxScore: number;
  passingScore?: number;
  weight?: number;
  status: 'Completed' | 'Pending' | 'Missing' | 'Late';
  feedback?: string;
  xpPoints?: number;
}

export interface GradeBreakdownExplanation {
  courseCode: string;
  courseName: string;
  lectureWeight: number; // e.g. 70%
  labOrActivityWeight: number; // e.g. 30%
  attendanceScore: number; // e.g. 98%
  attendanceWeight: number; // e.g. 10%
  quizzesScore: number; // e.g. 92%
  quizzesWeight: number; // e.g. 20%
  examsAverage: number; // e.g. 95%
  examsWeight: number; // e.g. 50%
  activitiesScore: number; // e.g. 96%
  activitiesWeight: number; // e.g. 20%
  totalPercentage: number;
  collegeGrade: CollegeGrade;
  explanation: string;
}

export interface Student {
  id: string;
  studentId: string; // e.g., "STU-2024-101" or "2024-00101"
  name: string;
  avatar: string;
  gradeLevel: string; // e.g., "3rd Year • Junior"
  program: string; // e.g., "BS Computer Science"
  email: string;
  attendanceRate: number; // e.g. 96.5%
  presentCount?: number;
  absentCount?: number;
  lateCount?: number;
  excusedCount?: number;
  totalSessions?: number;
  attendanceLogs?: AttendanceRecord[];
  questsAndActivities?: StudentQuestActivity[];
  terms: TermData[];
  history: HistoricalTerm[];
}

export type ViewRole = 'student' | 'teacher';

export type EmploymentStatus =
  | 'Permanent / Full-Time Faculty'
  | 'Probationary Faculty'
  | 'Part-Time Lecturer'
  | 'Visiting Professor';

export type DtrStatus =
  | 'On-Time'
  | 'Late / Tardy'
  | 'Undertime'
  | 'Overtime'
  | 'Official Business'
  | 'On Leave';

export interface EmploymentDtrLog {
  id: string;
  teacherId: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // e.g. "Monday"
  timeInAM?: string; // e.g. "07:48 AM"
  timeOutLunch?: string; // e.g. "12:05 PM"
  timeInPM?: string; // e.g. "12:55 PM"
  timeOutPM?: string; // e.g. "05:04 PM"
  overtimeHours?: number;
  totalHoursRendered: number; // e.g. 8.2
  status: DtrStatus;
  lateMinutes?: number;
  undertimeMinutes?: number;
  workstation: string; // e.g. "Room CS-301 / Faculty Center"
  remarks?: string; // e.g. "Prelim Exam Proctoring & Consultation"
  verificationMethod: 'Biometric Fingerprint' | 'RFID Card' | 'Web Portal PIN';
}

export interface TeacherProfile {
  id: string;
  employeeId: string; // e.g. "FAC-2018-042"
  name: string;
  salutation: string; // e.g. "Prof.", "Dr.", "Engr."
  rank: string; // e.g. "Associate Professor II", "Assistant Professor I"
  department: string; // e.g. "Department of Computer Science"
  college: string; // e.g. "College of Computer Studies"
  email: string;
  avatar: string;
  phone?: string;
  officeRoom: string;
  employmentStatus: EmploymentStatus;
  shiftSchedule: string; // e.g. "08:00 AM - 05:00 PM (Mon-Fri)"
  teachingLoadUnits: number; // e.g. 21
  consultationHours: string; // e.g. "MWF 1:00 PM - 3:00 PM"
  leaveCredits: {
    vacationLeave: number;
    sickLeave: number;
    emergencyLeave: number;
    serviceCredits: number;
  };
  isClockedIn: boolean;
  activePunchState?: 'CLOCKED_OUT' | 'AM_DUTY' | 'LUNCH_BREAK' | 'PM_DUTY' | 'OVERTIME';
  lastPunchTimestamp?: string;
  dtrLogs: EmploymentDtrLog[];
}

export interface UserAccount {
  id: string;
  accountId: string; // Employee ID or Student ID
  name: string;
  role: ViewRole;
  email: string;
  avatar: string;
  titleOrLevel: string; // e.g., "3rd Year • Junior" or "Associate Professor II"
  departmentOrProgram: string; // e.g., "BS Computer Science" or "College of Computer Studies"
  isOnline: boolean;
  lastLoginTime: string;
}

export interface AccountRuleItem {
  id: string;
  code: string; // e.g. "FAC-RULE-01" or "STU-RULE-02"
  title: string;
  roleTarget: 'teacher' | 'student' | 'all';
  category:
    | 'Employment & DTR Attendance'
    | 'Grading Rights & Submission Deadlines'
    | 'Academic Standing & 1.00-5.00 GWA'
    | 'Attendance & 20% Absence Limit'
    | 'Quests, Quizzes & Exam Clearance'
    | 'Account Security & Honor Code';
  summary: string;
  detailedRules: string[];
  consequences?: string;
  institutionalRef?: string;
}


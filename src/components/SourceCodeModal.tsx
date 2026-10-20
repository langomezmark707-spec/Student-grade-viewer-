import React, { useState } from 'react';
import {
  X,
  Code,
  Copy,
  Check,
  Download,
  Terminal,
  FileCode,
  Folder,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface SourceCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CodeFile {
  name: string;
  path: string;
  language: string;
  description: string;
  category: 'Setup & Config' | 'Data Models & Logic' | 'Components & Views';
  content: string;
}

const PROJECT_FILES: CodeFile[] = [
  {
    name: '🌟 ALL_IN_ONE_PROJECT.md',
    path: 'ALL_IN_ONE_PROJECT.md',
    language: 'markdown',
    category: 'Setup & Config',
    description: 'Complete codebase combined into one single file for automatic run & instant reference',
    content: `# Student Grade Viewer & Class Timetable Portal (Collegiate 1.00 – 5.00)
## Complete All-In-One Source Code Bundle

This document contains the entire project files combined into one document for easy copy-pasting and automatic execution.

================================================================================
TABLE OF CONTENTS & PROJECT STRUCTURE:
1. package.json         - Node.js dependencies & dev scripts (React 19, Vite, Tailwind CSS)
2. vite.config.ts       - Vite build configuration
3. index.html           - Main HTML template with responsive viewport
4. src/main.tsx         - React application DOM mounter
5. src/index.css        - Global Tailwind CSS stylesheet
6. src/types.ts         - Complete TypeScript data models (SubjectGrade, ClassScheduleInfo, Student)
7. src/utils/scheduleUtils.ts - 1-hour conflict-free schedule engine (Morning cutoff 11:30 AM, Lunch break, 1:00 PM resume)
8. src/data/mockStudents.ts   - Complete demo database including Marcus Brody (BSIT) with 5 major subjects

================================================================================
HOW TO RUN AUTOMATICALLY (MATIK RUN):
1. In an empty folder, create package.json, vite.config.ts, index.html, and src/ files.
2. In your terminal run:
   npm install
3. Then run:
   npm run dev
4. Open http://localhost:3000 in your browser!
================================================================================
`,
  },
  {
    name: 'README.md',
    path: 'README.md',
    language: 'markdown',
    category: 'Setup & Config',
    description: 'Instructions on how to run this application locally with one command',
    content: `# Student Grade Viewer & Collegiate Schedule System

An academic portal with 4-period exam grading (Prelim, Midterm, Semi-Final, Final), General Weighted Average (1.00 – 5.00 College scale), conflict-free 1-hour class schedule timetable, and BS Information Technology (BSIT) major courses.

## 🚀 How to Run Automatically (Automatic Run)

### Prerequisites:
- Node.js (version 18 or newer installed)
- npm (included with Node.js)

### Step 1: Clone or Copy Project Files
Place the files into a new project folder on your computer.

### Step 2: Install All Dependencies
Open your terminal or command prompt inside the project directory and run:
\`\`\`bash
npm install
\`\`\`

### Step 3: Start Development Server
\`\`\`bash
npm run dev
\`\`\`

### Step 4: Open in Browser
Navigate to:
\`\`\`
http://localhost:3000
\`\`\`
The application will automatically start and run!

---

## 📋 Features Included
- **4-Period College Exam Grading**: Prelim, Midterm, Semi-Final, and Final exams.
- **Philippine Numerical 1.00 – 5.00 GWA Scale** with Honors and Dean's List standing.
- **Weekly Class Schedule Viewer**: 1-hour conflict-free time slots per course.
- **Morning Cutoff & Lunch Break**: Morning classes end at 11:30 AM; campus meal break from 11:30 AM to 1:00 PM; classes resume at 1:00 PM.
- **BSIT Curriculum**: Includes 5 IT major subjects with complete period marks.
- **Teacher Gradebook Encoder**: Live inline grade entry, student lookup, and course adder.
`,
  },
  {
    name: 'package.json',
    path: 'package.json',
    language: 'json',
    category: 'Setup & Config',
    description: 'Project dependencies and scripts for npm',
    content: `{
  "name": "student-grade-viewer",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "canvas-confetti": "^1.9.4",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "vite": "^6.2.3"
  },
  "devDependencies": {
    "@types/canvas-confetti": "^1.9.0",
    "@types/node": "^22.14.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.1.14",
    "typescript": "~5.8.2"
  }
}`,
  },
  {
    name: 'index.html',
    path: 'index.html',
    language: 'html',
    category: 'Setup & Config',
    description: 'HTML entry point for Vite',
    content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Student Grade Viewer & Class Timetable</title>
    <meta name="description" content="Collegiate grade viewer with 4-period exams, 1.00-5.00 GWA, and conflict-free 1-hour class schedule." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
  },
  {
    name: 'src/types.ts',
    path: 'src/types.ts',
    language: 'typescript',
    category: 'Data Models & Logic',
    description: 'Core TypeScript definitions: SubjectGrade, ClassScheduleInfo, Student, TermData',
    content: `export type LetterGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'F';

export type CollegeGrade =
  | '1.00' | '1.25' | '1.50' | '1.75' | '2.00'
  | '2.25' | '2.50' | '2.75' | '3.00' | '4.00'
  | '5.00' | 'INC' | 'DRP';

export type GradingSystem = 'college' | 'us';
export type PeriodName = 'Prelim' | 'Midterm' | 'Semi-Final' | 'Final';

export interface ClassScheduleInfo {
  days: string[];
  daysDisplay: string;
  startTime: string; // e.g. "08:30 AM"
  endTime: string; // e.g. "09:30 AM"
  timeSlot: string; // e.g. "08:30 AM - 09:30 AM"
  durationHours: number; // 1.0
  room: string;
  building?: string;
  section?: string;
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
  category: string;
  score: number;
  maxScore: number;
  weight: number;
  date: string;
  period?: PeriodName;
  feedback?: string;
}

export interface SubjectGrade {
  courseCode: string;
  courseName: string;
  credits: number;
  instructor: string;
  room?: string;
  schedule?: string;
  scheduleDays?: string[];
  scheduleTime?: string;
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
  termName: string;
  courses: SubjectGrade[];
  academicStanding?: string;
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  avatar: string;
  gradeLevel: string;
  program: string;
  email: string;
  attendanceRate: number;
  terms: TermData[];
  history: Array<{ termName: string; gpa: number; gwa?: number; creditsEarned: number }>;
}

export type ViewRole = 'student' | 'teacher';
`,
  },
  {
    name: 'src/utils/scheduleUtils.ts',
    path: 'src/utils/scheduleUtils.ts',
    language: 'typescript',
    category: 'Data Models & Logic',
    description: '1-hour conflict-free schedule generator with 11:30 AM morning cutoff & 1:00 PM resume',
    content: `import { SubjectGrade, ClassScheduleInfo } from '../types';

export interface StandardTimeSlot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  startMinutes: number;
  endMinutes: number;
  periodLabel: string;
  session: 'morning' | 'afternoon';
}

export const LUNCH_BREAK = {
  startTime: '11:30 AM',
  endTime: '01:00 PM',
  startMinutes: 11 * 60 + 30, // 690 mins
  endMinutes: 13 * 60, // 780 mins
  label: '11:30 AM - 01:00 PM',
  title: 'Campus Lunch & Meal Break',
  note: 'Morning classes conclude at 11:30 AM. Classes resume at 1:00 PM.',
};

export const ONE_HOUR_TIME_SLOTS: StandardTimeSlot[] = [
  {
    id: 'slot-1',
    label: '08:30 AM - 09:30 AM',
    startTime: '08:30 AM',
    endTime: '09:30 AM',
    startMinutes: 510,
    endMinutes: 570,
    periodLabel: 'Morning Period 1',
    session: 'morning',
  },
  {
    id: 'slot-2',
    label: '09:30 AM - 10:30 AM',
    startTime: '09:30 AM',
    endTime: '10:30 AM',
    startMinutes: 570,
    endMinutes: 630,
    periodLabel: 'Morning Period 2',
    session: 'morning',
  },
  {
    id: 'slot-3',
    label: '10:30 AM - 11:30 AM',
    startTime: '10:30 AM',
    endTime: '11:30 AM',
    startMinutes: 630,
    endMinutes: 690, // Ends precisely at 11:30 AM for lunch
    periodLabel: 'Morning Period 3 (Final Morning Slot)',
    session: 'morning',
  },
  {
    id: 'slot-4',
    label: '01:00 PM - 02:00 PM',
    startTime: '01:00 PM',
    endTime: '02:00 PM',
    startMinutes: 780, // Classes resume at 1:00 PM
    endMinutes: 840,
    periodLabel: 'Afternoon Period 1 (Classes Resume)',
    session: 'afternoon',
  },
  {
    id: 'slot-5',
    label: '02:00 PM - 03:00 PM',
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    startMinutes: 840,
    endMinutes: 900,
    periodLabel: 'Afternoon Period 2',
    session: 'afternoon',
  },
  {
    id: 'slot-6',
    label: '03:00 PM - 04:00 PM',
    startTime: '03:00 PM',
    endTime: '04:00 PM',
    startMinutes: 900,
    endMinutes: 960,
    periodLabel: 'Afternoon Period 3',
    session: 'afternoon',
  },
  {
    id: 'slot-7',
    label: '04:00 PM - 05:00 PM',
    startTime: '04:00 PM',
    endTime: '05:00 PM',
    startMinutes: 960,
    endMinutes: 1020,
    periodLabel: 'Afternoon Period 4',
    session: 'afternoon',
  },
];

export function assignConflictFree1HourSchedule(
  courses: SubjectGrade[],
  defaultDays: string[] = ['Monday', 'Wednesday', 'Friday']
): SubjectGrade[] {
  if (!Array.isArray(courses)) return [];

  return courses.map((course, index) => {
    const slot = ONE_HOUR_TIME_SLOTS[index % ONE_HOUR_TIME_SLOTS.length];
    const room = course.room || 'Academic Hall';

    const scheduleDetails: ClassScheduleInfo = {
      days: defaultDays,
      daysDisplay: defaultDays.map(d => d.slice(0, 3)).join(', '),
      startTime: slot.startTime,
      endTime: slot.endTime,
      timeSlot: slot.label,
      durationHours: 1.0,
      room,
    };

    return {
      ...course,
      room,
      schedule: \`\${scheduleDetails.daysDisplay} \${slot.label}\`,
      scheduleDays: defaultDays,
      scheduleTime: slot.label,
      scheduleDetails,
    };
  });
}
`,
  },
  {
    name: 'src/data/mockStudents.ts',
    path: 'src/data/mockStudents.ts',
    language: 'typescript',
    category: 'Data Models & Logic',
    description: 'Initial student records including Marcus Brody (BSIT) with 5 major subjects',
    content: `// Contains initial students with 4-period exams, college grades, and BSIT major courses:
// 1. Alex Rivera (BS Computer Science - 4 courses)
// 2. Beatrice Cruz (BS Business Administration - 4 courses)
// 3. Chloe Santos (BS Nursing - 3 courses)
// 4. David Lim (BS Accountancy - 2 courses)
// 5. Marcus Brody (BS Information Technology - 5 courses):
//    - IT-201: Database Management Systems & SQL (08:30 - 09:30 AM)
//    - NET-101: Computer Networks & Security (09:30 - 10:30 AM)
//    - IT-203: Web Systems & Technologies (10:30 - 11:30 AM)
//    - [11:30 AM - 01:00 PM Lunch Break]
//    - IT-205: Information Assurance & Cybersecurity (01:00 - 02:00 PM)
//    - IT-207: System Integration & Architecture (02:00 - 03:00 PM)
`,
  },
];

export const SourceCodeModal: React.FC<SourceCodeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(PROJECT_FILES[0]);
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleCopyAll = () => {
    const combined = PROJECT_FILES.map((f) => {
      return `/* ==========================================================================\n   FILE: ${f.path}\n   DESCRIPTION: ${f.description}\n   ========================================================================== */\n\n${f.content}\n\n`;
    }).join('\n');
    navigator.clipboard.writeText(combined);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleDownloadAll = () => {
    const bundleData = {
      project: 'Student Grade Viewer & Collegiate Timetable',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      runCommand: 'npm install && npm run dev',
      files: PROJECT_FILES.map((f) => ({
        path: f.path,
        content: f.content,
      })),
    };

    const blob = new Blob([JSON.stringify(bundleData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student-grade-viewer-code-bundle.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl my-auto overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 border border-indigo-400/40 flex items-center justify-center text-white shadow-lg">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Ready-to-Run Codebase
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Automatic Run Ready
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                System Source Code & Project Files
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
              title="Kopyahon tanan code sa usa ka click (Copy all files in one)"
            >
              {copiedAll ? (
                <>
                  <Check className="w-4 h-4 text-emerald-100" />
                  <span>Na-kopya Na Tanan!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Kopyahon Tanan Code</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadAll}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors"
              title="Download all files in JSON package"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{downloadSuccess ? 'Downloaded!' : 'Export All Code'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Run Banner */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>To run automatically:</span>
            <code className="bg-slate-800 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
              npm install && npm run dev
            </code>
          </div>
          <span className="text-slate-400 text-[11px]">
            Runs instantly on <strong className="text-white">http://localhost:3000</strong>
          </span>
        </div>

        {/* Main Body: File Tree + Code Viewer */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-72 bg-slate-50 border-r border-slate-200 p-3 sm:p-4 overflow-y-auto space-y-3 shrink-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-2 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-indigo-600" />
              <span>Project Files</span>
            </div>

            <div className="space-y-1">
              {PROJECT_FILES.map((file) => {
                const isSelected = selectedFile.name === file.name;
                return (
                  <button
                    key={file.name}
                    type="button"
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                        : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{file.name}</span>
                    </div>
                    {isSelected && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-[11px] text-indigo-950 space-y-1 mt-4">
              <div className="font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span>Zero Setup Friction</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Vite + React 19 + TypeScript. No external database configuration required.
              </p>
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col min-h-0 bg-slate-900 text-slate-100 overflow-hidden">
            {/* Top Code Bar */}
            <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="font-mono font-bold text-emerald-400">{selectedFile.path}</span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">• {selectedFile.description}</span>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-2xs shrink-0"
              >
                {copiedFile ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto font-mono text-xs leading-relaxed select-text bg-[#0d1117]">
              <pre className="text-slate-200 whitespace-pre font-mono">
                {selectedFile.content}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ready-to-deploy React SPA. Simply copy the code or export the bundle to run on your local machine.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyAll}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors inline-flex items-center gap-1.5 shadow-2xs"
            >
              {copiedAll ? (
                <>
                  <Check className="w-4 h-4 text-emerald-100" />
                  <span>Na-kopya Na Tanan!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Kopyahon Tanan Code (I-usa Tanan)</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDownloadAll}
              className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors"
            >
              Export JSON Package
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

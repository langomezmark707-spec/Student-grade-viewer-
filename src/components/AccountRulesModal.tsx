import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  BookOpen,
  Award,
  AlertTriangle,
  Search,
  CheckCircle2,
  FileText,
  Printer,
  Sparkles,
  Scale,
} from 'lucide-react';

interface StudentRule {
  id: string;
  code: string;
  title: string;
  category: string;
  summary: string;
  detailedRules: string[];
  consequences?: string;
  reference?: string;
}

const STUDENT_GRADE_RULES: StudentRule[] = [
  {
    id: 'stu-gwa-01',
    code: 'GWA-RULE-01',
    title: 'General Weighted Average (GWA) & College Dean\'s List Standing',
    category: 'GWA & Academic Honors',
    summary:
      'Collegiate academic standing is evaluated using the numerical General Weighted Average (GWA) on a scale of 1.000 (Highest) to 5.000 (Failed).',
    detailedRules: [
      'GWA Formula: Sum of (Course Grade × Course Units) ÷ Total Enrolled Units for the semester.',
      "Dean's List / President's List Honors: Term GWA must be 1.750 or better, minimum of 15 academic units, with NO grade below 2.50 in any subject.",
      'Latin Honors at Graduation: Summa Cum Laude (1.000 – 1.200), Magna Cum Laude (1.201 – 1.450), Cum Laude (1.451 – 1.750).',
      'Retention & Academic Warning: A GWA exceeding 3.000 places a student on academic probation with a reduced unit load.',
    ],
    consequences:
      'Any grade of 5.00 in a major prerequisite subject requires retaking the course before enrolling in subsequent curriculum courses.',
    reference: 'CHED Higher Education Standards • University Student Handbook Art. IX',
  },
  {
    id: 'stu-att-02',
    code: 'ATT-RULE-02',
    title: '20% Maximum Absence Rule & Attendance Grade Contribution',
    category: 'Class Attendance & Punctuality',
    summary:
      'Regular class attendance is mandatory. Students who accumulate unexcused absences exceeding 20% of total contact hours shall be officially dropped or failed.',
    detailedRules: [
      'Maximum Allowed Absences: For a standard 3-unit subject (54 total hours), the allowable unexcused absence limit is four (4) sessions.',
      'Tardiness Equivalency: Three (3) instances of being marked Late are counted as one (1) full unexcused absence.',
      'Attendance Grade Share: Class attendance directly contributes 10% towards your final transmuted course grade.',
      'Medical & Valid Excuses: Medical certificates must be certified by the University Health Clinic within 48 hours of return to convert an absence into Excused.',
    ],
    consequences:
      'Exceeding the 20% limit requires the instructor to assign a grade of 5.00 (Failed due to absences) or DRP (Dropped), disqualifying from the Final Exam.',
    reference: 'CHED Manual of Regulations for Private Higher Education (MORPHE) Sec. 101',
  },
  {
    id: 'stu-exam-03',
    code: 'EXAM-RULE-03',
    title: '4-Period Major Examinations (Prelim, Midterm, Semi-Final, Final)',
    category: 'Examinations & Assessments',
    summary:
      'All students are required to take all four (4) periodic major exams to receive a completed collegiate mark.',
    detailedRules: [
      'Exam Contribution: The 4 major examinations together carry a 50% weight in the total course grade composition.',
      'Special / Makeup Exams: An unexcused absence on the examination date yields an automatic 0 score. Excused makeup exams must be arranged within 5 school days.',
      'Periodic Trajectory Tracking: Prelim, Midterm, and Semi-Final scores allow students to calculate what score they need in the Final Exam to maintain or achieve their target GWA.',
      'Missing Final Exam: Missing the Final Exam without verified institutional clearance leads to an INC (Incomplete) mark, which lapses to 5.00 if unremoved within 1 academic year.',
    ],
    consequences:
      'Unresolved Incomplete (INC) marks prevent graduation clearance and enrollment in prerequisite-dependent advanced subjects.',
    reference: 'University Academic Examination Regulations Art. IV',
  },
  {
    id: 'stu-breakdown-04',
    code: 'GRADE-RULE-04',
    title: 'Transparent 50-20-20-10 Grade Composition & Transmutation',
    category: 'Grading Transparency',
    summary:
      'Every subject course grade is computed transparently based on standardized collegiate components transmuted to the 1.00 – 5.00 scale.',
    detailedRules: [
      'Standard Weight Breakdown: 50% Periodic Major Exams + 20% Quizzes & Quests + 20% Laboratory & Class Activities + 10% Attendance.',
      'Decimal Transmutation Table: 97-100% (1.00), 94-96% (1.25), 91-93% (1.50), 88-90% (1.75), 85-87% (2.00), 82-84% (2.25), 79-81% (2.50), 76-78% (2.75), 75% (3.00 Passing), Below 75% (5.00 Failed).',
      'Right to Inspect Breakdown: Students have the right to view their itemized quiz, quest, activity, and exam raw scores to understand exactly why they received their grade.',
      'Grade Appeal Window: Students may file an inquiry within 5 school days following grade posting if there is a computational discrepancy.',
    ],
    consequences:
      'Raw scores below 75% receive an official grade of 5.00 (Failed) and do not earn academic unit credits.',
    reference: 'CHED Memorandum Order No. 40 • College Grading System Guidelines',
  },
];

interface AccountRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountRulesModal: React.FC<AccountRulesModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  if (!isOpen) return null;

  const categories = ['ALL', 'GWA & Academic Honors', 'Class Attendance & Punctuality', 'Examinations & Assessments', 'Grading Transparency'];

  const filteredRules = STUDENT_GRADE_RULES.filter((r) => {
    if (selectedCategory !== 'ALL' && r.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchSummary = r.summary.toLowerCase().includes(q);
      const matchCode = r.code.toLowerCase().includes(q);
      const matchDetails = r.detailedRules.some((d) => d.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchCode && !matchDetails) return false;
    }
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 border border-indigo-400/40 flex items-center justify-center text-white shadow-lg">
              <Scale className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Collegiate Academic Guidelines
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                Student Academic & Grade Rules
              </h2>
              <p className="text-xs text-indigo-200 mt-0.5">
                Official rules on GWA computation, 4-period exams, 20% attendance policy, ug honors
              </p>
            </div>
          </div>
        </div>

        {/* Filter subheader */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rules (e.g., GWA, 20% absence, Dean's List, prelim, 1.25)..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All Rule Categories' : cat}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shrink-0"
              title="Print Academic Rules"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filteredRules.map((r) => (
            <div key={r.id} className="p-5 rounded-2xl border border-indigo-100 bg-white shadow-2xs hover:border-indigo-200 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-slate-900 text-white">
                  {r.code}
                </span>
                <span className="text-[11px] font-bold text-indigo-700">
                  {r.category}
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900">{r.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{r.summary}</p>

              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Operational Guidelines:
                </p>
                <ul className="space-y-1.5">
                  {r.detailedRules.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50 p-2 rounded-xl">
                      <span className="w-4 h-4 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {r.consequences && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Sanction / Consequence: </strong>
                    <span>{r.consequences}</span>
                  </div>
                </div>
              )}

              {r.reference && (
                <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 font-medium">
                  <FileText className="w-3 h-3 text-slate-400" />
                  <span>Reference: {r.reference}</span>
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Student Academic Policy Handbook • Collegiate 1.00 – 5.00 Standards
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};

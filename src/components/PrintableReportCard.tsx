import React from 'react';
import { X, Printer, Download, Award, School, CheckCircle, GraduationCap } from 'lucide-react';
import { Student, TermData, GradingSystem } from '../types';
import {
  calculateCumulativeGpa,
  calculateTermGpa,
  calculateCumulativeGwa,
  calculateTermGwa,
  percentageToCollegeGrade,
  percentageToLetterGrade,
  getCollegeAcademicStanding,
  getAcademicStanding,
  getCoursePeriodScores,
} from '../utils/gradeUtils';

interface PrintableReportCardProps {
  student: Student;
  activeTerm: TermData;
  gradingSystem?: GradingSystem;
  onClose: () => void;
}

export const PrintableReportCard: React.FC<PrintableReportCardProps> = ({
  student,
  activeTerm,
  gradingSystem = 'college',
  onClose,
}) => {
  const cumGpa = calculateCumulativeGpa(student);
  const termGpa = calculateTermGpa(activeTerm?.courses || []);
  const cumGwa = calculateCumulativeGwa(student);
  const termGwa = calculateTermGwa(activeTerm?.courses || []);

  const standingCollege = getCollegeAcademicStanding(cumGwa.gwa, termGwa.hasFailingGrade);
  const standingUs = getAcademicStanding(cumGpa.gpa);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-w-none my-auto">
        {/* Modal Action Bar (Hidden when printing) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-200">
              Official Collegiate Transcript Preview (4 Exam Periods & GWA)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-10 space-y-6 text-slate-900 bg-white" id="printable-report">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Collegiate Academic Registry
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                  University Student Information System
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  Office of the University Registrar • Official Certificate of Grades (4-Period Exam Transcript)
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 text-xs font-black uppercase tracking-wider bg-slate-900 text-white rounded">
                  Certificate of Grades
                </span>
                <div className="text-[11px] text-slate-500 mt-1 font-mono">
                  Issued: {currentDate}
                </div>
              </div>
            </div>
          </div>

          {/* Student Info Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Student Name</span>
              <strong className="text-sm font-bold text-slate-900">{student.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Student ID Number</span>
              <span className="font-mono font-bold text-slate-800">{student.studentId}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Degree Program</span>
              <span className="font-medium text-slate-800">{student.program}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Academic Term</span>
              <strong className="font-bold text-slate-900">{activeTerm?.termName || 'Current Term'}</strong>
            </div>
          </div>

          {/* Course Grades Table with 4-Periods */}
          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="py-2.5 px-3">Course Code</th>
                  <th className="py-2.5 px-3 min-w-36">Descriptive Title</th>
                  <th className="py-2.5 px-2 text-center">Units</th>
                  <th className="py-2.5 px-2 text-center bg-indigo-50/40">Prelim</th>
                  <th className="py-2.5 px-2 text-center bg-indigo-50/40">Midterm</th>
                  <th className="py-2.5 px-2 text-center bg-indigo-50/40">Semi-Final</th>
                  <th className="py-2.5 px-2 text-center bg-indigo-50/40">Final</th>
                  <th className="py-2.5 px-3 text-center bg-slate-200/60 font-black">
                    Final Grade
                  </th>
                  <th className="py-2.5 px-3 text-center">Remarks</th>
                  <th className="py-2.5 px-3 text-right">Weighted Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(activeTerm?.courses || []).map((course) => {
                  const period = getCoursePeriodScores(course);
                  const college = period.finalCollegeGrade;
                  const weightedPoints = (college.numeric * course.credits).toFixed(2);

                  return (
                    <tr key={course.courseCode} className="text-slate-800">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {course.courseCode}
                      </td>
                      <td className="py-2.5 px-3 font-medium">
                        <div className="font-semibold text-slate-900">{course.courseName}</div>
                        <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                          <span>{course.instructor}</span>
                          {course.room && <span> • Room: {course.room}</span>}
                          {course.schedule && (
                            <span className="font-mono text-indigo-700 font-semibold">
                              {' '}• Schedule: {course.schedule} (1 hr)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold">
                        {course.credits}.0
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono bg-indigo-50/20 font-bold">
                        {period.prelim.examScore}% ({period.prelim.collegeGrade})
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono bg-indigo-50/20 font-bold">
                        {period.midterm.examScore}% ({period.midterm.collegeGrade})
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono bg-indigo-50/20 font-bold">
                        {period.semiFinal.examScore}% ({period.semiFinal.collegeGrade})
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono bg-indigo-50/20 font-bold">
                        {period.final.examScore}% ({period.final.collegeGrade})
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-black bg-slate-50">
                        <span className="px-2 py-0.5 rounded bg-slate-200/80">
                          {college.grade}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                            college.remarks === 'Passed'
                              ? 'text-emerald-700 bg-emerald-50'
                              : 'text-rose-700 bg-rose-50'
                          }`}
                        >
                          {college.remarks}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        {weightedPoints}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-300">
                <tr>
                  <td colSpan={2} className="py-3 px-3 uppercase text-[11px] text-slate-700">
                    Term Totals & General Weighted Average:
                  </td>
                  <td className="py-3 px-2 text-center font-mono font-black">
                    {termGwa.totalCredits} Units
                  </td>
                  <td colSpan={4} className="py-3 px-2 text-center text-[11px] text-slate-500 font-normal">
                    4 Periods Graded: Prelim (25%) + Midterm (25%) + Semi-Final (25%) + Final (25%)
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-black text-indigo-900 bg-indigo-50 border-x border-slate-300">
                    <div className="text-[10px] uppercase text-indigo-700 font-bold">SEMESTER GWA</div>
                    <div className="text-base text-indigo-950">{termGwa.gwa.toFixed(2)}</div>
                  </td>
                  <td colSpan={2} className="py-3 px-3 text-right font-mono font-black text-emerald-700">
                    {termGwa.allPassed ? 'ALL COURSES PASSED' : 'DEFICIENCY NOTED'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Academic Standing & Cumulative Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                Collegiate Academic Standing
              </div>
              <div className="text-base font-black text-indigo-900">
                {standingCollege.title}
              </div>
              <p className="text-slate-600 text-[11px]">
                {standingCollege.description}. Evaluated under standard collegiate retention criteria.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                Cumulative Academic Records
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-600">Cumulative GWA (1.00 – 5.00 Scale):</span>
                <span className="text-base font-black text-slate-900 font-mono">
                  {cumGwa.gwa.toFixed(2)} GWA
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-600">Total Enrolled Academic Units:</span>
                <span className="font-bold text-slate-900 font-mono">{cumGwa.totalCredits} Units</span>
              </div>
            </div>
          </div>

          {/* Grading Scale Legend & Signatures */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 space-y-3">
            <div>
              <strong className="text-slate-700">Official College Grading System: </strong>
              <span>
                1.00 (97-100% Excellent) • 1.25 (94-96% Superior) • 1.50 (91-93% Very Good) • 1.75 (88-90% Good) • 2.00 (85-87% Satisfactory) • 2.25 (82-84% Fairly Good) • 2.50 (79-81% Fair) • 2.75 (76-78% Passing) • 3.00 (75% Minimum Passing) • 4.00 (Conditional) • 5.00 (Failed). Formula: GWA = Sum(Course Grade × Units) / Sum(Units).
              </span>
            </div>

            <div className="pt-6 flex justify-between items-end">
              <div className="space-y-1">
                <div className="w-48 border-b border-slate-400" />
                <div className="text-[10px] font-medium text-slate-600 uppercase">
                  College Dean / Department Chair
                </div>
              </div>

              <div className="space-y-1 text-right">
                <div className="w-48 border-b border-slate-400 ml-auto" />
                <div className="text-[10px] font-medium text-slate-600 uppercase">
                  Office of the University Registrar
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

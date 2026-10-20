import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Edit3, CheckCircle2, Award, Calendar } from 'lucide-react';
import { Student, SubjectGrade, Assessment, TermData, GradingSystem, PeriodScore } from '../types';
import {
  calculateCoursePercentage,
  percentageToCollegeGrade,
  getCollegeGradeColorClass,
  getCoursePeriodScores,
  calculate4PeriodFinal,
} from '../utils/gradeUtils';

interface EditGradeModalProps {
  students: Student[];
  initialStudentId?: string;
  gradingSystem?: GradingSystem;
  onSaveStudents: (updatedStudents: Student[]) => void;
  onClose: () => void;
}

export const EditGradeModal: React.FC<EditGradeModalProps> = ({
  students,
  initialStudentId,
  gradingSystem = 'college',
  onSaveStudents,
  onClose,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || students[0]?.id || ''
  );

  const student = students.find((s) => s.id === selectedStudentId) || students[0];
  const activeTerm = student?.terms?.[0];

  const [selectedCourseCode, setSelectedCourseCode] = useState<string>(
    activeTerm?.courses?.[0]?.courseCode || ''
  );

  const course = activeTerm?.courses?.find((c) => c.courseCode === selectedCourseCode) || activeTerm?.courses?.[0];
  const initialPeriods = course ? getCoursePeriodScores(course) : null;

  // 4-Period Exam States
  const [prelim, setPrelim] = useState<number>(initialPeriods?.prelim.examScore || 90);
  const [midterm, setMidterm] = useState<number>(initialPeriods?.midterm.examScore || 90);
  const [semiFinal, setSemiFinal] = useState<number>(initialPeriods?.semiFinal.examScore || 90);
  const [finalExam, setFinalExam] = useState<number>(initialPeriods?.final.examScore || 90);

  // Local state for editing assessments
  const [assessments, setAssessments] = useState<Assessment[]>(
    course ? [...(course.assessments || [])] : []
  );
  const [teacherRemarks, setTeacherRemarks] = useState<string>(
    course?.teacherRemarks || ''
  );

  // New assessment form toggle
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<Assessment['category']>('Prelim Exam');
  const [newScore, setNewScore] = useState<number>(90);
  const [newMaxScore, setNewMaxScore] = useState<number>(100);
  const [newWeight, setNewWeight] = useState<number>(25);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Whenever student or course selector changes, reset
  const handleSelectStudent = (sId: string) => {
    setSelectedStudentId(sId);
    const s = students.find((item) => item.id === sId);
    if (s && s.terms?.[0]?.courses?.[0]) {
      const c = s.terms[0].courses[0];
      setSelectedCourseCode(c.courseCode);
      const p = getCoursePeriodScores(c);
      setPrelim(p.prelim.examScore);
      setMidterm(p.midterm.examScore);
      setSemiFinal(p.semiFinal.examScore);
      setFinalExam(p.final.examScore);
      setAssessments([...(c.assessments || [])]);
      setTeacherRemarks(c.teacherRemarks || '');
    }
  };

  const handleSelectCourse = (cCode: string) => {
    setSelectedCourseCode(cCode);
    const c = activeTerm?.courses?.find((item) => item.courseCode === cCode);
    if (c) {
      const p = getCoursePeriodScores(c);
      setPrelim(p.prelim.examScore);
      setMidterm(p.midterm.examScore);
      setSemiFinal(p.semiFinal.examScore);
      setFinalExam(p.final.examScore);
      setAssessments([...(c.assessments || [])]);
      setTeacherRemarks(c.teacherRemarks || '');
    }
  };

  const handleAddAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newAss: Assessment = {
      id: `ass-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      score: Number(newScore),
      maxScore: Number(newMaxScore),
      weight: Number(newWeight),
      date: new Date().toISOString().split('T')[0],
    };

    setAssessments([...assessments, newAss]);
    setNewName('');
    setIsAddingNew(false);
  };

  const handleSaveAll = () => {
    if (!student || !activeTerm || !course) return;

    const updatedStudents = students.map((s) => {
      if (s.id !== student.id) return s;

      const updatedTerms = s.terms.map((t) => {
        if (t.termId !== activeTerm.termId) return t;

        const updatedCourses = t.courses.map((c) => {
          if (c.courseCode !== course.courseCode) return c;

          const updatedPrelim: PeriodScore = {
            name: 'Prelim',
            examScore: prelim,
            examMax: 100,
            periodPercentage: prelim,
            collegeGrade: percentageToCollegeGrade(prelim).grade,
            isCompleted: true,
            remarks: percentageToCollegeGrade(prelim).remarks,
          };
          const updatedMidterm: PeriodScore = {
            name: 'Midterm',
            examScore: midterm,
            examMax: 100,
            periodPercentage: midterm,
            collegeGrade: percentageToCollegeGrade(midterm).grade,
            isCompleted: true,
            remarks: percentageToCollegeGrade(midterm).remarks,
          };
          const updatedSemi: PeriodScore = {
            name: 'Semi-Final',
            examScore: semiFinal,
            examMax: 100,
            periodPercentage: semiFinal,
            collegeGrade: percentageToCollegeGrade(semiFinal).grade,
            isCompleted: true,
            remarks: percentageToCollegeGrade(semiFinal).remarks,
          };
          const updatedFinal: PeriodScore = {
            name: 'Final',
            examScore: finalExam,
            examMax: 100,
            periodPercentage: finalExam,
            collegeGrade: percentageToCollegeGrade(finalExam).grade,
            isCompleted: true,
            remarks: percentageToCollegeGrade(finalExam).remarks,
          };

          return {
            ...c,
            prelimScore: updatedPrelim,
            midtermScore: updatedMidterm,
            semiFinalScore: updatedSemi,
            finalScore: updatedFinal,
            assessments,
            teacherRemarks,
          };
        });

        return { ...t, courses: updatedCourses };
      });

      return { ...s, terms: updatedTerms };
    });

    onSaveStudents(updatedStudents);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  const calc4Period = calculate4PeriodFinal(prelim, midterm, semiFinal, finalExam);
  const collegeColor = getCollegeGradeColorClass(calc4Period.collegeGrade.numeric);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>Teacher Gradebook Editor</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200">
                  4-Period Exam Entry
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Directly adjust Prelim, Midterm, Semi-Final, and Final exam grades.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Student
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => handleSelectStudent(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.studentId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Course
              </label>
              <select
                value={selectedCourseCode}
                onChange={(e) => handleSelectCourse(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500"
              >
                {activeTerm?.courses.map((c) => (
                  <option key={c.courseCode} value={c.courseCode}>
                    {c.courseCode} - {c.courseName}
                  </option>
                ))}
              </select>
            </div>

            {course && (
              <div className="sm:col-span-2 px-3 py-2 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs flex items-center justify-between text-indigo-950 flex-wrap gap-2">
                <span className="font-semibold">
                  🕒 Class Schedule: <strong className="font-mono">{course.schedule || 'MWF 08:00 AM - 09:00 AM (1 hr)'}</strong>
                </span>
                <span>• Room: <strong>{course.room || 'TBA'}</strong></span>
                <span className="text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-full text-[10px]">
                  ✓ 1-Hour Conflict-Free
                </span>
              </div>
            )}
          </div>

          {/* 4 Major Exam Period Inputs */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>4-Period Exam Score Entry (0 – 100%)</span>
              <span className="text-[11px] text-indigo-600 font-mono">
                Prelim + Midterm + Semi-Final + Final ÷ 4
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Prelim */}
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">
                  1. Prelim Exam
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={prelim}
                    onChange={(e) => setPrelim(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono font-bold text-slate-900 text-center"
                  />
                  <span className="text-xs font-bold text-slate-500">%</span>
                </div>
                <div className="text-[11px] font-bold text-indigo-700 mt-1 text-center font-mono">
                  Grade {percentageToCollegeGrade(prelim).grade}
                </div>
              </div>

              {/* Midterm */}
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">
                  2. Midterm Exam
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={midterm}
                    onChange={(e) => setMidterm(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono font-bold text-slate-900 text-center"
                  />
                  <span className="text-xs font-bold text-slate-500">%</span>
                </div>
                <div className="text-[11px] font-bold text-indigo-700 mt-1 text-center font-mono">
                  Grade {percentageToCollegeGrade(midterm).grade}
                </div>
              </div>

              {/* Semi-Final */}
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">
                  3. Semi-Final Exam
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={semiFinal}
                    onChange={(e) => setSemiFinal(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono font-bold text-slate-900 text-center"
                  />
                  <span className="text-xs font-bold text-slate-500">%</span>
                </div>
                <div className="text-[11px] font-bold text-indigo-700 mt-1 text-center font-mono">
                  Grade {percentageToCollegeGrade(semiFinal).grade}
                </div>
              </div>

              {/* Final */}
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">
                  4. Final Exam
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={finalExam}
                    onChange={(e) => setFinalExam(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono font-bold text-slate-900 text-center"
                  />
                  <span className="text-xs font-bold text-slate-500">%</span>
                </div>
                <div className="text-[11px] font-bold text-indigo-700 mt-1 text-center font-mono">
                  Grade {percentageToCollegeGrade(finalExam).grade}
                </div>
              </div>
            </div>
          </div>

          {/* Current Course Score Preview */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500 font-medium">Resulting Final Course Grade:</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-extrabold text-slate-900 text-base font-mono">
                  {calc4Period.finalPercentage.toFixed(1)}% Average
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-black font-mono text-xs border ${collegeColor.bg} ${collegeColor.text} ${collegeColor.border}`}
                >
                  Grade {calc4Period.collegeGrade.grade} ({calc4Period.collegeGrade.description})
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-slate-500 font-medium">Status:</span>
              <div className={`font-bold text-xs mt-0.5 ${calc4Period.isPassing ? 'text-emerald-700' : 'text-rose-700'}`}>
                {calc4Period.collegeGrade.remarks} (Earns {course.credits} Units)
              </div>
            </div>
          </div>

          {/* Teacher Remarks Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Instructor Remarks / Feedback
            </label>
            <input
              type="text"
              placeholder="e.g. Excellent analytical performance throughout all 4 exam periods."
              value={teacherRemarks}
              onChange={(e) => setTeacherRemarks(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div>
            {saveSuccess && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Grades & Period Exams Saved!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save 4-Period Grades</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

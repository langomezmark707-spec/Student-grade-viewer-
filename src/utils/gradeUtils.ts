import {
  Assessment,
  LetterGrade,
  SubjectGrade,
  Student,
  TermData,
  CollegeGrade,
  CollegeGradeDetail,
  PeriodScore,
  PeriodName,
} from '../types';

export const COLLEGE_GRADE_SCALE: CollegeGradeDetail[] = [
  {
    grade: '1.00',
    numeric: 1.0,
    percentageRange: '97% - 100%',
    minPercent: 97,
    maxPercent: 100,
    description: 'Excellent / Outstanding',
    remarks: 'Passed',
    usLetter: 'A+',
  },
  {
    grade: '1.25',
    numeric: 1.25,
    percentageRange: '94% - 96.9%',
    minPercent: 94,
    maxPercent: 96.9,
    description: 'Superior / Very Good',
    remarks: 'Passed',
    usLetter: 'A',
  },
  {
    grade: '1.50',
    numeric: 1.5,
    percentageRange: '91% - 93.9%',
    minPercent: 91,
    maxPercent: 93.9,
    description: 'Very Good',
    remarks: 'Passed',
    usLetter: 'A-',
  },
  {
    grade: '1.75',
    numeric: 1.75,
    percentageRange: '88% - 90.9%',
    minPercent: 88,
    maxPercent: 90.9,
    description: 'Good / Above Average',
    remarks: 'Passed',
    usLetter: 'B+',
  },
  {
    grade: '2.00',
    numeric: 2.0,
    percentageRange: '85% - 87.9%',
    minPercent: 85,
    maxPercent: 87.9,
    description: 'Good / Satisfactory',
    remarks: 'Passed',
    usLetter: 'B',
  },
  {
    grade: '2.25',
    numeric: 2.25,
    percentageRange: '82% - 84.9%',
    minPercent: 82,
    maxPercent: 84.9,
    description: 'Fairly Good / Satisfactory',
    remarks: 'Passed',
    usLetter: 'B-',
  },
  {
    grade: '2.50',
    numeric: 2.5,
    percentageRange: '79% - 81.9%',
    minPercent: 79,
    maxPercent: 81.9,
    description: 'Fair / Average',
    remarks: 'Passed',
    usLetter: 'C+',
  },
  {
    grade: '2.75',
    numeric: 2.75,
    percentageRange: '76% - 78.9%',
    minPercent: 76,
    maxPercent: 78.9,
    description: 'Fair / Minimum Passing',
    remarks: 'Passed',
    usLetter: 'C',
  },
  {
    grade: '3.00',
    numeric: 3.0,
    percentageRange: '75% - 75.9%',
    minPercent: 75,
    maxPercent: 75.9,
    description: 'Passing (Threshold)',
    remarks: 'Passed',
    usLetter: 'C-',
  },
  {
    grade: '4.00',
    numeric: 4.0,
    percentageRange: '70% - 74.9%',
    minPercent: 70,
    maxPercent: 74.9,
    description: 'Conditional / Removal Exam',
    remarks: 'Conditional',
    usLetter: 'D',
  },
  {
    grade: '5.00',
    numeric: 5.0,
    percentageRange: 'Below 70%',
    minPercent: 0,
    maxPercent: 69.9,
    description: 'Failed / No Credit',
    remarks: 'Failed',
    usLetter: 'F',
  },
];

export function calculateCoursePercentage(
  courseOrAssessments: Assessment[] | SubjectGrade
): number {
  if (!courseOrAssessments) return 0;

  if (!Array.isArray(courseOrAssessments)) {
    const course = courseOrAssessments;
    if (
      course.prelimScore &&
      course.midtermScore &&
      course.semiFinalScore &&
      course.finalScore
    ) {
      const p1 = course.prelimScore.periodPercentage;
      const p2 = course.midtermScore.periodPercentage;
      const p3 = course.semiFinalScore.periodPercentage;
      const p4 = course.finalScore.periodPercentage;
      return Math.round(((p1 + p2 + p3 + p4) / 4) * 10) / 10;
    }
    return calculateCoursePercentage(course.assessments || []);
  }

  const assessments = courseOrAssessments;
  if (assessments.length === 0) return 0;

  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const a of assessments) {
    if (a.maxScore > 0) {
      const percentage = (a.score / a.maxScore) * 100;
      totalWeightedScore += percentage * (a.weight / 100);
      totalWeight += a.weight;
    }
  }

  if (totalWeight === 0) return 0;
  const finalPercentage = (totalWeightedScore / totalWeight) * 100;
  return Math.round(finalPercentage * 10) / 10;
}

export function percentageToCollegeGrade(percentage: number): CollegeGradeDetail {
  if (percentage >= 97) return COLLEGE_GRADE_SCALE[0]; // 1.00
  if (percentage >= 94) return COLLEGE_GRADE_SCALE[1]; // 1.25
  if (percentage >= 91) return COLLEGE_GRADE_SCALE[2]; // 1.50
  if (percentage >= 88) return COLLEGE_GRADE_SCALE[3]; // 1.75
  if (percentage >= 85) return COLLEGE_GRADE_SCALE[4]; // 2.00
  if (percentage >= 82) return COLLEGE_GRADE_SCALE[5]; // 2.25
  if (percentage >= 79) return COLLEGE_GRADE_SCALE[6]; // 2.50
  if (percentage >= 76) return COLLEGE_GRADE_SCALE[7]; // 2.75
  if (percentage >= 75) return COLLEGE_GRADE_SCALE[8]; // 3.00
  if (percentage >= 70) return COLLEGE_GRADE_SCALE[9]; // 4.00
  return COLLEGE_GRADE_SCALE[10];                      // 5.00
}

export function percentageToLetterGrade(percentage: number): LetterGrade {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 60) return 'D';
  return 'F';
}

export function letterGradeToGpaPoints(grade: LetterGrade): number {
  switch (grade) {
    case 'A+':
    case 'A':
      return 4.0;
    case 'A-':
      return 3.7;
    case 'B+':
      return 3.3;
    case 'B':
      return 3.0;
    case 'B-':
      return 2.7;
    case 'C+':
      return 2.3;
    case 'C':
      return 2.0;
    case 'C-':
      return 1.7;
    case 'D+':
      return 1.3;
    case 'D':
      return 1.0;
    case 'F':
      return 0.0;
  }
}

/**
 * Returns the 4 distinct collegiate exam periods: Prelim, Midterm, Semi-Final, Final
 * and computes the final course percentage and college grade.
 */
export function getCoursePeriodScores(course?: SubjectGrade | null): {
  prelim: PeriodScore;
  midterm: PeriodScore;
  semiFinal: PeriodScore;
  final: PeriodScore;
  finalPercentage: number;
  finalCollegeGrade: CollegeGradeDetail;
} {
  const defaultPeriod: PeriodScore = {
    name: 'Prelim',
    examScore: 0,
    examMax: 100,
    periodPercentage: 0,
    collegeGrade: '5.00',
    isCompleted: false,
    remarks: 'Failed',
  };

  if (!course) {
    return {
      prelim: defaultPeriod,
      midterm: { ...defaultPeriod, name: 'Midterm' },
      semiFinal: { ...defaultPeriod, name: 'Semi-Final' },
      final: { ...defaultPeriod, name: 'Final' },
      finalPercentage: 0,
      finalCollegeGrade: percentageToCollegeGrade(0),
    };
  }

  if (
    course.prelimScore &&
    course.midtermScore &&
    course.semiFinalScore &&
    course.finalScore
  ) {
    const p1 = course.prelimScore.periodPercentage;
    const p2 = course.midtermScore.periodPercentage;
    const p3 = course.semiFinalScore.periodPercentage;
    const p4 = course.finalScore.periodPercentage;
    const avg = Math.round(((p1 + p2 + p3 + p4) / 4) * 10) / 10;
    return {
      prelim: course.prelimScore,
      midterm: course.midtermScore,
      semiFinal: course.semiFinalScore,
      final: course.finalScore,
      finalPercentage: avg,
      finalCollegeGrade: percentageToCollegeGrade(avg),
    };
  }

  // Derive from assessments if present
  const assessments = course.assessments || [];
  const prelimAss = assessments.find(
    (a) =>
      a.category === 'Prelim Exam' ||
      a.name.toLowerCase().includes('prelim') ||
      a.period === 'Prelim'
  );
  const midtermAss = assessments.find(
    (a) =>
      a.category === 'Midterm Exam' ||
      a.name.toLowerCase().includes('midterm') ||
      a.period === 'Midterm'
  );
  const semiAss = assessments.find(
    (a) =>
      a.category === 'Semi-Final Exam' ||
      a.name.toLowerCase().includes('semi') ||
      a.period === 'Semi-Final'
  );
  const finalAss = assessments.find(
    (a) =>
      a.category === 'Final Exam' ||
      a.name.toLowerCase().includes('final') ||
      a.period === 'Final'
  );

  const basePercent = calculateCoursePercentage(assessments);

  const p1Pct = prelimAss && prelimAss.maxScore > 0
    ? (prelimAss.score / prelimAss.maxScore) * 100
    : Math.max(68, Math.min(100, Math.round((basePercent - 1) * 10) / 10));
  const p2Pct = midtermAss && midtermAss.maxScore > 0
    ? (midtermAss.score / midtermAss.maxScore) * 100
    : Math.max(68, Math.min(100, Math.round((basePercent + 0.5) * 10) / 10));
  const p3Pct = semiAss && semiAss.maxScore > 0
    ? (semiAss.score / semiAss.maxScore) * 100
    : Math.max(68, Math.min(100, Math.round((basePercent - 0.5) * 10) / 10));
  const p4Pct = finalAss && finalAss.maxScore > 0
    ? (finalAss.score / finalAss.maxScore) * 100
    : Math.max(68, Math.min(100, Math.round((basePercent + 1) * 10) / 10));

  const finalAvg = Math.round(((p1Pct + p2Pct + p3Pct + p4Pct) / 4) * 10) / 10;

  return {
    prelim: {
      name: 'Prelim',
      examScore: Math.round(p1Pct),
      examMax: 100,
      periodPercentage: Math.round(p1Pct * 10) / 10,
      collegeGrade: percentageToCollegeGrade(p1Pct).grade,
      isCompleted: true,
      remarks: percentageToCollegeGrade(p1Pct).remarks,
    },
    midterm: {
      name: 'Midterm',
      examScore: Math.round(p2Pct),
      examMax: 100,
      periodPercentage: Math.round(p2Pct * 10) / 10,
      collegeGrade: percentageToCollegeGrade(p2Pct).grade,
      isCompleted: true,
      remarks: percentageToCollegeGrade(p2Pct).remarks,
    },
    semiFinal: {
      name: 'Semi-Final',
      examScore: Math.round(p3Pct),
      examMax: 100,
      periodPercentage: Math.round(p3Pct * 10) / 10,
      collegeGrade: percentageToCollegeGrade(p3Pct).grade,
      isCompleted: true,
      remarks: percentageToCollegeGrade(p3Pct).remarks,
    },
    final: {
      name: 'Final',
      examScore: Math.round(p4Pct),
      examMax: 100,
      periodPercentage: Math.round(p4Pct * 10) / 10,
      collegeGrade: percentageToCollegeGrade(p4Pct).grade,
      isCompleted: true,
      remarks: percentageToCollegeGrade(p4Pct).remarks,
    },
    finalPercentage: finalAvg,
    finalCollegeGrade: percentageToCollegeGrade(finalAvg),
  };
}

/**
 * Calculates Final Course percentage from the 4 period exams:
 * (Prelim + Midterm + SemiFinal + Final) / 4
 */
export function calculate4PeriodFinal(
  prelimPct: number,
  midtermPct: number,
  semiFinalPct: number,
  finalPct: number
): {
  finalPercentage: number;
  collegeGrade: CollegeGradeDetail;
  isPassing: boolean;
} {
  const avg = Math.round(((prelimPct + midtermPct + semiFinalPct + finalPct) / 4) * 10) / 10;
  const grade = percentageToCollegeGrade(avg);
  return {
    finalPercentage: avg,
    collegeGrade: grade,
    isPassing: grade.remarks === 'Passed',
  };
}

/**
 * Given Prelim, Midterm, and Semi-Final scores, calculates what score is needed
 * on the Final Exam to reach the target college grade (e.g. 1.25, 2.50)
 */
export function calculateNeededFinalExam(
  prelimPct: number,
  midtermPct: number,
  semiFinalPct: number,
  targetCollegeGrade: string
): {
  neededFinalPercentage: number;
  isPossible: boolean;
  targetDetail: CollegeGradeDetail;
} {
  const targetDetail =
    COLLEGE_GRADE_SCALE.find((s) => s.grade === targetCollegeGrade) ||
    COLLEGE_GRADE_SCALE[1]; // default 1.25
  const targetMinPct = targetDetail.minPercent;

  // Formula: (Prelim + Midterm + SemiFinal + Final) / 4 >= targetMinPct
  // Final >= (4 * targetMinPct) - Prelim - Midterm - SemiFinal
  const needed = 4 * targetMinPct - prelimPct - midtermPct - semiFinalPct;
  const rounded = Math.round(needed * 10) / 10;

  return {
    neededFinalPercentage: rounded,
    isPossible: rounded <= 100,
    targetDetail,
  };
}

export function calculateTermGwa(courses: SubjectGrade[]): {
  gwa: number;
  totalCredits: number;
  averagePercentage: number;
  allPassed: boolean;
  hasFailingGrade: boolean;
} {
  if (!courses || courses.length === 0) {
    return { gwa: 0, totalCredits: 0, averagePercentage: 0, allPassed: true, hasFailingGrade: false };
  }

  let totalGradePoints = 0;
  let totalUnits = 0;
  let totalPercent = 0;
  let hasFail = false;

  for (const course of courses) {
    const periodCalc = getCoursePeriodScores(course);
    const college = periodCalc.finalCollegeGrade;
    totalGradePoints += college.numeric * course.credits;
    totalUnits += course.credits;
    totalPercent += periodCalc.finalPercentage * course.credits;
    if (college.numeric >= 4.0) {
      hasFail = true;
    }
  }

  const rawGwa = totalUnits > 0 ? totalGradePoints / totalUnits : 0;
  const avgPercent = totalUnits > 0 ? totalPercent / totalUnits : 0;

  return {
    gwa: Math.round(rawGwa * 100) / 100,
    totalCredits: totalUnits,
    averagePercentage: Math.round(avgPercent * 10) / 10,
    allPassed: !hasFail,
    hasFailingGrade: hasFail,
  };
}

export function calculateCumulativeGwa(student?: Student | null): {
  gwa: number;
  totalCredits: number;
} {
  let totalGradePoints = 0;
  let totalUnits = 0;

  if (student?.history) {
    for (const h of student.history) {
      const termGwa =
        h.gwa !== undefined
          ? h.gwa
          : Math.max(1.0, Math.min(5.0, Math.round((5.0 - (h.gpa / 4.0) * 4.0 + 1.0) * 100) / 100));
      totalGradePoints += termGwa * h.creditsEarned;
      totalUnits += h.creditsEarned;
    }
  }

  if (student?.terms) {
    for (const t of student.terms) {
      const termCalc = calculateTermGwa(t.courses);
      totalGradePoints += termCalc.gwa * termCalc.totalCredits;
      totalUnits += termCalc.totalCredits;
    }
  }

  const gwa = totalUnits > 0 ? totalGradePoints / totalUnits : 0;
  return {
    gwa: Math.round(gwa * 100) / 100,
    totalCredits: totalUnits,
  };
}

export function calculateTermGpa(courses: SubjectGrade[]): {
  gpa: number;
  totalCredits: number;
  letterGrade: LetterGrade;
  averagePercentage: number;
} {
  if (!courses || courses.length === 0) {
    return { gpa: 0, totalCredits: 0, letterGrade: 'F', averagePercentage: 0 };
  }

  let totalPoints = 0;
  let totalCredits = 0;
  let totalPercent = 0;

  for (const course of courses) {
    const periodCalc = getCoursePeriodScores(course);
    const percent = periodCalc.finalPercentage;
    const letter = percentageToLetterGrade(percent);
    const points = letterGradeToGpaPoints(letter);
    totalPoints += points * course.credits;
    totalCredits += course.credits;
    totalPercent += percent * course.credits;
  }

  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
  const avgPercent = totalCredits > 0 ? totalPercent / totalCredits : 0;

  return {
    gpa: Math.round(gpa * 100) / 100,
    totalCredits,
    letterGrade: percentageToLetterGrade(avgPercent),
    averagePercentage: Math.round(avgPercent * 10) / 10,
  };
}

export function calculateCumulativeGpa(student?: Student | null): {
  gpa: number;
  totalCredits: number;
} {
  let totalPoints = 0;
  let totalCredits = 0;

  if (student?.history) {
    for (const h of student.history) {
      totalPoints += h.gpa * h.creditsEarned;
      totalCredits += h.creditsEarned;
    }
  }

  if (student?.terms) {
    for (const t of student.terms) {
      const termCalc = calculateTermGpa(t.courses);
      totalPoints += termCalc.gpa * termCalc.totalCredits;
      totalCredits += termCalc.totalCredits;
    }
  }

  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
  return {
    gpa: Math.round(gpa * 100) / 100,
    totalCredits,
  };
}

export function getCollegeAcademicStanding(
  gwa: number,
  hasFailingSubject = false
): {
  title: string;
  badgeClass: string;
  description: string;
  honorRank: string;
} {
  if (hasFailingSubject) {
    return {
      title: 'Academic Alert / Deficiency',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      description: 'Contains grade of 4.00/5.00 requiring removal or re-enrollment',
      honorRank: 'Deficiency',
    };
  }
  if (gwa > 0 && gwa <= 1.25) {
    return {
      title: "President's Lister (Summa Standing)",
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: 'Outstanding college scholastic excellence (GWA 1.00 – 1.25)',
      honorRank: "President's List",
    };
  } else if (gwa <= 1.50) {
    return {
      title: "Dean's Lister (1st Honors)",
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      description: 'Magna scholastic achievement (GWA 1.26 – 1.50)',
      honorRank: "Dean's List - 1st",
    };
  } else if (gwa <= 1.75) {
    return {
      title: "Dean's Lister (2nd Honors)",
      badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
      description: 'Cum laude scholastic achievement (GWA 1.51 – 1.75)',
      honorRank: "Dean's List - 2nd",
    };
  } else if (gwa <= 2.50) {
    return {
      title: 'Good Academic Standing',
      badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
      description: 'Regular student in good academic standing',
      honorRank: 'Good Standing',
    };
  } else if (gwa <= 3.00) {
    return {
      title: 'Satisfactory / Passing',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      description: 'Meets minimum collegiate passing threshold',
      honorRank: 'Passing',
    };
  } else {
    return {
      title: 'Academic Probation',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      description: 'Cumulative GWA exceeds retention maximum (GWA > 3.00)',
      honorRank: 'Probation',
    };
  }
}

export function getAcademicStanding(gpa: number): {
  title: string;
  badgeClass: string;
  description: string;
} {
  if (gpa >= 3.8) {
    return {
      title: "Dean's List / High Honors",
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: 'Outstanding academic excellence',
    };
  } else if (gpa >= 3.5) {
    return {
      title: 'Honor Roll',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      description: 'High scholastic achievement',
    };
  } else if (gpa >= 2.0) {
    return {
      title: 'Good Standing',
      badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
      description: 'Satisfactory academic progress',
    };
  } else {
    return {
      title: 'Academic Alert',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      description: 'Intervention recommended',
    };
  }
}

export function getCollegeGradeColorClass(grade: string | number): {
  text: string;
  bg: string;
  border: string;
  bar: string;
} {
  const numeric = typeof grade === 'string' ? parseFloat(grade) : grade;
  if (numeric <= 1.25) {
    return {
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      bar: 'bg-emerald-500',
    };
  } else if (numeric <= 1.75) {
    return {
      text: 'text-sky-700',
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      bar: 'bg-sky-500',
    };
  } else if (numeric <= 2.25) {
    return {
      text: 'text-indigo-700',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      bar: 'bg-indigo-500',
    };
  } else if (numeric <= 2.75) {
    return {
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      bar: 'bg-amber-500',
    };
  } else if (numeric <= 3.0) {
    return {
      text: 'text-orange-700',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      bar: 'bg-orange-500',
    };
  } else {
    return {
      text: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      bar: 'bg-rose-500',
    };
  }
}

export function getGradeColorClass(percentage: number): {
  text: string;
  bg: string;
  border: string;
  bar: string;
} {
  if (percentage >= 90) {
    return {
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      bar: 'bg-emerald-500',
    };
  } else if (percentage >= 80) {
    return {
      text: 'text-sky-700',
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      bar: 'bg-sky-500',
    };
  } else if (percentage >= 70) {
    return {
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      bar: 'bg-amber-500',
    };
  } else if (percentage >= 60) {
    return {
      text: 'text-orange-700',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      bar: 'bg-orange-500',
    };
  } else {
    return {
      text: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      bar: 'bg-rose-500',
    };
  }
}

export function calculateNeededScore(
  currentAssessments: Assessment[],
  targetPercent: number,
  upcomingWeight: number
): {
  neededPercentage: number;
  isPossible: boolean;
  currentWeightedTotal: number;
  currentWeight: number;
} {
  let currentWeightedSum = 0;
  let currentWeight = 0;

  for (const a of currentAssessments) {
    if (a.maxScore > 0) {
      currentWeightedSum += (a.score / a.maxScore) * a.weight;
      currentWeight += a.weight;
    }
  }

  const totalWeight = currentWeight + upcomingWeight;
  const targetWeightedSum = (targetPercent / 100) * totalWeight;
  const neededWeightedSum = targetWeightedSum - currentWeightedSum;

  if (upcomingWeight <= 0) {
    return {
      neededPercentage: 0,
      isPossible: false,
      currentWeightedTotal: currentWeight > 0 ? (currentWeightedSum / currentWeight) * 100 : 0,
      currentWeight,
    };
  }

  const neededPercentage = (neededWeightedSum / upcomingWeight) * 100;
  const rounded = Math.round(neededPercentage * 10) / 10;

  return {
    neededPercentage: rounded,
    isPossible: rounded <= 100,
    currentWeightedTotal: currentWeight > 0 ? (currentWeightedSum / currentWeight) * 100 : 0,
    currentWeight,
  };
}

/**
 * Calculates why a student received a specific grade:
 * Synthesizes 4-period exams (e.g. 50%), Quizzes & Quests (e.g. 20%),
 * Lab/Activities (e.g. 20%), and Attendance (e.g. 10%).
 */
export function explainCourseGradeComposition(
  course?: SubjectGrade | null,
  studentAttendanceRate: number = 95
) {
  const periodData = getCoursePeriodScores(course);
  const examAvg = periodData.finalPercentage; // 4 periods average

  // Separate quizzes/quests vs homework/projects/labs from course assessments
  const assessments = course?.assessments || [];
  const quizzes = assessments.filter(
    (a) => a.category === 'Quiz' || a.name.toLowerCase().includes('quiz')
  );
  const activities = assessments.filter(
    (a) =>
      a.category === 'Activity' ||
      a.category === 'Homework' ||
      a.category === 'Lab' ||
      a.category === 'Project'
  );

  const calcAvg = (items: Assessment[], fallback: number) => {
    if (items.length === 0) return fallback;
    let sum = 0;
    let count = 0;
    items.forEach((i) => {
      if (i.maxScore > 0) {
        sum += (i.score / i.maxScore) * 100;
        count++;
      }
    });
    return count > 0 ? Math.round((sum / count) * 10) / 10 : fallback;
  };

  const quizzesAvg = calcAvg(quizzes, Math.max(70, Math.min(100, examAvg - 1.5)));
  const activitiesAvg = calcAvg(activities, Math.max(75, Math.min(100, examAvg + 2)));
  const attendanceScore = studentAttendanceRate;

  // Typical college formula:
  // Major Exams: 50%
  // Quizzes & Quests: 20%
  // Class Activities & Labs: 20%
  // Attendance & Participation: 10%
  const examWeight = 0.50;
  const quizWeight = 0.20;
  const actWeight = 0.20;
  const attWeight = 0.10;

  const weightedTotal =
    examAvg * examWeight +
    quizzesAvg * quizWeight +
    activitiesAvg * actWeight +
    attendanceScore * attWeight;

  const roundedTotal = Math.round(weightedTotal * 10) / 10;
  const collegeGrade = percentageToCollegeGrade(roundedTotal);

  return {
    examAvg,
    examWeightPercent: examWeight * 100,
    examContribution: Math.round(examAvg * examWeight * 10) / 10,

    quizzesAvg,
    quizWeightPercent: quizWeight * 100,
    quizContribution: Math.round(quizzesAvg * quizWeight * 10) / 10,

    activitiesAvg,
    actWeightPercent: actWeight * 100,
    activityContribution: Math.round(activitiesAvg * actWeight * 10) / 10,

    attendanceScore,
    attWeightPercent: attWeight * 100,
    attendanceContribution: Math.round(attendanceScore * attWeight * 10) / 10,

    finalPercentage: roundedTotal,
    collegeGrade,
    periodScores: periodData,
  };
}

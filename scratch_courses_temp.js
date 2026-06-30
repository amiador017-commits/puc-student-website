export const COURSES = [
  // ── Semester 1 ───────────────────────────────────────────
  {
    courseId: "s1-ban1101",
    code: "BAN 1101(V4)",
    name: "Functional Bengali Language",
    semester: 1,
    credits: 2,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 20, final: 0, finalMax: 40, attendance: 0, assignment: 0, classTest1: 0, classTest2: 0 },
    assessmentComponents: [
      { key: "attendance", label: "Attendance", max: 10 },
      { key: "assignment", label: "Assignment", max: 10 },
      { key: "classTest1", label: "Class Test 1", max: 10 },
      { key: "classTest2", label: "Class Test 2", max: 10 },
      { key: "midterm", label: "Mid Term", max: 20 },
      { key: "final", label: "Final", max: 40 },
    ],
  },
  {
    courseId: "s1-cse1111",
    code: "CSE 1111(V4)",
    name: "Computer Fundamentals and Ethics",
    semester: 1,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 0, final: 0, finalMax: 0, attendance: 0, classAssignment: 0, groupWork: 0, quiz: 0, presentation: 0, viva: 0 },
    assessmentComponents: [
      { key: "classAssignment", label: "Class Assignment", max: 10 },
      { key: "groupWork", label: "Group Work", max: 30 },
      { key: "quiz", label: "Quiz", max: 30 },
      { key: "presentation", label: "Presentation", max: 20 },
      { key: "viva", label: "Viva", max: 10 },
    ],
  },
  {
    courseId: "s1-cse1113",
    code: "CSE 1113(V4)",
    name: "Programming Fundamentals",
    semester: 1,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 20, final: 0, finalMax: 40, attendance: 0, assignment: 0, classTest1: 0, classTest2: 0 },
    assessmentComponents: [
      { key: "attendance", label: "Attendance", max: 10 },
      { key: "assignment", label: "Assignment", max: 10 },
      { key: "classTest1", label: "Class Test 1", max: 10 },
      { key: "classTest2", label: "Class Test 2", max: 10 },
      { key: "midterm", label: "Mid Term", max: 20 },
      { key: "final", label: "Final", max: 40 },
    ],
  },
  {
    courseId: "s1-cse1114",
    code: "CSE 1114(V4)",
    name: "Programming Fundamentals Laboratory",
    semester: 1,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 0, final: 0, finalMax: 0, attendance: 0, assignment: 0, labPerformance: 0, labReport: 0, labExam: 0, quiz: 0, viva: 0 },
    assessmentComponents: [
      { key: "assignment", label: "Assignment", max: 10 },
      { key: "labPerformance", label: "Lab Performance", max: 20 },
      { key: "labReport", label: "Lab Report", max: 10 },
      { key: "labExam", label: "Lab Exam", max: 30 },
      { key: "quiz", label: "Quiz", max: 20 },
      { key: "viva", label: "Viva", max: 10 },
    ],
  },
  {
    courseId: "s1-eee1101",
    code: "EEE 1101(V4)",
    name: "Introduction to Electrical Engineering",
    semester: 1,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 20, final: 0, finalMax: 40, attendance: 0, assignment: 0, classTest1: 0, classTest2: 0 },
    assessmentComponents: [
      { key: "attendance", label: "Attendance", max: 10 },
      { key: "assignment", label: "Assignment", max: 10 },
      { key: "classTest1", label: "Class Test 1", max: 10 },
      { key: "classTest2", label: "Class Test 2", max: 10 },
      { key: "midterm", label: "Mid Term", max: 20 },
      { key: "final", label: "Final", max: 40 },
    ],
  },
  {
    courseId: "s1-eee1102",
    code: "EEE 1102(V4)",
    name: "Introduction to Electrical Engineering Laboratory",
    semester: 1,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 0, final: 0, finalMax: 0, attendance: 0, assignment: 0, labPerformance: 0, labReport: 0, quiz: 0, viva: 0 },
    assessmentComponents: [
      { key: "assignment", label: "Assignment", max: 10 },
      { key: "labPerformance", label: "Lab Performance", max: 40 },
      { key: "labReport", label: "Lab Report", max: 20 },
      { key: "quiz", label: "Quiz", max: 20 },
      { key: "viva", label: "Viva", max: 10 },
    ],
  },
  {
    courseId: "s1-eng1101",
    code: "ENG 1101(V4)",
    name: "General English",
    semester: 1,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 20, final: 0, finalMax: 40, attendance: 0, assignment: 0, classTest1: 0, classTest2: 0 },
    assessmentComponents: [
      { key: "attendance", label: "Attendance", max: 10 },
      { key: "assignment", label: "Assignment", max: 10 },
      { key: "classTest1", label: "Class Test 1", max: 10 },
      { key: "classTest2", label: "Class Test 2", max: 10 },
      { key: "midterm", label: "Mid Term", max: 20 },
      { key: "final", label: "Final", max: 40 },
    ],
  },
  {
    courseId: "s1-mat1203",
    code: "MAT 1203(V4)",
    name: "Differential and Integral Calculus",
    semester: 1,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 20, final: 0, finalMax: 40, attendance: 0, assignment: 0, classTest1: 0, classTest2: 0 },
    assessmentComponents: [
      { key: "attendance", label: "Attendance", max: 10 },
      { key: "assignment", label: "Assignment", max: 10 },
      { key: "classTest1", label: "Class Test 1", max: 10 },
      { key: "classTest2", label: "Class Test 2", max: 10 },
      { key: "midterm", label: "Mid Term", max: 20 },
      { key: "final", label: "Final", max: 40 },
    ],
  },
  {
    courseId: "s1-me1104",
    code: "ME 1104(V4)",
    name: "Mechanical Engineering Drawing",
    semester: 1,
    credits: 0.75,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 0, final: 0, finalMax: 0, attendance: 0, assignment: 0, labPerformance: 0, labReport: 0, labExam: 0, quiz: 0, viva: 0 },
    assessmentComponents: [
      { key: "assignment", label: "Assignment", max: 10 },
      { key: "labPerformance", label: "Lab Performance", max: 20 },
      { key: "labReport", label: "Lab Report", max: 10 },
      { key: "labExam", label: "Lab Exam", max: 30 },
      { key: "quiz", label: "Quiz", max: 20 },
      { key: "viva", label: "Viva", max: 10 },
    ],
  },

  // ── Semester 2 ───────────────────────────────────────────
  {
    courseId: "s2-cse1110",
    code: "CSE 1110(V4)",
    name: "Competitive Programming Laboratory",
    semester: 2,
    credits: 0.75,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s2-cse1411",
    code: "CSE 1411(V4)",
    name: "Discrete Mathematics and Number Theory",
    semester: 2,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s2-cse1413",
    code: "CSE 1413(V4)",
    name: "Data Structures",
    semester: 2,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s2-cse1414",
    code: "CSE 1414(V4)",
    name: "Data Structures Laboratory",
    semester: 2,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s2-eco1101",
    code: "ECO 1101(V4)",
    name: "Engineering Economics",
    semester: 2,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s2-eee1201",
    code: "EEE 1201(V4)",
    name: "Electronics Devices and Circuits",
    semester: 2,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s2-eee1202",
    code: "EEE 1202(V4)",
    name: "Electronics Device and Circuits Laboratory",
    semester: 2,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s2-phy1103",
    code: "PHY 1103(V4)",
    name: "Introduction to Classical & Modern Physics",
    semester: 2,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s2-phy1104",
    code: "PHY 1104(V4)",
    name: "Physics Laboratory",
    semester: 2,
    credits: 0.75,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },

  // ── Semester 3 ───────────────────────────────────────────
  {
    courseId: "s3-cse1115",
    code: "CSE 1115(V4)",
    name: "Object Oriented Programming",
    semester: 3,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s3-cse1116",
    code: "CSE 1116(V4)",
    name: "Object Oriented Programming Laboratory",
    semester: 3,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s3-cse3210",
    code: "CSE 3210(V4)",
    name: "Internet Programming",
    semester: 3,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s3-eee2201",
    code: "EEE 2201(V4)",
    name: "Digital Electronics and Pulse Technique",
    semester: 3,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s3-eee2202",
    code: "EEE 2202(V4)",
    name: "Digital Electronics and Pulse Technique Laboratory",
    semester: 3,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s3-eng1102",
    code: "ENG 1102(V4)",
    name: "Communicative English",
    semester: 3,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s3-mat1205",
    code: "MAT 1205(V4)",
    name: "Coordinate Geometry & Vector Analysis",
    semester: 3,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s3-mat2304",
    code: "MAT 2304(V4)",
    name: "Numerical Methods",
    semester: 3,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s3-ssc1101",
    code: "SSC 1101(V4)",
    name: "Bangladesh Studies",
    semester: 3,
    credits: 2,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },

  // ── Semester 4 ───────────────────────────────────────────
  {
    courseId: "s4-bio2101",
    code: "BIO 2101(V4)",
    name: "Biology for Engineers",
    semester: 4,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s4-cse2221",
    code: "CSE 2221(V4)",
    name: "Database Management Systems",
    semester: 4,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s4-cse2222",
    code: "CSE 2222(V4)",
    name: "Database Management Systems Laboratory",
    semester: 4,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s4-cse2415",
    code: "CSE 2415(V4)",
    name: "Algorithms",
    semester: 4,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s4-cse2416",
    code: "CSE 2416(V4)",
    name: "Algorithms Laboratory",
    semester: 4,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s4-cse3815",
    code: "CSE 3815(V4)",
    name: "Microprocessors & Microcontrollers",
    semester: 4,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s4-cse3816",
    code: "CSE 3816(V4)",
    name: "Microprocessors and Microcontrollers Laboratory",
    semester: 4,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s4-mat2207",
    code: "MAT 2207(V4)",
    name: "Matrix, Linear Algebra, Differential Equation",
    semester: 4,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },

  // ── Semester 5 ───────────────────────────────────────────
  {
    courseId: "s5-cse2210",
    code: "CSE 2210(V4)",
    name: "Mobile Application Development",
    semester: 5,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s5-cse3211",
    code: "CSE 3211(V4)",
    name: "Information System Design",
    semester: 5,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s5-cse3317",
    code: "CSE 3317(V4)",
    name: "Artificial Intelligence",
    semester: 5,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s5-cse3318",
    code: "CSE 3318(V4)",
    name: "Artificial Intelligence Laboratory",
    semester: 5,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s5-cse3733",
    code: "CSE 3733(V4)",
    name: "Operating Systems",
    semester: 5,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s5-cse3734",
    code: "CSE 3734(V4)",
    name: "Operating Systems Laboratory",
    semester: 5,
    credits: 0.75,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s5-cse3737",
    code: "CSE 3737(V4)",
    name: "Computer Organization & Architecture",
    semester: 5,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s5-sta2107",
    code: "STA 2107(V4)",
    name: "Statistics and Probability",
    semester: 5,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },

  // ── Semester 6 ───────────────────────────────────────────
  {
    courseId: "s6-cse3000",
    code: "CSE 3000(V4)",
    name: "Software Development Project",
    semester: 6,
    credits: 2,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s6-cse3233",
    code: "CSE 3233(V4)",
    name: "Software Engineering",
    semester: 6,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s6-cse3234",
    code: "CSE 3234(V4)",
    name: "Software Engineering Laboratory",
    semester: 6,
    credits: 0.75,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s6-cse3567",
    code: "CSE 3567(V4)",
    name: "Computer Networks",
    semester: 6,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s6-cse3568",
    code: "CSE 3568(V4)",
    name: "Computer Networks Laboratory",
    semester: 6,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s6-cse3637",
    code: "CSE 3637(V4)",
    name: "Computer and Cyber Security",
    semester: 6,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s6-cse4427",
    code: "CSE 4427(V4)",
    name: "Data Communication",
    semester: 6,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s6-mgt3301",
    code: "MGT 3301(V4)",
    name: "Project Management and Entrepreneurship",
    semester: 6,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },

  // ── Semester 7 ───────────────────────────────────────────
  {
    courseId: "s7-cse3409",
    code: "CSE 3409(V4)",
    name: "Theory of Computation",
    semester: 7,
    credits: 2,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s7-cse4293",
    code: "CSE 4293(V4)",
    name: "Software Testing and Quality Assurance",
    semester: 7,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s7-cse4294",
    code: "CSE 4294(V4)",
    name: "Software Testing and Assurance Quality Laboratory",
    semester: 7,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s7-cse4311",
    code: "CSE 4311(V4)",
    name: "Machine Learning",
    semester: 7,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s7-cse4312",
    code: "CSE 4312(V4)",
    name: "Machine Learning Lab",
    semester: 7,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s7-cse4523",
    code: "CSE 4523(V4)",
    name: "Cloud Computing",
    semester: 7,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s7-cse4524",
    code: "CSE 4524(V4)",
    name: "Cloud Computing Laboratory",
    semester: 7,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s7-eng4104",
    code: "ENG 4104(V4)",
    name: "Technical Writing and Presentation",
    semester: 7,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s7-hum3101",
    code: "HUM 3101(V4)",
    name: "Society, Engineering Ethics and Environmental Protection",
    semester: 7,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },

  // ── Semester 8 ───────────────────────────────────────────
  {
    courseId: "s8-acc1501",
    code: "ACC 1501(V4)",
    name: "Financial and Managerial Accounting",
    semester: 8,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s8-cse4001",
    code: "CSE 4001",
    name: "Internship",
    semester: 8,
    credits: 0.75,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s8-cse4251",
    code: "CSE 4251",
    name: "Human Computer Interaction",
    semester: 8,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s8-cse4283",
    code: "CSE 4283",
    name: "Game Design and Development",
    semester: 8,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s8-cse4284",
    code: "CSE 4284",
    name: "Game Design and Development Laboratory",
    semester: 8,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s8-cse4333",
    code: "CSE 4333",
    name: "Data Mining",
    semester: 8,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s8-cse4345",
    code: "CSE 4345",
    name: "Big Data Analytics",
    semester: 8,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s8-cse4346",
    code: "CSE 4346",
    name: "Big Data Analytics Laboratory",
    semester: 8,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s8-cse4573",
    code: "CSE 4573",
    name: "Green Computing",
    semester: 8,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s8-cse4591",
    code: "CSE 4591",
    name: "Network Security",
    semester: 8,
    credits: 3,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
  {
    courseId: "s8-cse4592",
    code: "CSE 4592",
    name: "Network Security Laboratory",
    semester: 8,
    credits: 1.5,
    instructor: "—",
    grades: { midterm: 0, midtermMax: 30, final: 0, finalMax: 50, attendance: 0 },
  },
];

// ═══════════════════════════════════════════════════════════════
// Notifications
// ═══════════════════════════════════════════════════════════════

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "assignment",
    title: "New Assignment",
    body: "A new assignment has been posted in CSE 1413 — Data Structures.",
    time: "Just now",
  },
  {
    id: "n2",
    type: "grade",
    title: "Grade Updated",
    body: "Your midterm grade for Discrete Mathematics has been released.",
    time: "59 min ago",
  },
  {
    id: "n3",
    type: "announcement",
    title: "Class Rescheduled",
    body: "Physics Laboratory session on Wednesday is moved to Sunday 1:30 PM.",
    time: "2 hrs ago",
  },
  {
    id: "n4",
    type: "message",
    title: "New Message",
    body: "FSC replied to your query about the Data Structures Lab assignment.",
    time: "Yesterday",
  },
  {
    id: "n5",
    type: "announcement",
    title: "Holiday Notice",
    body: "University will remain closed on July 4th. All exams are rescheduled.",
    time: "2 days ago",
  },
];

// ═══════════════════════════════════════════════════════════════
// Messages
// ═══════════════════════════════════════════════════════════════

export const MESSAGES: Message[] = [
  {
    id: "m1",
    from: "FSC",
    subject: "Re: Data Structures Lab Query",
    preview: "Good question! For the lab assignment, you should focus on...",
    body: "Good question! For the lab assignment, you should focus on implementing the linked list operations with proper memory management. Make sure to handle edge cases like empty lists and single-node operations. Let me know if you need any further guidance.",
    time: "10:45 AM",
    read: false,
  },
  {
    id: "m2",
    from: "AIR",
    subject: "EDC Assignment Feedback",
    preview: "Your submission on circuit analysis was impressive. However...",
    body: "Your submission on circuit analysis was impressive. However, I noticed some calculation errors in the Thevenin equivalent section. Please review the formulas and resubmit the corrected version by Friday. Overall good work!",
    time: "Yesterday",
    read: false,
  },
  {
    id: "m3",
    from: "Academic Office",
    subject: "Semester Registration Reminder",
    preview: "This is a reminder that semester registration for Spring 2026...",
    body: "This is a reminder that semester registration for Spring 2026 opens on July 15th. Please ensure you have cleared all outstanding dues and have your advisor's approval before registering. Contact the academic office for any queries.",
    time: "Mon",
    read: true,
  },
  {
    id: "m4",
    from: "DAB",
    subject: "Competitive Programming Contest",
    preview: "There will be a practice contest this Saturday at 2PM...",
    body: "There will be a practice contest this Saturday at 2PM in Lab 404. All Section A students are encouraged to participate. The problems will focus on data structures and basic algorithms. Bring your laptops.",
    time: "Sun",
    read: true,
  },
  {
    id: "m5",
    from: "Library Services",
    subject: "Book Due Reminder",
    preview: "You have 2 books due for return by June 30th...",
    body: "You have 2 books due for return by June 30th: 'Introduction to Algorithms' by CLRS and 'Discrete Mathematics and Its Applications' by Rosen. Please return them to avoid any late fees. Books can be renewed online through the library portal.",
    time: "Jun 28",
    read: true,
  },
];

// ── Derived helpers ──────────────────────────────────────────

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export function getCoursesBySemester(semester: number) {
  return COURSES.filter((c) => c.semester === semester);
}

export function getCourseTotalAndMax(course: Course): { total: number; max: number } {
  if (course.assessmentComponents && course.assessmentComponents.length > 0) {
    let total = 0;
    let max = 0;
    for (const comp of course.assessmentComponents) {
      total += course.grades[comp.key] ?? 0;
      max += comp.max;
    }
    return { total, max };
  }
  return {
    total: course.grades.midterm + course.grades.final,
    max: course.grades.midtermMax + course.grades.finalMax,
  };
}

export function getGradePoint(course: Course): number {
  const { total, max } = getCourseTotalAndMax(course);
  if (max === 0) return 0;
  const pct = (total / max) * 100;
  if (pct >= 80) return 4.00;
  if (pct >= 75) return 3.75;
  if (pct >= 70) return 3.50;
  if (pct >= 65) return 3.25;
  if (pct >= 60) return 3.00;
  if (pct >= 55) return 2.75;
  if (pct >= 50) return 2.50;
  if (pct >= 45) return 2.25;
  if (pct >= 40) return 2.00;
  return 0.00;
}

export function calculateGPA(courses): number {
  if (courses.length === 0) return 0;
  let totalPoints = 0;
  let totalCredits = 0;
  for (const c of courses) {
    const { total: totalMarks, max: maxMarks } = getCourseTotalAndMax(c);
    if (maxMarks === 0) continue; // skip courses with no max marks set
    const gp = getGradePoint(c);
    totalPoints += gp * c.credits;
    totalCredits += c.credits;
  }
  if (totalCredits === 0) return 0;
  return totalPoints / totalCredits;
}

export function getLetterGrade(course: Course): string {
  const { total, max } = getCourseTotalAndMax(course);
  if (max === 0) return "—";
  const pct = (total / max) * 100;
  if (pct >= 80) return "A+";
  if (pct >= 75) return "A";
  if (pct >= 70) return "A-";
  if (pct >= 65) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 55) return "B-";
  if (pct >= 50) return "C";
  if (pct >= 45) return "C-";
  if (pct >= 40) return "D";
  return "F";
}

// ═══════════════════════════════════════════════════════════════
// Schedule — 2nd Semester, Section 2A
// Session: Spring 2026
// ═══════════════════════════════════════════════════════════════



// Color palette for schedule — each unique course gets a color
const SCHEDULE_COLORS = {
  "CSE 1110":  "neon",
  "CSE 1411":  "violet",
  "CSE 1413":  "amber",
  "CSE 1414":  "sky",
  "EEE 1201":  "rose",
  "EEE 1202":  "teal",
  "PHY 1104":  "orange",
};

function getCourseColor(code: string): string {
  // Extract base code (without section/version suffix)
  const baseCode = code.replace(/ - .*$/, "").trim();
  return SCHEDULE_COLORS[baseCode] ?? "neon";
}


export default COURSES;
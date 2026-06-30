INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s1-ban1101', 'BAN 1101(V4)', 'Functional Bengali Language', 1, 2, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.course_assessment_components (course_id, component_key, label, max_marks) VALUES
  ('s1-ban1101', 'attendance', 'Attendance', 10),
  ('s1-ban1101', 'assignment', 'Assignment', 10),
  ('s1-ban1101', 'classTest1', 'Class Test 1', 10),
  ('s1-ban1101', 'classTest2', 'Class Test 2', 10),
  ('s1-ban1101', 'midterm', 'Mid Term', 20),
  ('s1-ban1101', 'final', 'Final', 40)
ON CONFLICT (course_id, component_key) DO UPDATE SET
  label = EXCLUDED.label, max_marks = EXCLUDED.max_marks;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s1-cse1111', 'CSE 1111(V4)', 'Computer Fundamentals and Ethics', 1, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.course_assessment_components (course_id, component_key, label, max_marks) VALUES
  ('s1-cse1111', 'classAssignment', 'Class Assignment', 10),
  ('s1-cse1111', 'groupWork', 'Group Work', 30),
  ('s1-cse1111', 'quiz', 'Quiz', 30),
  ('s1-cse1111', 'presentation', 'Presentation', 20),
  ('s1-cse1111', 'viva', 'Viva', 10)
ON CONFLICT (course_id, component_key) DO UPDATE SET
  label = EXCLUDED.label, max_marks = EXCLUDED.max_marks;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s1-cse1113', 'CSE 1113(V4)', 'Programming Fundamentals', 1, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.course_assessment_components (course_id, component_key, label, max_marks) VALUES
  ('s1-cse1113', 'attendance', 'Attendance', 10),
  ('s1-cse1113', 'assignment', 'Assignment', 10),
  ('s1-cse1113', 'classTest1', 'Class Test 1', 10),
  ('s1-cse1113', 'classTest2', 'Class Test 2', 10),
  ('s1-cse1113', 'midterm', 'Mid Term', 20),
  ('s1-cse1113', 'final', 'Final', 40)
ON CONFLICT (course_id, component_key) DO UPDATE SET
  label = EXCLUDED.label, max_marks = EXCLUDED.max_marks;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s1-cse1114', 'CSE 1114(V4)', 'Programming Fundamentals Laboratory', 1, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.course_assessment_components (course_id, component_key, label, max_marks) VALUES
  ('s1-cse1114', 'assignment', 'Assignment', 10),
  ('s1-cse1114', 'labPerformance', 'Lab Performance', 20),
  ('s1-cse1114', 'labReport', 'Lab Report', 10),
  ('s1-cse1114', 'labExam', 'Lab Exam', 30),
  ('s1-cse1114', 'quiz', 'Quiz', 20),
  ('s1-cse1114', 'viva', 'Viva', 10)
ON CONFLICT (course_id, component_key) DO UPDATE SET
  label = EXCLUDED.label, max_marks = EXCLUDED.max_marks;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s1-eee1101', 'EEE 1101(V4)', 'Introduction to Electrical Engineering', 1, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.course_assessment_components (course_id, component_key, label, max_marks) VALUES
  ('s1-eee1101', 'attendance', 'Attendance', 10),
  ('s1-eee1101', 'assignment', 'Assignment', 10),
  ('s1-eee1101', 'classTest1', 'Class Test 1', 10),
  ('s1-eee1101', 'classTest2', 'Class Test 2', 10),
  ('s1-eee1101', 'midterm', 'Mid Term', 20),
  ('s1-eee1101', 'final', 'Final', 40)
ON CONFLICT (course_id, component_key) DO UPDATE SET
  label = EXCLUDED.label, max_marks = EXCLUDED.max_marks;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s1-eee1102', 'EEE 1102(V4)', 'Introduction to Electrical Engineering Laboratory', 1, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.course_assessment_components (course_id, component_key, label, max_marks) VALUES
  ('s1-eee1102', 'assignment', 'Assignment', 10),
  ('s1-eee1102', 'labPerformance', 'Lab Performance', 40),
  ('s1-eee1102', 'labReport', 'Lab Report', 20),
  ('s1-eee1102', 'quiz', 'Quiz', 20),
  ('s1-eee1102', 'viva', 'Viva', 10)
ON CONFLICT (course_id, component_key) DO UPDATE SET
  label = EXCLUDED.label, max_marks = EXCLUDED.max_marks;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s1-eng1101', 'ENG 1101(V4)', 'General English', 1, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.course_assessment_components (course_id, component_key, label, max_marks) VALUES
  ('s1-eng1101', 'attendance', 'Attendance', 10),
  ('s1-eng1101', 'assignment', 'Assignment', 10),
  ('s1-eng1101', 'classTest1', 'Class Test 1', 10),
  ('s1-eng1101', 'classTest2', 'Class Test 2', 10),
  ('s1-eng1101', 'midterm', 'Mid Term', 20),
  ('s1-eng1101', 'final', 'Final', 40)
ON CONFLICT (course_id, component_key) DO UPDATE SET
  label = EXCLUDED.label, max_marks = EXCLUDED.max_marks;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s1-mat1203', 'MAT 1203(V4)', 'Differential and Integral Calculus', 1, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.course_assessment_components (course_id, component_key, label, max_marks) VALUES
  ('s1-mat1203', 'attendance', 'Attendance', 10),
  ('s1-mat1203', 'assignment', 'Assignment', 10),
  ('s1-mat1203', 'classTest1', 'Class Test 1', 10),
  ('s1-mat1203', 'classTest2', 'Class Test 2', 10),
  ('s1-mat1203', 'midterm', 'Mid Term', 20),
  ('s1-mat1203', 'final', 'Final', 40)
ON CONFLICT (course_id, component_key) DO UPDATE SET
  label = EXCLUDED.label, max_marks = EXCLUDED.max_marks;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s1-me1104', 'ME 1104(V4)', 'Mechanical Engineering Drawing', 1, 0.75, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.course_assessment_components (course_id, component_key, label, max_marks) VALUES
  ('s1-me1104', 'assignment', 'Assignment', 10),
  ('s1-me1104', 'labPerformance', 'Lab Performance', 20),
  ('s1-me1104', 'labReport', 'Lab Report', 10),
  ('s1-me1104', 'labExam', 'Lab Exam', 30),
  ('s1-me1104', 'quiz', 'Quiz', 20),
  ('s1-me1104', 'viva', 'Viva', 10)
ON CONFLICT (course_id, component_key) DO UPDATE SET
  label = EXCLUDED.label, max_marks = EXCLUDED.max_marks;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s2-cse1110', 'CSE 1110(V4)', 'Competitive Programming Laboratory', 2, 0.75, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s2-cse1411', 'CSE 1411(V4)', 'Discrete Mathematics and Number Theory', 2, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s2-cse1413', 'CSE 1413(V4)', 'Data Structures', 2, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s2-cse1414', 'CSE 1414(V4)', 'Data Structures Laboratory', 2, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s2-eco1101', 'ECO 1101(V4)', 'Engineering Economics', 2, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s2-eee1201', 'EEE 1201(V4)', 'Electronics Devices and Circuits', 2, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s2-eee1202', 'EEE 1202(V4)', 'Electronics Device and Circuits Laboratory', 2, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s2-phy1103', 'PHY 1103(V4)', 'Introduction to Classical & Modern Physics', 2, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s2-phy1104', 'PHY 1104(V4)', 'Physics Laboratory', 2, 0.75, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s3-cse1115', 'CSE 1115(V4)', 'Object Oriented Programming', 3, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s3-cse1116', 'CSE 1116(V4)', 'Object Oriented Programming Laboratory', 3, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s3-cse3210', 'CSE 3210(V4)', 'Internet Programming', 3, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s3-eee2201', 'EEE 2201(V4)', 'Digital Electronics and Pulse Technique', 3, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s3-eee2202', 'EEE 2202(V4)', 'Digital Electronics and Pulse Technique Laboratory', 3, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s3-eng1102', 'ENG 1102(V4)', 'Communicative English', 3, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s3-mat1205', 'MAT 1205(V4)', 'Coordinate Geometry & Vector Analysis', 3, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s3-mat2304', 'MAT 2304(V4)', 'Numerical Methods', 3, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s3-ssc1101', 'SSC 1101(V4)', 'Bangladesh Studies', 3, 2, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s4-bio2101', 'BIO 2101(V4)', 'Biology for Engineers', 4, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s4-cse2221', 'CSE 2221(V4)', 'Database Management Systems', 4, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s4-cse2222', 'CSE 2222(V4)', 'Database Management Systems Laboratory', 4, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s4-cse2415', 'CSE 2415(V4)', 'Algorithms', 4, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s4-cse2416', 'CSE 2416(V4)', 'Algorithms Laboratory', 4, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s4-cse3815', 'CSE 3815(V4)', 'Microprocessors & Microcontrollers', 4, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s4-cse3816', 'CSE 3816(V4)', 'Microprocessors and Microcontrollers Laboratory', 4, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s4-mat2207', 'MAT 2207(V4)', 'Matrix, Linear Algebra, Differential Equation', 4, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s5-cse2210', 'CSE 2210(V4)', 'Mobile Application Development', 5, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s5-cse3211', 'CSE 3211(V4)', 'Information System Design', 5, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s5-cse3317', 'CSE 3317(V4)', 'Artificial Intelligence', 5, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s5-cse3318', 'CSE 3318(V4)', 'Artificial Intelligence Laboratory', 5, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s5-cse3733', 'CSE 3733(V4)', 'Operating Systems', 5, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s5-cse3734', 'CSE 3734(V4)', 'Operating Systems Laboratory', 5, 0.75, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s5-cse3737', 'CSE 3737(V4)', 'Computer Organization & Architecture', 5, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s5-sta2107', 'STA 2107(V4)', 'Statistics and Probability', 5, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s6-cse3000', 'CSE 3000(V4)', 'Software Development Project', 6, 2, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s6-cse3233', 'CSE 3233(V4)', 'Software Engineering', 6, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s6-cse3234', 'CSE 3234(V4)', 'Software Engineering Laboratory', 6, 0.75, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s6-cse3567', 'CSE 3567(V4)', 'Computer Networks', 6, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s6-cse3568', 'CSE 3568(V4)', 'Computer Networks Laboratory', 6, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s6-cse3637', 'CSE 3637(V4)', 'Computer and Cyber Security', 6, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s6-cse4427', 'CSE 4427(V4)', 'Data Communication', 6, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s6-mgt3301', 'MGT 3301(V4)', 'Project Management and Entrepreneurship', 6, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s7-cse3409', 'CSE 3409(V4)', 'Theory of Computation', 7, 2, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s7-cse4293', 'CSE 4293(V4)', 'Software Testing and Quality Assurance', 7, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s7-cse4294', 'CSE 4294(V4)', 'Software Testing and Assurance Quality Laboratory', 7, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s7-cse4311', 'CSE 4311(V4)', 'Machine Learning', 7, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s7-cse4312', 'CSE 4312(V4)', 'Machine Learning Lab', 7, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s7-cse4523', 'CSE 4523(V4)', 'Cloud Computing', 7, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s7-cse4524', 'CSE 4524(V4)', 'Cloud Computing Laboratory', 7, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s7-eng4104', 'ENG 4104(V4)', 'Technical Writing and Presentation', 7, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s7-hum3101', 'HUM 3101(V4)', 'Society, Engineering Ethics and Environmental Protection', 7, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s8-acc1501', 'ACC 1501(V4)', 'Financial and Managerial Accounting', 8, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s8-cse4001', 'CSE 4001', 'Internship', 8, 0.75, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s8-cse4251', 'CSE 4251', 'Human Computer Interaction', 8, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s8-cse4283', 'CSE 4283', 'Game Design and Development', 8, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s8-cse4284', 'CSE 4284', 'Game Design and Development Laboratory', 8, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s8-cse4333', 'CSE 4333', 'Data Mining', 8, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s8-cse4345', 'CSE 4345', 'Big Data Analytics', 8, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s8-cse4346', 'CSE 4346', 'Big Data Analytics Laboratory', 8, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s8-cse4573', 'CSE 4573', 'Green Computing', 8, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s8-cse4591', 'CSE 4591', 'Network Security', 8, 3, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;

INSERT INTO public.courses (course_id, code, name, semester, credits, instructor) VALUES
  ('s8-cse4592', 'CSE 4592', 'Network Security Laboratory', 8, 1.5, '—')
ON CONFLICT (course_id) DO UPDATE SET
  code = EXCLUDED.code, name = EXCLUDED.name, semester = EXCLUDED.semester, credits = EXCLUDED.credits, instructor = EXCLUDED.instructor;
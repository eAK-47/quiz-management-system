
SET REFERENTIAL_INTEGRITY FALSE;
TRUNCATE TABLE result;
TRUNCATE TABLE question;
TRUNCATE TABLE quiz;
TRUNCATE TABLE student;
TRUNCATE TABLE teacher;
SET REFERENTIAL_INTEGRITY TRUE;

-- 2. TEACHER: Pre-loading at ID 100
INSERT INTO teacher (id, name, tchrid, password)
VALUES (100, 'ak', '1', 'ak');

-- 3. STUDENT: Pre-loading at ID 100
INSERT INTO student (id, name, roll_no, password)
VALUES (100, 'vv', '1', 'ak');

-- 4. INITIAL QUIZ: Pre-loading at ID 100
INSERT INTO quiz (id, title)
VALUES (100, 'Java OOP & Basics');

-- 5. SAMPLE QUESTIONS: Linked to Quiz 100
-- correct_option: 0=A, 1=B, 2=C, 3=D
INSERT INTO question (id, question_text, option1, option2, option3, option4, correct_option, quiz_id)
VALUES (100, 'Which keyword is used to inherit a class in Java?', 'implements', 'extends', 'inherits', 'super', 1, 100);

INSERT INTO question (id, question_text, option1, option2, option3, option4, correct_option, quiz_id)
VALUES (101, 'Which of these is NOT a pillar of OOP?', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Compilation', 3, 100);

-- 6. SEED A RESULT: Using the Hibernate-generated column 'result_quiz_id'
INSERT INTO result (id, student_name, score, total_marks, result_quiz_id)
VALUES (100, 'Akash', 2, 2, 100);
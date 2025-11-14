// =====================================
// ✅ TEAM 6 MOCK DATA FILE (EXPANDED & FIXED)
// =====================================

// Utility: shuffle array
const shuffle = (arr) => arr.slice().sort(() => Math.random() - 0.5);

// =====================================
// RANDOM QUESTION SELECTOR FUNCTION
// =====================================
export const getRandomQuestions = () => {
  const multipleCorrectQuestions = [17, 43];
  const imageQuestions = [42, 44];
  const fillBlankQuestions = [15, 45];
  const textQuestions = [16, 46];
  const multipleChoiceQuestions = [
    14, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
    36, 37, 38, 39, 40, 41,
  ];

  const selectedMultipleCorrect = shuffle(multipleCorrectQuestions).slice(0, 1);
  const selectedImage = shuffle(imageQuestions).slice(0, 1);
  const selectedFillBlank = shuffle(fillBlankQuestions).slice(0, 1);
  const selectedText = shuffle(textQuestions).slice(0, 1);
  const selectedMultipleChoice = shuffle(multipleChoiceQuestions).slice(0, 3);

  return shuffle([
    ...selectedMultipleCorrect,
    ...selectedImage,
    ...selectedFillBlank,
    ...selectedText,
    ...selectedMultipleChoice,
  ]);
};

// =====================================
// COURSE CATEGORIES
// =====================================
export const mockCategories = [
  { id: 1, name: "Математик", description: "Математикийн хичээлүүд" },
  { id: 2, name: "Физик", description: "Физикийн хичээлүүд" },
  {
    id: 3,
    name: "Компьютер шинжлэх ухаан",
    description: "Програм хангамж, систем шинжилгээ",
  },
  { id: 4, name: "Инженер", description: "Инженерийн хичээлүүд" },
  { id: 5, name: "Био хими", description: "Биологи, химийн хичээлүүд" },
];

// =====================================
// COURSES
// =====================================
export const mockCourses = [
  {
    id: 1,
    categoryId: 3,
    name: "Компьютерын архитектур",
    code: "CS301",
    description: "CPU, RAM, ROM, Addressing",
  },
  {
    id: 2,
    categoryId: 1,
    name: "Математик I",
    code: "MATH101",
    description: "Дифференциал тооцоолол",
  },
  {
    id: 3,
    categoryId: 2,
    name: "Физик I",
    code: "PHYS101",
    description: "Механик, хөдөлгөөн",
  },
  {
    id: 4,
    categoryId: 3,
    name: "Өгөгдлийн бүтэц",
    code: "CS201",
    description: "Stack, Queue, LinkedList, Trees",
  },
  {
    id: 5,
    categoryId: 1,
    name: "Математик II",
    code: "MATH102",
    description: "Интеграл, лимит, тооцоолол",
  },
];

// =====================================
// TOPICS
// =====================================
export const mockTopics = [
  { id: 13, courseId: 1, name: "RAM", description: "DRAM, SRAM, SDRAM" },
  { id: 14, courseId: 1, name: "ROM", description: "PROM, EPROM, EEPROM" },
  {
    id: 15,
    courseId: 1,
    name: "CPU-RAM data flow",
    description: "control/data bus",
  },
  { id: 16, courseId: 1, name: "Addressing", description: "Direct, Indirect" },

  { id: 21, courseId: 4, name: "Stack", description: "Push, Pop, Overflow" },
  { id: 22, courseId: 4, name: "Queue", description: "FIFO, enqueue, dequeue" },
];

// =====================================
// EXAMS
// =====================================
export const mockExams = [
  {
    id: 1,
    courseId: 1,
    variantId: 1,
    title: "Компьютерын архитектур — Дундын шалгалт",
    description: "RAM, ROM, CPU, Addressing",
    startDate: "2025-02-15T09:00:00",
    endDate: "2025-02-15T11:00:00",
    duration: 10,
    totalMarks: 35,
    passingMarks: 20,
    status: "active",
    createdBy: "Багш А",
    createdAt: "2025-02-01T10:00:00",
    selectedTopics: [
      { topicId: 13, questionCount: 2 },
      { topicId: 14, questionCount: 2 },
      { topicId: 15, questionCount: 2 },
      { topicId: 16, questionCount: 1 },
    ],
    totalQuestions: 7,
  },
  {
    id: 2,
    courseId: 4,
    variantId: 2,
    title: "Өгөгдлийн бүтэц — Chapter Quiz",
    description: "Stack / Queue",
    startDate: "2025-03-01T09:00:00",
    endDate: "2025-03-01T09:30:00",
    duration: 10,
    totalMarks: 25,
    passingMarks: 15,
    status: "draft",
    createdBy: "Багш C",
    createdAt: "2025-02-20T10:00:00",
    selectedTopics: [
      { topicId: 21, questionCount: 3 },
      { topicId: 22, questionCount: 2 },
    ],
    totalQuestions: 5,
  },
];

// =====================================
// VARIANTS
// =====================================
const makeVariant = (examId, name) => {
  const questionIds = getRandomQuestions();
  return {
    id: Math.floor(Math.random() * 10000),
    examId,
    name,
    description: `${name} — санамсаргүй ${questionIds.length} асуулт`,
    questionIds,
    totalQuestions: questionIds.length,
    createdAt: new Date().toISOString(),
  };
};

export const mockVariants = [
  makeVariant(1, "Вариант A"),
  makeVariant(1, "Вариант B"),
  makeVariant(2, "Вариант C"),
  makeVariant(2, "Вариант D"),
];

// =====================================
// QUESTION BANK (EXPANDED)
// =====================================
export const mockQuestionBank = [
  // Existing
  {
    id: 14,
    courseId: 1,
    topicId: 13,
    question: "DRAM ямар төрлийн санах ой вэ?",
    type: "multiple_choice",
    options: [
      "Тогтмол сэргээх шаардлагатай.",
      "Сэргээх шаардлагагүй",
      "ROM",
      "Flash",
    ],
    correctAnswers: ["Тогтмол сэргээх шаардлагатай."],
    marks: 5,
  },
  {
    id: 15,
    courseId: 1,
    topicId: 13,
    question: "SRAM нь ______ шаардлагагүй санах ой юм.",
    type: "fill_blank",
    correctAnswers: ["сэргээх."],
    acceptableAnswers: ["refresh", "сэргээлт"],
    marks: 5,
  },
  {
    id: 16,
    courseId: 1,
    topicId: 13,
    question: "___ нь системийн цагтай синхрон санах ой.",
    type: "text_answer",
    correctAnswers: ["SDRAM"],
    marks: 5,
  },
  {
    id: 17,
    courseId: 1,
    topicId: 13,
    question: "SDRAM-ийн онцлог (олон хариулт)?",
    type: "multiple_correct",
    options: ["Хурдан", "Удаан", "CPU цагтай синхрон", "Их сэргээлттэй"],
    correctAnswers: ["Хурдан", "CPU цагтай синхрон"],
    marks: 5,
  },
  {
    id: 42,
    courseId: 1,
    topicId: 16,
    question: "Зураг дээрх аль хэсэг нь RAM вэ?",
    image: "/src/team6/data/test1.png",
    type: "multiple_choice",
    options: ["A", "B", "C"],
    correctAnswers: ["A"],
    marks: 5,
  },

  // NEW QUESTIONS
  {
    id: 43,
    courseId: 4,
    topicId: 21,
    type: "multiple_correct",
    question: "Stack-ийн онцлогийг сонго:",
    options: ["LIFO", "FIFO", "Push", "Enqueue"],
    correctAnswers: ["LIFO", "Push"],
    marks: 5,
  },
  {
    id: 44,
    courseId: 4,
    topicId: 21,
    type: "image_question",
    question: "Зураг дээрх бүтэц аль вэ?",
    image: "/src/team6/data/stack.png",
    options: ["Stack", "Queue", "Tree"],
    correctAnswers: ["Stack"],
    marks: 5,
  },
  {
    id: 45,
    courseId: 4,
    topicId: 22,
    type: "fill_blank",
    question: "Queue нь ___ зарчмаар ажилладаг.",
    correctAnswers: ["FIFO"],
    acceptableAnswers: ["fifo"],
    marks: 5,
  },
  {
    id: 46,
    courseId: 4,
    topicId: 22,
    type: "text_answer",
    question: "Queue-д overflow ямар үед үүсдэг вэ?",
    correctAnswers: ["Insert хийх зай дуусах үед"],
    marks: 5,
  },
];

// =====================================
// STUDENTS (more added)
// =====================================
export const mockStudents = [
  { id: 1, name: "Б.Болд", email: "bold@student.edu.mn" },
  { id: 2, name: "Ц.Саруул", email: "saruul@student.edu.mn" },
  { id: 3, name: "Д.Энхжин", email: "enkhjin@student.edu.mn" },
  { id: 4, name: "Л.Хүслэн", email: "khuslen@student.edu.mn" },
  { id: 5, name: "М.Тэмүүлэн", email: "temuulen@student.edu.mn" },
  { id: 6, name: "Ч.Урангоо", email: "urangoo@student.edu.mn" },
];

// =====================================
// TEACHERS
// =====================================
export const mockTeachers = [
  { id: 1, name: "Багш А", email: "teacherA@school.edu.mn", department: "CS" },
  {
    id: 2,
    name: "Багш Б",
    email: "teacherB@school.edu.mn",
    department: "Math",
  },
  { id: 3, name: "Багш C", email: "teacherC@school.edu.mn", department: "CS" },
];

// =====================================
// STUDENT EXAMS
// =====================================
export const mockStudentExams = [
  {
    id: 1,
    examId: 1,
    studentId: 1,
    studentName: "Б.Болд",
    variantId: 1,
    status: "completed",
    score: 22,
    answers: [],
  },
  {
    id: 2,
    examId: 1,
    studentId: 2,
    studentName: "Ц.Саруул",
    variantId: 102,
    status: "in_progress",
    startTime: "2025-02-15T09:10:00",
    score: null,
    answers: [],
  },
  {
    id: 3,
    examId: 2,
    studentId: 3,
    studentName: "Д.Энхжин",
    variantId: 103,
    status: "completed",
    score: null,
    answers: [],
  },
];

// =====================================
// EXAM STATISTICS (expanded)
// =====================================
export const mockExamStats = {
  1: {
    examId: 1,
    totalStudents: 60,
    completedStudents: 23,
    averageScore: 24,
    highestScore: 35,
    lowestScore: 10,
    passRate: 60,
  },
  2: {
    examId: 2,
    totalStudents: 40,
    completedStudents: 18,
    averageScore: 17,
    highestScore: 23,
    lowestScore: 5,
    passRate: 45,
  },
};

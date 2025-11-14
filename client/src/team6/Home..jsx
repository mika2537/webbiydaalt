import { Link } from "react-router-dom";

export default function Team6Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-3xl font-bold mb-8">Team 6 Exam System</h1>

      <Link
        to="/team6/courses/1/exams"
        className="px-8 py-4 bg-black text-white rounded-lg text-xl hover:bg-gray-800"
      >
        📘 Manage Exams
      </Link>

      <Link
        to="/team6/exams/1/students/1/edit"
        className="px-8 py-4 bg-blue-600 text-white rounded-lg text-xl hover:bg-blue-700"
      >
        🧑‍🎓 Take Exam
      </Link>
    </div>
  );
}

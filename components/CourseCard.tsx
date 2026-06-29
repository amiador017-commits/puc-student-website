import { type Course, getLetterGrade } from "../lib/mockData";
import { User } from "lucide-react";

interface Props {
  course: Course;
}

export default function CourseCard({ course }: Props) {
  const total = course.grades.midterm + course.grades.final;
  const max = course.grades.midtermMax + course.grades.finalMax;
  const hasGrades = total > 0;
  const percentage = max > 0 ? Math.round((total / max) * 100) : 0;
  const letter = getLetterGrade(course);

  const barColor = !hasGrades ? "#4b5563" :
    percentage >= 85 ? "#a3e635" :
    percentage >= 70 ? "#60a5fa" :
    percentage >= 55 ? "#fb923c" : "#f87171";

  return (
    <div
      className="p-5 rounded-[26px] group relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "#1c1c22",
        boxShadow: "8px 8px 24px rgba(0,0,0,0.55), inset -6px -6px 12px rgba(0,0,0,0.65), inset 3px 3px 6px rgba(255,255,255,0.06)",
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] font-space-mono text-neon px-3 py-1 rounded-xl font-bold"
            style={{
              background: "rgba(163,230,53,0.1)",
              border: "1px solid rgba(163,230,53,0.15)",
              boxShadow: "inset 1.5px 1.5px 3px rgba(255,255,255,0.15), inset -1.5px -1.5px 3px rgba(0,0,0,0.3)",
            }}
          >
            {course.code}
          </span>
        </div>
        {/* Grade badge */}
        <span
          className="text-sm font-syne font-bold px-3 py-1 rounded-xl"
          style={{
            color: barColor,
            background: `${barColor}18`,
            border: `1px solid ${barColor}30`,
          }}
        >
          {letter}
        </span>
      </div>

      <h3 className="text-sm font-syne font-bold text-white mb-1 group-hover:text-neon transition-colors leading-snug">
        {course.name}
      </h3>

      {/* Instructor */}
      <div className="flex items-center gap-1.5 mb-4">
        <User size={11} className="text-gray-600" />
        <span className="text-[11px] text-gray-500">{course.instructor}</span>
      </div>

      {/* Marks grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div
          className="rounded-xl p-2.5 text-center"
          style={{
            background: "#0b0b0e",
            boxShadow: "inset 3px 3px 6px rgba(0,0,0,0.6), inset -1.5px -1.5px 3px rgba(255,255,255,0.03)",
          }}
        >
          <p className="text-[10px] text-gray-600 mb-1">Midterm</p>
          <p className="font-space-mono text-sm font-bold text-white">
            {course.grades.midterm}
            <span className="text-gray-600 text-[10px">/{course.grades.midtermMax}</span>
          </p>
        </div>
        <div
          className="rounded-xl p-2.5 text-center"
          style={{
            background: "#0b0b0e",
            boxShadow: "inset 3px 3px 6px rgba(0,0,0,0.6), inset -1.5px -1.5px 3px rgba(255,255,255,0.03)",
          }}
        >
          <p className="text-[10px] text-gray-600 mb-1">Final</p>
          <p className="font-space-mono text-sm font-bold text-white">
            {course.grades.final}
            <span className="text-gray-600 text-[10px">/{course.grades.finalMax}</span>
          </p>
        </div>
        <div
          className="rounded-xl p-2.5 text-center"
          style={{
            background: "#0b0b0e",
            boxShadow: "inset 3px 3px 6px rgba(0,0,0,0.6), inset -1.5px -1.5px 3px rgba(255,255,255,0.03)",
          }}
        >
          <p className="text-[10px] text-gray-600 mb-1">Attend.</p>
          <p className="font-space-mono text-sm font-bold text-white">
            {course.grades.attendance}<span className="text-gray-600 text-[10px">%</span>
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] text-gray-600">Overall</span>
          <span className="text-[10px] font-space-mono font-bold" style={{ color: barColor }}>
            {percentage}%
          </span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${percentage}%`, background: barColor, boxShadow: `0 0 6px ${barColor}60` }}
          />
        </div>
      </div>
    </div>
  );
}
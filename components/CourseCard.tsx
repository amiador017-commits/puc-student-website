import { type Course, getLetterGrade, getCourseTotalAndMax } from "../lib/mockData";
import { User, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSession } from "../lib/useSession";
import { saveSavedGrades } from "../lib/grades";

interface ClaySelectProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
}

function ClaySelect({ value, max, onChange }: ClaySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeOptionRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<"down" | "up">("down");

  const options = Array.from({ length: max + 1 }, (_, i) => i);
  const displayValue = value < 10 ? `0${value}` : `${value}`;

  // Smart positioning (auto-flip upwards if not enough space below)
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Dropdown height is approx 200px
    if (spaceBelow < 200 && spaceAbove > spaceBelow) {
      setDropdownPosition("up");
    } else {
      setDropdownPosition("down");
    }
  }, [isOpen]);

  // Center selected option inside dropdown when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (activeOptionRef.current) {
          activeOptionRef.current.scrollIntoView({ block: "center", behavior: "auto" });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Click outside and scroll prevention handlers
  useEffect(() => {
    if (!isOpen) return;

    // Close when clicking/touching outside
    const handleClose = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    // Lock scrolling on background page and modal form
    const handlePreventScroll = (e: WheelEvent | TouchEvent) => {
      const dropdownMenu = containerRef.current?.querySelector("[data-dropdown-menu]");
      if (dropdownMenu && dropdownMenu.contains(e.target as Node)) {
        return; // allow scrolling inside the dropdown menu
      }
      e.preventDefault();
    };

    document.addEventListener("mousedown", handleClose);
    document.addEventListener("touchstart", handleClose);
    window.addEventListener("wheel", handlePreventScroll, { passive: false });
    window.addEventListener("touchmove", handlePreventScroll, { passive: false });

    return () => {
      document.removeEventListener("mousedown", handleClose);
      document.removeEventListener("touchstart", handleClose);
      window.removeEventListener("wheel", handlePreventScroll);
      window.removeEventListener("touchmove", handlePreventScroll);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center rounded-2xl py-2.5 px-4 text-sm text-white font-space-mono bg-[#1c1c22] border border-white/[0.04] focus:outline-none transition-all cursor-pointer select-none"
        style={{
          boxShadow: "4px 4px 10px rgba(0,0,0,0.5), inset -3px -3px 6px rgba(0,0,0,0.65), inset 2px 2px 4px rgba(255,255,255,0.05)",
        }}
      >
        <span>{displayValue}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          data-dropdown-menu
          className={`absolute left-0 right-0 z-50 max-h-48 overflow-y-auto rounded-2xl p-1.5 border border-white/[0.05] animate-fade-in ${
            dropdownPosition === "up" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
          style={{
            background: "#16161c",
            boxShadow: "0 10px 25px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(0,0,0,0.7), inset 2px 2px 4px rgba(255,255,255,0.06)",
            backdropFilter: "blur(10px)",
            overscrollBehavior: "contain",
          }}
        >
          {options.map((opt) => {
            const optLabel = opt < 10 ? `0${opt}` : `${opt}`;
            const isSelected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                ref={isSelected ? activeOptionRef : undefined}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left py-1.5 px-3 rounded-xl text-xs font-space-mono transition-all ${
                  isSelected
                    ? "text-space-950 font-bold bg-[#a3e635]"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                }`}
                style={
                  isSelected
                    ? {
                        boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.4), inset -1px -1px 2px rgba(0,0,0,0.2)",
                      }
                    : {}
                }
              >
                {optLabel}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface Props {
  course: Course;
  onGradesUpdate?: () => void;
}

export default function CourseCard({ course, onGradesUpdate }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempGrades, setTempGrades] = useState<Record<string, number>>({});
  const session = useSession();

  // Sync state with course prop if it changes
  useEffect(() => {
    const initial: Record<string, number> = {
      attendance: course.grades.attendance,
      midterm: course.grades.midterm,
      final: course.grades.final,
      classTest: course.grades.classTest ?? 0,
    };
    if (course.assessmentComponents) {
      for (const comp of course.assessmentComponents) {
        initial[comp.key] = course.grades[comp.key] ?? 0;
      }
    }
    setTempGrades(initial);
  }, [course]);

  const { total, max } = getCourseTotalAndMax(course);
  const hasGrades = total > 0;
  const percentage = max > 0 ? Math.round((total / max) * 100) : 0;
  const letter = getLetterGrade(course);

  const barColor = !hasGrades ? "#4b5563" :
    percentage >= 85 ? "#a3e635" :
    percentage >= 70 ? "#60a5fa" :
    percentage >= 55 ? "#fb923c" : "#f87171";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (session?.studentId) {
      await saveSavedGrades(session.studentId, course.courseId, tempGrades);
      if (onGradesUpdate) {
        onGradesUpdate();
      }
      setIsModalOpen(false);
    }
  };

  // Determine attendance string to render on the card
  let attendanceStr = "N/A";
  if (course.assessmentComponents) {
    const attComp = course.assessmentComponents.find((c) => c.key === "attendance");
    if (attComp) {
      const attVal = course.grades.attendance ?? 0;
      const attPct = attComp.max > 0 ? Math.round((attVal / attComp.max) * 100) : 0;
      attendanceStr = `${attPct}%`;
    }
  } else {
    attendanceStr = `${course.grades.attendance}%`;
  }

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="p-5 rounded-[26px] group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:shadow-[0_0_20px_rgba(163,230,53,0.08)] border border-transparent hover:border-neon/20"
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

        {/* Marks area - Attendance only */}
        <div className="mb-4">
          <div
            className="rounded-xl p-3 flex justify-between items-center"
            style={{
              background: "#0b0b0e",
              boxShadow: "inset 3px 3px 6px rgba(0,0,0,0.6), inset -1.5px -1.5px 3px rgba(255,255,255,0.03)",
            }}
          >
            <span className="text-xs text-gray-500 font-syne">Attendance</span>
            <span className="font-space-mono text-sm font-bold text-white">
              {attendanceStr}
            </span>
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

      {/* Grade Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 cursor-default animate-fade-in"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(false);
          }}
        >
          <div
            className="w-full max-w-md rounded-[32px] p-6 text-left relative overflow-hidden border border-white/[0.05]"
            style={{
              background: "#121216",
              boxShadow: "0 20px 50px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.05)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
              <div>
                <span className="text-[10px] font-space-mono text-neon px-2.5 py-0.5 rounded-lg bg-neon/10 border border-neon/15 font-bold">
                  {course.code}
                </span>
                <h3 className="text-lg font-syne font-bold text-white mt-2 leading-snug">
                  {course.name}
                </h3>
                <p className="text-[11px] text-gray-500 mt-1">Instructor: {course.instructor}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Inputs Form */}
            <form onSubmit={handleSave} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {course.assessmentComponents && course.assessmentComponents.length > 0 ? (
                course.assessmentComponents.map((comp) => (
                  <div key={comp.key}>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs text-gray-400 font-syne font-medium">
                        {comp.label} Marks (Max {comp.max})
                      </label>
                      <span className="text-xs font-space-mono text-gray-500">
                        /{comp.max}
                      </span>
                    </div>
                    <ClaySelect
                      value={tempGrades[comp.key] ?? 0}
                      max={comp.max}
                      onChange={(val) => {
                        setTempGrades((prev) => ({
                          ...prev,
                          [comp.key]: val,
                        }));
                      }}
                    />
                  </div>
                ))
              ) : (
                <>
                  {/* Attendance */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs text-gray-400 font-syne font-medium">Attendance Percentage (Max 100)</label>
                      <span className="text-xs font-space-mono text-neon font-bold">%</span>
                    </div>
                    <ClaySelect
                      value={tempGrades.attendance ?? 0}
                      max={100}
                      onChange={(val) => setTempGrades((prev) => ({ ...prev, attendance: val }))}
                    />
                  </div>

                  {/* Midterm */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs text-gray-400 font-syne font-medium">Midterm Marks (Max 30)</label>
                      <span className="text-xs font-space-mono text-gray-500">/30</span>
                    </div>
                    <ClaySelect
                      value={tempGrades.midterm ?? 0}
                      max={30}
                      onChange={(val) => setTempGrades((prev) => ({ ...prev, midterm: val }))}
                    />
                  </div>

                  {/* Final */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs text-gray-400 font-syne font-medium">Final Marks (Max 50)</label>
                      <span className="text-xs font-space-mono text-gray-500">/50</span>
                    </div>
                    <ClaySelect
                      value={tempGrades.final ?? 0}
                      max={50}
                      onChange={(val) => setTempGrades((prev) => ({ ...prev, final: val }))}
                    />
                  </div>

                  {/* Class Test */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs text-gray-400 font-syne font-medium">Class Test Marks (Max 20)</label>
                      <span className="text-xs font-space-mono text-gray-500">/20</span>
                    </div>
                    <ClaySelect
                      value={tempGrades.classTest ?? 0}
                      max={20}
                      onChange={(val) => setTempGrades((prev) => ({ ...prev, classTest: val }))}
                    />
                  </div>
                </>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-2xl text-xs font-syne font-bold text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all border border-white/[0.06]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl text-xs font-syne font-bold text-space-950 hover:opacity-90 transition-all font-bold"
                  style={{
                    background: "#a3e635",
                    boxShadow: "0 4px 12px rgba(163,230,53,0.25)",
                  }}
                >
                  Save Marks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
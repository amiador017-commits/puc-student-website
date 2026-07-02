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

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    if (spaceBelow < 200 && spaceAbove > spaceBelow) {
      setDropdownPosition("up");
    } else {
      setDropdownPosition("down");
    }
  }, [isOpen]);

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

  useEffect(() => {
    if (!isOpen) return;
    const handleClose = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handlePreventScroll = (e: WheelEvent | TouchEvent) => {
      const dropdownMenu = containerRef.current?.querySelector("[data-dropdown-menu]");
      if (dropdownMenu && dropdownMenu.contains(e.target as Node)) return;
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
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onKeyDown={(e) => {
          if (e.key === "Escape") setIsOpen(false);
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setIsOpen((o) => !o); }
        }}
        className="clay-input w-full flex justify-between items-center py-2.5 px-4 text-sm text-white font-space-mono focus:outline-none cursor-pointer select-none"
      >
        <span>{displayValue}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          data-dropdown-menu
          role="listbox"
          className={`absolute left-0 right-0 z-50 max-h-48 overflow-y-auto rounded-clay p-1.5 border border-white/[0.05] animate-fade-in ${
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
                role="option"
                aria-selected={isSelected}
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`w-full text-left py-1.5 px-3 rounded-clay-sm text-xs font-space-mono transition-all ${
                  isSelected
                    ? "text-space-950 font-bold bg-neon"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                }`}
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
      if (onGradesUpdate) onGradesUpdate();
      setIsModalOpen(false);
    }
  };

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
        className="clay-card p-5 group relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(163,230,53,0.06)] border border-transparent hover:border-neon/15"
      >
        <div className="flex items-start justify-between mb-4">
          <span
            className="text-[10px] font-space-mono text-neon px-3 py-1 rounded-clay-sm font-bold"
            style={{ background: "rgba(163,230,53,0.1)", border: "1px solid rgba(163,230,53,0.15)" }}
          >
            {course.code}
          </span>
          <span
            className="text-sm font-syne font-bold px-3 py-1 rounded-clay-sm"
            style={{ color: barColor, background: `${barColor}18`, border: `1px solid ${barColor}30` }}
          >
            {letter}
          </span>
        </div>

        <h3 className="text-sm font-syne font-bold text-white mb-1 group-hover:text-neon transition-colors leading-snug">
          {course.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-4">
          <User size={11} className="text-gray-600" />
          <span className="text-[11px] text-gray-500">{course.instructor}</span>
        </div>

        <div className="mb-4">
          <div className="clay-input rounded-clay p-3 flex justify-between items-center">
            <span className="text-xs text-gray-500 font-syne">Attendance</span>
            <span className="font-space-mono text-sm font-bold text-white">{attendanceStr}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] text-gray-600">Overall</span>
            <span className="text-[10px] font-space-mono font-bold" style={{ color: barColor }}>{percentage}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${percentage}%`, background: barColor }}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 cursor-default animate-fade-in"
          onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
        >
          <div
            className="w-full max-w-md rounded-clay-xl p-6 text-left relative overflow-hidden shadow-clay-floating border border-white/[0.05]"
            style={{ background: "#121216" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-5">
              <div>
                <span className="text-[10px] font-space-mono text-neon px-2.5 py-0.5 rounded-clay-sm bg-neon/10 border border-neon/15 font-bold">
                  {course.code}
                </span>
                <h3 className="text-lg font-syne font-bold text-white mt-2 leading-snug">{course.name}</h3>
                <p className="text-[11px] text-gray-500 mt-1">Instructor: {course.instructor}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-clay-sm bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} data-lenis-prevent className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {course.assessmentComponents && course.assessmentComponents.length > 0 ? (
                course.assessmentComponents.map((comp) => (
                  <div key={comp.key}>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs text-gray-400 font-syne font-medium">
                        {comp.label} Marks (Max {comp.max})
                      </label>
                      <span className="text-xs font-space-mono text-gray-500">/{comp.max}</span>
                    </div>
                    <ClaySelect
                      value={tempGrades[comp.key] ?? 0}
                      max={comp.max}
                      onChange={(val) => setTempGrades((prev) => ({ ...prev, [comp.key]: val }))}
                    />
                  </div>
                ))
              ) : (
                <>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs text-gray-400 font-syne font-medium">Attendance Percentage (Max 100)</label>
                      <span className="text-xs font-space-mono text-neon font-bold">%</span>
                    </div>
                    <ClaySelect value={tempGrades.attendance ?? 0} max={100} onChange={(val) => setTempGrades((prev) => ({ ...prev, attendance: val }))} />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs text-gray-400 font-syne font-medium">Midterm Marks (Max 30)</label>
                      <span className="text-xs font-space-mono text-gray-500">/30</span>
                    </div>
                    <ClaySelect value={tempGrades.midterm ?? 0} max={30} onChange={(val) => setTempGrades((prev) => ({ ...prev, midterm: val }))} />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs text-gray-400 font-syne font-medium">Final Marks (Max 50)</label>
                      <span className="text-xs font-space-mono text-gray-500">/50</span>
                    </div>
                    <ClaySelect value={tempGrades.final ?? 0} max={50} onChange={(val) => setTempGrades((prev) => ({ ...prev, final: val }))} />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs text-gray-400 font-syne font-medium">Class Test Marks (Max 20)</label>
                      <span className="text-xs font-space-mono text-gray-500">/20</span>
                    </div>
                    <ClaySelect value={tempGrades.classTest ?? 0} max={20} onChange={(val) => setTempGrades((prev) => ({ ...prev, classTest: val }))} />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-clay text-xs font-syne font-bold text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all border border-white/[0.06]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-clay text-xs font-syne font-bold text-space-950 clay-btn"
                  style={{ background: "#a3e635" }}
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

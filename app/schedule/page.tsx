"use client";
import { useEffect, useState } from "react";
import { type ScheduleEntry, mapDbRowsToSchedule } from "../../lib/mockData";
import { Clock, MapPin } from "lucide-react";
import { createClient } from "../../lib/supabase";
import { useSession } from "../../lib/useSession";

const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"];

const COLOR_PALETTE: Array<{ text: string; bg: string; border: string; glow: string }> = [
  { text: "#a3e635", bg: "rgba(163,230,53,0.08)",  border: "rgba(163,230,53,0.2)",  glow: "rgba(163,230,53,0.1)"  }, // neon
  { text: "#c084fc", bg: "rgba(192,132,252,0.08)", border: "rgba(192,132,252,0.2)", glow: "rgba(192,132,252,0.1)" }, // violet
  { text: "#fbbf24", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.2)",  glow: "rgba(251,191,36,0.1)"  }, // amber
  { text: "#38bdf8", bg: "rgba(56,189,248,0.08)",  border: "rgba(56,189,248,0.2)",  glow: "rgba(56,189,248,0.1)"  }, // sky
  { text: "#fb7185", bg: "rgba(251,113,133,0.08)", border: "rgba(251,113,133,0.2)", glow: "rgba(251,113,133,0.1)" }, // rose
  { text: "#2dd4bf", bg: "rgba(45,212,191,0.08)",  border: "rgba(45,212,191,0.2)",  glow: "rgba(45,212,191,0.1)"  }, // teal
  { text: "#fb923c", bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.2)",  glow: "rgba(251,146,60,0.1)"  }, // orange
];

// Assigns a stable color to each unique course code based on its position in the sorted list.
function buildCourseColorMap(entries: ScheduleEntry[]): Map<string, typeof COLOR_PALETTE[0]> {
  const codes = Array.from(new Set(entries.map((e) => e.courseCode))).sort();
  const map = new Map<string, typeof COLOR_PALETTE[0]>();
  codes.forEach((code, i) => map.set(code, COLOR_PALETTE[i % COLOR_PALETTE.length]));
  return map;
}

function ClassCard({ entry, colorMap }: { entry: ScheduleEntry; colorMap: Map<string, typeof COLOR_PALETTE[0]> }) {
  const c = colorMap.get(entry.courseCode) ?? COLOR_PALETTE[0];
  return (
    <div
      className="rounded-2xl p-3.5 transition-all duration-200 hover:-translate-y-0.5 h-full flex flex-col justify-between"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        boxShadow: `0 4px 12px ${c.glow}`,
      }}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span
            className="text-[10px] font-space-mono font-bold px-2 py-0.5 rounded-lg"
            style={{ color: c.text, background: `${c.text}18` }}
          >
            {entry.courseCode}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <Clock size={9} />
            <span className="font-space-mono">{entry.startTime}–{entry.endTime}</span>
          </div>
        </div>
        <p className="text-xs font-syne font-bold text-white mb-1.5 leading-tight">{entry.courseName}</p>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <MapPin size={9} />
            <span>Room {entry.room}</span>
          </div>
          {entry.duration && (
            <span className="text-[9px] text-gray-600 font-space-mono">{entry.duration}</span>
          )}
        </div>
        <p className="text-[10px] text-gray-600 mt-0.5">{entry.instructor}</p>
      </div>
    </div>
  );
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const courseColorMap = buildCourseColorMap(schedule);
  const [semLabel, setSemLabel] = useState("");
  const [sectionLabel, setSectionLabel] = useState("");
  const [totalCourses, setTotalCourses] = useState(0);
  const session = useSession();

  useEffect(() => {
    if (!session) return;

    setSemLabel(`${ordinal(session.semester)} Semester`);
    setSectionLabel(`Section ${session.section}`);

    const supabase = createClient();

    // Fetch schedule entries for this semester + section
    supabase
      .from("schedules")
      .select("day, start_time, end_time, duration, course_code, course_name, room, instructor, color")
      .eq("semester", session.semester)
      .eq("section", session.section)
      .then(({ data }) => {
        if (data) setSchedule(mapDbRowsToSchedule(data));
      });

    // Fetch total courses for this semester from the courses table
    supabase
      .from("courses")
      .select("course_id", { count: "exact", head: true })
      .eq("semester", session.semester)
      .then(({ count }) => {
        if (count !== null) setTotalCourses(count);
      });
  }, [session?.semester, session?.section]);

  // Count unique (day, startTime) pairs — each pair is one visible class slot
  const totalClasses = new Set(schedule.map((s) => `${s.day}|${s.startTime}`)).size;

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <p className="text-xs text-gray-600 mb-1 font-space-mono tracking-widest uppercase">Dashboards / Schedule</p>
        <h1 className="text-2xl font-syne font-bold text-white">Schedule</h1>
        <p className="text-sm text-gray-500 mt-1">
          Weekly class timetable
          {semLabel && sectionLabel
            ? ` — ${semLabel}, ${sectionLabel}`
            : " — Loading..."}
        </p>
      </header>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {Array.from(courseColorMap.entries()).map(([code, c]) => (
          <div key={code} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.text }} />
            <span className="text-[11px] text-gray-400 font-space-mono">{code}</span>
          </div>
        ))}
        <div className="ml-auto flex gap-4 text-xs text-gray-500">
          <span><span className="font-space-mono font-bold text-white">{totalClasses}</span> classes/week</span>
          <span><span className="font-space-mono font-bold text-white">{totalCourses}</span> courses</span>
        </div>
      </div>

      {/* Timetable grid */}
      <div
        className="rounded-[26px] overflow-hidden"
        style={{
          background: "#121216",
          boxShadow: "10px 10px 30px rgba(0,0,0,0.5), inset -6px -6px 12px rgba(0,0,0,0.7), inset 3px 3px 6px rgba(255,255,255,0.04)",
        }}
      >
        {/* Horizontal scroll container for smaller screens */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px] grid grid-cols-[100px_repeat(5,1fr)] divide-x divide-y divide-white/[0.04]">
            {/* Header row */}
            <div className="p-3.5 bg-space-950 font-syne font-bold text-xs text-gray-500 flex items-center justify-center">
              Time
            </div>
            {DAYS.map((day) => {
              const dayClasses = schedule.filter((s) => s.day === day);
              return (
                <div key={day} className="px-4 py-3.5 bg-space-950 text-center">
                  <p className="text-xs font-syne font-bold text-white">{day}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5 font-space-mono">
                    {dayClasses.length} class{dayClasses.length !== 1 ? "es" : ""}
                  </p>
                </div>
              );
            })}

            {/* Time Slot Row 1 (8:30-9:45) */}
            <div className="p-3.5 flex flex-col items-center justify-center bg-white/[0.01]">
              <span className="text-xs font-bold text-white font-space-mono">8:30</span>
              <span className="text-[10px] text-gray-600 font-space-mono">9:45</span>
            </div>
            {DAYS.map((day) => {
              const item = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "8:30" && s.endTime.replace(/^0/, "") === "9:45");
              const lab = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "8:30" && s.endTime.replace(/^0/, "") === "11:00");
              if (lab) {
                return (
                  <div key={day} className="p-3 row-span-2 flex flex-col h-full" style={{ gridRowEnd: "span 2" }}>
                    <ClassCard entry={lab} colorMap={courseColorMap} />
                  </div>
                );
              }
              return (
                <div key={day} className="p-3 flex flex-col h-full">
                  {item ? <ClassCard entry={item} colorMap={courseColorMap} /> : <div className="h-full min-h-[60px] flex items-center justify-center text-[10px] text-gray-800 font-space-mono">Empty</div>}
                </div>
              );
            })}

            {/* Time Slot Row 2 (9:45-11:00) */}
            <div className="p-3.5 flex flex-col items-center justify-center bg-white/[0.01]">
              <span className="text-xs font-bold text-white font-space-mono">9:45</span>
              <span className="text-[10px] text-gray-600 font-space-mono">11:00</span>
            </div>
            {DAYS.map((day) => {
              const lab = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "8:30" && s.endTime.replace(/^0/, "") === "11:00");
              if (lab) return null;
              const item = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "9:45" && s.endTime.replace(/^0/, "") === "11:00");
              return (
                <div key={day} className="p-3 flex flex-col h-full">
                  {item ? <ClassCard entry={item} colorMap={courseColorMap} /> : <div className="h-full min-h-[60px] flex items-center justify-center text-[10px] text-gray-800 font-space-mono">Empty</div>}
                </div>
              );
            })}

            {/* Time Slot Row 3 (11:00-12:15) */}
            <div className="p-3.5 flex flex-col items-center justify-center bg-white/[0.01]">
              <span className="text-xs font-bold text-white font-space-mono">11:00</span>
              <span className="text-[10px] text-gray-600 font-space-mono">12:15</span>
            </div>
            {DAYS.map((day) => {
              const item = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "11:00" && s.endTime.replace(/^0/, "") === "12:15");
              const lab = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "11:00" && s.endTime.replace(/^0/, "") === "1:30");
              if (lab) {
                return (
                  <div key={day} className="p-3 row-span-2 flex flex-col h-full" style={{ gridRowEnd: "span 2" }}>
                    <ClassCard entry={lab} colorMap={courseColorMap} />
                  </div>
                );
              }
              return (
                <div key={day} className="p-3 flex flex-col h-full">
                  {item ? <ClassCard entry={item} colorMap={courseColorMap} /> : <div className="h-full min-h-[60px] flex items-center justify-center text-[10px] text-gray-800 font-space-mono">Empty</div>}
                </div>
              );
            })}

            {/* Time Slot Row 4 (12:15-1:30) */}
            <div className="p-3.5 flex flex-col items-center justify-center bg-white/[0.01]">
              <span className="text-xs font-bold text-white font-space-mono">12:15</span>
              <span className="text-[10px] text-gray-600 font-space-mono">1:30</span>
            </div>
            {DAYS.map((day) => {
              const lab = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "11:00" && s.endTime.replace(/^0/, "") === "1:30");
              if (lab) return null;
              const item = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "12:15" && s.endTime.replace(/^0/, "") === "1:30");
              return (
                <div key={day} className="p-3 flex flex-col h-full">
                  {item ? <ClassCard entry={item} colorMap={courseColorMap} /> : <div className="h-full min-h-[60px] flex items-center justify-center text-[10px] text-gray-800 font-space-mono">Empty</div>}
                </div>
              );
            })}

            {/* Time Slot Row 5 (1:30-2:45 / 1:30-4:00 Labs) */}
            <div className="p-3.5 flex flex-col items-center justify-center bg-white/[0.01]">
              <span className="text-xs font-bold text-white font-space-mono">1:30</span>
              <span className="text-[10px] text-gray-600 font-space-mono">2:45</span>
            </div>
            {DAYS.map((day) => {
              const item = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "1:30" && s.endTime.replace(/^0/, "") === "2:45");
              const lab = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "1:30" && s.endTime.replace(/^0/, "") === "4:00");
              if (lab) {
                return (
                  <div key={day} className="p-3 row-span-2 flex flex-col h-full" style={{ gridRowEnd: "span 2" }}>
                    <ClassCard entry={lab} colorMap={courseColorMap} />
                  </div>
                );
              }
              return (
                <div key={day} className="p-3 flex flex-col h-full">
                  {item ? <ClassCard entry={item} colorMap={courseColorMap} /> : <div className="h-full min-h-[60px] flex items-center justify-center text-[10px] text-gray-800 font-space-mono">Empty</div>}
                </div>
              );
            })}

            {/* Time Slot Row 6 (2:45-4:00) */}
            <div className="p-3.5 flex flex-col items-center justify-center bg-white/[0.01]">
              <span className="text-xs font-bold text-white font-space-mono">2:45</span>
              <span className="text-[10px] text-gray-600 font-space-mono">4:00</span>
            </div>
            {DAYS.map((day) => {
              const lab = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "1:30" && s.endTime.replace(/^0/, "") === "4:00");
              if (lab) return null;
              const item = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "2:45" && s.endTime.replace(/^0/, "") === "4:00");
              return (
                <div key={day} className="p-3 flex flex-col h-full">
                  {item ? <ClassCard entry={item} colorMap={courseColorMap} /> : <div className="h-full min-h-[60px] flex items-center justify-center text-[10px] text-gray-800 font-space-mono">Empty</div>}
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </div>
  );
}

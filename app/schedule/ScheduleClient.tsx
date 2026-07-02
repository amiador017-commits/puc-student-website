"use client";
import { useState, useEffect } from "react";
import { type ScheduleEntry, mapDbRowsToSchedule } from "../../lib/mockData";
import { Clock, MapPin } from "lucide-react";
import { createClient } from "../../lib/supabase";
import { useSession } from "../../lib/useSession";
import type { SessionUser } from "../../lib/server-session";

const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"];

const COLOR_PALETTE: Array<{ text: string; bg: string; border: string; glow: string }> = [
  { text: "#a3e635", bg: "rgba(163,230,53,0.08)",  border: "rgba(163,230,53,0.2)",  glow: "rgba(163,230,53,0.1)"  },
  { text: "#c084fc", bg: "rgba(192,132,252,0.08)", border: "rgba(192,132,252,0.2)", glow: "rgba(192,132,252,0.1)" },
  { text: "#fbbf24", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.2)",  glow: "rgba(251,191,36,0.1)"  },
  { text: "#38bdf8", bg: "rgba(56,189,248,0.08)",  border: "rgba(56,189,248,0.2)",  glow: "rgba(56,189,248,0.1)"  },
  { text: "#fb7185", bg: "rgba(251,113,133,0.08)", border: "rgba(251,113,133,0.2)", glow: "rgba(251,113,133,0.1)" },
  { text: "#2dd4bf", bg: "rgba(45,212,191,0.08)",  border: "rgba(45,212,191,0.2)",  glow: "rgba(45,212,191,0.1)"  },
  { text: "#fb923c", bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.2)",  glow: "rgba(251,146,60,0.1)"  },
];

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
      className="rounded-clay-sm md:rounded-clay-lg p-0.5 md:p-3.5 transition-all duration-200 hover:-translate-y-0.5 h-full flex flex-col justify-between"
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
    >
      <div className="flex flex-col justify-between h-full">
        <div className="flex md:flex-row flex-col items-start justify-between gap-0.5 md:gap-2 md:mb-2">
          <span className="text-[7px] md:text-[10px] font-space-mono font-bold px-0.5 md:px-2 py-0.5 rounded" style={{ color: c.text, background: `${c.text}18` }}>
            {entry.courseCode}
          </span>
          <div className="hidden md:flex items-center gap-1 text-[10px] text-gray-500">
            <Clock size={7} className="md:w-2.5 md:h-2.5" />
            <span className="font-space-mono">{entry.startTime}–{entry.endTime}</span>
          </div>
        </div>
        <p className="text-[9px] md:text-xs font-syne font-bold text-white mb-1 md:mb-1.5 leading-tight line-clamp-2 hidden md:block">
          {entry.courseName}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5 md:gap-1 text-[7px] md:text-[10px] text-gray-400 font-space-mono">
            <MapPin size={6} className="hidden md:inline md:w-2.5 md:h-2.5" />
            <span>R{entry.room}</span>
          </div>
          {entry.duration && (
            <span className="text-[7px] md:text-[9px] text-gray-600 font-space-mono hidden md:inline">{entry.duration}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

export default function ScheduleClient({
  initialUser,
  initialSchedule,
  initialTotalCourses,
}: {
  initialUser: SessionUser | null;
  initialSchedule: ScheduleEntry[];
  initialTotalCourses: number;
}) {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(initialSchedule);
  const [totalCourses, setTotalCourses] = useState(initialTotalCourses);
  const [dataFetched, setDataFetched] = useState(initialSchedule.length > 0);
  const [semLabel, setSemLabel] = useState("");
  const [sectionLabel, setSectionLabel] = useState("");
  const session = useSession();

  useEffect(() => {
    if (!session) return;
    setSemLabel(`${ordinal(session.semester)} Semester`);
    setSectionLabel(`Section ${session.section}`);
    if (dataFetched) return;
    const supabase = createClient();
    supabase
      .from("schedules")
      .select("day, start_time, end_time, duration, course_code, course_name, room, instructor, color")
      .eq("semester", session.semester)
      .eq("section", session.section)
      .then(({ data }) => {
        if (data) {
          setSchedule(mapDbRowsToSchedule(data));
          setDataFetched(true);
        }
      });
    supabase
      .from("courses")
      .select("course_id", { count: "exact", head: true })
      .eq("semester", session.semester)
      .then(({ count }) => {
        if (count !== null) setTotalCourses(count);
      });
  }, [session?.semester, session?.section, dataFetched]);

  const courseColorMap = buildCourseColorMap(schedule);
  const totalClasses = new Set(schedule.map((s) => `${s.day}|${s.startTime}`)).size;

  return (
    <div className="p-1.5 md:p-8">
      <header className="mb-2 md:mb-8">
        <p className="page-breadcrumb text-[9px] md:text-xs">Dashboards / Schedule</p>
        <h1 className="text-lg md:text-2xl font-syne font-bold text-white">Schedule</h1>
        <p className="text-[11px] md:text-sm text-gray-500 mt-0.5 md:mt-1">
          Weekly class timetable
          {semLabel && sectionLabel ? ` — ${semLabel}, ${sectionLabel}` : " — Loading..."}
        </p>
      </header>

      <div className="flex flex-wrap gap-1.5 md:gap-3 mb-3 md:mb-6">
        {Array.from(courseColorMap.entries()).map(([code, c]) => (
          <div key={code} className="flex items-center gap-1 md:gap-2">
            <div className="w-1 h-1 md:w-2.5 md:h-2.5 rounded-full" style={{ background: c.text }} />
            <span className="text-[8px] md:text-[11px] text-gray-400 font-space-mono">{code}</span>
          </div>
        ))}
        <div className="ml-auto flex gap-1.5 md:gap-4 text-[9px] md:text-xs text-gray-500">
          <span><span className="font-space-mono font-bold text-white">{totalClasses}</span> cl<span className="hidden md:inline">asses/week</span><span className="md:hidden">/w</span></span>
          <span><span className="font-space-mono font-bold text-white">{totalCourses}</span> co<span className="hidden md:inline">urses</span><span className="md:hidden">rs</span></span>
        </div>
      </div>

      <div className="shadow-clay-raised rounded-clay-sm md:rounded-clay-xl overflow-hidden" style={{ background: "#121216" }}>
        <div className="overflow-x-auto md:overflow-x-visible">
          <div className="min-w-0 md:min-w-[800px] grid grid-cols-[32px_repeat(5,1fr)] md:grid-cols-[100px_repeat(5,1fr)] divide-x divide-y divide-white/[0.04]">
            <div className="p-0.5 md:p-3.5 bg-space-950 font-syne font-bold text-[8px] md:text-xs text-gray-500 flex items-center justify-center">
              Time
            </div>
            {DAYS.map((day) => {
              const dayClasses = schedule.filter((s) => s.day === day);
              return (
                <div key={day} className="px-0.5 py-0.5 md:px-4 md:py-3.5 bg-space-950 text-center">
                  <p className="text-[8px] md:text-xs font-syne font-bold text-white">
                    {day.substring(0, 3)}<span className="hidden md:inline">{day.substring(3)}</span>
                  </p>
                  <p className="text-[7px] md:text-[10px] text-gray-600 mt-0.5 font-space-mono">
                    {dayClasses.length} <span className="hidden md:inline">class{dayClasses.length !== 1 ? "es" : ""}</span><span className="md:hidden">c</span>
                  </p>
                </div>
              );
            })}

            <div className="p-0.5 md:p-3.5 flex flex-col items-center justify-center bg-white/[0.01]">
              <span className="text-[8px] md:text-xs font-bold text-white font-space-mono">8:30</span>
              <span className="text-[7px] md:text-[10px] text-gray-600 font-space-mono">9:45</span>
            </div>
            {DAYS.map((day) => {
              const item = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "8:30" && s.endTime.replace(/^0/, "") === "9:45");
              const lab = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "8:30" && s.endTime.replace(/^0/, "") === "11:00");
              if (lab) {
                return (
                  <div key={day} className="p-0.5 md:p-3 row-span-2 flex flex-col h-full" style={{ gridRowEnd: "span 2" }}>
                    <ClassCard entry={lab} colorMap={courseColorMap} />
                  </div>
                );
              }
              return (
                <div key={day} className="p-0.5 md:p-3 flex flex-col h-full">
                  {item ? <ClassCard entry={item} colorMap={courseColorMap} /> : <div className="h-full min-h-[42px] md:min-h-[60px] flex items-center justify-center text-[7px] md:text-[10px] text-gray-800 font-space-mono">Empty</div>}
                </div>
              );
            })}

            <div className="p-0.5 md:p-3.5 flex flex-col items-center justify-center bg-white/[0.01]">
              <span className="text-[8px] md:text-xs font-bold text-white font-space-mono">9:45</span>
              <span className="text-[7px] md:text-[10px] text-gray-600 font-space-mono">11:00</span>
            </div>
            {DAYS.map((day) => {
              const lab = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "8:30" && s.endTime.replace(/^0/, "") === "11:00");
              if (lab) return null;
              const item = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "9:45" && s.endTime.replace(/^0/, "") === "11:00");
              return (
                <div key={day} className="p-0.5 md:p-3 flex flex-col h-full">
                  {item ? <ClassCard entry={item} colorMap={courseColorMap} /> : <div className="h-full min-h-[42px] md:min-h-[60px] flex items-center justify-center text-[7px] md:text-[10px] text-gray-800 font-space-mono">Empty</div>}
                </div>
              );
            })}

            <div className="p-0.5 md:p-3.5 flex flex-col items-center justify-center bg-white/[0.01]">
              <span className="text-[8px] md:text-xs font-bold text-white font-space-mono">11:00</span>
              <span className="text-[7px] md:text-[10px] text-gray-600 font-space-mono">12:15</span>
            </div>
            {DAYS.map((day) => {
              const item = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "11:00" && s.endTime.replace(/^0/, "") === "12:15");
              const lab = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "11:00" && s.endTime.replace(/^0/, "") === "1:30");
              if (lab) {
                return (
                  <div key={day} className="p-0.5 md:p-3 row-span-2 flex flex-col h-full" style={{ gridRowEnd: "span 2" }}>
                    <ClassCard entry={lab} colorMap={courseColorMap} />
                  </div>
                );
              }
              return (
                <div key={day} className="p-0.5 md:p-3 flex flex-col h-full">
                  {item ? <ClassCard entry={item} colorMap={courseColorMap} /> : <div className="h-full min-h-[42px] md:min-h-[60px] flex items-center justify-center text-[7px] md:text-[10px] text-gray-800 font-space-mono">Empty</div>}
                </div>
              );
            })}

            <div className="p-0.5 md:p-3.5 flex flex-col items-center justify-center bg-white/[0.01]">
              <span className="text-[8px] md:text-xs font-bold text-white font-space-mono">12:15</span>
              <span className="text-[7px] md:text-[10px] text-gray-600 font-space-mono">1:30</span>
            </div>
            {DAYS.map((day) => {
              const lab = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "11:00" && s.endTime.replace(/^0/, "") === "1:30");
              if (lab) return null;
              const item = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "12:15" && s.endTime.replace(/^0/, "") === "1:30");
              return (
                <div key={day} className="p-0.5 md:p-3 flex flex-col h-full">
                  {item ? <ClassCard entry={item} colorMap={courseColorMap} /> : <div className="h-full min-h-[42px] md:min-h-[60px] flex items-center justify-center text-[7px] md:text-[10px] text-gray-800 font-space-mono">Empty</div>}
                </div>
              );
            })}

            <div className="p-0.5 md:p-3.5 flex flex-col items-center justify-center bg-white/[0.01]">
              <span className="text-[8px] md:text-xs font-bold text-white font-space-mono">1:30</span>
              <span className="text-[7px] md:text-[10px] text-gray-600 font-space-mono">2:45</span>
            </div>
            {DAYS.map((day) => {
              const item = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "1:30" && s.endTime.replace(/^0/, "") === "2:45");
              const lab = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "1:30" && s.endTime.replace(/^0/, "") === "4:00");
              if (lab) {
                return (
                  <div key={day} className="p-0.5 md:p-3 row-span-2 flex flex-col h-full" style={{ gridRowEnd: "span 2" }}>
                    <ClassCard entry={lab} colorMap={courseColorMap} />
                  </div>
                );
              }
              return (
                <div key={day} className="p-0.5 md:p-3 flex flex-col h-full">
                  {item ? <ClassCard entry={item} colorMap={courseColorMap} /> : <div className="h-full min-h-[42px] md:min-h-[60px] flex items-center justify-center text-[7px] md:text-[10px] text-gray-800 font-space-mono">Empty</div>}
                </div>
              );
            })}

            <div className="p-0.5 md:p-3.5 flex flex-col items-center justify-center bg-white/[0.01]">
              <span className="text-[8px] md:text-xs font-bold text-white font-space-mono">2:45</span>
              <span className="text-[7px] md:text-[10px] text-gray-600 font-space-mono">4:00</span>
            </div>
            {DAYS.map((day) => {
              const lab = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "1:30" && s.endTime.replace(/^0/, "") === "4:00");
              if (lab) return null;
              const item = schedule.find((s) => s.day === day && s.startTime.replace(/^0/, "") === "2:45" && s.endTime.replace(/^0/, "") === "4:00");
              return (
                <div key={day} className="p-0.5 md:p-3 flex flex-col h-full">
                  {item ? <ClassCard entry={item} colorMap={courseColorMap} /> : <div className="h-full min-h-[42px] md:min-h-[60px] flex items-center justify-center text-[7px] md:text-[10px] text-gray-800 font-space-mono">Empty</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

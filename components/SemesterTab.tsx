interface Props { semesterNumber: number; active: boolean; onClick: () => void; }
export default function SemesterTab({ semesterNumber, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm rounded-xl whitespace-nowrap transition-all duration-200 font-syne font-bold active:scale-95 ${
        active 
          ? "bg-neon text-space-950 border border-neon/20 shadow-[4px_4px_10px_rgba(0,0,0,0.3),_inset_-3.5px_-3.5px_7px_rgba(0,0,0,0.35),_inset_2px_2px_4px_rgba(255,255,255,0.5)]" 
          : "bg-black/25 text-gray-400 border border-black/20 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5),_inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.03)] hover:text-white"
      }`}
    >
      Semester {semesterNumber}
    </button>
  );
}
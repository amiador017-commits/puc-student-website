interface Props { semesterNumber: number; active: boolean; onClick: () => void; }
export default function SemesterTab({ semesterNumber, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm rounded-clay whitespace-nowrap transition-all duration-200 font-syne font-bold active:scale-95 ${
        active 
          ? "bg-neon text-space-950 border border-neon/20 shadow-clay-neon" 
          : "bg-black/25 text-gray-400 border border-black/20 shadow-clay-inset hover:text-white"
      }`}
    >
      Semester {semesterNumber}
    </button>
  );
}

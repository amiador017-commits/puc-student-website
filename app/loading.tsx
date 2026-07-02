export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-clay-lg flex items-center justify-center bg-neon shadow-clay-neon">
          <span className="font-syne font-black text-xl text-space-950 select-none">P</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-neon animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-neon animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-neon animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

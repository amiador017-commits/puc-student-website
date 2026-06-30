export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse"
          style={{
            background: "#a3e635",
            boxShadow: "0 0 20px rgba(163,230,53,0.3)",
          }}
        >
          <span className="font-syne font-black text-xl text-space-950 select-none">
            P
          </span>
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

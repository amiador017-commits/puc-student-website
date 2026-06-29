interface Props { title: string; icon: React.ReactNode; value: string | number; subtitle: string; trend?: string; trendDown?: boolean; }
export default function DashboardCard({ title, icon, value, subtitle, trend, trendDown }: Props) {
  return (
    <div className="flat-card p-6 flex flex-col justify-between relative overflow-hidden group min-h-[170px]">
      {/* Decorative Clay Knob Dot (Top Right) */}
      <div className="w-3.5 h-3.5 rounded-full bg-white/[0.03] shadow-[inset_-1.5px_-1.5px_3px_rgba(0,0,0,0.4),_inset_1px_1px_2px_rgba(255,255,255,0.05),_1.5px_1.5px_3px_rgba(0,0,0,0.15)] border border-white/5 absolute top-6 right-6" />

      <div>
        {/* Clay Knob Icon Container (Top Left) */}
        <div className="w-11 h-11 rounded-2xl bg-black/20 shadow-[inset_-3px_-3px_6px_rgba(0,0,0,0.45),_inset_2px_2px_4px_rgba(255,255,255,0.06),_3px_3px_6px_rgba(0,0,0,0.25)] border border-white/5 flex items-center justify-center text-neon mb-4">
          {icon}
        </div>
        
        {/* Title */}
        <span className="font-syne font-semibold text-xs text-gray-400 uppercase tracking-wider block">{title}</span>
        
        {/* Value */}
        <div className="text-3.5xl font-space-mono text-white font-bold mt-1.5 flex items-baseline gap-2">
          {value}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-[11px] text-gray-500 font-medium">{subtitle}</span>
        {trend && (
          <div className={`px-3 py-1 rounded-full text-[10px] font-space-mono font-bold shadow-[2px_2px_6px_rgba(0,0,0,0.2),_inset_-2px_-2px_4px_rgba(0,0,0,0.25),_inset_1.5px_1.5px_3px_rgba(255,255,255,0.35)] flex items-center gap-1.5 ${
            trendDown 
              ? "bg-red-500/10 text-red-400" 
              : "bg-neon/15 text-neon"
          }`}>
            {trendDown ? (
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m6 9 6 6 6-6"/></svg>
            ) : (
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m18 15-6-6-6 6"/></svg>
            )}
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}
interface Props { title: string; icon: React.ReactNode; value: string | number; subtitle: string; trend?: string; trendDown?: boolean; }
export default function DashboardCard({ title, icon, value, subtitle, trend, trendDown }: Props) {
  return (
    <div className="clay-card p-6 flex flex-col justify-between relative overflow-hidden group min-h-[170px]">
      <div>
        <div className="w-11 h-11 rounded-clay-lg bg-black/20 shadow-clay-inset border border-white/5 flex items-center justify-center text-neon mb-4">
          {icon}
        </div>
        <span className="font-syne font-semibold text-xs text-gray-400 uppercase tracking-wider block">{title}</span>
        <div className="text-3.5xl font-space-mono text-white font-bold mt-1.5 flex items-baseline gap-2">
          {value}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-[11px] text-gray-500 font-medium">{subtitle}</span>
        {trend && (
          <div className={`px-3 py-1 rounded-full text-[10px] font-space-mono font-bold shadow-clay-flat flex items-center gap-1.5 ${
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

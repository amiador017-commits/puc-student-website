import React from "react";

interface CircularProgressCardProps {
  title: string;
  value: number;
  max: number;
  valueDisplay: string;
  subtitle: string;
  accentColor: string;
  glowColor?: string;
  icon?: React.ReactNode;
}

export default function CircularProgressCard({
  title,
  value,
  max,
  valueDisplay,
  subtitle,
  accentColor,
  glowColor,
  icon,
}: CircularProgressCardProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = 38;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="clay-card p-2.5 sm:p-5 rounded-clay-xl relative overflow-hidden flex flex-col justify-between items-center text-center aspect-square">
      <div className="w-full flex items-center justify-center gap-1.5 mb-1">
        {icon}
        <p className="text-[8px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold text-center w-full truncate">
          {title}
        </p>
      </div>

      <div className="relative w-24 h-24 xs:w-26 xs:h-26 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-24 lg:h-24 xl:w-28 xl:h-28 flex items-center justify-center my-auto"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#272730" strokeWidth={strokeWidth} />
          <circle
            cx="50" cy="50" r={radius} fill="transparent"
            stroke={accentColor} strokeWidth={strokeWidth}
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease-in-out", filter: glowColor ? `drop-shadow(0 0 6px ${glowColor})` : undefined }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-space-mono text-xs xs:text-sm sm:text-base md:text-lg font-bold text-white leading-none">
            {valueDisplay.split("/")[0]}
          </span>
          {valueDisplay.includes("/") && (
            <span className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] text-gray-500 font-semibold mt-0.5">
              /{valueDisplay.split("/")[1]}
            </span>
          )}
        </div>
      </div>

      <p className="text-[8px] sm:text-xs text-gray-500 font-medium mt-1 w-full truncate">
        {subtitle}
      </p>
    </div>
  );
}

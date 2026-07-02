import React from "react";

interface CircularProgressCardProps {
  title: string;
  value: number;
  max: number;
  valueDisplay: string;
  subtitle: string;
  accentColor: string; // hex color e.g. "#a3e635"
  glowColor?: string; // hex or rgba for glow, e.g. "rgba(163,230,53,0.15)"
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
  // Ensure percentage is between 0 and 100
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  // SVG Circle parameters
  const radius = 38;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="p-2.5 sm:p-5 rounded-[20px] sm:rounded-[26px] relative overflow-hidden flex flex-col justify-between items-center text-center aspect-square transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: "#1c1c22",
        boxShadow: "8px 8px 24px rgba(0,0,0,0.55), inset -6px -6px 12px rgba(0,0,0,0.65), inset 3px 3px 6px rgba(255,255,255,0.06)",
      }}
    >
      {/* Decorative Clay Knob Dot / Glow Effect */}
      <div 
        className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
        style={{
          background: accentColor,
          boxShadow: `0 0 10px ${accentColor}`,
        }}
      />

      {/* Title */}
      <div className="w-full flex items-center justify-center mb-1">
        <p className="text-[8px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold text-center w-full truncate">
          {title}
        </p>
      </div>

      {/* Circular Progress Area */}
      <div className="relative w-24 h-24 xs:w-26 xs:h-26 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-24 lg:h-24 xl:w-28 xl:h-28 flex items-center justify-center my-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Track Circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#272730"
            strokeWidth={strokeWidth}
          />
          {/* Active Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={accentColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.8s ease-in-out",
            }}
          />
        </svg>

        {/* Text inside Circle */}
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

      {/* Subtitle */}
      <p className="text-[8px] sm:text-xs text-gray-500 font-medium mt-1 w-full truncate">
        {subtitle}
      </p>
    </div>
  );
}

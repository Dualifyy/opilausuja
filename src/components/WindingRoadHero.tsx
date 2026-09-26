import React from 'react';
import { Settings, Lightbulb, Users, Code, Brain } from 'lucide-react';
import { Language } from '../types';

interface WindingRoadHeroProps {
  lang: Language;
}

export const WindingRoadHero: React.FC<WindingRoadHeroProps> = ({ lang }) => {
  const milestones = [
    {
      titleEn: "Technical Skills",
      titleEt: "Tehnilised oskused",
      icon: Settings,
      x: 15,
      y: 82,
      color: "from-teal-400 to-emerald-500",
      delay: "0s"
    },
    {
      titleEn: "Problem Solving",
      titleEt: "Probleemilahendus",
      icon: Lightbulb,
      x: 42,
      y: 65,
      color: "from-amber-400 to-amber-500",
      delay: "0.2s"
    },
    {
      titleEn: "Communication",
      titleEt: "Suhtlemisoskus",
      icon: Users,
      x: 68,
      y: 52,
      color: "from-emerald-400 to-teal-600",
      delay: "0.4s"
    },
    {
      titleEn: "Data Literacy",
      titleEt: "Andmepädevus",
      icon: Code,
      x: 76,
      y: 30,
      color: "from-cyan-400 to-teal-500",
      delay: "0.6s"
    },
    {
      titleEn: "Critical Thinking",
      titleEt: "Kriitiline mõtlemine",
      icon: Brain,
      x: 62,
      y: 12,
      color: "from-teal-500 to-emerald-600",
      delay: "0.8s"
    }
  ];

  return (
    <div className="relative w-full h-[280px] sm:h-[340px] overflow-hidden rounded-2xl bg-gradient-to-b from-teal-50/60 via-emerald-50/40 to-white border border-teal-100/60 p-4 shadow-xs select-none">
      {/* Background Soft Hills SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 500 300"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="hill1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CCFBF1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#99F6E4" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="hill2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D1FAE5" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#A7F3D0" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="roadGlow" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F0FDFA" />
            <stop offset="100%" stopColor="#CCFBF1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Distant Hills */}
        <path d="M0,200 Q150,110 320,150 T500,120 L500,300 L0,300 Z" fill="url(#hill1)" />
        <path d="M0,230 Q180,140 360,180 T500,160 L500,300 L0,300 Z" fill="url(#hill2)" />

        {/* Winding Road Path */}
        <path
          d="M 50 280 C 120 270, 160 220, 220 200 C 290 180, 360 160, 350 110 C 340 70, 300 50, 310 20"
          stroke="url(#roadGlow)"
          strokeWidth="32"
          strokeLinecap="round"
          fill="none"
          className="opacity-90"
        />

        {/* Road center dashed guide */}
        <path
          d="M 50 280 C 120 270, 160 220, 220 200 C 290 180, 360 160, 350 110 C 340 70, 300 50, 310 20"
          stroke="#0D9488"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          strokeLinecap="round"
          fill="none"
          className="opacity-40"
        />
      </svg>

      {/* Floating Milestone Badges */}
      {milestones.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            className="absolute flex items-center gap-2 transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-105 duration-300"
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
          >
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${m.color} text-white flex items-center justify-center shadow-md shadow-teal-500/20 ring-4 ring-white/90`}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="hidden xs:block bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-teal-100 shadow-xs text-[11px] sm:text-xs font-medium text-slate-800 whitespace-nowrap">
              {lang === 'et' ? m.titleEt : m.titleEn}
            </div>
          </div>
        );
      })}

      {/* Decorative stars / sparks */}
      <div className="absolute top-6 right-8 text-teal-400 text-lg animate-pulse">✦</div>
      <div className="absolute bottom-8 left-8 text-emerald-400 text-sm animate-pulse">✦</div>
      <div className="absolute top-1/2 left-4 text-teal-300 text-xs">●</div>
      <div className="absolute top-1/4 right-1/3 text-emerald-300 text-xs">●</div>
    </div>
  );
};

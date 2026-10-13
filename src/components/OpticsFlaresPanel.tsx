import React from 'react';
import { FlareType, OpticsSettings } from '../types/editor';
import { Sparkles, Sun, Flame, Wind, RotateCcw } from 'lucide-react';

interface OpticsFlaresPanelProps {
  opticsSettings: OpticsSettings;
  setOpticsSettings: React.Dispatch<React.SetStateAction<OpticsSettings>>;
}

export const OpticsFlaresPanel: React.FC<OpticsFlaresPanelProps> = ({
  opticsSettings,
  setOpticsSettings,
}) => {
  const flarePresets: { id: FlareType; label: string; bengaliLabel: string; icon: string; preview: string }[] = [
    { 
      id: 'none', 
      label: 'None', 
      bengaliLabel: 'কোনোটি না', 
      icon: '🚫',
      preview: 'bg-zinc-900' 
    },
    { 
      id: 'anamorphic-blue', 
      label: 'Anamorphic Blue', 
      bengaliLabel: 'অ্যানামরফিক ব্লু স্ট্রিক', 
      icon: '🌌',
      preview: 'bg-gradient-to-r from-transparent via-cyan-400 to-transparent' 
    },
    { 
      id: 'warm-vintage', 
      label: '35mm Vintage Leak', 
      bengaliLabel: 'ওয়ার্ম সানসেট লিকেজ', 
      icon: '🌅',
      preview: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-transparent' 
    },
    { 
      id: 'golden-sunburst', 
      label: 'Golden Sunburst', 
      bengaliLabel: 'গোল্ডেন সানবার্স্ট ফ্লেয়ার', 
      icon: '☀️',
      preview: 'bg-[radial-gradient(circle,#fbbf24_0%,transparent_70%)]' 
    },
    { 
      id: 'dust-particles', 
      label: 'Dust & Motes', 
      bengaliLabel: 'ডাস্ট পার্টিকলস ও ফিল্ম গ্রেইন', 
      icon: '✨',
      preview: 'bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:10px_10px]' 
    },
  ];

  const handleReset = () => {
    setOpticsSettings({
      flareType: 'none',
      flareIntensity: 60,
      flareX: 25,
      flareY: 20,
      halation: 0,
      highlightBloom: 0,
      ambientOcclusion: 0,
      particlesCount: 0,
    });
  };

  return (
    <div className="flex flex-col gap-2.5 animate-in fade-in select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Sparkles size={12} />
          </div>
          <div>
            <span className="text-xs font-bold text-white">লাইট লিকেজ, লেন্স ফ্লেয়ার ও হ্যালিয়েশন (Optics VFX)</span>
            <span className="text-[9px] text-zinc-400 block leading-tight">অ্যানামরফিক ব্লু স্ট্রিক, ফিল্ম হ্যালিয়েশন ও সিনেমাটিক গ্লো</span>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          title="রিসেট করুন"
        >
          <RotateCcw size={12} />
        </button>
      </div>

      {/* Flare & Leak Type Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 overflow-x-auto py-0.5">
        {flarePresets.map((f) => {
          const isSelected = opticsSettings.flareType === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setOpticsSettings(prev => ({ ...prev, flareType: f.id }))}
              className={`p-2 rounded-xl border flex flex-col gap-1 transition-all ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 shadow-md ring-1 ring-cyan-400/50'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className={`h-8 rounded-lg ${f.preview} flex items-center justify-center border border-zinc-800/80`}>
                <span className="text-xs">{f.icon}</span>
              </div>
              <span className="text-[10px] font-bold truncate">{f.bengaliLabel}</span>
              <span className="text-[8px] text-zinc-500 truncate">{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sliders: Flare Intensity, Halation, Bloom, Ambient Occlusion */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80 text-xs">
        {/* Flare Intensity */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-300 font-semibold">ফ্লেয়ার তীব্রতা:</span>
            <span className="font-mono text-cyan-400 font-bold">{opticsSettings.flareIntensity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={opticsSettings.flareIntensity}
            onChange={(e) => setOpticsSettings(prev => ({ ...prev, flareIntensity: Number(e.target.value) }))}
            className="w-full h-1 accent-cyan-400 bg-zinc-800 rounded"
          />
        </div>

        {/* Film Halation (Red/Orange glow around highlights) */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-300 font-semibold">ফিল্ম হ্যালিয়েশন (Halation):</span>
            <span className="font-mono text-rose-400 font-bold">{opticsSettings.halation}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={opticsSettings.halation}
            onChange={(e) => setOpticsSettings(prev => ({ ...prev, halation: Number(e.target.value) }))}
            className="w-full h-1 accent-rose-400 bg-zinc-800 rounded"
          />
        </div>

        {/* Highlight Bloom */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-300 font-semibold">হাইলাইট ব্লুম (Bloom):</span>
            <span className="font-mono text-amber-400 font-bold">{opticsSettings.highlightBloom}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={opticsSettings.highlightBloom}
            onChange={(e) => setOpticsSettings(prev => ({ ...prev, highlightBloom: Number(e.target.value) }))}
            className="w-full h-1 accent-amber-400 bg-zinc-800 rounded"
          />
        </div>

        {/* Ambient Occlusion (Depth Shadow) */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-300 font-semibold">অ্যাম্বিয়েন্ট অক্লুশন (AO):</span>
            <span className="font-mono text-purple-400 font-bold">{opticsSettings.ambientOcclusion}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={opticsSettings.ambientOcclusion}
            onChange={(e) => setOpticsSettings(prev => ({ ...prev, ambientOcclusion: Number(e.target.value) }))}
            className="w-full h-1 accent-purple-400 bg-zinc-800 rounded"
          />
        </div>
      </div>
    </div>
  );
};

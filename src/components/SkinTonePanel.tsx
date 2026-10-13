import React from 'react';
import { ShieldCheck, User, Sparkles, RotateCcw, Compass } from 'lucide-react';
import { SkinToneProtection } from '../types/editor';

interface SkinTonePanelProps {
  skinTone: SkinToneProtection;
  setSkinTone: React.Dispatch<React.SetStateAction<SkinToneProtection>>;
}

export const SkinTonePanel: React.FC<SkinTonePanelProps> = ({
  skinTone,
  setSkinTone,
}) => {
  const handleReset = () => {
    setSkinTone(prev => ({
      ...prev,
      protectAmount: 70,
      warmth: 15,
      rosyTint: 10,
      softGlow: 25,
      showSkinLineGuide: false,
    }));
  };

  return (
    <div className="flex flex-col gap-2.5 animate-in fade-in select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <ShieldCheck size={12} />
          </div>
          <div>
            <span className="text-xs font-bold text-white">স্কিন টোন প্রটেকশন (Skin Tone Protection)</span>
            <span className="text-[9px] text-zinc-400 block leading-tight">ব্যাকগ্রাউন্ড গ্রেডিং হলেও মুখের স্কিন কালার থাকবে ন্যাচারাল</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Active Switch */}
          <button
            onClick={() => setSkinTone(prev => ({ ...prev, enabled: !prev.enabled }))}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
              skinTone.enabled
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm'
                : 'bg-zinc-800 text-zinc-500 border-zinc-700'
            }`}
          >
            {skinTone.enabled ? 'লকড (ON)' : 'বন্ধ (OFF)'}
          </button>

          <button
            onClick={handleReset}
            className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            title="রিসেট করুন"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Guide Line Toggle & Info */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800">
        <div className="flex items-center gap-2">
          <Compass size={14} className="text-amber-400" />
          <div>
            <span className="text-[11px] font-bold text-zinc-200">ভেক্টরেস্কোপ স্কিন-লাইন গাইড</span>
            <span className="text-[9px] text-zinc-500 block leading-tight">প্রিভিউতে প্রফেশনাল স্কিন-লাইন এলাইনমেন্ট রেখা দেখাবে</span>
          </div>
        </div>
        <button
          onClick={() => setSkinTone(prev => ({ ...prev, showSkinLineGuide: !prev.showSkinLineGuide }))}
          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            skinTone.showSkinLineGuide
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-zinc-900 text-zinc-400 border-zinc-800'
          }`}
        >
          {skinTone.showSkinLineGuide ? 'গাইড দৃশ্যমান' : 'গাইড লুকান'}
        </button>
      </div>

      {/* Sliders: Protect Amount, Warmth, Rosy Tint, Soft Glow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80 text-xs">
        {/* Protect Amount */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-300 font-semibold">প্রটেকশন মাত্রা (Strength):</span>
            <span className="font-mono text-rose-400 font-bold">{skinTone.protectAmount}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={skinTone.protectAmount}
            onChange={(e) => setSkinTone(prev => ({ ...prev, protectAmount: Number(e.target.value), enabled: true }))}
            className="w-full h-1 accent-rose-400 bg-zinc-800 rounded"
          />
        </div>

        {/* Warmth */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-300 font-semibold">স্কিন ওয়ার্মথ (Skin Warmth):</span>
            <span className="font-mono text-amber-400 font-bold">{skinTone.warmth > 0 ? `+${skinTone.warmth}` : skinTone.warmth}°</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={skinTone.warmth}
            onChange={(e) => setSkinTone(prev => ({ ...prev, warmth: Number(e.target.value), enabled: true }))}
            className="w-full h-1 accent-amber-400 bg-zinc-800 rounded"
          />
        </div>

        {/* Rosy Tint */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-300 font-semibold">রোজি গ্লো টিন্ট (Rosy Tint):</span>
            <span className="font-mono text-pink-400 font-bold">{skinTone.rosyTint > 0 ? `+${skinTone.rosyTint}` : skinTone.rosyTint}</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={skinTone.rosyTint}
            onChange={(e) => setSkinTone(prev => ({ ...prev, rosyTint: Number(e.target.value), enabled: true }))}
            className="w-full h-1 accent-pink-400 bg-zinc-800 rounded"
          />
        </div>

        {/* Soft Face Glow */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-300 font-semibold">ফেস গ্লো ও রিফাইন (Soft Glow):</span>
            <span className="font-mono text-cyan-400 font-bold">{skinTone.softGlow}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={skinTone.softGlow}
            onChange={(e) => setSkinTone(prev => ({ ...prev, softGlow: Number(e.target.value), enabled: true }))}
            className="w-full h-1 accent-cyan-400 bg-zinc-800 rounded"
          />
        </div>
      </div>
    </div>
  );
};

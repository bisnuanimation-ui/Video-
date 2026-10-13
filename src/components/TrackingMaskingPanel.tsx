import React, { useState } from 'react';
import { Crosshair, Play, RotateCcw, Circle, Square, Scissors, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { ObjectTrackerSettings, MaskingSettings, MaskShape } from '../types/editor';

interface TrackingMaskingPanelProps {
  trackerSettings: ObjectTrackerSettings;
  setTrackerSettings: React.Dispatch<React.SetStateAction<ObjectTrackerSettings>>;
  maskSettings: MaskingSettings;
  setMaskSettings: React.Dispatch<React.SetStateAction<MaskingSettings>>;
  currentTime: number;
}

export const TrackingMaskingPanel: React.FC<TrackingMaskingPanelProps> = ({
  trackerSettings,
  setTrackerSettings,
  maskSettings,
  setMaskSettings,
  currentTime,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'tracking' | 'masking' | 'dress-blur'>('tracking');
  const [isSimulatingTrack, setIsSimulatingTrack] = useState(false);

  const maskShapes: { id: MaskShape; label: string; bengaliLabel: string; icon: any }[] = [
    { id: 'none', label: 'None', bengaliLabel: 'মাস্ক অফ', icon: Scissors },
    { id: 'circle', label: 'Circular Window', bengaliLabel: 'সার্কুলার উইন্ডো', icon: Circle },
    { id: 'rectangle', label: 'Box Window', bengaliLabel: 'বক্স উইন্ডো', icon: Square },
    { id: 'subject-roto', label: 'Roto Subject Cutout', bengaliLabel: 'রোটো ব্রাশ (সাবজেক্ট)', icon: Sparkles },
  ];

  const handleRunTracking = () => {
    setIsSimulatingTrack(true);
    setTrackerSettings(prev => ({ ...prev, isTrackingActive: true }));
    setTimeout(() => {
      setIsSimulatingTrack(false);
      setTrackerSettings(prev => ({ ...prev, confidence: 97 }));
    }, 1200);
  };

  const handleReset = () => {
    setTrackerSettings({
      isTrackingActive: false,
      targetName: 'Subject Face / Body',
      currentX: 50,
      currentY: 45,
      targetWidth: 28,
      targetHeight: 35,
      confidence: 94,
      autoTrack: true,
      trackPath: [],
    });
    setMaskSettings({
      shape: 'none',
      invert: false,
      feather: 40,
      opacity: 85,
      centerX: 50,
      centerY: 50,
      radiusX: 35,
      radiusY: 40,
      rotation: 0,
      applyOnlyToBackground: false,
      linkedToTracker: false,
    });
  };

  return (
    <div className="flex flex-col gap-2.5 animate-in fade-in select-none">
      {/* Sub-tab Navigation */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
          <button
            onClick={() => setActiveSubTab('tracking')}
            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
              activeSubTab === 'tracking'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            🎯 স্মার্ট অবজেক্ট ট্র্যাকিং
          </button>
          <button
            onClick={() => setActiveSubTab('masking')}
            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
              activeSubTab === 'masking'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            ✂️ রোটো ও পাওয়ার উইন্ডো মাস্ক
          </button>
          <button
            onClick={() => setActiveSubTab('dress-blur')}
            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
              activeSubTab === 'dress-blur'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            👗 ড্রেস ও অবজেক্ট ব্লার
          </button>
        </div>

        <button
          onClick={handleReset}
          className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          title="রিসেট করুন"
        >
          <RotateCcw size={12} />
        </button>
      </div>

      {/* ================= SUB-TAB: SMART OBJECT TRACKING ================= */}
      {activeSubTab === 'tracking' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="flex items-center gap-2">
              <Crosshair size={15} className={trackerSettings.isTrackingActive ? 'text-cyan-400 animate-spin' : 'text-zinc-400'} />
              <div>
                <span className="text-xs font-bold text-white">অপটিক্যাল ফ্লো মোশন ট্র্যাকার</span>
                <span className="text-[9px] text-zinc-400 block leading-tight">
                  ভিডিওতে নড়াচড়া করলেও সাবজেক্টের সাথে লাইট বা কালার স্বয়ংক্রিয়ভাবে লক হয়ে থাকবে
                </span>
              </div>
            </div>

            <button
              onClick={handleRunTracking}
              disabled={isSimulatingTrack}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-[10px] shadow-sm active:scale-95 transition-all"
            >
              <Play size={10} className="fill-current" />
              <span>{isSimulatingTrack ? 'ট্র্যাকিং চলছে...' : 'ট্র্যাক রান করুন'}</span>
            </button>
          </div>

          {/* Tracking Target Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80 text-xs">
            {/* Target Label */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-zinc-300 font-semibold">টার্গেট অবজেক্ট নাম:</span>
              <input
                type="text"
                value={trackerSettings.targetName}
                onChange={(e) => setTrackerSettings(prev => ({ ...prev, targetName: e.target.value }))}
                className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] text-white focus:outline-none"
              />
            </div>

            {/* Target Position X */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-300 font-semibold">ট্র্যাকিং পয়েন্ট X:</span>
                <span className="font-mono text-cyan-400 font-bold">{trackerSettings.currentX}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={trackerSettings.currentX}
                onChange={(e) => setTrackerSettings(prev => ({ ...prev, currentX: Number(e.target.value) }))}
                className="w-full h-1 accent-cyan-400 bg-zinc-800 rounded"
              />
            </div>

            {/* Target Position Y */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-300 font-semibold">ট্র্যাকিং পয়েন্ট Y:</span>
                <span className="font-mono text-cyan-400 font-bold">{trackerSettings.currentY}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={trackerSettings.currentY}
                onChange={(e) => setTrackerSettings(prev => ({ ...prev, currentY: Number(e.target.value) }))}
                className="w-full h-1 accent-cyan-400 bg-zinc-800 rounded"
              />
            </div>
          </div>

          {/* Tracking Status Pill */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-[10px]">
            <span className="text-zinc-400 flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-400" />
              <span>স্মার্ট ট্র্যাকিং স্টেটাস: <strong>{trackerSettings.confidence}% একুরেসি লকড</strong></span>
            </span>
            <span className="font-mono text-zinc-500">
              টাইমলাইন সময়: {currentTime.toFixed(2)}s
            </span>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB: ROTOSCOPING & MASKING ================= */}
      {activeSubTab === 'masking' && (
        <div className="flex flex-col gap-2">
          {/* Mask Shape Cards */}
          <div className="grid grid-cols-4 gap-1.5">
            {maskShapes.map((s) => {
              const Icon = s.icon;
              const isSelected = maskSettings.shape === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setMaskSettings(prev => ({ ...prev, shape: s.id }))}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-400 text-purple-200 shadow-md ring-1 ring-purple-400/50'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-[10px] font-bold truncate max-w-full">{s.bengaliLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Mask Options: Invert & Apply Only to Background */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMaskSettings(prev => ({ ...prev, invert: !prev.invert }))}
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                  maskSettings.invert ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}
              >
                {maskSettings.invert ? 'মাস্ক ইনভার্ট: চালু' : 'মাস্ক ইনভার্ট: বন্ধ'}
              </button>

              <button
                onClick={() => setMaskSettings(prev => ({ ...prev, applyOnlyToBackground: !prev.applyOnlyToBackground }))}
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                  maskSettings.applyOnlyToBackground ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}
              >
                {maskSettings.applyOnlyToBackground ? 'শুধু ব্যাকগ্রাউন্ড গ্রেড' : 'সাবজেক্টে গ্রেড'}
              </button>
            </div>

            <button
              onClick={() => setMaskSettings(prev => ({ ...prev, linkedToTracker: !prev.linkedToTracker }))}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                maskSettings.linkedToTracker ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-zinc-900 text-zinc-500 border-zinc-800'
              }`}
            >
              {maskSettings.linkedToTracker ? 'ট্র্যাকার লিংকড' : 'লিংক ট্র্যাকার'}
            </button>
          </div>

          {/* Mask Parameters: Feather, Radius X, Radius Y */}
          <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80 text-xs">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-300 font-semibold">ফেদার (Feather):</span>
                <span className="font-mono text-purple-400 font-bold">{maskSettings.feather}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={maskSettings.feather}
                onChange={(e) => setMaskSettings(prev => ({ ...prev, feather: Number(e.target.value) }))}
                className="w-full h-1 accent-purple-400 bg-zinc-800 rounded"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-300 font-semibold">সাইজ X (Radius):</span>
                <span className="font-mono text-cyan-400 font-bold">{maskSettings.radiusX}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={maskSettings.radiusX}
                onChange={(e) => setMaskSettings(prev => ({ ...prev, radiusX: Number(e.target.value) }))}
                className="w-full h-1 accent-cyan-400 bg-zinc-800 rounded"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-300 font-semibold">সাইজ Y (Radius):</span>
                <span className="font-mono text-teal-400 font-bold">{maskSettings.radiusY}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={maskSettings.radiusY}
                onChange={(e) => setMaskSettings(prev => ({ ...prev, radiusY: Number(e.target.value) }))}
                className="w-full h-1 accent-teal-400 bg-zinc-800 rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB: DRESS & OBJECT BLUR ================= */}
      {activeSubTab === 'dress-blur' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">👗</div>
              <div>
                <span className="text-xs font-bold text-white">ড্রেস ও অবজেক্ট ব্লার (Dress & Object Smart Blur)</span>
                <span className="text-[9px] text-zinc-400 block leading-tight">
                  যেকোনো ড্রেস, ব্যাকগ্রাউন্ড বা অবজেক্ট নিখুঁতভাবে ব্লার বা বোকেহ করুন
                </span>
              </div>
            </div>

            <button
              onClick={() => setMaskSettings(prev => ({ ...prev, dressBlurEnabled: !prev.dressBlurEnabled }))}
              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] border transition-all ${
                maskSettings.dressBlurEnabled
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800'
              }`}
            >
              {maskSettings.dressBlurEnabled ? 'ব্লার সক্রিয় (ON)' : 'ব্লার বন্ধ (OFF)'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80 text-xs">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-300 font-semibold">ব্লার ব্যাসার্ধ (Radius):</span>
                <span className="font-mono text-rose-400 font-bold">{maskSettings.dressBlurRadius || 35}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={maskSettings.dressBlurRadius || 35}
                onChange={(e) => setMaskSettings(prev => ({ ...prev, dressBlurRadius: Number(e.target.value), dressBlurEnabled: true }))}
                className="w-full h-1 accent-rose-400 bg-zinc-800 rounded"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-zinc-300 font-semibold">ব্লার মোড (Mode):</span>
              <select
                value={maskSettings.dressBlurMode || 'dress-soft'}
                onChange={(e) => setMaskSettings(prev => ({ ...prev, dressBlurMode: e.target.value as any, dressBlurEnabled: true }))}
                className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] text-white focus:outline-none"
              >
                <option value="dress-soft">ড্রেস সফট ব্লার (Dress Soft)</option>
                <option value="bokeh-blur">সিনেম্যাটিক বোকেহ (Bokeh)</option>
                <option value="background-blur">ব্যাকগ্রাউন্ড ব্লার (Background)</option>
                <option value="object-isolate">অবজেক্ট আইসোলেট (Isolate)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

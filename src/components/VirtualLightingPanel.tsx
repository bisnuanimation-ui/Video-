import React from 'react';
import { SunMedium, RotateCcw, Link2, Eye, ShieldAlert } from 'lucide-react';
import { VirtualLightSettings, LightSourceType } from '../types/editor';

interface VirtualLightingPanelProps {
  lightSettings: VirtualLightSettings;
  setLightSettings: React.Dispatch<React.SetStateAction<VirtualLightSettings>>;
}

export const VirtualLightingPanel: React.FC<VirtualLightingPanelProps> = ({
  lightSettings,
  setLightSettings,
}) => {
  const lightTypes: { id: LightSourceType; label: string; bengaliLabel: string; icon: string }[] = [
    { id: 'spotlight', label: 'Spotlight', bengaliLabel: 'স্পটলাইট', icon: '🔦' },
    { id: 'point', label: 'Point Light', bengaliLabel: 'পয়েন্ট লাইট', icon: '💡' },
    { id: 'rim', label: 'Rim Light', bengaliLabel: 'রিম লাইট', icon: '✨' },
    { id: 'studio-key', label: 'Warm Studio Key', bengaliLabel: 'ওয়ার্ম স্টুডিও কি', icon: '☀️' },
    { id: 'neon-edge', label: 'Neon Cyan Edge', bengaliLabel: 'নিয়ন সায়ান এজ', icon: '🔵' },
    { id: 'sunset-flare', label: 'Sunset Golden', bengaliLabel: 'গোল্ডেন সানসেট', icon: '🌅' },
    { id: 'top-spot', label: 'Dramatic Top', bengaliLabel: 'ড্রামাটিক টপ', icon: '🌟' },
  ];

  const handleReset = () => {
    setLightSettings({
      enabled: false,
      type: 'spotlight',
      x: 35,
      y: 30,
      color: '#ffdd88',
      intensity: 65,
      radius: 45,
      angle: 45,
      castShadows: true,
      shadowAngle: 135,
      shadowOpacity: 55,
      shadowBlur: 20,
      linkedToTracker: false,
    });
  };

  return (
    <div className="flex flex-col gap-2.5 animate-in fade-in select-none">
      {/* Header with Switch */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <SunMedium size={12} />
          </div>
          <div>
            <span className="text-xs font-bold text-white">ভার্চুয়াল লাইটিং ও কাস্টম শ্যাডো (Virtual 3D Lights)</span>
            <span className="text-[9px] text-zinc-400 block leading-tight">সিনেম্যাটিক স্পটলাইট, রিম লাইট ও মোশন শ্যাডো কাস্টিং</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLightSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
              lightSettings.enabled
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                : 'bg-zinc-800 text-zinc-500 border-zinc-700'
            }`}
          >
            {lightSettings.enabled ? 'লাইট সক্রিয়' : 'বন্ধ (OFF)'}
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

      {/* Light Source Types Selector */}
      <div className="grid grid-cols-3 gap-1.5">
        {lightTypes.map((t) => {
          const isSelected = lightSettings.type === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setLightSettings(prev => ({ ...prev, type: t.id, enabled: true }))}
              className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                isSelected
                  ? 'bg-amber-950/40 border-amber-400 text-amber-200 shadow-md ring-1 ring-amber-400/50'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <span className="text-base">{t.icon}</span>
              <span className="text-[10px] font-bold">{t.bengaliLabel}</span>
              <span className="text-[8px] text-zinc-500">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Light Color & Tracker Sync */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-300 font-medium">লাইটের রঙ (Color):</span>
          <input
            type="color"
            value={lightSettings.color}
            onChange={(e) => setLightSettings(prev => ({ ...prev, color: e.target.value, enabled: true }))}
            className="w-6 h-6 rounded border border-zinc-700 cursor-pointer bg-transparent"
          />
          <span className="font-mono text-zinc-400 text-[10px]">{lightSettings.color}</span>
        </div>

        {/* Link to Motion Tracker */}
        <button
          onClick={() => setLightSettings(prev => ({ ...prev, linkedToTracker: !prev.linkedToTracker }))}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
            lightSettings.linkedToTracker
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              : 'bg-zinc-900 text-zinc-500 border-zinc-800'
          }`}
          title="অবজেক্ট ট্র্যাকিংয়ের সাথে লাইট অটো মুভ করান"
        >
          <Link2 size={11} />
          <span>{lightSettings.linkedToTracker ? 'ট্র্যাকার লিংকড' : 'লিংক ট্র্যাকার'}</span>
        </button>
      </div>

      {/* Sliders: Intensity, Radius, Position X & Y */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80 text-xs">
        {/* Intensity */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-300 font-semibold">ইনটেনসিটি (Intensity):</span>
            <span className="font-mono text-amber-400 font-bold">{lightSettings.intensity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={lightSettings.intensity}
            onChange={(e) => setLightSettings(prev => ({ ...prev, intensity: Number(e.target.value), enabled: true }))}
            className="w-full h-1 accent-amber-400 bg-zinc-800 rounded"
          />
        </div>

        {/* Radius / Spread */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-300 font-semibold">লাইটের ব্যাপ্তি (Spread):</span>
            <span className="font-mono text-cyan-400 font-bold">{lightSettings.radius}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={lightSettings.radius}
            onChange={(e) => setLightSettings(prev => ({ ...prev, radius: Number(e.target.value), enabled: true }))}
            className="w-full h-1 accent-cyan-400 bg-zinc-800 rounded"
          />
        </div>

        {/* Position X */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-300 font-semibold">পজিশন X:</span>
            <span className="font-mono text-teal-400 font-bold">{lightSettings.x}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={lightSettings.x}
            onChange={(e) => setLightSettings(prev => ({ ...prev, x: Number(e.target.value), enabled: true }))}
            className="w-full h-1 accent-teal-400 bg-zinc-800 rounded"
          />
        </div>

        {/* Position Y */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-300 font-semibold">পজিশন Y:</span>
            <span className="font-mono text-purple-400 font-bold">{lightSettings.y}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={lightSettings.y}
            onChange={(e) => setLightSettings(prev => ({ ...prev, y: Number(e.target.value), enabled: true }))}
            className="w-full h-1 accent-purple-400 bg-zinc-800 rounded"
          />
        </div>
      </div>

      {/* Cast Shadow Controls */}
      <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-bold text-zinc-200">কাস্ট শ্যাডো কন্ট্রোল (Cast Shadow):</span>
          <button
            onClick={() => setLightSettings(prev => ({ ...prev, castShadows: !prev.castShadows }))}
            className={`px-2 py-0.5 rounded text-[9px] font-bold ${
              lightSettings.castShadows ? 'bg-zinc-800 text-amber-300' : 'bg-zinc-900 text-zinc-600'
            }`}
          >
            {lightSettings.castShadows ? 'ছায়া অন' : 'ছায়া অফ'}
          </button>
        </div>

        {lightSettings.castShadows && (
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-zinc-400">ছায়ার কোণ: {lightSettings.shadowAngle}°</span>
              <input
                type="range"
                min="0"
                max="360"
                value={lightSettings.shadowAngle}
                onChange={(e) => setLightSettings(prev => ({ ...prev, shadowAngle: Number(e.target.value) }))}
                className="w-full h-1 accent-amber-400 bg-zinc-800 rounded"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-zinc-400">ছায়ার ঘনত্ব: {lightSettings.shadowOpacity}%</span>
              <input
                type="range"
                min="0"
                max="100"
                value={lightSettings.shadowOpacity}
                onChange={(e) => setLightSettings(prev => ({ ...prev, shadowOpacity: Number(e.target.value) }))}
                className="w-full h-1 accent-amber-400 bg-zinc-800 rounded"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-zinc-400">সফট ব্লার: {lightSettings.shadowBlur}px</span>
              <input
                type="range"
                min="0"
                max="50"
                value={lightSettings.shadowBlur}
                onChange={(e) => setLightSettings(prev => ({ ...prev, shadowBlur: Number(e.target.value) }))}
                className="w-full h-1 accent-amber-400 bg-zinc-800 rounded"
              />
            </div>
          </div>
        )}
      </div>

      {/* Motion Blur & Tracked Blur Section */}
      <div className="p-2 rounded-xl bg-zinc-950 border border-cyan-900/40 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="text-cyan-400">💨</span>
            <span className="font-bold text-white">মোশন ব্লার ও অটো-ট্র্যাক ব্লার (Motion & Tracked Blur)</span>
          </div>
          <button
            onClick={() => setLightSettings(prev => ({ ...prev, motionBlurEnabled: !prev.motionBlurEnabled }))}
            className={`px-2.5 py-0.5 rounded text-[9px] font-bold ${
              lightSettings.motionBlurEnabled ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'bg-zinc-900 text-zinc-600'
            }`}
          >
            {lightSettings.motionBlurEnabled ? 'ব্লার অন' : 'ব্লার অফ'}
          </button>
        </div>

        {lightSettings.motionBlurEnabled && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px]">
                <span className="text-zinc-300">মোশন ব্লার ইনটেনসিটি:</span>
                <span className="font-mono text-cyan-400">{lightSettings.motionBlurIntensity || 35}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={lightSettings.motionBlurIntensity || 35}
                onChange={(e) => setLightSettings(prev => ({ ...prev, motionBlurIntensity: Number(e.target.value) }))}
                className="w-full h-1 accent-cyan-400 bg-zinc-800 rounded"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px]">
                <span className="text-zinc-300">ডিরেকশনাল অ্যাঙ্গেল:</span>
                <span className="font-mono text-amber-400">{lightSettings.motionBlurAngle || 45}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={lightSettings.motionBlurAngle || 45}
                onChange={(e) => setLightSettings(prev => ({ ...prev, motionBlurAngle: Number(e.target.value) }))}
                className="w-full h-1 accent-amber-400 bg-zinc-800 rounded"
              />
            </div>
          </div>
        )}

        {/* Tracked Blur Toggle */}
        <div className="flex items-center justify-between pt-1 border-t border-zinc-900 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="text-purple-400">🎯</span>
            <span className="text-zinc-300 font-medium">মার্কড অবজেক্ট অটো-ট্র্যাক ব্লার (Tracked Mask Blur)</span>
          </div>
          <button
            onClick={() => setLightSettings(prev => ({ ...prev, blurTrackingEnabled: !prev.blurTrackingEnabled }))}
            className={`px-2 py-0.5 rounded text-[9px] font-bold ${
              lightSettings.blurTrackingEnabled ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50' : 'bg-zinc-900 text-zinc-600'
            }`}
          >
            {lightSettings.blurTrackingEnabled ? 'ট্র্যাক ব্লার অন' : 'অফ'}
          </button>
        </div>

        {lightSettings.blurTrackingEnabled && (
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex justify-between text-[9px]">
              <span className="text-zinc-400">ট্র্যাকড ব্লার রেডিয়াস:</span>
              <span className="font-mono text-purple-300">{lightSettings.blurTrackingRadius || 35}px</span>
            </div>
            <input
              type="range"
              min="5"
              max="80"
              value={lightSettings.blurTrackingRadius || 35}
              onChange={(e) => setLightSettings(prev => ({ ...prev, blurTrackingRadius: Number(e.target.value) }))}
              className="w-full h-1 accent-purple-400 bg-zinc-800 rounded"
            />
          </div>
        )}
      </div>

      {/* Golden Effect & Background Glow Section */}
      <div className="p-2 rounded-xl bg-gradient-to-br from-amber-950/40 to-zinc-950 border border-amber-500/40 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400">✨</span>
            <span className="font-bold text-amber-200">গোল্ডেন এফেক্ট ও ব্যাকগ্রাউন্ড গ্লো (Golden Effect)</span>
          </div>
          <button
            onClick={() => setLightSettings(prev => ({ ...prev, goldenEffectEnabled: !prev.goldenEffectEnabled }))}
            className={`px-2.5 py-0.5 rounded text-[9px] font-bold ${
              lightSettings.goldenEffectEnabled ? 'bg-amber-500/30 text-amber-300 border border-amber-500/60' : 'bg-zinc-900 text-zinc-600'
            }`}
          >
            {lightSettings.goldenEffectEnabled ? 'গোল্ডেন অন' : 'অফ'}
          </button>
        </div>

        {lightSettings.goldenEffectEnabled && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px]">
                <span className="text-zinc-300">গোল্ডেন ইনটেনসিটি:</span>
                <span className="font-mono text-amber-400">{lightSettings.goldenIntensity || 70}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={lightSettings.goldenIntensity || 70}
                onChange={(e) => setLightSettings(prev => ({ ...prev, goldenIntensity: Number(e.target.value) }))}
                className="w-full h-1 accent-amber-400 bg-zinc-800 rounded"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px]">
                <span className="text-zinc-300">ব্যাকগ্রাউন্ড গ্লো:</span>
                <span className="font-mono text-yellow-400">{lightSettings.goldenBackgroundGlow || 50}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={lightSettings.goldenBackgroundGlow || 50}
                onChange={(e) => setLightSettings(prev => ({ ...prev, goldenBackgroundGlow: Number(e.target.value) }))}
                className="w-full h-1 accent-yellow-400 bg-zinc-800 rounded"
              />
            </div>
          </div>
        )}
      </div>

      {/* Anywhere Spot Blur Section (যেকোনো জায়গায় ব্লার) */}
      <div className="p-2 rounded-xl bg-zinc-950 border border-teal-500/40 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="text-teal-400">💧</span>
            <span className="font-bold text-teal-200">যে কোনো জায়গায় স্পট ব্লার (Spot Blur)</span>
          </div>
          <button
            onClick={() => setLightSettings(prev => ({ ...prev, spotBlurEnabled: !prev.spotBlurEnabled }))}
            className={`px-2.5 py-0.5 rounded text-[9px] font-bold ${
              lightSettings.spotBlurEnabled ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50' : 'bg-zinc-900 text-zinc-600'
            }`}
          >
            {lightSettings.spotBlurEnabled ? 'স্পট ব্লার অন' : 'অফ'}
          </button>
        </div>

        {lightSettings.spotBlurEnabled && (
          <div className="flex flex-col gap-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[9px]">
                  <span className="text-zinc-300">બ્લર X:</span>
                  <span className="font-mono text-teal-400">{lightSettings.spotBlurX || 50}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lightSettings.spotBlurX || 50}
                  onChange={(e) => setLightSettings(prev => ({ ...prev, spotBlurX: Number(e.target.value) }))}
                  className="w-full h-1 accent-teal-400 bg-zinc-800 rounded"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[9px]">
                  <span className="text-zinc-300">બ્લર Y:</span>
                  <span className="font-mono text-teal-400">{lightSettings.spotBlurY || 50}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lightSettings.spotBlurY || 50}
                  onChange={(e) => setLightSettings(prev => ({ ...prev, spotBlurY: Number(e.target.value) }))}
                  className="w-full h-1 accent-teal-400 bg-zinc-800 rounded"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[9px]">
                  <span className="text-zinc-300">রেডিয়াস:</span>
                  <span className="font-mono text-teal-300">{lightSettings.spotBlurRadius || 40}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={lightSettings.spotBlurRadius || 40}
                  onChange={(e) => setLightSettings(prev => ({ ...prev, spotBlurRadius: Number(e.target.value) }))}
                  className="w-full h-1 accent-teal-400 bg-zinc-800 rounded"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[9px]">
                  <span className="text-zinc-300">ইনটেনসিটি:</span>
                  <span className="font-mono text-teal-300">{lightSettings.spotBlurIntensity || 25}px</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={lightSettings.spotBlurIntensity || 25}
                  onChange={(e) => setLightSettings(prev => ({ ...prev, spotBlurIntensity: Number(e.target.value) }))}
                  className="w-full h-1 accent-teal-400 bg-zinc-800 rounded"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

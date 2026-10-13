import React from 'react';
import { Sparkles, RotateCcw, Check, Pipette } from 'lucide-react';
import { SelectiveColorSettings } from '../types/editor';
import { COLOR_HUE_RANGES } from '../utils/compositingUtils';

interface SelectiveColorPanelProps {
  selectiveColor: SelectiveColorSettings;
  setSelectiveColor: React.Dispatch<React.SetStateAction<SelectiveColorSettings>>;
}

export const SelectiveColorPanel: React.FC<SelectiveColorPanelProps> = ({
  selectiveColor,
  setSelectiveColor,
}) => {
  const currentRange = COLOR_HUE_RANGES[selectiveColor.activeColor] || COLOR_HUE_RANGES.red;

  const handleReset = () => {
    setSelectiveColor(prev => ({
      ...prev,
      hueShift: 0,
      saturation: 0,
      luminance: 0,
      rangeWidth: 45,
      feather: 30,
    }));
  };

  return (
    <div className="flex flex-col gap-2.5 animate-in fade-in select-none">
      {/* Header with Enable Switch & Reset */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Sparkles size={12} />
          </div>
          <div>
            <span className="text-xs font-bold text-white">সিলেক্টিভ কালার কারেকশন (Selective HSL)</span>
            <span className="text-[9px] text-zinc-400 block leading-tight">নির্দিষ্ট রঙের হিউ, স্যাচুরেশন ও লুমিন্যান্স আইসোলেশন</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Active switch */}
          <button
            onClick={() => setSelectiveColor(prev => ({ ...prev, enabled: !prev.enabled }))}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
              selectiveColor.enabled
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                : 'bg-zinc-800 text-zinc-500 border-zinc-700'
            }`}
          >
            {selectiveColor.enabled ? 'সক্রিয় (ON)' : 'বন্ধ (OFF)'}
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

      {/* Color Spectrum Swatches */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-0.5">
        {(Object.keys(COLOR_HUE_RANGES) as (keyof typeof COLOR_HUE_RANGES)[]).map((key) => {
          const item = COLOR_HUE_RANGES[key];
          const isSelected = selectiveColor.activeColor === key;
          return (
            <button
              key={key}
              onClick={() => setSelectiveColor(prev => ({ ...prev, activeColor: key as any, enabled: true }))}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border shrink-0 transition-all ${
                isSelected
                  ? 'bg-zinc-800 border-white text-white shadow-md ring-1 ring-white/60'
                  : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div
                className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-inner shrink-0"
                style={{ backgroundColor: key === 'custom' ? selectiveColor.customHex : item.colorHex }}
              />
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* If Custom color is chosen */}
      {selectiveColor.activeColor === 'custom' && (
        <div className="flex items-center gap-2 p-2 bg-zinc-950 rounded-xl border border-zinc-800">
          <Pipette size={14} className="text-purple-400" />
          <span className="text-[10px] text-zinc-300 font-medium">কাস্টম কালার পিক করুন:</span>
          <input
            type="color"
            value={selectiveColor.customHex}
            onChange={(e) => setSelectiveColor(prev => ({ ...prev, customHex: e.target.value }))}
            className="w-7 h-7 rounded border border-zinc-700 cursor-pointer bg-transparent"
          />
          <span className="font-mono text-zinc-400 text-[10px]">{selectiveColor.customHex}</span>
        </div>
      )}

      {/* Sliders: Hue Shift, Saturation, Luminance, Range, Feather */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80 text-xs">
        {/* Hue Shift */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-300 font-semibold">হিউ শিফট (Hue Shift):</span>
            <span className="font-mono text-amber-400 font-bold">{selectiveColor.hueShift > 0 ? `+${selectiveColor.hueShift}` : selectiveColor.hueShift}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={selectiveColor.hueShift}
            onChange={(e) => setSelectiveColor(prev => ({ ...prev, hueShift: Number(e.target.value), enabled: true }))}
            className="w-full h-1 accent-amber-400 bg-zinc-800 rounded"
          />
        </div>

        {/* Saturation */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-300 font-semibold">স্যাচুরেশন (Saturation):</span>
            <span className="font-mono text-cyan-400 font-bold">{selectiveColor.saturation > 0 ? `+${selectiveColor.saturation}` : selectiveColor.saturation}%</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={selectiveColor.saturation}
            onChange={(e) => setSelectiveColor(prev => ({ ...prev, saturation: Number(e.target.value), enabled: true }))}
            className="w-full h-1 accent-cyan-400 bg-zinc-800 rounded"
          />
        </div>

        {/* Luminance */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-300 font-semibold">লুমিন্যান্স (Luminance):</span>
            <span className="font-mono text-purple-400 font-bold">{selectiveColor.luminance > 0 ? `+${selectiveColor.luminance}` : selectiveColor.luminance}%</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={selectiveColor.luminance}
            onChange={(e) => setSelectiveColor(prev => ({ ...prev, luminance: Number(e.target.value), enabled: true }))}
            className="w-full h-1 accent-purple-400 bg-zinc-800 rounded"
          />
        </div>

        {/* Range Width & Feather */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-300 font-semibold">রেঞ্জ ও সফট ফেদার (Feather):</span>
            <span className="font-mono text-teal-400 font-bold">{selectiveColor.feather}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={selectiveColor.feather}
            onChange={(e) => setSelectiveColor(prev => ({ ...prev, feather: Number(e.target.value), enabled: true }))}
            className="w-full h-1 accent-teal-400 bg-zinc-800 rounded"
          />
        </div>
      </div>
    </div>
  );
};

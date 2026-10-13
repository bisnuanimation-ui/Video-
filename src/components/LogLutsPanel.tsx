import React from 'react';
import { Film, Sliders, CheckCircle, RotateCcw, Camera } from 'lucide-react';
import { LogProfileSettings, CameraLogProfile } from '../types/editor';
import { CAMERA_LOG_PRESETS } from '../utils/compositingUtils';

interface LogLutsPanelProps {
  logSettings: LogProfileSettings;
  setLogSettings: React.Dispatch<React.SetStateAction<LogProfileSettings>>;
}

export const LogLutsPanel: React.FC<LogLutsPanelProps> = ({
  logSettings,
  setLogSettings,
}) => {
  const selectedPreset = CAMERA_LOG_PRESETS.find(p => p.id === logSettings.profile) || CAMERA_LOG_PRESETS[0];

  const handleSelectProfile = (id: CameraLogProfile) => {
    setLogSettings(prev => ({
      ...prev,
      profile: id,
    }));
  };

  const handleReset = () => {
    setLogSettings({
      profile: 'rec709',
      exposureComp: 0,
      contrastRecovery: 50,
      highlightRollOff: 40,
      lutIntensity: 100,
    });
  };

  return (
    <div className="flex flex-col gap-2.5 animate-in fade-in select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Camera size={12} />
          </div>
          <div>
            <span className="text-xs font-bold text-white">লগ ও র’ (Log & RAW) ফুটেজ সাপোর্ট</span>
            <span className="text-[9px] text-zinc-400 block leading-tight">ARRI, Sony S-Log, RED, DJI ও Blackmagic ইনপুট LUTs</span>
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

      {/* Camera Profile Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto p-0.5">
        {CAMERA_LOG_PRESETS.map((preset) => {
          const isSelected = logSettings.profile === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectProfile(preset.id)}
              className={`p-2 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                isSelected
                  ? 'bg-emerald-950/40 border-emerald-400 text-emerald-200 shadow-md ring-1 ring-emerald-400/50'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-mono text-[8px] font-bold">
                  {preset.badge}
                </span>
                {isSelected && <CheckCircle size={12} className="text-emerald-400" />}
              </div>
              <span className="text-[11px] font-bold truncate">{preset.name}</span>
              <span className="text-[9px] text-zinc-500 truncate">{preset.manufacturer}</span>
            </button>
          );
        })}
      </div>

      {/* Active Profile Info Banner */}
      <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-[10px]">
        <div>
          <span className="text-emerald-400 font-bold">{selectedPreset.bengaliName}</span>
          <p className="text-zinc-400 text-[9px]">{selectedPreset.description}</p>
        </div>
      </div>

      {/* Sliders: LUT Intensity, Exposure Compensation, Contrast Recovery */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80 text-xs">
        {/* LUT Transform Intensity */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-300 font-semibold">LUT মাত্রা (Intensity):</span>
            <span className="font-mono text-emerald-400 font-bold">{logSettings.lutIntensity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={logSettings.lutIntensity}
            onChange={(e) => setLogSettings(prev => ({ ...prev, lutIntensity: Number(e.target.value) }))}
            className="w-full h-1 accent-emerald-400 bg-zinc-800 rounded"
          />
        </div>

        {/* Exposure Compensation */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-300 font-semibold">এক্সপোজার (Exposure):</span>
            <span className="font-mono text-cyan-400 font-bold">{logSettings.exposureComp > 0 ? `+${logSettings.exposureComp}` : logSettings.exposureComp} EV</span>
          </div>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.2"
            value={logSettings.exposureComp}
            onChange={(e) => setLogSettings(prev => ({ ...prev, exposureComp: Number(e.target.value) }))}
            className="w-full h-1 accent-cyan-400 bg-zinc-800 rounded"
          />
        </div>

        {/* Highlight Recovery */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-300 font-semibold">হাইলাইটস রিকভারি:</span>
            <span className="font-mono text-amber-400 font-bold">{logSettings.highlightRollOff}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={logSettings.highlightRollOff}
            onChange={(e) => setLogSettings(prev => ({ ...prev, highlightRollOff: Number(e.target.value) }))}
            className="w-full h-1 accent-amber-400 bg-zinc-800 rounded"
          />
        </div>
      </div>
    </div>
  );
};

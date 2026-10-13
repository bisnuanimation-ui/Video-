import React, { useState } from 'react';
import { Layers, Eye, EyeOff, Lock, Unlock, Sliders, RotateCcw, Sparkles, Pipette } from 'lucide-react';
import { CompositingLayer, ChromaKeyerSettings, CompositingBlendMode } from '../types/editor';

interface LayersCompositingPanelProps {
  layers: CompositingLayer[];
  setLayers: React.Dispatch<React.SetStateAction<CompositingLayer[]>>;
  chromaKey: ChromaKeyerSettings;
  setChromaKey: React.Dispatch<React.SetStateAction<ChromaKeyerSettings>>;
}

export const LayersCompositingPanel: React.FC<LayersCompositingPanelProps> = ({
  layers,
  setLayers,
  chromaKey,
  setChromaKey,
}) => {
  const [activeTab, setActiveTab] = useState<'layers' | 'chroma'>('layers');
  const [selectedLayerId, setSelectedLayerId] = useState<string>(layers[0]?.id || '');

  const blendOptions: { id: CompositingBlendMode; label: string }[] = [
    { id: 'normal', label: 'Normal' },
    { id: 'screen', label: 'Screen (লাইট/ফ্লেয়ার)' },
    { id: 'multiply', label: 'Multiply (ডার্কেন/শ্যাডো)' },
    { id: 'overlay', label: 'Overlay (হাই কনট্রাস্ট)' },
    { id: 'soft-light', label: 'Soft Light (সিনেমা ব্লেন্ড)' },
    { id: 'hard-light', label: 'Hard Light' },
    { id: 'color-dodge', label: 'Color Dodge (গ্লো)' },
    { id: 'luminosity', label: 'Luminosity (আলোর মাত্রা)' },
    { id: 'difference', label: 'Difference' },
  ];

  const handleToggleVisibility = (id: string) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  const handleToggleLock = (id: string) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, locked: !l.locked } : l));
  };

  const handleOpacityChange = (id: string, val: number) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, opacity: val } : l));
  };

  const handleBlendChange = (id: string, mode: CompositingBlendMode) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, blendMode: mode } : l));
  };

  const selectedLayer = layers.find(l => l.id === selectedLayerId) || layers[0];

  return (
    <div className="flex flex-col gap-2.5 animate-in fade-in select-none">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
          <button
            onClick={() => setActiveTab('layers')}
            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
              activeTab === 'layers'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            📚 মাল্টি-লেয়ার স্ট্যাক ({layers.length})
          </button>
          <button
            onClick={() => setActiveTab('chroma')}
            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
              activeTab === 'chroma'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            🟩 ক্রোমা কি ও ম্যাট (Green Screen)
          </button>
        </div>

        <button
          onClick={() => {
            setLayers(prev => prev.map(l => ({ ...l, visible: true, opacity: 100, blendMode: 'normal' })));
          }}
          className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          title="রিসেট করুন"
        >
          <RotateCcw size={12} />
        </button>
      </div>

      {/* ================= TAB: LAYERS STACK ================= */}
      {activeTab === 'layers' && (
        <div className="flex flex-col gap-2">
          {/* Layer List Stack */}
          <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
            {layers.map((layer) => {
              const isSelected = selectedLayerId === layer.id;
              return (
                <div
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`p-2 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-400 text-blue-200 shadow-sm ring-1 ring-blue-400/50'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleVisibility(layer.id);
                      }}
                      className={`p-1 rounded hover:bg-zinc-800 ${layer.visible ? 'text-zinc-200' : 'text-zinc-600'}`}
                      title={layer.visible ? 'হাইড করুন' : 'দৃশ্যমান করুন'}
                    >
                      {layer.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleLock(layer.id);
                      }}
                      className={`p-1 rounded hover:bg-zinc-800 ${layer.locked ? 'text-amber-400' : 'text-zinc-600'}`}
                      title={layer.locked ? 'আনলক করুন' : 'লক করুন'}
                    >
                      {layer.locked ? <Lock size={12} /> : <Unlock size={12} />}
                    </button>

                    <div>
                      <span className="font-bold text-[11px] block">{layer.name}</span>
                      <span className="text-[9px] text-zinc-500 font-mono">
                        ব্লেন্ড: {layer.blendMode.toUpperCase()} | অপাসিটি: {layer.opacity}%
                      </span>
                    </div>
                  </div>

                  {/* Inline quick opacity slider */}
                  <div className="flex items-center gap-2 w-28" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={layer.opacity}
                      disabled={layer.locked}
                      onChange={(e) => handleOpacityChange(layer.id, Number(e.target.value))}
                      className="w-full h-1 accent-blue-400 bg-zinc-800 rounded disabled:opacity-30"
                    />
                    <span className="font-mono text-zinc-400 text-[9px] w-6 text-right">{layer.opacity}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Layer Blend Mode & Inspector */}
          {selectedLayer && (
            <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-300 text-[10px] font-semibold">
                সিলেক্টেড লেয়ার ব্লেন্ড মোড:
              </span>
              <select
                value={selectedLayer.blendMode}
                disabled={selectedLayer.locked}
                onChange={(e) => handleBlendChange(selectedLayer.id, e.target.value as any)}
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-[10px] text-white focus:outline-none disabled:opacity-40"
              >
                {blendOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB: CHROMA KEY & MATTE ================= */}
      {activeTab === 'chroma' && (
        <div className="flex flex-col gap-2">
          {/* Header Switch */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-sm" />
              <div>
                <span className="text-xs font-bold text-white">গ্রিন স্ক্রিন ও ক্রোমা কিয়ার (Chroma Key)</span>
                <span className="text-[9px] text-zinc-400 block leading-tight">
                  ব্যাকগ্রাউন্ড স্বচ্ছ করে অন্য লেয়ারের সাথে ন্যাচারাল কম্পোজিট করুন
                </span>
              </div>
            </div>

            <button
              onClick={() => setChromaKey(prev => ({ ...prev, enabled: !prev.enabled }))}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                chromaKey.enabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                  : 'bg-zinc-800 text-zinc-500 border-zinc-700'
              }`}
            >
              {chromaKey.enabled ? 'ক্রোমা সক্রিয়' : 'বন্ধ (OFF)'}
            </button>
          </div>

          {/* Key Color Picker */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
            <div className="flex items-center gap-2">
              <Pipette size={14} className="text-emerald-400" />
              <span className="text-[10px] text-zinc-300 font-medium">কি কালার সিলেক্ট করুন:</span>
              <input
                type="color"
                value={chromaKey.keyColor}
                onChange={(e) => setChromaKey(prev => ({ ...prev, keyColor: e.target.value, enabled: true }))}
                className="w-6 h-6 rounded border border-zinc-700 cursor-pointer bg-transparent"
              />
              <span className="font-mono text-zinc-400 text-[10px]">{chromaKey.keyColor}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setChromaKey(prev => ({ ...prev, keyColor: '#00ff22', enabled: true }))}
                className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/40 text-[9px] font-bold"
              >
                গ্রিন (Green)
              </button>
              <button
                onClick={() => setChromaKey(prev => ({ ...prev, keyColor: '#0044ff', enabled: true }))}
                className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-600/40 text-[9px] font-bold"
              >
                ব্লু (Blue)
              </button>
            </div>
          </div>

          {/* Tolerance, Softness & Spill Suppression */}
          <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80 text-xs">
            {/* Tolerance */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-300 font-semibold">টলারেন্স (Tolerance):</span>
                <span className="font-mono text-emerald-400 font-bold">{chromaKey.tolerance}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={chromaKey.tolerance}
                onChange={(e) => setChromaKey(prev => ({ ...prev, tolerance: Number(e.target.value), enabled: true }))}
                className="w-full h-1 accent-emerald-400 bg-zinc-800 rounded"
              />
            </div>

            {/* Softness */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-300 font-semibold">এজ সফটনেস (Softness):</span>
                <span className="font-mono text-cyan-400 font-bold">{chromaKey.softness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={chromaKey.softness}
                onChange={(e) => setChromaKey(prev => ({ ...prev, softness: Number(e.target.value), enabled: true }))}
                className="w-full h-1 accent-cyan-400 bg-zinc-800 rounded"
              />
            </div>

            {/* Spill Suppression */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-300 font-semibold">স্পিল সাবপ্রেশন:</span>
                <span className="font-mono text-teal-400 font-bold">{chromaKey.spillSuppression}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={chromaKey.spillSuppression}
                onChange={(e) => setChromaKey(prev => ({ ...prev, spillSuppression: Number(e.target.value), enabled: true }))}
                className="w-full h-1 accent-teal-400 bg-zinc-800 rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

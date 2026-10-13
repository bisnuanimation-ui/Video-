import React, { useState } from 'react';
import { 
  Palette, 
  Sliders, 
  Sparkles, 
  Wand2, 
  Type, 
  Smile, 
  Music, 
  Diamond, 
  RotateCcw, 
  Check, 
  X, 
  Sun, 
  Contrast, 
  Droplet, 
  Thermometer, 
  Film, 
  Eye, 
  Plus, 
  Trash2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Layers,
  Activity,
  Zap,
  ArrowRight,
  GitCommit,
  ShieldCheck,
  SunMedium,
  Crosshair,
  Camera,
  BarChart3
} from 'lucide-react';
import { HistogramPanel } from './HistogramPanel';
import { 
  FilterSettings, 
  PresetFilter, 
  ColorPalette,
  ActiveToolTab, 
  TextOverlay, 
  StickerOverlay,
  AudioTrack,
  Keyframe,
  RGBCurves,
  ColorGradingNode,
  SelectiveColorSettings,
  SkinToneProtection,
  LogProfileSettings,
  VirtualLightSettings,
  OpticsSettings,
  ObjectTrackerSettings,
  MaskingSettings,
  CompositingLayer,
  ChromaKeyerSettings
} from '../types/editor';
import { 
  PRESET_FILTERS, 
  COLOR_PALETTES, 
  STICKER_PRESETS, 
  FONT_OPTIONS, 
  DEFAULT_FILTERS, 
  BGM_TRACKS 
} from '../constants/presets';
import { CurvesAdjustmentPanel } from './CurvesAdjustmentPanel';
import { NodeGradingPanel } from './NodeGradingPanel';
import { SelectiveColorPanel } from './SelectiveColorPanel';
import { SkinTonePanel } from './SkinTonePanel';
import { LogLutsPanel } from './LogLutsPanel';
import { VirtualLightingPanel } from './VirtualLightingPanel';
import { OpticsFlaresPanel } from './OpticsFlaresPanel';
import { TrackingMaskingPanel } from './TrackingMaskingPanel';
import { LayersCompositingPanel } from './LayersCompositingPanel';
import { PresetsGallery } from './PresetsGallery';

interface BottomToolbarProps {
  activeTab: ActiveToolTab | null;
  setActiveTab: (tab: ActiveToolTab | null) => void;
  filters: FilterSettings;
  setFilters: React.Dispatch<React.SetStateAction<FilterSettings>>;
  selectedPresetId: string;
  onApplyPreset: (preset: PresetFilter) => void;
  onApplyPalette: (palette: ColorPalette) => void;
  filterIntensity: number;
  setFilterIntensity: (val: number) => void;
  showLetterbox: boolean;
  setShowLetterbox: (val: boolean) => void;
  textOverlays: TextOverlay[];
  onAddText: (text: string, font: string, color: string) => void;
  onDeleteText: (id: string) => void;
  stickerOverlays: StickerOverlay[];
  onAddSticker: (emoji: string) => void;
  onDeleteSticker: (id: string) => void;
  onAutoAdjust: () => void;
  onRunAISceneDetection: () => void;
  isAiProcessing: boolean;
  activeAudioTrack: AudioTrack | null;
  onSelectAudioTrack: (track: AudioTrack | null) => void;
  audioVolume: number;
  setAudioVolume: (val: number) => void;
  keyframes: Keyframe[];
  selectedKeyframeId: string | null;
  onSelectKeyframe: (id: string | null) => void;
  onAddKeyframe: () => void;
  onDeleteKeyframe: (id: string) => void;
  onClearAllKeyframes?: () => void;
  currentTime?: number;
  onSeek: (time: number) => void;
  onApplyAutomationPreset: (mode: 'sunset' | 'dayNight' | 'cyberShift') => void;
  onChangeCurves: (newCurves: RGBCurves) => void;
  onResetCurves: () => void;
  nodes: ColorGradingNode[];
  setNodes: React.Dispatch<React.SetStateAction<ColorGradingNode[]>>;
  selectedNodeId: string;
  setSelectedNodeId: (id: string) => void;
  selectiveColor: SelectiveColorSettings;
  setSelectiveColor: React.Dispatch<React.SetStateAction<SelectiveColorSettings>>;
  skinTone: SkinToneProtection;
  setSkinTone: React.Dispatch<React.SetStateAction<SkinToneProtection>>;
  logSettings: LogProfileSettings;
  setLogSettings: React.Dispatch<React.SetStateAction<LogProfileSettings>>;
  virtualLight: VirtualLightSettings;
  setLightSettings: React.Dispatch<React.SetStateAction<VirtualLightSettings>>;
  opticsSettings: OpticsSettings;
  setOpticsSettings: React.Dispatch<React.SetStateAction<OpticsSettings>>;
  trackerSettings: ObjectTrackerSettings;
  setTrackerSettings: React.Dispatch<React.SetStateAction<ObjectTrackerSettings>>;
  maskSettings: MaskingSettings;
  setMaskSettings: React.Dispatch<React.SetStateAction<MaskingSettings>>;
  layers: CompositingLayer[];
  setLayers: React.Dispatch<React.SetStateAction<CompositingLayer[]>>;
  chromaKey: ChromaKeyerSettings;
  setChromaKey: React.Dispatch<React.SetStateAction<ChromaKeyerSettings>>;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
}

export const BottomToolbar: React.FC<BottomToolbarProps> = ({
  videoRef,
  activeTab,
  setActiveTab,
  filters,
  setFilters,
  selectedPresetId,
  onApplyPreset,
  onApplyPalette,
  filterIntensity,
  setFilterIntensity,
  showLetterbox,
  setShowLetterbox,
  textOverlays,
  onAddText,
  onDeleteText,
  stickerOverlays,
  onAddSticker,
  onDeleteSticker,
  onAutoAdjust,
  onRunAISceneDetection,
  isAiProcessing,
  activeAudioTrack,
  onSelectAudioTrack,
  audioVolume,
  setAudioVolume,
  keyframes,
  selectedKeyframeId,
  onSelectKeyframe,
  onAddKeyframe,
  onDeleteKeyframe,
  onClearAllKeyframes,
  currentTime = 0,
  onSeek,
  onApplyAutomationPreset,
  onChangeCurves,
  onResetCurves,
  nodes,
  setNodes,
  selectedNodeId,
  setSelectedNodeId,
  selectiveColor,
  setSelectiveColor,
  skinTone,
  setSkinTone,
  logSettings,
  setLogSettings,
  virtualLight,
  setLightSettings,
  opticsSettings,
  setOpticsSettings,
  trackerSettings,
  setTrackerSettings,
  maskSettings,
  setMaskSettings,
  layers,
  setLayers,
  chromaKey,
  setChromaKey,
}) => {
  type NumericFilterKey = Exclude<keyof FilterSettings, 'curves'>;

  const [presetCategory, setPresetCategory] = useState<'Featured' | 'FilmStocks' | 'Cinematic' | 'Moody' | 'SciFi' | 'Vintage' | 'NEW' | 'Hits' | 'Landscape' | 'All'>('Featured');
  const [selectedAdjustKey, setSelectedAdjustKey] = useState<NumericFilterKey>('brightness');
  const [showStudioHistogram, setShowStudioHistogram] = useState<boolean>(true);

  const isColorGradingStudioTab = activeTab && ['curves', 'adjust', 'nodes', 'selective-color', 'skin-tone', 'log-luts', 'histogram'].includes(activeTab);

  // Text state
  const [newText, setNewText] = useState('My Video');
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0].family);
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  // Quality state
  const [hdUpscaleActive, setHdUpscaleActive] = useState(false);
  const [denoiseLevel, setDenoiseLevel] = useState<'Off' | 'Low' | 'Medium' | 'High'>('Medium');
  const [smoothMotion, setSmoothMotion] = useState(true);

  const categories = ['Featured', 'FilmStocks', 'Cinematic', 'Moody', 'SciFi', 'Vintage', 'NEW', 'Hits', 'Landscape', 'All'] as const;

  const filteredPresets = PRESET_FILTERS.filter(
    (p) => presetCategory === 'All' || p.category === presetCategory || (presetCategory === 'Featured' && p.id === 'none')
  );

  const handleSliderChange = (key: NumericFilterKey, val: number) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const adjustItems: { key: NumericFilterKey; label: string; icon: string; min: number; max: number; unit: string; def: number }[] = [
    { key: 'brightness', label: 'ব্রাইটনেস', icon: '☀️', min: 0, max: 200, unit: '%', def: 100 },
    { key: 'contrast', label: 'কন্ট্রাস্ট', icon: '◐', min: 0, max: 200, unit: '%', def: 100 },
    { key: 'saturation', label: 'স্যাচুরেশন', icon: '💧', min: 0, max: 200, unit: '%', def: 100 },
    { key: 'brilliance', label: 'ব্রিলিয়ান্স', icon: '✨', min: 0, max: 200, unit: '%', def: 100 },
    { key: 'sharpen', label: 'শার্পনেস', icon: '🔺', min: 0, max: 100, unit: '%', def: 0 },
    { key: 'highlights', label: 'হাইলাইটস', icon: '🔆', min: 0, max: 200, unit: '%', def: 100 },
    { key: 'shadows', label: 'শ্যাডো', icon: '🌑', min: 0, max: 200, unit: '%', def: 100 },
    { key: 'whites', label: 'হোয়াইটস্', icon: '⚪', min: 0, max: 200, unit: '%', def: 100 },
    { key: 'blacks', label: 'ব্ল্যাকস্', icon: '⚫', min: 0, max: 200, unit: '%', def: 100 },
    { key: 'temperature', label: 'টেম্পারেচার', icon: '🌡️', min: -100, max: 100, unit: '°', def: 0 },
    { key: 'hue', label: 'হিউ', icon: '🌈', min: -180, max: 180, unit: '°', def: 0 },
    { key: 'fade', label: 'ফেড', icon: '🌫️', min: 0, max: 100, unit: '%', def: 0 },
    { key: 'vignette', label: 'ভিগনেট', icon: '🔘', min: 0, max: 100, unit: '%', def: 0 },
    { key: 'grain', label: 'ফিল্ম গ্রেইন', icon: '🎞️', min: 0, max: 100, unit: '%', def: 0 },
  ];

  const currentAdjustConfig = adjustItems.find((item) => item.key === selectedAdjustKey) || adjustItems[0];
  const activeSelectedKeyframe = keyframes.find((k) => k.id === selectedKeyframeId);

  return (
    <div className="bg-zinc-950 border-t border-zinc-800/90 flex flex-col z-20 shrink-0 safe-pb">
      {/* 1. Mobile Bottom Dock Navigation */}
      <div className="h-14 px-1 flex items-center justify-between sm:justify-around overflow-x-auto text-xs bg-zinc-950 select-none">
        {/* Filters Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'filters' ? null : 'filters')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[48px] py-1 transition-all ${
            activeTab === 'filters' ? 'text-cyan-400 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'filters' ? 'bg-cyan-500/20' : ''}`}>
            <Palette size={17} />
          </div>
          <span className="text-[10px]">ফিল্টারস</span>
        </button>

        {/* Color Palettes Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'palettes' ? null : 'palettes')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[48px] py-1 transition-all ${
            activeTab === 'palettes' ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'palettes' ? 'bg-amber-500/20' : ''}`}>
            <Layers size={17} />
          </div>
          <span className="text-[10px]">প্যালেট</span>
        </button>

        {/* Adjust Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'adjust' ? null : 'adjust')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[48px] py-1 transition-all ${
            activeTab === 'adjust' ? 'text-cyan-400 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'adjust' ? 'bg-cyan-500/20' : ''}`}>
            <Sliders size={17} />
          </div>
          <span className="text-[10px]">অ্যাডজাস্ট</span>
        </button>

        {/* Curves (RGB) Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'curves' ? null : 'curves')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[48px] py-1 transition-all ${
            activeTab === 'curves' ? 'text-cyan-300 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'curves' ? 'bg-cyan-500/25 ring-1 ring-cyan-400/60' : ''}`}>
            <Activity size={17} />
          </div>
          <span className="text-[10px]">কার্ভস</span>
        </button>

        {/* Histogram / Scopes Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'histogram' ? null : 'histogram')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[48px] py-1 transition-all ${
            activeTab === 'histogram' ? 'text-cyan-300 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'histogram' ? 'bg-cyan-500/25 ring-1 ring-cyan-400/60' : ''}`}>
            <BarChart3 size={17} />
          </div>
          <span className="text-[10px]">হিস্টোগ্রাম</span>
        </button>

        {/* Node-Based Grading Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'nodes' ? null : 'nodes')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[48px] py-1 transition-all ${
            activeTab === 'nodes' ? 'text-purple-300 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'nodes' ? 'bg-purple-500/25 ring-1 ring-purple-400/60' : ''}`}>
            <GitCommit size={17} />
          </div>
          <span className="text-[10px]">নোড ট্রি</span>
        </button>

        {/* Selective Color Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'selective-color' ? null : 'selective-color')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[48px] py-1 transition-all ${
            activeTab === 'selective-color' ? 'text-amber-300 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'selective-color' ? 'bg-amber-500/25 ring-1 ring-amber-400/60' : ''}`}>
            <Sparkles size={17} />
          </div>
          <span className="text-[10px]">সিলেক্টিভ</span>
        </button>

        {/* Skin Tone Protection Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'skin-tone' ? null : 'skin-tone')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[48px] py-1 transition-all ${
            activeTab === 'skin-tone' ? 'text-rose-300 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'skin-tone' ? 'bg-rose-500/25 ring-1 ring-rose-400/60' : ''}`}>
            <ShieldCheck size={17} />
          </div>
          <span className="text-[10px]">স্কিন টোন</span>
        </button>

        {/* Log & RAW Camera LUTs Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'log-luts' ? null : 'log-luts')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[48px] py-1 transition-all ${
            activeTab === 'log-luts' ? 'text-emerald-300 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'log-luts' ? 'bg-emerald-500/25 ring-1 ring-emerald-400/60' : ''}`}>
            <Camera size={17} />
          </div>
          <span className="text-[10px]">ক্যামেরা LUTs</span>
        </button>

        {/* Virtual 3D Lights Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'virtual-lighting' ? null : 'virtual-lighting')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[48px] py-1 transition-all ${
            activeTab === 'virtual-lighting' ? 'text-amber-300 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'virtual-lighting' ? 'bg-amber-500/25 ring-1 ring-amber-400/60' : ''}`}>
            <SunMedium size={17} />
          </div>
          <span className="text-[10px]">ভার্চুয়াল লাইট</span>
        </button>

        {/* Optics, Flares & Halation Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'optics-flares' ? null : 'optics-flares')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[48px] py-1 transition-all ${
            activeTab === 'optics-flares' ? 'text-cyan-300 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'optics-flares' ? 'bg-cyan-500/25 ring-1 ring-cyan-400/60' : ''}`}>
            <Zap size={17} />
          </div>
          <span className="text-[10px]">ফ্লেয়ার ও গ্লো</span>
        </button>

        {/* Smart Object Tracking & Masking Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'object-tracking' ? null : 'object-tracking')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[48px] py-1 transition-all ${
            activeTab === 'object-tracking' ? 'text-cyan-300 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'object-tracking' ? 'bg-cyan-500/25 ring-1 ring-cyan-400/60' : ''}`}>
            <Crosshair size={17} />
          </div>
          <span className="text-[10px]">ট্র্যাকিং ও মাস্ক</span>
        </button>

        {/* Multi-Layer Compositing & Chroma Key Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'layers-compositing' ? null : 'layers-compositing')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[48px] py-1 transition-all ${
            activeTab === 'layers-compositing' ? 'text-blue-300 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'layers-compositing' ? 'bg-blue-500/25 ring-1 ring-blue-400/60' : ''}`}>
            <Layers size={17} />
          </div>
          <span className="text-[10px]">লেয়ার্স ও ম্যাট</span>
        </button>


        {/* Keyframes & Automation Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'keyframes' ? null : 'keyframes')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[48px] py-1 transition-all ${
            activeTab === 'keyframes' ? 'text-amber-300 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'keyframes' ? 'bg-amber-500/20' : ''}`}>
            <Diamond size={17} />
          </div>
          <span className="text-[10px]">কী-ফ্রেম</span>
        </button>

        {/* Audio Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'audio' ? null : 'audio')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[48px] py-1 transition-all ${
            activeTab === 'audio' ? 'text-teal-400 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'audio' ? 'bg-teal-500/20' : ''}`}>
            <Music size={17} />
          </div>
          <span className="text-[10px]">অডিও</span>
        </button>

        {/* Quality Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'quality' ? null : 'quality')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[48px] py-1 transition-all ${
            activeTab === 'quality' ? 'text-cyan-400 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'quality' ? 'bg-cyan-500/20' : ''}`}>
            <Sparkles size={17} />
          </div>
          <span className="text-[10px]">কোয়ালিটি</span>
        </button>

        {/* AI Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'ai-clipper' ? null : 'ai-clipper')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[48px] py-1 transition-all ${
            activeTab === 'ai-clipper' ? 'text-purple-400 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'ai-clipper' ? 'bg-purple-500/20' : ''}`}>
            <Wand2 size={17} />
          </div>
          <span className="text-[10px]">এআই</span>
        </button>

        {/* Text Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'text' ? null : 'text')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[48px] py-1 transition-all ${
            activeTab === 'text' ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'text' ? 'bg-amber-500/20' : ''}`}>
            <Type size={17} />
          </div>
          <span className="text-[10px]">টেক্সট</span>
        </button>

        {/* Stickers Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'stickers' ? null : 'stickers')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[48px] py-1 transition-all ${
            activeTab === 'stickers' ? 'text-rose-400 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'stickers' ? 'bg-rose-500/20' : ''}`}>
            <Smile size={17} />
          </div>
          <span className="text-[10px]">স্টিকার</span>
        </button>
      </div>

      {/* 2. CapCut Mobile Tool Drawer Panel */}
      {activeTab && (
        <div className="bg-zinc-900 border-t border-zinc-800 p-2 sm:p-3 flex flex-col gap-2 max-h-60 overflow-y-auto animate-in slide-in-from-bottom-6">
          {/* Drawer Top Header */}
          <div className="flex items-center justify-between px-1 pb-1 border-b border-zinc-800/80 shrink-0">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              {activeTab === 'filters' && '🎨 কালার ফিল্টারস ও ফিল্ম প্রিসেট (30+)'}
              {activeTab === 'palettes' && '🎭 প্রফেশনাল কালার প্যালেট স্কিমস'}
              {activeTab === 'adjust' && '🎛️ কালার অ্যাডজাস্টমেন্ট ও সেটিংস'}
              {activeTab === 'curves' && '📈 RGB কালার কার্ভস ও প্রফেশনাল লুমিন্যান্স'}
              {activeTab === 'histogram' && '📊 রিয়েল-টাইম লুমিন্যান্স হিস্টোগ্রাম ও এক্সপোজার মনিটর'}
              {activeTab === 'nodes' && '🔀 নোড-ভিত্তিক কালার গ্রেডিং (Node Tree)'}
              {activeTab === 'selective-color' && '🎯 সিলেক্টিভ কালার কারেকশন (Selective HSL)'}
              {activeTab === 'skin-tone' && '🛡️ স্কিন টোন প্রটেকশন ও ভেক্টরেস্কোপ গাইড'}
              {activeTab === 'log-luts' && '🎥 লগ ও র’ (Log & RAW) ক্যামেরা ইনপুট LUTs'}
              {activeTab === 'virtual-lighting' && '💡 ৩ডি ভার্চুয়াল লাইটিং ও কাস্টম শ্যাডো'}
              {activeTab === 'optics-flares' && '⚡ লাইট লিকেজ, অ্যানামরফিক ফ্লেয়ার ও হ্যালিয়েশন'}
              {activeTab === 'object-tracking' && '🎯 স্মার্ট অবজেক্ট ট্র্যাকিং ও রোটো মাস্কিং'}
              {activeTab === 'layers-compositing' && '📚 মাল্টি-লেয়ার কম্পোজিটিং ও গ্রিন স্ক্রিন'}
              {activeTab === 'keyframes' && '◆ কী-ফ্রেম কাস্টমাইজেশন ও অটোমেশন'}
              {activeTab === 'audio' && '🎵 ব্যাকগ্রাউন্ড মিউজিক (BGM)'}
              {activeTab === 'quality' && '✨ ভিডিও কোয়ালিটি এনহ্যান্স'}
              {activeTab === 'ai-clipper' && '🤖 এআই সিন ডিটেকশন'}
              {activeTab === 'text' && '🔤 ভিডিও টেক্সট লেয়ার'}
              {activeTab === 'stickers' && '😊 স্টিকার ও রিঅ্যাকশন'}
            </span>

            <div className="flex items-center gap-1.5">
              {/* Studio Histogram Toggle Button */}
              {isColorGradingStudioTab && activeTab !== 'histogram' && (
                <button
                  type="button"
                  onClick={() => setShowStudioHistogram(!showStudioHistogram)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 active:scale-95 transition-all ${
                    showStudioHistogram
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/80 shadow-sm'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
                  }`}
                  title="রিয়েল-টাইম লুমিন্যান্স হিস্টোগ্রাম অন/অফ"
                >
                  <BarChart3 size={11} />
                  <span>হিস্টোগ্রাম</span>
                </button>
              )}

              {activeTab === 'adjust' && (
                <button
                  onClick={onAutoAdjust}
                  className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] border border-cyan-500/40 flex items-center gap-1 active:scale-95"
                >
                  <Wand2 size={10} />
                  <span>অটো</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab(null)}
                className="w-6 h-6 rounded-full bg-cyan-500 text-zinc-950 flex items-center justify-center font-black shadow active:scale-90"
                title="Done"
              >
                <Check size={13} className="stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Real-time Studio Histogram (rendered for Adjust, Nodes, Selective Color, Skin Tone, Log LUTs) */}
          {showStudioHistogram && isColorGradingStudioTab && activeTab !== 'curves' && activeTab !== 'histogram' && (
            <HistogramPanel
              videoRef={videoRef}
              filters={filters}
              curves={filters.curves}
              currentTime={currentTime}
              compact={true}
              className="mb-1"
            />
          )}

          {/* ======================= TAB: FILTERS ======================= */}
          {activeTab === 'filters' && (
            <PresetsGallery
              selectedPresetId={selectedPresetId}
              onApplyPreset={onApplyPreset}
              filterIntensity={filterIntensity}
              setFilterIntensity={setFilterIntensity}
            />
          )}

          {/* ======================= TAB: COLOR PALETTES ======================= */}
          {activeTab === 'palettes' && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-zinc-400">
                এক ক্লিকে সিনেমাটিক ৪-কালার প্যালেট সমন্বয় প্রয়োগ করুন:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 overflow-y-auto max-h-40">
                {COLOR_PALETTES.map((pal) => (
                  <button
                    key={pal.id}
                    onClick={() => onApplyPalette(pal)}
                    className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-400/60 flex flex-col gap-1.5 text-left active:scale-95 transition-all group"
                  >
                    {/* 4 Swatches bar */}
                    <div className="h-4 rounded-md overflow-hidden flex border border-white/10 shadow-sm">
                      {pal.colors.map((c, i) => (
                        <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <div className="truncate">
                      <span className="text-[10px] font-bold text-zinc-200 block truncate group-hover:text-amber-300">
                        {pal.banglaName}
                      </span>
                      <span className="text-[8px] text-zinc-500">{pal.mood}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ======================= TAB: ADJUST ======================= */}
          {activeTab === 'adjust' && (
            <div className="flex flex-col gap-2">
              {/* Active Slider */}
              <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 flex flex-col gap-1.5 shadow-inner">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <span>{currentAdjustConfig.icon}</span>
                    <span>{currentAdjustConfig.label}</span>
                  </span>
                  <span className="font-mono text-cyan-400 font-bold text-xs">
                    {filters[currentAdjustConfig.key]}{currentAdjustConfig.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={currentAdjustConfig.min}
                  max={currentAdjustConfig.max}
                  value={filters[currentAdjustConfig.key]}
                  onChange={(e) => handleSliderChange(currentAdjustConfig.key, Number(e.target.value))}
                  className="w-full h-1.5 accent-cyan-400 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Advanced Shadows & Highlights Quick Panel */}
              <div className="grid grid-cols-2 gap-2 bg-zinc-950/90 p-2 rounded-xl border border-zinc-800">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-amber-300 font-medium flex items-center gap-1">🌑 Shadows Lift</span>
                    <span className="font-mono text-amber-400">{filters.shadows}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.shadows}
                    onChange={(e) => handleSliderChange('shadows', Number(e.target.value))}
                    className="w-full h-1 accent-amber-400 bg-zinc-800 rounded"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-cyan-300 font-medium flex items-center gap-1">🔆 Highlights Rec</span>
                    <span className="font-mono text-cyan-400">{filters.highlights}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.highlights}
                    onChange={(e) => handleSliderChange('highlights', Number(e.target.value))}
                    className="w-full h-1 accent-cyan-400 bg-zinc-800 rounded"
                  />
                </div>
              </div>

              {/* Horizontal Scrollable Icons for each parameter */}
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin">
                {adjustItems.map((item) => {
                  const isSelected = selectedAdjustKey === item.key;
                  const isModified = filters[item.key] !== item.def;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setSelectedAdjustKey(item.key)}
                      className={`flex flex-col items-center gap-1 p-1.5 rounded-xl shrink-0 transition-all active:scale-90 ${
                        isSelected
                          ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                          : 'bg-zinc-950 border border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <div className="relative text-base">
                        {item.icon}
                        {isModified && (
                          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        )}
                      </div>
                      <span className="text-[9px] font-medium whitespace-nowrap">{item.label}</span>
                    </button>
                  );
                })}

                <button
                  onClick={() => setShowLetterbox(!showLetterbox)}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded-xl shrink-0 border active:scale-90 ${
                    showLetterbox
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <span className="text-base">🎬</span>
                  <span className="text-[9px] font-medium whitespace-nowrap">লেটারবক্স</span>
                </button>

                {/* Shortcut to Curves */}
                <button
                  onClick={() => setActiveTab('curves')}
                  className="flex flex-col items-center gap-1 p-1.5 rounded-xl shrink-0 border bg-cyan-500/10 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 active:scale-90"
                  title="RGB কালার কার্ভস এডিটর ওপেন করুন"
                >
                  <Activity size={18} className="text-cyan-400" />
                  <span className="text-[9px] font-bold whitespace-nowrap">RGB কার্ভস</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================= TAB: CURVES (RGB COLOR CURVES) ======================= */}
          {activeTab === 'curves' && (
            <CurvesAdjustmentPanel
              curves={filters.curves}
              onChangeCurves={onChangeCurves}
              onResetCurves={onResetCurves}
              videoRef={videoRef}
              filters={filters}
              currentTime={currentTime}
            />
          )}

          {/* ======================= TAB: HISTOGRAM & EXPOSURE MONITOR ======================= */}
          {activeTab === 'histogram' && (
            <div className="flex flex-col gap-2">
              <HistogramPanel
                videoRef={videoRef}
                filters={filters}
                curves={filters.curves}
                currentTime={currentTime}
                compact={false}
                allowScopeModes={true}
                allowToggleChannel={true}
                onQuickAdjust={(adjustments) => {
                  setFilters((prev) => ({ ...prev, ...adjustments }));
                }}
              />

              {/* Real-time Exposure Adjustment Sliders */}
              <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800/80 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-zinc-200">
                  <span className="flex items-center gap-1.5">
                    <Sliders size={13} className="text-cyan-400" />
                    এক্সপোজার ও লাইটিং এডজাস্টমেন্ট (Exposure Sliders)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        brightness: 100,
                        contrast: 100,
                        highlights: 100,
                        shadows: 100,
                        whites: 100,
                        blacks: 100,
                      }));
                    }}
                    className="text-[9px] text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-zinc-800 active:scale-95"
                  >
                    রিসেট
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-0.5">
                      <span>ব্রাইটনেস (Overall Luma)</span>
                      <span className="font-mono text-cyan-300 font-bold">{filters.brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="180"
                      value={filters.brightness}
                      onChange={(e) => setFilters((prev) => ({ ...prev, brightness: Number(e.target.value) }))}
                      className="w-full accent-cyan-400 h-1 bg-zinc-800 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-0.5">
                      <span>কন্ট্রাস্ট (Dynamic Curve)</span>
                      <span className="font-mono text-cyan-300 font-bold">{filters.contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="180"
                      value={filters.contrast}
                      onChange={(e) => setFilters((prev) => ({ ...prev, contrast: Number(e.target.value) }))}
                      className="w-full accent-cyan-400 h-1 bg-zinc-800 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-0.5">
                      <span>শ্যাডো লিফট (Shadows)</span>
                      <span className="font-mono text-cyan-300 font-bold">{filters.shadows}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="180"
                      value={filters.shadows}
                      onChange={(e) => setFilters((prev) => ({ ...prev, shadows: Number(e.target.value) }))}
                      className="w-full accent-cyan-400 h-1 bg-zinc-800 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-0.5">
                      <span>হাইলাইটস (Highlights)</span>
                      <span className="font-mono text-cyan-300 font-bold">{filters.highlights}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="180"
                      value={filters.highlights}
                      onChange={(e) => setFilters((prev) => ({ ...prev, highlights: Number(e.target.value) }))}
                      className="w-full accent-cyan-400 h-1 bg-zinc-800 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB: NODES (NODE-BASED GRADING) ======================= */}
          {activeTab === 'nodes' && (
            <NodeGradingPanel
              nodes={nodes}
              setNodes={setNodes}
              selectedNodeId={selectedNodeId}
              setSelectedNodeId={setSelectedNodeId}
              onOpenToolTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* ======================= TAB: SELECTIVE COLOR (HSL QUALIFIER) ======================= */}
          {activeTab === 'selective-color' && (
            <SelectiveColorPanel
              selectiveColor={selectiveColor}
              setSelectiveColor={setSelectiveColor}
            />
          )}

          {/* ======================= TAB: SKIN TONE PROTECTION ======================= */}
          {activeTab === 'skin-tone' && (
            <SkinTonePanel
              skinTone={skinTone}
              setSkinTone={setSkinTone}
            />
          )}

          {/* ======================= TAB: LOG & RAW CAMERA LUTS ======================= */}
          {activeTab === 'log-luts' && (
            <LogLutsPanel
              logSettings={logSettings}
              setLogSettings={setLogSettings}
            />
          )}

          {/* ======================= TAB: VIRTUAL 3D LIGHTING & SHADOWS ======================= */}
          {activeTab === 'virtual-lighting' && (
            <VirtualLightingPanel
              lightSettings={virtualLight}
              setLightSettings={setLightSettings}
            />
          )}

          {/* ======================= TAB: OPTICS, FLARES & HALATION ======================= */}
          {activeTab === 'optics-flares' && (
            <OpticsFlaresPanel
              opticsSettings={opticsSettings}
              setOpticsSettings={setOpticsSettings}
            />
          )}

          {/* ======================= TAB: SMART OBJECT TRACKING & MASKING ======================= */}
          {activeTab === 'object-tracking' && (
            <TrackingMaskingPanel
              trackerSettings={trackerSettings}
              setTrackerSettings={setTrackerSettings}
              maskSettings={maskSettings}
              setMaskSettings={setMaskSettings}
              currentTime={currentTime}
            />
          )}

          {/* ======================= TAB: MULTI-LAYER COMPOSITING & CHROMA KEY ======================= */}
          {activeTab === 'layers-compositing' && (
            <LayersCompositingPanel
              layers={layers}
              setLayers={setLayers}
              chromaKey={chromaKey}
              setChromaKey={setChromaKey}
            />
          )}


          {/* ======================= TAB: KEYFRAMES & AUTOMATION ======================= */}
          {activeTab === 'keyframes' && (() => {
            const activeNearKf = keyframes.find((k) => Math.abs(k.time - currentTime) < 0.25);
            const targetDeleteId = activeNearKf?.id || selectedKeyframeId;
            return (
              <div className="flex flex-col gap-2.5">
                {/* Quick Actions & Dedicated Keyframe Removal Tool */}
                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={onAddKeyframe}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-[10px] active:scale-95"
                    >
                      <Diamond size={11} className="fill-current" />
                      <span>+ কী-ফ্রেম যোগ</span>
                    </button>

                    {/* Dedicated Tool to Remove Keyframe */}
                    {targetDeleteId && (
                      <button
                        onClick={() => onDeleteKeyframe(targetDeleteId)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50 font-bold text-[10px] active:scale-95 animate-pulse"
                        title="বর্তমান ফ্রেমের কী-ফ্রেম রিমুভ / মুছুন"
                      >
                        <Trash2 size={11} className="text-red-400" />
                        <span>কী-ফ্রেম মুছুন {activeNearKf ? `(${activeNearKf.time.toFixed(1)}s)` : ''}</span>
                      </button>
                    )}

                    {/* Clear All Keyframes tool */}
                    {keyframes.length > 0 && onClearAllKeyframes && (
                      <button
                        onClick={onClearAllKeyframes}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-800 hover:bg-red-950/40 text-zinc-400 hover:text-red-300 border border-zinc-700 text-[10px] font-medium active:scale-95"
                        title="সব কী-ফ্রেম একসাথে মুছে ফেলুন"
                      >
                        <Trash2 size={10} />
                        <span>সব ক্লিয়ার ({keyframes.length})</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-zinc-400 font-semibold">অটোমেশন:</span>
                    <button
                      onClick={() => onApplyAutomationPreset('dayNight')}
                      className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-cyan-300 text-[9px] font-medium active:scale-95"
                      title="Day to Night color shift"
                    >
                      🌅 ডেরাইজিং
                    </button>
                    <button
                      onClick={() => onApplyAutomationPreset('sunset')}
                      className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-[9px] font-medium active:scale-95"
                      title="Sunset golden hour pulse"
                    >
                      🌆 সানসেট
                    </button>
                    <button
                      onClick={() => onApplyAutomationPreset('cyberShift')}
                      className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-purple-300 text-[9px] font-medium active:scale-95"
                      title="Cyberpunk color shift"
                    >
                      ⚡ সাইবার
                    </button>
                  </div>
                </div>

                {/* Active Keyframes List with Direct Remove Actions */}
                <div className="space-y-1.5 overflow-y-auto max-h-36">
                  {keyframes.map((kf, i) => {
                    const isSelected = selectedKeyframeId === kf.id;
                    const isNearCurrent = Math.abs(kf.time - currentTime) < 0.25;
                    return (
                      <div
                        key={kf.id}
                        onClick={() => {
                          onSelectKeyframe(kf.id);
                          onSeek(kf.time);
                        }}
                        className={`p-2 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-amber-950/40 border-amber-400 text-amber-200 shadow-md ring-1 ring-amber-400/50' 
                            : isNearCurrent
                            ? 'bg-zinc-900 border-cyan-500/50 text-cyan-200'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Diamond size={13} className={isNearCurrent ? 'text-cyan-400 fill-cyan-400' : 'text-amber-400 fill-amber-400'} />
                          <div>
                            <span className="font-bold text-[11px] flex items-center gap-1.5">
                              <span>কী-ফ্রেম #{i + 1} ({kf.time.toFixed(2)}s)</span>
                              {isNearCurrent && (
                                <span className="px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[8px] font-bold border border-cyan-500/30">
                                  বর্তমান ফ্রেম
                                </span>
                              )}
                            </span>
                            <span className="text-[9px] text-zinc-500">
                              ব্রাইট: {kf.settings.brightness}% | কন্ট্রাস্ট: {kf.settings.contrast}% | টেম্প: {kf.settings.temperature}°
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSeek(kf.time);
                            }}
                            className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300 hover:text-white"
                          >
                            যাও
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteKeyframe(kf.id);
                            }}
                            className="px-2 py-0.5 rounded bg-red-500/15 hover:bg-red-500/30 text-red-300 hover:text-red-200 text-[10px] font-semibold border border-red-500/30 flex items-center gap-1"
                            title="এই কী-ফ্রেমটি রিমুভ / মুছুন"
                          >
                            <Trash2 size={10} />
                            <span>মুছুন</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {keyframes.length === 0 && (
                    <div className="text-center py-3 text-zinc-500 text-[11px] italic bg-zinc-950/50 rounded-xl border border-dashed border-zinc-800">
                      কোনো কী-ফ্রেম নেই। যেকোনো ফ্রেমে যেয়ে <strong className="text-amber-400">+ কী-ফ্রেম</strong> বা <strong className="text-purple-400">⚡ অটোমেশন</strong> চাপুন!
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* ======================= TAB: AUDIO & BGM ======================= */}
          {activeTab === 'audio' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Volume2 size={13} className="text-teal-400" />
                  <span>মিউজিক সাউন্ড (BGM Volume):</span>
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioVolume}
                  onChange={(e) => setAudioVolume(Number(e.target.value))}
                  className="w-24 h-1 accent-teal-400 bg-zinc-800 rounded"
                />
                <span className="font-mono text-teal-400 text-[10px] w-8 text-right">
                  {Math.round(audioVolume * 100)}%
                </span>
              </div>

              {/* BGM Selection Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BGM_TRACKS.map((track) => {
                  const isSelected = activeAudioTrack?.id === track.id;
                  return (
                    <button
                      key={track.id}
                      onClick={() => {
                        if (isSelected) {
                          onSelectAudioTrack(null);
                        } else {
                          onSelectAudioTrack({
                            id: track.id,
                            title: track.title,
                            artist: track.genre,
                            url: track.url,
                            volume: audioVolume,
                            isMuted: false,
                          });
                        }
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all active:scale-95 ${
                        isSelected
                          ? 'bg-teal-500/20 border-teal-400 text-white shadow-md'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-lg">{track.emoji}</span>
                      <div className="truncate">
                        <span className="text-[10px] font-bold block truncate">{track.title}</span>
                        <span className="text-[8px] text-zinc-500">{track.genre}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================= TAB: QUALITY ======================= */}
          {activeTab === 'quality' && (
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setHdUpscaleActive(!hdUpscaleActive);
                  if (!hdUpscaleActive) {
                    handleSliderChange('sharpen', 45);
                    handleSliderChange('contrast', 115);
                  } else {
                    handleSliderChange('sharpen', 0);
                  }
                }}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                  hdUpscaleActive ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                }`}
              >
                <Sparkles size={16} />
                <span className="text-[10px] font-bold">HD ক্ল্যারিটি</span>
              </button>

              <button
                onClick={() => setSmoothMotion(!smoothMotion)}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                  smoothMotion ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                }`}
              >
                <span className="font-mono text-xs font-bold">60FPS</span>
                <span className="text-[10px] font-bold">মোশন স্মুথ</span>
              </button>

              <button
                onClick={() => {
                  const next = denoiseLevel === 'Off' ? 'Medium' : denoiseLevel === 'Medium' ? 'High' : 'Off';
                  setDenoiseLevel(next);
                }}
                className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 flex flex-col items-center gap-1 text-center"
              >
                <Droplet size={16} className="text-cyan-400" />
                <span className="text-[10px] font-bold">নয়েজ: {denoiseLevel}</span>
              </button>
            </div>
          )}

          {/* ======================= TAB: AI CLIPPER ======================= */}
          {activeTab === 'ai-clipper' && (
            <div className="flex flex-col gap-2 p-1">
              <p className="text-[10px] text-zinc-400 leading-tight">
                জেমিনাই এআই মডেল ব্যবহার করে স্বয়ংক্রিয়ভাবে ভিডিওর দৃশ্য শনাক্ত করুন ও কাট পয়েন্ট তৈরি করুন।
              </p>
              <button
                onClick={onRunAISceneDetection}
                disabled={isAiProcessing}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <Wand2 size={13} className={isAiProcessing ? 'animate-spin' : ''} />
                <span>{isAiProcessing ? 'বিশ্লেষণ চলছে...' : 'অটো সিন ডিটেক্ট করুন'}</span>
              </button>
            </div>
          )}

          {/* ======================= TAB: TEXT ======================= */}
          {activeTab === 'text' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="টেক্সট লিখুন..."
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-7 h-7 rounded-lg bg-zinc-950 border border-zinc-800 cursor-pointer"
                />
                <button
                  onClick={() => {
                    if (newText.trim()) {
                      onAddText(newText, selectedFont, selectedColor);
                      setNewText('');
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 text-zinc-950 font-bold text-xs shrink-0"
                >
                  যোগ করুন
                </button>
              </div>

              {textOverlays.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                  {textOverlays.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-1 px-2 py-0.5 bg-zinc-950 rounded border border-zinc-800 text-[10px] shrink-0"
                    >
                      <span className="text-zinc-200 truncate max-w-[80px]">{t.text}</span>
                      <button onClick={() => onDeleteText(t.id)} className="text-zinc-500 hover:text-red-400">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================= TAB: STICKERS ======================= */}
          {activeTab === 'stickers' && (
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 overflow-y-auto max-h-24">
              {STICKER_PRESETS.map((stk, idx) => (
                <button
                  key={idx}
                  onClick={() => onAddSticker(stk.emoji)}
                  className="w-10 h-10 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-lg flex items-center justify-center text-lg active:scale-90"
                  title={stk.name}
                >
                  <span>{stk.emoji}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

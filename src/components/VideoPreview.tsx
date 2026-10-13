import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Columns, 
  Upload, 
  Sparkles,
  Gauge,
  BarChart3
} from 'lucide-react';
import { HistogramPanel } from './HistogramPanel';
import { 
  AspectRatio, 
  FilterSettings, 
  TextOverlay, 
  StickerOverlay,
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
import { generateFeComponentTransferTable } from '../utils/curveUtils';
import { getSelectiveColorCssFilter, getLogTransformModifiers } from '../utils/compositingUtils';

interface VideoPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoUrl: string | null;
  videoFileName: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  filters: FilterSettings;
  aspectRatio: AspectRatio;
  textOverlays: TextOverlay[];
  stickerOverlays: StickerOverlay[];
  showLetterbox: boolean;
  selectiveColor?: SelectiveColorSettings;
  skinTone?: SkinToneProtection;
  logSettings?: LogProfileSettings;
  virtualLight?: VirtualLightSettings;
  opticsSettings?: OpticsSettings;
  trackerSettings?: ObjectTrackerSettings;
  maskSettings?: MaskingSettings;
  layers?: CompositingLayer[];
  chromaKey?: ChromaKeyerSettings;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onPlaybackRateChange: (rate: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onImportClick: () => void;
  setVirtualLight?: React.Dispatch<React.SetStateAction<VirtualLightSettings>>;
  setTextOverlays?: React.Dispatch<React.SetStateAction<TextOverlay[]>>;
  setStickerOverlays?: React.Dispatch<React.SetStateAction<StickerOverlay[]>>;
  setTrackerSettings?: React.Dispatch<React.SetStateAction<ObjectTrackerSettings>>;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  videoRef,
  videoUrl,
  videoFileName,
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  volume,
  isMuted,
  filters,
  aspectRatio,
  textOverlays,
  stickerOverlays,
  showLetterbox,
  selectiveColor,
  skinTone,
  logSettings,
  virtualLight,
  opticsSettings,
  trackerSettings,
  maskSettings,
  layers,
  chromaKey,
  onTogglePlay,
  onSeek,
  onPlaybackRateChange,
  onVolumeChange,
  onToggleMute,
  onImportClick,
  setVirtualLight,
  setTextOverlays,
  setStickerOverlays,
  setTrackerSettings,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSplitCompare, setShowSplitCompare] = useState(false);
  const [splitPos, setSplitPos] = useState(50);
  const [showFloatingScope, setShowFloatingScope] = useState(false);
  const [activeMovableTarget, setActiveMovableTarget] = useState<'light' | 'spotBlur' | 'tracker' | 'text'>('light');

  const handleVideoAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round(((e.clientY - rect.top) / rect.height) * 100)));

    if (activeMovableTarget === 'light' && setVirtualLight) {
      setVirtualLight(prev => ({ ...prev, x, y, enabled: true }));
    } else if (activeMovableTarget === 'spotBlur' && setVirtualLight) {
      setVirtualLight(prev => ({ ...prev, spotBlurX: x, spotBlurY: y, spotBlurEnabled: true }));
    } else if (activeMovableTarget === 'tracker' && setTrackerSettings) {
      setTrackerSettings(prev => ({ ...prev, currentX: x, currentY: y, isTrackingActive: true }));
    } else if (activeMovableTarget === 'text' && setTextOverlays && textOverlays.length > 0) {
      setTextOverlays(prev => prev.map((t, idx) => idx === 0 ? { ...t, x, y } : t));
    }
  };

  // Compute CSS filter string with Log, Curves, and Selective Color enhancements
  const getFilterString = (f: FilterSettings): string => {
    // Log profile modifiers
    const logMods = logSettings && logSettings.profile !== 'rec709'
      ? getLogTransformModifiers(logSettings.profile, logSettings.lutIntensity)
      : { contrastMultiplier: 1, brightnessMultiplier: 1, saturationMultiplier: 1, highlightRecovery: 0 };

    const expComp = logSettings ? (logSettings.exposureComp * 15) : 0;
    const tempSepia = f.temperature > 0 ? (f.temperature / 100) * 25 : 0;
    const tempHue = f.temperature < 0 ? (f.temperature / 100) * 20 : (f.temperature / 100) * 10;
    const brillianceBoost = (f.brilliance - 100) * 0.25;
    
    // Base components
    let finalBrightness = Math.max(0, (f.brightness + brillianceBoost + expComp) * logMods.brightnessMultiplier);
    let finalContrast = Math.max(0, (f.contrast + brillianceBoost * 0.5) * logMods.contrastMultiplier);
    let finalSaturation = Math.max(0, f.saturation * logMods.saturationMultiplier);

    // Skin Tone Protection adjustments
    if (skinTone && skinTone.enabled) {
      finalBrightness += (skinTone.softGlow * 0.05);
    }

    const highlightsEffect = (f.highlights - 100) * 0.15 + (f.whites - 100) * 0.15;
    const shadowsEffect = (f.shadows - 100) * 0.15 + (f.blacks - 100) * 0.15;

    const totalBrightness = Math.round(finalBrightness + highlightsEffect);
    const totalContrast = Math.round(finalContrast + shadowsEffect);
    const totalSaturation = Math.round(finalSaturation);
    const totalHue = Math.round(f.hue + tempHue);
    const totalSepia = Math.min(100, Math.round(f.sepia + tempSepia));

    let filterStr = `brightness(${totalBrightness}%) contrast(${totalContrast}%) saturate(${totalSaturation}%) hue-rotate(${totalHue}deg) sepia(${totalSepia}%) grayscale(${f.grayscale}%) invert(${f.invert}%)`;

    // Append Selective Color Filter if enabled
    if (selectiveColor && selectiveColor.enabled) {
      const selectiveCss = getSelectiveColorCssFilter(selectiveColor);
      if (selectiveCss) {
        filterStr += ` ${selectiveCss}`;
      }
    }

    return filterStr;
  };

  const curveTables = generateFeComponentTransferTable(filters.curves);
  const baseFilterCss = getFilterString(filters);
  const activeFilterCss = curveTables.isModified
    ? `${baseFilterCss} url(#capcut-rgb-curves)`
    : baseFilterCss;

  const getAspectClass = (ratio: AspectRatio): string => {
    switch (ratio) {
      case '9:16':
        return 'aspect-[9/16] h-full max-h-[100%]';
      case '16:9':
        return 'aspect-[16/9] w-full max-w-[100%] max-h-[100%]';
      case '1:1':
        return 'aspect-square h-full max-h-[100%]';
      case '4:5':
        return 'aspect-[4/5] h-full max-h-[100%]';
      case '21:9':
        return 'aspect-[21/9] w-full max-h-[100%]';
      default:
        return 'aspect-[9/16] h-full';
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex-1 bg-zinc-950 flex flex-col items-center justify-center p-2 select-none overflow-hidden min-h-0"
    >
      {/* Studio Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />

      {/* SVG Hardware-accelerated RGB Curves Filter Definition */}
      <svg className="hidden absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <filter id="capcut-rgb-curves" colorInterpolationFilters="sRGB">
          <feComponentTransfer>
            <feFuncR type="table" tableValues={curveTables.r} />
            <feFuncG type="table" tableValues={curveTables.g} />
            <feFuncB type="table" tableValues={curveTables.b} />
          </feComponentTransfer>
        </filter>
      </svg>

      {videoUrl ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center min-h-0">
          {/* Top Floating Controls on Video */}
          <div className="absolute top-1.5 left-2 right-2 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1.5 pointer-events-auto">
              {/* Split Screen compare button */}
              <button
                onClick={() => setShowSplitCompare(!showSplitCompare)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-md flex items-center gap-1 shadow-md transition-all active:scale-95 ${
                  showSplitCompare 
                    ? 'bg-cyan-500 text-zinc-950 border-cyan-400 font-bold' 
                    : 'bg-zinc-900/90 text-zinc-300 border-zinc-800'
                }`}
              >
                <Columns size={11} />
                <span>{showSplitCompare ? 'স্প্লিট অন' : 'আগে/পরে'}</span>
              </button>

              {/* Real-time Floating Scope Monitor Button */}
              <button
                onClick={() => setShowFloatingScope(!showFloatingScope)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-md flex items-center gap-1 shadow-md transition-all active:scale-95 ${
                  showFloatingScope 
                    ? 'bg-cyan-500 text-zinc-950 border-cyan-400 font-bold' 
                    : 'bg-zinc-900/90 text-zinc-300 border-zinc-800'
                }`}
                title="রিয়েল-টাইম স্কোপ / হিস্টোগ্রাম অন/অফ"
              >
                <BarChart3 size={11} />
                <span>{showFloatingScope ? 'স্কোপ অন' : 'স্কোপ'}</span>
              </button>

              {/* Movable Target Selector */}
              <div className="flex items-center gap-0.5 bg-zinc-900/90 p-0.5 rounded-full border border-zinc-800 pointer-events-auto">
                <button
                  onClick={() => setActiveMovableTarget('light')}
                  className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${activeMovableTarget === 'light' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400'}`}
                  title="লাইট পজিশন"
                >
                  💡 লাইট
                </button>
                <button
                  onClick={() => setActiveMovableTarget('spotBlur')}
                  className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${activeMovableTarget === 'spotBlur' ? 'bg-teal-500 text-zinc-950' : 'text-zinc-400'}`}
                  title="স্পট ব্লার"
                >
                  💧 ব্লার
                </button>
                <button
                  onClick={() => setActiveMovableTarget('tracker')}
                  className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${activeMovableTarget === 'tracker' ? 'bg-purple-500 text-white' : 'text-zinc-400'}`}
                  title="ট্র্যাকার"
                >
                  🎯 ট্র্যাকার
                </button>
                <button
                  onClick={() => setActiveMovableTarget('text')}
                  className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${activeMovableTarget === 'text' ? 'bg-cyan-500 text-zinc-950' : 'text-zinc-400'}`}
                  title="টেক্সট ওভারলে"
                >
                  ✍️ টেক্সট
                </button>
              </div>
            </div>

            {/* Timecode Pill */}
            <div className="pointer-events-auto font-mono text-[10px] text-zinc-300 bg-zinc-950/80 px-2 py-0.5 rounded-full border border-zinc-800/80">
              <span className="text-cyan-400 font-bold">{formatTime(currentTime)}</span>
              <span className="text-zinc-600 mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Floating Scope Monitor HUD (Anchored Over Video Preview) */}
          {showFloatingScope && (
            <div className="absolute top-8 right-2 z-30 w-72 max-w-[90%] shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
              <HistogramPanel
                videoRef={videoRef}
                filters={filters}
                curves={filters.curves}
                currentTime={currentTime}
                compact={true}
                allowScopeModes={true}
                allowToggleChannel={true}
              />
            </div>
          )}

          {/* Video Container Box */}
          <div 
            onClick={handleVideoAreaClick}
            className={`relative ${getAspectClass(aspectRatio)} rounded-xl overflow-hidden bg-black shadow-2xl border border-zinc-800/80 flex items-center justify-center group max-h-[calc(100%-32px)] cursor-crosshair`}
            title="যে কোনো জায়গায় ক্লিক করে বর্তমান ইফেক্ট/লাইট/টেক্সট পজিশন সেট করুন"
          >
            {showSplitCompare ? (
              <div className="relative w-full h-full overflow-hidden select-none">
                <video
                  src={videoUrl}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  style={{ filter: 'none' }}
                />
                
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - splitPos}% 0 0)` }}
                >
                  <video
                    src={videoUrl}
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ filter: activeFilterCss }}
                  />
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-cyan-600/90 text-white text-[9px] font-bold shadow z-10">
                    GRADED
                  </span>
                </div>

                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-zinc-800/90 text-zinc-300 text-[9px] font-bold shadow z-10">
                  RAW
                </span>

                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] cursor-ew-resize z-20 flex items-center justify-center"
                  style={{ left: `${splitPos}%` }}
                >
                  <div className="w-4 h-4 rounded-full bg-cyan-400 text-zinc-950 flex items-center justify-center text-[9px] font-bold shadow">
                    ↔
                  </div>
                </div>

                <input
                  type="range"
                  min="5"
                  max="95"
                  value={splitPos}
                  onChange={(e) => setSplitPos(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize z-30"
                />
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  playsInline
                  onClick={onTogglePlay}
                  className="w-full h-full object-contain cursor-pointer transition-all duration-75"
                  style={{ filter: activeFilterCss }}
                />

                {/* Fade Overlay */}
                {filters.fade > 0 && (
                  <div 
                    className="absolute inset-0 bg-white pointer-events-none mix-blend-screen"
                    style={{ opacity: (filters.fade / 100) * 0.28 }}
                  />
                )}

                {/* Vignette Overlay */}
                {filters.vignette > 0 && (
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, transparent 40%, rgba(0,0,0,${(filters.vignette / 100) * 0.95}) 100%)`
                    }}
                  />
                )}

                {/* Film Grain Simulation */}
                {filters.grain > 0 && (
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
                    style={{
                      opacity: (filters.grain / 100) * 0.6,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.7'/%3E%3C/svg%3E")`,
                    }}
                  />
                )}

                {/* 2.35:1 Letterbox */}
                {showLetterbox && (
                  <>
                    <div className="absolute top-0 left-0 right-0 h-[10%] bg-black pointer-events-none z-10" />
                    <div className="absolute bottom-0 left-0 right-0 h-[10%] bg-black pointer-events-none z-10" />
                  </>
                )}

                {/* ================= COMPOSITING: VIRTUAL LIGHTING & SHADOWS ================= */}
                {virtualLight && virtualLight.enabled && (() => {
                  const lightX = virtualLight.linkedToTracker && trackerSettings?.isTrackingActive 
                    ? trackerSettings.currentX 
                    : virtualLight.x;
                  const lightY = virtualLight.linkedToTracker && trackerSettings?.isTrackingActive 
                    ? trackerSettings.currentY 
                    : virtualLight.y;
                  return (
                    <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
                      {/* Virtual Light Beam / Pool */}
                      <div
                        className="absolute -translate-x-1/2 -translate-y-1/2 mix-blend-soft-light transition-all duration-75"
                        style={{
                          left: `${lightX}%`,
                          top: `${lightY}%`,
                          width: `${virtualLight.radius * 2.5}%`,
                          height: `${virtualLight.radius * 2.5}%`,
                          background: `radial-gradient(circle, ${virtualLight.color} 0%, transparent 70%)`,
                          opacity: virtualLight.intensity / 100,
                        }}
                      />
                      {/* High-intensity Light Core */}
                      <div
                        className="absolute -translate-x-1/2 -translate-y-1/2 mix-blend-screen transition-all duration-75"
                        style={{
                          left: `${lightX}%`,
                          top: `${lightY}%`,
                          width: `${virtualLight.radius}%`,
                          height: `${virtualLight.radius}%`,
                          background: `radial-gradient(circle, rgba(255,255,255,0.9) 0%, ${virtualLight.color} 40%, transparent 75%)`,
                          opacity: (virtualLight.intensity / 100) * 0.75,
                        }}
                      />
                      {/* Directional Cast Shadow */}
                      {virtualLight.castShadows && (
                        <div
                          className="absolute inset-0 mix-blend-multiply transition-all duration-75"
                          style={{
                            background: `linear-gradient(${virtualLight.shadowAngle}deg, transparent 40%, rgba(0,0,0,${(virtualLight.shadowOpacity / 100) * 0.85}) 100%)`,
                            filter: `blur(${virtualLight.shadowBlur * 0.5}px)`,
                          }}
                        />
                      )}
                    </div>
                  );
                })()}

                {/* ================= MOTION BLUR & TRACKED BLUR ================= */}
                {virtualLight && virtualLight.motionBlurEnabled && (
                  <div 
                    className="absolute inset-0 pointer-events-none z-16 transition-all"
                    style={{
                      backdropFilter: `blur(${Math.round((virtualLight.motionBlurIntensity || 35) * 0.25)}px)`,
                      transform: `rotate(${virtualLight.motionBlurAngle || 45}deg) scale(1.05)`,
                      opacity: (virtualLight.motionBlurIntensity || 35) / 100,
                    }}
                  />
                )}

                {virtualLight && virtualLight.blurTrackingEnabled && (
                  <div
                    className="absolute pointer-events-none z-17 rounded-full border border-purple-400/60 shadow-[0_0_30px_rgba(168,85,247,0.6)]"
                    style={{
                      left: `${trackerSettings?.currentX || 50}%`,
                      top: `${trackerSettings?.currentY || 45}%`,
                      width: `${virtualLight.blurTrackingRadius || 35}px`,
                      height: `${virtualLight.blurTrackingRadius || 35}px`,
                      transform: 'translate(-50%, -50%)',
                      backdropFilter: 'blur(16px)',
                      background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 80%)',
                    }}
                  />
                )}

                {/* ================= GOLDEN EFFECT & BACKGROUND GLOW ================= */}
                {virtualLight && virtualLight.goldenEffectEnabled && (
                  <div
                    className="absolute inset-0 pointer-events-none z-16 mix-blend-screen transition-all duration-300"
                    style={{
                      opacity: (virtualLight.goldenIntensity || 70) / 100,
                      background: `radial-gradient(circle at 65% 35%, rgba(251,191,36,${(virtualLight.goldenBackgroundGlow || 50) / 100}) 0%, rgba(217,119,6,0.3) 50%, transparent 85%)`,
                      boxShadow: 'inset 0 0 60px rgba(251, 191, 36, 0.4)',
                    }}
                  />
                )}

                {/* ================= ANYWHERE SPOT BLUR (যে কোনো জায়গায় স্পট ব্লার) ================= */}
                {virtualLight && virtualLight.spotBlurEnabled && (
                  <div
                    className="absolute pointer-events-none z-18 rounded-full border border-teal-400/50 shadow-[0_0_25px_rgba(20,184,166,0.5)]"
                    style={{
                      left: `${virtualLight.spotBlurX || 50}%`,
                      top: `${virtualLight.spotBlurY || 50}%`,
                      width: `${virtualLight.spotBlurRadius || 40}px`,
                      height: `${virtualLight.spotBlurRadius || 40}px`,
                      transform: 'translate(-50%, -50%)',
                      backdropFilter: `blur(${virtualLight.spotBlurIntensity || 25}px)`,
                      background: 'radial-gradient(circle, rgba(20,184,166,0.3) 0%, transparent 80%)',
                    }}
                  />
                )}

                {/* ================= COMPOSITING: OPTICAL FLARES & LIGHT LEAKS ================= */}
                {opticsSettings && opticsSettings.flareType !== 'none' && (
                  <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
                    {/* Anamorphic Blue Streak */}
                    {opticsSettings.flareType === 'anamorphic-blue' && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center mix-blend-screen"
                        style={{ opacity: opticsSettings.flareIntensity / 100 }}
                      >
                        <div className="w-[180%] h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-[1px] shadow-[0_0_20px_#22d3ee]" />
                        <div className="absolute w-[120%] h-12 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent blur-md" />
                        <div className="absolute w-12 h-12 rounded-full bg-cyan-200 blur-sm" />
                      </div>
                    )}

                    {/* Warm 35mm Vintage Sun Leak */}
                    {opticsSettings.flareType === 'warm-vintage' && (
                      <div 
                        className="absolute top-0 right-0 w-[85%] h-[85%] mix-blend-screen transition-all duration-100"
                        style={{
                          opacity: opticsSettings.flareIntensity / 100,
                          background: 'radial-gradient(circle at 90% 10%, rgba(251,191,36,0.85) 0%, rgba(244,63,94,0.4) 40%, transparent 75%)',
                        }}
                      />
                    )}

                    {/* Golden Sunburst Flare */}
                    {opticsSettings.flareType === 'golden-sunburst' && (
                      <div 
                        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
                        style={{ opacity: opticsSettings.flareIntensity / 100 }}
                      >
                        <div className="w-48 h-48 rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 blur-xl opacity-75" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-1 bg-yellow-200 rotate-45 blur-xs" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-1 bg-yellow-200 -rotate-45 blur-xs" />
                      </div>
                    )}

                    {/* Dust & Film Particles */}
                    {opticsSettings.flareType === 'dust-particles' && (
                      <div 
                        className="absolute inset-0 mix-blend-screen opacity-70 animate-pulse"
                        style={{
                          opacity: (opticsSettings.flareIntensity / 100) * 0.8,
                          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px), radial-gradient(circle, #fbbf24 1.5px, transparent 1.5px)`,
                          backgroundSize: '32px 32px, 54px 54px',
                          backgroundPosition: '0 0, 16px 16px',
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Film Halation (Red/Orange Highlight Edge Glow) */}
                {opticsSettings && opticsSettings.halation > 0 && (
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-screen z-15"
                    style={{
                      opacity: (opticsSettings.halation / 100) * 0.45,
                      background: 'radial-gradient(circle at center, rgba(239,68,68,0.2) 0%, rgba(249,115,22,0.3) 50%, transparent 80%)',
                      filter: 'blur(12px)',
                    }}
                  />
                )}

                {/* Highlight Bloom */}
                {opticsSettings && opticsSettings.highlightBloom > 0 && (
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-screen z-15"
                    style={{
                      opacity: (opticsSettings.highlightBloom / 100) * 0.4,
                      background: 'radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 70%)',
                      filter: 'blur(16px)',
                    }}
                  />
                )}

                {/* Ambient Occlusion (Depth Crevice Vignette) */}
                {opticsSettings && opticsSettings.ambientOcclusion > 0 && (
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-multiply z-15"
                    style={{
                      opacity: (opticsSettings.ambientOcclusion / 100) * 0.8,
                      background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.85) 100%)',
                    }}
                  />
                )}

                {/* ================= POWER WINDOW / ROTOSCOPING MASK ================= */}
                {maskSettings && maskSettings.shape !== 'none' && (
                  <div className="absolute inset-0 pointer-events-none z-18 flex items-center justify-center">
                    {maskSettings.shape === 'circle' && (
                      <div
                        className="rounded-full border-2 border-dashed border-purple-400/80 shadow-[0_0_12px_rgba(168,85,247,0.5)] transition-all duration-75"
                        style={{
                          width: `${maskSettings.radiusX * 2}%`,
                          height: `${maskSettings.radiusY * 2}%`,
                        }}
                      >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-400" />
                      </div>
                    )}
                    {maskSettings.shape === 'rectangle' && (
                      <div
                        className="border-2 border-dashed border-cyan-400/80 shadow-[0_0_12px_rgba(34,211,238,0.5)] transition-all duration-75"
                        style={{
                          width: `${maskSettings.radiusX * 2}%`,
                          height: `${maskSettings.radiusY * 2}%`,
                        }}
                      >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400" />
                      </div>
                    )}
                    {maskSettings.shape === 'subject-roto' && (
                      <div className="absolute inset-4 border-2 border-emerald-400/80 rounded-3xl shadow-[0_0_15px_rgba(52,211,153,0.4)] flex items-end justify-start p-2">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-[8px] font-bold">
                          ✂️ রোটো ব্রাশ সাবজেক্ট মাস্ক সক্রিয়
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* ================= SMART OBJECT TRACKING RETICLE ================= */}
                {trackerSettings && trackerSettings.isTrackingActive && (
                  <div
                    className="absolute pointer-events-none z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
                    style={{
                      left: `${trackerSettings.currentX}%`,
                      top: `${trackerSettings.currentY}%`,
                      width: `${trackerSettings.targetWidth}%`,
                      height: `${trackerSettings.targetHeight}%`,
                    }}
                  >
                    {/* Corner Reticle Brackets */}
                    <div className="w-full h-full border-2 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)] relative rounded-sm">
                      {/* Crosshair Center */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-cyan-400" />
                        <div className="absolute h-full w-0.5 bg-cyan-400" />
                      </div>

                      {/* Top Label Badge */}
                      <div className="absolute -top-6 left-0 bg-zinc-950/90 border border-cyan-400/80 px-1.5 py-0.5 rounded text-[8px] font-mono text-cyan-300 font-bold flex items-center gap-1 shadow-lg whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        <span>🎯 {trackerSettings.targetName} ({trackerSettings.confidence}%)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= VECTORSCOPE SKIN TONE LINE GUIDE ================= */}
                {skinTone && skinTone.showSkinLineGuide && (
                  <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent -rotate-45 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                    <span className="absolute top-4 right-4 px-2 py-0.5 rounded bg-amber-950/90 border border-amber-500/50 text-amber-300 font-mono text-[8px] font-bold shadow-lg">
                      I-Line: স্কিন টোন ভেক্টর গাইড (57°)
                    </span>
                  </div>
                )}

                {/* ================= CHROMA KEY STATUS BADGE ================= */}
                {chromaKey && chromaKey.enabled && (
                  <div className="absolute bottom-2 left-2 pointer-events-none z-20 px-2 py-0.5 rounded bg-emerald-950/85 border border-emerald-500/50 text-emerald-300 font-mono text-[8px] font-bold flex items-center gap-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: chromaKey.keyColor }} />
                    <span>ক্রোমা কি ম্যাট অ্যাক্টিভ</span>
                  </div>
                )}


                {/* Live Text Overlays */}
                {textOverlays
                  .filter((t) => currentTime >= t.startTime && currentTime <= t.endTime)
                  .map((t) => (
                    <div
                      key={t.id}
                      className="absolute z-20 pointer-events-none font-bold drop-shadow px-1.5 py-0.5 rounded"
                      style={{
                        left: `${t.x}%`,
                        top: `${t.y}%`,
                        transform: 'translate(-50%, -50%)',
                        fontSize: `${t.fontSize}px`,
                        color: t.color,
                        fontFamily: t.fontFamily,
                        textShadow: '0 2px 6px rgba(0,0,0,0.9)',
                      }}
                    >
                      {t.text}
                    </div>
                  ))}

                {/* Live Sticker Overlays */}
                {stickerOverlays
                  .filter((s) => currentTime >= s.startTime && currentTime <= s.endTime)
                  .map((s) => (
                    <div
                      key={s.id}
                      className="absolute z-20 pointer-events-none drop-shadow select-none"
                      style={{
                        left: `${s.x}%`,
                        top: `${s.y}%`,
                        transform: 'translate(-50%, -50%)',
                        fontSize: `${s.size}px`,
                      }}
                    >
                      {s.emoji}
                    </div>
                  ))}

                {/* Mobile Center Tap Play Indicator */}
                {!isPlaying && (
                  <button
                    onClick={onTogglePlay}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-cyan-500/85 text-zinc-950 flex items-center justify-center shadow-xl backdrop-blur-sm active:scale-90 transition-transform z-20"
                    title="Play"
                  >
                    <Play size={20} className="ml-0.5 fill-current" />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Quick Floating Playback Controls Bar */}
          <div className="flex items-center justify-between w-full max-w-sm px-2 pt-1 text-xs text-zinc-400">
            <button
              onClick={onTogglePlay}
              className="w-6 h-6 rounded-full bg-zinc-800 text-white flex items-center justify-center active:scale-90 transition-transform"
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
            </button>

            <button
              onClick={() => onSeek(Math.max(0, currentTime - 1))}
              className="p-1 text-zinc-400 hover:text-white"
              title="Rewind 1s"
            >
              <RotateCcw size={13} />
            </button>

            {/* Speed toggle chip */}
            <button
              onClick={() => {
                const nextRate = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : playbackRate === 2 ? 0.5 : 1;
                onPlaybackRateChange(nextRate);
              }}
              className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-semibold text-cyan-400"
            >
              {playbackRate}x
            </button>

            <button
              onClick={onToggleMute}
              className="p-1 text-zinc-400 hover:text-white"
            >
              {isMuted || volume === 0 ? <VolumeX size={13} className="text-red-400" /> : <Volume2 size={13} />}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1 text-zinc-400 hover:text-white"
            >
              {isFullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
            </button>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400 mb-3 shadow-lg">
            <Upload size={28} />
          </div>
          <h2 className="text-base font-bold text-white mb-1">ভিডিও যোগ করুন</h2>
          <p className="text-xs text-zinc-400 mb-4 max-w-xs">
            মোবাইলে ক্যাপকাটের মতো কালার গ্রেডিং করতে ভিডিও ইমপোর্ট করুন।
          </p>
          <button
            onClick={onImportClick}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md active:scale-95"
          >
            ভিডিও ফাইল নির্বাচন করুন
          </button>
        </div>
      )}
    </div>
  );
};

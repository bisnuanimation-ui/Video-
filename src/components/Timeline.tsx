import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Scissors, 
  Diamond, 
  Music, 
  Type, 
  Wand2, 
  Sparkles,
  Layers,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { Keyframe, TextOverlay, StickerOverlay } from '../types/editor';

interface TimelineProps {
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  keyframes: Keyframe[];
  selectedKeyframeId: string | null;
  onSelectKeyframe: (id: string | null) => void;
  textOverlays: TextOverlay[];
  stickerOverlays: StickerOverlay[];
  videoFileName: string;
  videoUrl: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onSeek: (time: number) => void;
  onTogglePlay: () => void;
  onAddKeyframe: () => void;
  onDeleteKeyframe: (id: string) => void;
  onSplitClip: () => void;
  onAutoGenerateKeyframes: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  duration,
  currentTime,
  isPlaying,
  keyframes,
  selectedKeyframeId,
  onSelectKeyframe,
  textOverlays,
  stickerOverlays,
  videoFileName,
  videoUrl,
  videoRef,
  onSeek,
  onTogglePlay,
  onAddKeyframe,
  onDeleteKeyframe,
  onSplitClip,
  onAutoGenerateKeyframes,
}) => {
  const rulerRef = useRef<HTMLDivElement>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [frameCount, setFrameCount] = useState<number>(12);
  const [frameSnapshots, setFrameSnapshots] = useState<{ id: number; time: number; label: string }[]>([]);

  const totalDuration = Math.max(1, duration || 15);
  const currentProgressPercent = Math.min(100, Math.max(0, (currentTime / totalDuration) * 100));

  // Generate discrete frame markers so every single frame is clearly visible
  useEffect(() => {
    const count = 12; // 12 distinct frame blocks
    setFrameCount(count);

    const generated = Array.from({ length: count }).map((_, idx) => {
      const time = (idx / (count - 1)) * totalDuration;
      const mins = Math.floor(time / 60);
      const secs = Math.floor(time % 60);
      const ms = Math.floor((time % 1) * 10);
      return {
        id: idx + 1,
        time,
        label: `F${(idx + 1).toString().padStart(2, '0')} (${mins}:${secs.toString().padStart(2, '0')}.${ms})`,
      };
    });
    setFrameSnapshots(generated);
  }, [totalDuration]);

  const handleSeekFromEvent = (clientX: number) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * totalDuration);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsScrubbing(true);
    if (e.touches.length > 0) {
      handleSeekFromEvent(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isScrubbing) return;
    if (e.touches.length > 0) {
      handleSeekFromEvent(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsScrubbing(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsScrubbing(true);
    handleSeekFromEvent(e.clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isScrubbing) return;
      handleSeekFromEvent(e.clientX);
    };

    const handleMouseUp = () => {
      setIsScrubbing(false);
    };

    if (isScrubbing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isScrubbing, totalDuration]);

  // Ruler tick marks
  const ticks = [0, 0.2, 0.4, 0.6, 0.8, 1].map((ratio) => {
    const t = ratio * totalDuration;
    const secs = Math.floor(t % 60);
    return { percent: ratio * 100, label: `00:${secs.toString().padStart(2, '0')}` };
  });

  // Check if playhead is near an existing keyframe (within 0.25s)
  const activeNearKf = keyframes.find((k) => Math.abs(k.time - currentTime) < 0.25);
  const activeTargetKfId = activeNearKf?.id || selectedKeyframeId;

  return (
    <div className="h-32 sm:h-38 bg-zinc-950 border-t border-zinc-800/80 flex flex-col select-none shrink-0 relative z-20">
      {/* Top Mobile Action Bar (Split, Keyframe Add/Remove Tool, Automation, Play) */}
      <div className="h-8 px-2 sm:px-3 border-b border-zinc-800/80 bg-zinc-900/70 flex items-center justify-between text-xs">
        {/* Left Tools */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5">
          {/* Split Clip Button */}
          <button
            onClick={onSplitClip}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-semibold active:scale-90 transition-transform shrink-0"
            title="Split Clip at playhead"
          >
            <Scissors size={11} className="text-cyan-400" />
            <span>কাট</span>
          </button>

          {/* Add Custom Keyframe */}
          <button
            onClick={onAddKeyframe}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-[10px] font-semibold active:scale-90 transition-transform shrink-0 border border-amber-500/30"
            title="Add Custom Keyframe at Current Frame"
          >
            <Diamond size={11} className="text-amber-400 fill-amber-400" />
            <span>+ কী-ফ্রেম</span>
          </button>

          {/* Dedicated Tool to Remove Keyframe (active if on or near a keyframe) */}
          {activeTargetKfId && (
            <button
              onClick={() => onDeleteKeyframe(activeTargetKfId)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[10px] font-bold active:scale-90 transition-transform shrink-0 border border-red-500/40 animate-pulse"
              title="বর্তমান ফ্রেমের কী-ফ্রেম রিমুভ / মুছুন"
            >
              <Trash2 size={11} className="text-red-400" />
              <span>কী-ফ্রেম মুছুন</span>
            </button>
          )}

          {/* Auto Animation Generator */}
          <button
            onClick={onAutoGenerateKeyframes}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-900/60 hover:bg-purple-800/80 text-purple-300 text-[10px] font-semibold active:scale-90 transition-transform shrink-0 border border-purple-500/40"
            title="Automatically generate smooth color automation keyframes"
          >
            <Sparkles size={11} className="text-purple-400" />
            <span>⚡ অটো</span>
          </button>
        </div>

        {/* Center Current Time & Active Keyframe Indicator */}
        <div className="flex items-center gap-1 shrink-0 font-mono text-[10px] sm:text-[11px] font-bold text-cyan-400">
          <span>{currentTime.toFixed(2)}s</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400 text-[10px]">{totalDuration.toFixed(1)}s</span>
          {keyframes.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-semibold border border-amber-500/30 hidden xs:inline">
              ◆ {keyframes.length} কী-ফ্রেম
            </span>
          )}
        </div>

        {/* Right Play Toggle */}
        <button
          onClick={onTogglePlay}
          className="w-6 h-6 rounded-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 flex items-center justify-center font-bold active:scale-90 shadow-sm shrink-0 ml-1"
        >
          {isPlaying ? <Pause size={11} /> : <Play size={11} className="ml-0.5" />}
        </button>
      </div>

      {/* Frame-by-Frame Track Container matching reference screenshot */}
      <div className="flex-1 flex overflow-hidden">
        {/* Track Label Badges on Left */}
        <div className="w-16 sm:w-20 bg-zinc-900/95 border-r border-zinc-800 flex flex-col shrink-0 justify-around py-1 text-[9px] sm:text-[10px] text-zinc-400 px-2 font-bold tracking-wider">
          <div className="text-purple-400 flex items-center justify-between">
            <span>MEDIA 1</span>
            <div className="flex gap-0.5">
              <span className="w-2 h-2 rounded bg-purple-500/30 flex items-center justify-center text-[7px]">👁️</span>
              <span className="w-2 h-2 rounded bg-purple-500/30 flex items-center justify-center text-[7px]">🔒</span>
            </div>
          </div>
          <div className="text-teal-400 flex items-center justify-between">
            <span>AUDIO 1</span>
            <div className="flex gap-0.5">
              <span className="w-2 h-2 rounded bg-teal-500/30 flex items-center justify-center text-[7px]">👁️</span>
              <span className="w-2 h-2 rounded bg-teal-500/30 flex items-center justify-center text-[7px]">🔒</span>
            </div>
          </div>
          <div className="text-cyan-400 flex items-center justify-between">
            <span>TEXT 1</span>
            <div className="flex gap-0.5">
              <span className="w-2 h-2 rounded bg-cyan-500/30 flex items-center justify-center text-[7px]">👁️</span>
              <span className="w-2 h-2 rounded bg-cyan-500/30 flex items-center justify-center text-[7px]">🔒</span>
            </div>
          </div>
        </div>

        {/* Scrubbing Tracks Area */}
        <div
          ref={rulerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative flex-1 bg-zinc-950 flex flex-col justify-between py-1 px-2 cursor-crosshair touch-none overflow-x-auto gap-1"
        >
          {/* 1. Time Ruler Ticks */}
          <div className="h-3 relative flex items-center text-[8px] font-mono text-zinc-500">
            <span className="absolute left-0">00:00</span>
            <span className="absolute left-1/4">00:10</span>
            <span className="absolute left-2/4">00:20</span>
            <span className="absolute left-3/4">00:30</span>
            <span className="absolute right-0">00:40</span>
          </div>

          {/* Track 1: MEDIA 1 (Purple Rounded Video Clip Cards) */}
          <div className="h-8 relative rounded-xl bg-purple-950/30 border border-purple-500/40 flex items-center px-2 gap-2 overflow-hidden shadow-md">
            <div className="h-6 px-3 rounded-lg bg-purple-600/90 text-white font-semibold text-[10px] flex items-center gap-2 shadow-sm border border-purple-400/50 cursor-pointer active:scale-95">
              <span className="w-3 h-3 rounded bg-black/30 flex items-center justify-center text-[8px]">🎬</span>
              <span>Earth.Png</span>
            </div>
            <div className="h-6 px-3 rounded-lg bg-purple-600/90 text-white font-semibold text-[10px] flex items-center gap-2 shadow-sm border border-purple-400/50 cursor-pointer active:scale-95">
              <span className="w-3 h-3 rounded bg-black/30 flex items-center justify-center text-[8px]">🎬</span>
              <span>Big-Bang.Mp4</span>
            </div>
          </div>

          {/* Track 2: AUDIO 1 (Waveform Track Strip) */}
          <div className="h-7 relative rounded-xl bg-teal-950/30 border border-teal-500/40 flex items-center px-2 gap-2 overflow-hidden shadow-md">
            <div className="h-5 px-3 rounded-lg bg-teal-600/90 text-white font-semibold text-[10px] flex items-center gap-2 shadow-sm border border-teal-400/50">
              <Music size={11} />
              <span>Caption-Sound.Mp3</span>
            </div>
            <div className="flex-1 flex items-center gap-0.5 opacity-60">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-teal-400 rounded-full"
                  style={{ height: `${Math.abs(Math.sin(i * 0.5) * 10) + 3}px` }}
                />
              ))}
            </div>
          </div>

          {/* Track 3: TEXT 1 (Teal Pill Cards matching screenshot) */}
          <div className="h-7 relative rounded-xl bg-cyan-950/30 border border-cyan-500/40 flex items-center px-2 gap-3 overflow-hidden shadow-md">
            <div className="h-5 px-3 rounded-lg bg-cyan-600 text-white font-semibold text-[10px] flex items-center gap-1.5 shadow-sm border border-cyan-400/60">
              <span>Law Of Conservation Of Energy</span>
              <span className="w-3 h-3 rounded bg-cyan-950 text-cyan-300 flex items-center justify-center text-[8px]">T</span>
            </div>
            <div className="h-5 px-3 rounded-lg bg-cyan-600 text-white font-semibold text-[10px] flex items-center gap-1.5 shadow-sm border border-cyan-400/60">
              <span>End Point Of World ?</span>
              <span className="w-3 h-3 rounded bg-cyan-950 text-cyan-300 flex items-center justify-center text-[8px]">T</span>
            </div>
          </div>

          {/* Orange Playhead Needle with Top Handle matching reference screenshot */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none z-40 flex flex-col items-center"
            style={{ left: `${currentProgressPercent}%` }}
          >
            <div className="w-4 h-4 bg-amber-500 rounded-b shadow-[0_0_12px_rgba(245,158,11,0.9)] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
            <div className="flex-1 w-0.5 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
          </div>
        </div>
      </div>
    </div>
  );
};

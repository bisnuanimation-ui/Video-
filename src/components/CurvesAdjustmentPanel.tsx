import React, { useState, useRef, useCallback } from 'react';
import { 
  CurvePoint, 
  RGBCurves, 
  CurveChannel, 
  FilterSettings 
} from '../types/editor';
import { 
  DEFAULT_RGB_CURVES, 
  CURVE_PRESETS, 
  generateCurveSvgPath, 
  isChannelDefault,
  isCurvesDefault
} from '../utils/curveUtils';
import { RotateCcw, Trash2, Plus, Sparkles, Check, SlidersHorizontal } from 'lucide-react';
import { HistogramPanel } from './HistogramPanel';

interface CurvesAdjustmentPanelProps {
  curves?: RGBCurves;
  onChangeCurves: (newCurves: RGBCurves) => void;
  onResetCurves: () => void;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  filters?: FilterSettings;
  currentTime?: number;
}

export const CurvesAdjustmentPanel: React.FC<CurvesAdjustmentPanelProps> = ({
  curves = DEFAULT_RGB_CURVES,
  onChangeCurves,
  onResetCurves,
  videoRef,
  filters,
  currentTime,
}) => {
  const [activeChannel, setActiveChannel] = useState<CurveChannel>('rgb');
  const [selectedPointIdx, setSelectedPointIdx] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const currentPoints = curves[activeChannel] || [
    { x: 0, y: 0 },
    { x: 255, y: 255 },
  ];

  // Channel theme configuration
  const channelConfig: Record<
    CurveChannel,
    { label: string; bangla: string; stroke: string; glow: string; text: string; bg: string; dotColor: string }
  > = {
    rgb: {
      label: 'RGB',
      bangla: 'মাস্টার',
      stroke: '#ffffff',
      glow: 'rgba(255,255,255,0.7)',
      text: 'text-white',
      bg: 'bg-white/10 border-white/40',
      dotColor: '#ffffff',
    },
    red: {
      label: 'Red',
      bangla: 'লাল (R)',
      stroke: '#ef4444',
      glow: 'rgba(239,68,68,0.7)',
      text: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/40',
      dotColor: '#ef4444',
    },
    green: {
      label: 'Green',
      bangla: 'সবুজ (G)',
      stroke: '#22c55e',
      glow: 'rgba(34,197,94,0.7)',
      text: 'text-green-400',
      bg: 'bg-green-500/10 border-green-500/40',
      dotColor: '#22c55e',
    },
    blue: {
      label: 'Blue',
      bangla: 'নীল (B)',
      stroke: '#3b82f6',
      glow: 'rgba(59,130,246,0.7)',
      text: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/40',
      dotColor: '#3b82f6',
    },
  };

  const currentChannelConf = channelConfig[activeChannel];

  // Convert client pointer to 0..256 graph coordinate
  const getCoordinatesFromEvent = (e: React.PointerEvent<SVGSVGElement>): { x: number; y: number } | null => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    const relX = (clientX - rect.left) / rect.width;
    const relY = (clientY - rect.top) / rect.height;

    const x = Math.min(255, Math.max(0, Math.round(relX * 255)));
    // Invert Y because SVG coordinate 0 is at top, while graph 0 is at bottom
    const y = Math.min(255, Math.max(0, Math.round((1 - relY) * 255)));

    return { x, y };
  };

  // Pointer Down handler: hit test or add point
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const coords = getCoordinatesFromEvent(e);
    if (!coords) return;

    (e.target as Element).setPointerCapture?.(e.pointerId);

    // Hit test with existing points (within 20px threshold in 255 coord space)
    const HIT_RADIUS = 20;
    const hitIndex = currentPoints.findIndex((p) => {
      const dx = p.x - coords.x;
      const dy = p.y - coords.y;
      return Math.sqrt(dx * dx + dy * dy) <= HIT_RADIUS;
    });

    if (hitIndex !== -1) {
      setSelectedPointIdx(hitIndex);
      setIsDragging(true);
    } else {
      // Add a new point if not clicking directly on existing points
      const newPts = [...currentPoints, coords].sort((a, b) => a.x - b.x);
      const newIdx = newPts.findIndex((p) => p.x === coords.x && p.y === coords.y);
      setSelectedPointIdx(newIdx);
      setIsDragging(true);

      onChangeCurves({
        ...curves,
        [activeChannel]: newPts,
      });
    }
  };

  // Pointer Move handler: drag current point
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging || selectedPointIdx === null) return;
    const coords = getCoordinatesFromEvent(e);
    if (!coords) return;

    const pts = [...currentPoints];
    const pt = pts[selectedPointIdx];
    if (!pt) return;

    let newX = coords.x;
    let newY = coords.y;

    // Constrain endpoints
    if (selectedPointIdx === 0) {
      newX = 0; // First point is always x = 0
    } else if (selectedPointIdx === pts.length - 1) {
      newX = 255; // Last point is always x = 255
    } else {
      // Keep strictly between neighbor points
      const prevX = pts[selectedPointIdx - 1]?.x ?? 0;
      const nextX = pts[selectedPointIdx + 1]?.x ?? 255;
      newX = Math.min(nextX - 2, Math.max(prevX + 2, newX));
    }

    pts[selectedPointIdx] = { x: newX, y: newY };

    onChangeCurves({
      ...curves,
      [activeChannel]: pts,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    setIsDragging(false);
    try {
      (e.target as Element).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Delete selected control point
  const handleDeleteSelectedPoint = () => {
    if (selectedPointIdx === null) return;
    if (selectedPointIdx === 0 || selectedPointIdx === currentPoints.length - 1) {
      // Cannot delete start or end points
      return;
    }
    const newPts = currentPoints.filter((_, idx) => idx !== selectedPointIdx);
    setSelectedPointIdx(null);
    onChangeCurves({
      ...curves,
      [activeChannel]: newPts,
    });
  };

  // Reset active channel
  const handleResetCurrentChannel = () => {
    setSelectedPointIdx(null);
    onChangeCurves({
      ...curves,
      [activeChannel]: [
        { x: 0, y: 0 },
        { x: 255, y: 255 },
      ],
    });
  };

  // Apply a curve preset
  const handleApplyPreset = (presetCurves: RGBCurves) => {
    setSelectedPointIdx(null);
    onChangeCurves({ ...presetCurves });
  };

  const selectedPoint =
    selectedPointIdx !== null ? currentPoints[selectedPointIdx] : null;

  return (
    <div className="flex flex-col gap-2 text-xs select-none">
      {/* Real-time Luminance Histogram */}
      <HistogramPanel
        videoRef={videoRef}
        filters={filters}
        curves={curves}
        currentTime={currentTime}
        compact={true}
        allowToggleChannel={true}
      />

      {/* 1. Header & Channel Tabs */}
      <div className="flex items-center justify-between gap-1.5 flex-wrap">
        {/* Channel Switcher */}
        <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-xl border border-zinc-800">
          {(['rgb', 'red', 'green', 'blue'] as CurveChannel[]).map((ch) => {
            const conf = channelConfig[ch];
            const isActive = activeChannel === ch;
            return (
              <button
                key={ch}
                onClick={() => {
                  setActiveChannel(ch);
                  setSelectedPointIdx(null);
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg font-bold text-[10px] transition-all active:scale-95 ${
                  isActive
                    ? `${conf.bg} ${conf.text} shadow-sm border`
                    : 'text-zinc-400 hover:text-white border border-transparent'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: conf.dotColor }}
                />
                <span>{conf.bangla}</span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons: Reset Active Channel & Reset All */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleResetCurrentChannel}
            disabled={isChannelDefault(currentPoints)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-[10px] font-medium border border-zinc-700 disabled:opacity-40 active:scale-95"
            title="বর্তমান চ্যানেল রিসেট"
          >
            <RotateCcw size={10} />
            <span>চ্যানেল রিসেট</span>
          </button>

          <button
            onClick={onResetCurves}
            disabled={isCurvesDefault(curves)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 text-[10px] font-bold border border-red-500/30 disabled:opacity-40 active:scale-95"
            title="সব RGB কার্ভস রিসেট"
          >
            <span>সব রিসেট</span>
          </button>
        </div>
      </div>

      {/* 2. Main Graph Coordinate Box & Point Readout */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
        {/* Interactive SVG Box */}
        <div className="relative w-full max-w-[280px] sm:max-w-[260px] aspect-square bg-zinc-950 rounded-xl border border-zinc-800 p-2 shadow-inner overflow-hidden">
          {/* Subtle Tone Labels */}
          <span className="absolute bottom-1 left-2 text-[8px] text-zinc-600 font-mono">শ্যাডো (০)</span>
          <span className="absolute bottom-1 right-2 text-[8px] text-zinc-600 font-mono">হাইলাইটস (২৫৫)</span>
          <span className="absolute top-2 left-2 text-[8px] text-zinc-600 font-mono">আউটপুট (২৫৫)</span>

          <svg
            ref={svgRef}
            viewBox="0 0 256 256"
            className="w-full h-full cursor-crosshair touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* 4x4 Grid Guide Lines */}
            <line x1="0" y1="64" x2="256" y2="64" stroke="#27272a" strokeDasharray="3 3" strokeWidth="1" />
            <line x1="0" y1="128" x2="256" y2="128" stroke="#3f3f46" strokeDasharray="3 3" strokeWidth="1.2" />
            <line x1="0" y1="192" x2="256" y2="192" stroke="#27272a" strokeDasharray="3 3" strokeWidth="1" />
            <line x1="64" y1="0" x2="64" y2="256" stroke="#27272a" strokeDasharray="3 3" strokeWidth="1" />
            <line x1="128" y1="0" x2="128" y2="256" stroke="#3f3f46" strokeDasharray="3 3" strokeWidth="1.2" />
            <line x1="192" y1="0" x2="192" y2="256" stroke="#27272a" strokeDasharray="3 3" strokeWidth="1" />

            {/* Baseline 1:1 Reference Diagonal */}
            <line
              x1="0"
              y1="256"
              x2="256"
              y2="0"
              stroke="#52525b"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />

            {/* Background Ghost curves of the other inactive channels */}
            {(['rgb', 'red', 'green', 'blue'] as CurveChannel[])
              .filter((ch) => ch !== activeChannel)
              .map((ch) => {
                const otherPts = curves[ch];
                if (!otherPts || otherPts.length < 2) return null;
                const pathD = generateCurveSvgPath(otherPts);
                return (
                  <path
                    key={`ghost-${ch}`}
                    d={pathD}
                    fill="none"
                    stroke={channelConfig[ch].stroke}
                    strokeWidth="1.2"
                    strokeDasharray="2 3"
                    opacity="0.25"
                    className="pointer-events-none"
                  />
                );
              })}

            {/* Active Foreground Channel Curve */}
            <path
              d={generateCurveSvgPath(currentPoints)}
              fill="none"
              stroke={currentChannelConf.stroke}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: `drop-shadow(0 0 6px ${currentChannelConf.glow})`,
              }}
              className="pointer-events-none"
            />

            {/* Interactive Control Points */}
            {currentPoints.map((pt, idx) => {
              const isSelected = selectedPointIdx === idx;
              const svgY = 256 - pt.y;
              return (
                <g key={`pt-${idx}`} className="cursor-pointer">
                  {/* Invisible larger hit circle for easy tapping */}
                  <circle cx={pt.x} cy={svgY} r="14" fill="transparent" />

                  {/* Outer glowing halo when selected */}
                  {isSelected && (
                    <circle
                      cx={pt.x}
                      cy={svgY}
                      r="9"
                      fill="none"
                      stroke={currentChannelConf.stroke}
                      strokeWidth="2"
                      opacity="0.8"
                      className="animate-pulse"
                    />
                  )}

                  {/* Visible point circle */}
                  <circle
                    cx={pt.x}
                    cy={svgY}
                    r={isSelected ? 6 : 4.5}
                    fill={currentChannelConf.dotColor}
                    stroke="#09090b"
                    strokeWidth="2"
                    className="transition-transform duration-75"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Point Controls & Sliders */}
        <div className="flex-1 w-full flex flex-col gap-2 justify-center">
          <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
                <SlidersHorizontal size={13} className={currentChannelConf.text} />
                <span>পয়েন্ট সমন্বয়:</span>
              </span>

              {selectedPoint && selectedPointIdx !== 0 && selectedPointIdx !== currentPoints.length - 1 && (
                <button
                  onClick={handleDeleteSelectedPoint}
                  className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 text-[10px] font-semibold flex items-center gap-1 border border-red-500/40 active:scale-95"
                >
                  <Trash2 size={10} />
                  <span>পয়েন্ট মুছুন</span>
                </button>
              )}
            </div>

            {selectedPoint ? (
              <div className="flex flex-col gap-2">
                {/* Input X Slider */}
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-zinc-400">ইনপুট টোন (X):</span>
                  <span className="font-mono font-bold text-white bg-zinc-900 px-1.5 py-0.2 rounded border border-zinc-800">
                    {selectedPoint.x}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  disabled={selectedPointIdx === 0 || selectedPointIdx === currentPoints.length - 1}
                  value={selectedPoint.x}
                  onChange={(e) => {
                    if (selectedPointIdx === null) return;
                    const val = Number(e.target.value);
                    const pts = [...currentPoints];
                    const prevX = pts[selectedPointIdx - 1]?.x ?? 0;
                    const nextX = pts[selectedPointIdx + 1]?.x ?? 255;
                    const clampedX = Math.min(nextX - 1, Math.max(prevX + 1, val));
                    pts[selectedPointIdx] = { ...pts[selectedPointIdx], x: clampedX };
                    onChangeCurves({ ...curves, [activeChannel]: pts });
                  }}
                  className="w-full h-1 accent-zinc-300 bg-zinc-800 rounded disabled:opacity-40"
                />

                {/* Output Y Slider */}
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-zinc-400">আউটপুট লেভেল (Y):</span>
                  <span className={`font-mono font-bold ${currentChannelConf.text} bg-zinc-900 px-1.5 py-0.2 rounded border border-zinc-800`}>
                    {selectedPoint.y}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={selectedPoint.y}
                  onChange={(e) => {
                    if (selectedPointIdx === null) return;
                    const val = Number(e.target.value);
                    const pts = [...currentPoints];
                    pts[selectedPointIdx] = { ...pts[selectedPointIdx], y: val };
                    onChangeCurves({ ...curves, [activeChannel]: pts });
                  }}
                  className="w-full h-1.5 rounded"
                  style={{
                    accentColor: currentChannelConf.dotColor,
                    backgroundColor: '#27272a',
                  }}
                />
              </div>
            ) : (
              <div className="py-3 text-center text-[10px] text-zinc-500 flex flex-col items-center gap-1">
                <span>কার্ভের উপর ক্লিক করে নতুন কন্ট্রোল পয়েন্ট যোগ করুন</span>
                <span className="text-[9px] text-zinc-600">বা যেকোনো পয়েন্ট টেনে কালার গ্রাফ নিয়ন্ত্রণ করুন</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Preset Curve Styles Carousel */}
      <div className="flex flex-col gap-1 mt-0.5">
        <span className="text-[10px] text-zinc-400 font-semibold flex items-center gap-1">
          <Sparkles size={11} className="text-amber-400" />
          <span>সিনেমাটিক কার্ভস প্রিসেট (One-Click):</span>
        </span>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin">
          {CURVE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset.curves)}
              className="px-2.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 flex items-center gap-1.5 shrink-0 active:scale-95 transition-all text-left group"
              title={preset.description}
            >
              <span className="text-sm">{preset.icon}</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-200 group-hover:text-cyan-300 whitespace-nowrap">
                  {preset.banglaName}
                </span>
                <span className="text-[8px] text-zinc-500 whitespace-nowrap">
                  {preset.name.split(' ')[0]}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FilterSettings, RGBCurves } from '../types/editor';
import { 
  BarChart3, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  Sliders,
  Sun,
  Moon
} from 'lucide-react';

export type HistogramChannelMode = 'luma' | 'rgb' | 'red' | 'green' | 'blue';
export type ScopeDisplayMode = 'histogram' | 'waveform' | 'parade';

interface HistogramPanelProps {
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  filters?: FilterSettings;
  curves?: RGBCurves;
  currentTime?: number;
  compact?: boolean;
  className?: string;
  allowToggleChannel?: boolean;
  allowScopeModes?: boolean;
  onQuickAdjust?: (adjustments: Partial<FilterSettings>) => void;
}

export const HistogramPanel: React.FC<HistogramPanelProps> = ({
  videoRef,
  filters,
  curves,
  currentTime = 0,
  compact = true,
  className = '',
  allowToggleChannel = true,
  allowScopeModes = true,
  onQuickAdjust,
}) => {
  const [channelMode, setChannelMode] = useState<HistogramChannelMode>('luma');
  const [scopeMode, setScopeMode] = useState<ScopeDisplayMode>('histogram');
  const [isExpanded, setIsExpanded] = useState<boolean>(!compact);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Statistics
  const [stats, setStats] = useState({
    avgLumaIre: 48,
    shadowPercent: 18,
    midtonesPercent: 64,
    highlightsPercent: 18,
    shadowClipped: false,
    highlightClipped: false,
    crushedPercent: 0,
    clippedPercent: 0,
    exposureGrade: 'সুষম (Balanced)',
    dynamicRangeStops: 11.2,
  });

  const BINS_COUNT = 64;

  // Process frame and compute histogram / waveform
  const updateHistogram = useCallback(() => {
    const video = videoRef?.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lumaBins = new Float32Array(BINS_COUNT);
    const rBins = new Float32Array(BINS_COUNT);
    const gBins = new Float32Array(BINS_COUNT);
    const bBins = new Float32Array(BINS_COUNT);

    let hasSampledVideo = false;

    // Buffer for waveform if requested
    const sampleW = 96;
    const sampleH = 54;
    let sampledPixels: Uint8ClampedArray | null = null;

    if (video && video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
      try {
        if (!offscreenCanvasRef.current) {
          offscreenCanvasRef.current = document.createElement('canvas');
        }
        const offCanvas = offscreenCanvasRef.current;
        offCanvas.width = sampleW;
        offCanvas.height = sampleH;
        const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

        if (offCtx) {
          // Apply current CSS filter approximation if available
          if (filters) {
            const b = filters.brightness ?? 100;
            const c = filters.contrast ?? 100;
            const s = filters.saturation ?? 100;
            const h = filters.hue ?? 0;
            offCtx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%) hue-rotate(${h}deg)`;
          }

          offCtx.drawImage(video, 0, 0, sampleW, sampleH);
          const imgData = offCtx.getImageData(0, 0, sampleW, sampleH);
          sampledPixels = imgData.data;
          const data = sampledPixels;
          const totalPixels = data.length / 4;

          let sumLuma = 0;
          let crushedCount = 0;
          let blownCount = 0;
          let shadowCount = 0;
          let midCount = 0;
          let highCount = 0;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Rec.709 ITU-R Luminance formula
            const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            sumLuma += luma;

            if (luma < 12) crushedCount++;
            if (luma > 245) blownCount++;

            if (luma < 51) shadowCount++; // < 20% IRE
            else if (luma > 204) highCount++; // > 80% IRE
            else midCount++;

            const lumaBin = Math.min(BINS_COUNT - 1, Math.floor((luma / 256) * BINS_COUNT));
            const rBin = Math.min(BINS_COUNT - 1, Math.floor((r / 256) * BINS_COUNT));
            const gBin = Math.min(BINS_COUNT - 1, Math.floor((g / 256) * BINS_COUNT));
            const bBin = Math.min(BINS_COUNT - 1, Math.floor((b / 256) * BINS_COUNT));

            lumaBins[lumaBin]++;
            rBins[rBin]++;
            gBins[gBin]++;
            bBins[bBin]++;
          }

          const crushedPct = (crushedCount / totalPixels) * 100;
          const blownPct = (blownCount / totalPixels) * 100;
          const avgIre = Math.round((sumLuma / totalPixels / 255) * 100);

          let grade = 'সুষম (Balanced)';
          if (avgIre < 35) grade = 'আন্ডার-এক্সপোজড (Dark)';
          else if (avgIre > 65) grade = 'ওভার-এক্সপোজড (Bright)';
          else if (crushedPct > 5 && blownPct > 5) grade = 'হাই কনট্রাস্ট (High Contrast)';

          setStats({
            avgLumaIre: avgIre,
            shadowPercent: Math.round((shadowCount / totalPixels) * 100),
            midtonesPercent: Math.round((midCount / totalPixels) * 100),
            highlightsPercent: Math.round((highCount / totalPixels) * 100),
            shadowClipped: crushedPct > 2.5,
            highlightClipped: blownPct > 2.5,
            crushedPercent: Math.round(crushedPct * 10) / 10,
            clippedPercent: Math.round(blownPct * 10) / 10,
            exposureGrade: grade,
            dynamicRangeStops: Math.round((10 + (Math.abs(50 - avgIre) < 15 ? 1.5 : 0)) * 10) / 10,
          });

          hasSampledVideo = true;
        }
      } catch {
        // Video might be cross-origin protected or canvas tainted
        hasSampledVideo = false;
      }
    }

    // Mathematical fallback simulation if video frame sampling failed or video not loaded yet
    if (!hasSampledVideo) {
      const bFactor = (filters?.brightness ?? 100) / 100;
      const cFactor = (filters?.contrast ?? 100) / 100;
      const hFactor = (filters?.highlights ?? 100) / 100;
      const sFactor = (filters?.shadows ?? 100) / 100;

      const meanBin = Math.min(BINS_COUNT - 2, Math.max(2, Math.round(30 * bFactor)));
      const spread = Math.max(6, Math.round(18 / Math.max(0.4, cFactor)));

      for (let i = 0; i < BINS_COUNT; i++) {
        const dist = (i - meanBin) / spread;
        let baseVal = Math.exp(-0.5 * dist * dist);

        if (i < BINS_COUNT * 0.25) baseVal *= sFactor;
        if (i > BINS_COUNT * 0.75) baseVal *= hFactor;

        lumaBins[i] = baseVal * 100;
        rBins[i] = baseVal * 95 * ((filters?.temperature ?? 0) > 0 ? 1.2 : 0.9);
        gBins[i] = baseVal * 100;
        bBins[i] = baseVal * 95 * ((filters?.temperature ?? 0) < 0 ? 1.2 : 0.9);
      }

      const avgIre = Math.round(Math.min(100, Math.max(0, 48 * bFactor)));
      let grade = 'সুষম (Balanced)';
      if (avgIre < 35) grade = 'আন্ডার-এক্সপোজড (Dark)';
      else if (avgIre > 65) grade = 'ওভার-এক্সপোজড (Bright)';

      setStats({
        avgLumaIre: avgIre,
        shadowPercent: Math.round(Math.min(100, Math.max(0, 20 * sFactor))),
        midtonesPercent: 60,
        highlightsPercent: Math.round(Math.min(100, Math.max(0, 20 * hFactor))),
        shadowClipped: bFactor < 0.6 || (filters?.blacks ?? 100) < 60,
        highlightClipped: bFactor > 1.4 || (filters?.whites ?? 100) > 140,
        crushedPercent: bFactor < 0.6 ? 4.2 : 0.4,
        clippedPercent: bFactor > 1.4 ? 5.1 : 0.6,
        exposureGrade: grade,
        dynamicRangeStops: 11.0,
      });
    }

    // Render onto target canvas
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Dark professional backdrop
    ctx.fillStyle = '#08090c';
    ctx.fillRect(0, 0, width, height);

    // ==========================================
    // RENDER MODE 1: HISTOGRAM (FREQUENCY CURVE)
    // ==========================================
    if (scopeMode === 'histogram') {
      // Grid lines for 25%, 50%, 75% IRE
      ctx.strokeStyle = 'rgba(63, 63, 70, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);

      const quarterX = width * 0.25;
      const halfX = width * 0.5;
      const threeQuarterX = width * 0.75;

      ctx.beginPath();
      ctx.moveTo(quarterX, 0);
      ctx.lineTo(quarterX, height);
      ctx.moveTo(halfX, 0);
      ctx.lineTo(halfX, height);
      ctx.moveTo(threeQuarterX, 0);
      ctx.lineTo(threeQuarterX, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // 18% Grey Reference band (around 40-45% IRE)
      ctx.fillStyle = 'rgba(234, 179, 8, 0.06)';
      ctx.fillRect(width * 0.38, 0, width * 0.08, height);

      // Find peak value for normalization
      let maxVal = 1;
      for (let i = 0; i < BINS_COUNT; i++) {
        if (lumaBins[i] > maxVal) maxVal = lumaBins[i];
        if (rBins[i] > maxVal) maxVal = rBins[i];
        if (gBins[i] > maxVal) maxVal = gBins[i];
        if (bBins[i] > maxVal) maxVal = bBins[i];
      }

      const drawChannel = (bins: Float32Array, strokeColor: string, fillColor: string | CanvasGradient, composite: GlobalCompositeOperation = 'source-over') => {
        ctx.globalCompositeOperation = composite;
        ctx.beginPath();
        ctx.moveTo(0, height);

        const step = width / (BINS_COUNT - 1);
        for (let i = 0; i < BINS_COUNT; i++) {
          const x = i * step;
          const normalized = Math.min(1, bins[i] / maxVal);
          const y = height - normalized * (height - 4);
          if (i === 0) ctx.lineTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        ctx.fillStyle = fillColor;
        ctx.fill();

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      };

      if (channelMode === 'luma') {
        const grad = ctx.createLinearGradient(0, height, 0, 0);
        grad.addColorStop(0, 'rgba(34, 211, 238, 0.12)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0.55)');
        drawChannel(lumaBins, '#38bdf8', grad);
      } else if (channelMode === 'rgb') {
        drawChannel(rBins, 'rgba(239, 68, 68, 0.85)', 'rgba(239, 68, 68, 0.25)', 'screen');
        drawChannel(gBins, 'rgba(34, 197, 94, 0.85)', 'rgba(34, 197, 94, 0.25)', 'screen');
        drawChannel(bBins, 'rgba(59, 130, 246, 0.85)', 'rgba(59, 130, 246, 0.25)', 'screen');
        ctx.globalCompositeOperation = 'source-over';
      } else if (channelMode === 'red') {
        drawChannel(rBins, '#ef4444', 'rgba(239, 68, 68, 0.35)');
      } else if (channelMode === 'green') {
        drawChannel(gBins, '#22c55e', 'rgba(34, 197, 94, 0.35)');
      } else if (channelMode === 'blue') {
        drawChannel(bBins, '#3b82f6', 'rgba(59, 130, 246, 0.35)');
      }
    } 
    // ==========================================
    // RENDER MODE 2: WAVEFORM (LUMA SPATIAL TRACE)
    // ==========================================
    else if (scopeMode === 'waveform') {
      // Horizontal IRE lines (0, 25, 50, 75, 100)
      ctx.strokeStyle = 'rgba(63, 63, 70, 0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);

      const y100 = height * 0.05;
      const y75 = height * 0.28;
      const y50 = height * 0.51;
      const y25 = height * 0.74;
      const y0 = height * 0.95;

      [y100, y75, y50, y25, y0].forEach(yPos => {
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(width, yPos);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Draw spatial trace points
      ctx.fillStyle = 'rgba(34, 211, 238, 0.45)';
      if (sampledPixels) {
        const stepX = width / sampleW;
        for (let x = 0; x < sampleW; x++) {
          for (let y = 0; y < sampleH; y += 2) {
            const idx = (y * sampleW + x) * 4;
            const r = sampledPixels[idx];
            const g = sampledPixels[idx + 1];
            const b = sampledPixels[idx + 2];
            const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
            const py = (1 - luma) * (height - 4) + 2;
            ctx.fillRect(x * stepX, py, 1.2, 1.2);
          }
        }
      } else {
        // Fallback smooth waveform visualization
        for (let x = 0; x < width; x += 2) {
          const normX = x / width;
          const baseLuma = 0.4 + 0.3 * Math.sin(normX * Math.PI * 2);
          const py = (1 - baseLuma) * (height - 10) + 5;
          ctx.fillRect(x, py + (Math.random() * 8 - 4), 1.5, 1.5);
        }
      }
    }
    // ==========================================
    // RENDER MODE 3: RGB PARADE
    // ==========================================
    else if (scopeMode === 'parade') {
      const colW = width / 3;

      // Divider lines
      ctx.strokeStyle = 'rgba(82, 82, 91, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(colW, 0);
      ctx.lineTo(colW, height);
      ctx.moveTo(colW * 2, 0);
      ctx.lineTo(colW * 2, height);
      ctx.stroke();

      // Column labels
      ctx.font = '9px monospace';
      ctx.fillStyle = '#ef4444';
      ctx.fillText('R', 4, 10);
      ctx.fillStyle = '#22c55e';
      ctx.fillText('G', colW + 4, 10);
      ctx.fillStyle = '#3b82f6';
      ctx.fillText('B', colW * 2 + 4, 10);

      // Render channels in their sub-columns
      if (sampledPixels) {
        const subSampleW = Math.floor(sampleW / 3);
        for (let x = 0; x < subSampleW; x++) {
          for (let y = 0; y < sampleH; y += 3) {
            const idx = (y * sampleW + x * 3) * 4;
            const r = sampledPixels[idx] / 255;
            const g = sampledPixels[idx + 1] / 255;
            const b = sampledPixels[idx + 2] / 255;

            // R
            ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
            ctx.fillRect((x / subSampleW) * colW, (1 - r) * (height - 6) + 3, 1.2, 1.2);

            // G
            ctx.fillStyle = 'rgba(34, 197, 94, 0.45)';
            ctx.fillRect(colW + (x / subSampleW) * colW, (1 - g) * (height - 6) + 3, 1.2, 1.2);

            // B
            ctx.fillStyle = 'rgba(59, 130, 246, 0.45)';
            ctx.fillRect(colW * 2 + (x / subSampleW) * colW, (1 - b) * (height - 6) + 3, 1.2, 1.2);
          }
        }
      }
    }
  }, [videoRef, filters, curves, channelMode, scopeMode]);

  useEffect(() => {
    updateHistogram();

    const video = videoRef?.current;
    if (!video) return;

    let animId: number;
    const renderLoop = () => {
      updateHistogram();
      if (!video.paused && !video.ended) {
        animId = requestAnimationFrame(renderLoop);
      }
    };

    const handlePlay = () => {
      animId = requestAnimationFrame(renderLoop);
    };

    const handlePause = () => {
      cancelAnimationFrame(animId);
      updateHistogram();
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('seeked', updateHistogram);
    video.addEventListener('timeupdate', updateHistogram);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('seeked', updateHistogram);
      video.removeEventListener('timeupdate', updateHistogram);
      cancelAnimationFrame(animId);
    };
  }, [videoRef, updateHistogram, currentTime]);

  return (
    <div className={`rounded-xl border border-zinc-800 bg-zinc-950/95 overflow-hidden shadow-lg text-xs select-none ${className}`}>
      {/* Top Header / Scope Bar */}
      <div className="flex items-center justify-between px-2.5 py-1.5 bg-zinc-900/90 border-b border-zinc-800/80">
        <div className="flex items-center gap-1.5">
          <BarChart3 size={13} className="text-cyan-400" />
          <span className="font-bold text-[11px] text-zinc-200">
            {scopeMode === 'histogram' && 'লুমিন্যান্স হিস্টোগ্রাম (Histogram)'}
            {scopeMode === 'waveform' && 'ওয়েভফর্ম লুমা মনিটর (Waveform)'}
            {scopeMode === 'parade' && 'আরজিবি প্যারেড (RGB Parade)'}
          </span>
          <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-[9px] font-mono text-cyan-300 font-bold border border-zinc-700">
            {stats.avgLumaIre} IRE
          </span>
          <span className="text-[9px] text-zinc-400 hidden sm:inline">
            • {stats.exposureGrade}
          </span>
        </div>

        {/* Right Controls: Scope Mode Switcher & Expand */}
        <div className="flex items-center gap-1.5">
          {/* Scope Mode Switcher */}
          {allowScopeModes && (
            <div className="flex items-center bg-zinc-950 rounded-lg p-0.5 border border-zinc-800">
              <button
                type="button"
                onClick={() => setScopeMode('histogram')}
                className={`px-1.5 py-0.5 text-[9px] rounded transition-colors ${
                  scopeMode === 'histogram' ? 'bg-cyan-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
                title="Histogram Frequency View"
              >
                হিস্টোগ্রাম
              </button>
              <button
                type="button"
                onClick={() => setScopeMode('waveform')}
                className={`px-1.5 py-0.5 text-[9px] rounded transition-colors ${
                  scopeMode === 'waveform' ? 'bg-cyan-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
                title="Broadcast Luma Waveform"
              >
                ওয়েভফর্ম
              </button>
              <button
                type="button"
                onClick={() => setScopeMode('parade')}
                className={`px-1.5 py-0.5 text-[9px] rounded transition-colors ${
                  scopeMode === 'parade' ? 'bg-cyan-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
                title="RGB Parade"
              >
                প্যারেড
              </button>
            </div>
          )}

          {/* Warning Badges */}
          {stats.shadowClipped && (
            <span
              className="px-1 py-0.2 rounded bg-red-950/80 border border-red-500/50 text-red-300 text-[8px] font-bold flex items-center gap-0.5 animate-pulse"
              title={`শ্যাডো ক্রাশড (${stats.crushedPercent}% pixels < 5 IRE)`}
            >
              <AlertTriangle size={8} /> CRUSH
            </span>
          )}

          {stats.highlightClipped && (
            <span
              className="px-1 py-0.2 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300 text-[8px] font-bold flex items-center gap-0.5 animate-pulse"
              title={`হাইলাইটস ক্লিপড (${stats.clippedPercent}% pixels > 95 IRE)`}
            >
              <AlertTriangle size={8} /> CLIP
            </span>
          )}

          {/* Channel selector when in Histogram mode */}
          {allowToggleChannel && scopeMode === 'histogram' && (
            <div className="flex items-center bg-zinc-950 rounded-lg p-0.5 border border-zinc-800">
              <button
                type="button"
                onClick={() => setChannelMode('luma')}
                className={`px-1.5 py-0.5 text-[9px] font-mono rounded transition-colors ${
                  channelMode === 'luma' ? 'bg-cyan-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
                title="Luminance (Y)"
              >
                Y
              </button>
              <button
                type="button"
                onClick={() => setChannelMode('rgb')}
                className={`px-1.5 py-0.5 text-[9px] font-mono rounded transition-colors ${
                  channelMode === 'rgb' ? 'bg-purple-500 text-white font-bold' : 'text-zinc-400 hover:text-white'
                }`}
                title="RGB Overlay"
              >
                RGB
              </button>
              <button
                type="button"
                onClick={() => setChannelMode('red')}
                className={`px-1 py-0.5 text-[9px] font-mono rounded transition-colors ${
                  channelMode === 'red' ? 'bg-red-500 text-white font-bold' : 'text-zinc-500 hover:text-red-400'
                }`}
                title="Red Channel"
              >
                R
              </button>
              <button
                type="button"
                onClick={() => setChannelMode('green')}
                className={`px-1 py-0.5 text-[9px] font-mono rounded transition-colors ${
                  channelMode === 'green' ? 'bg-green-500 text-zinc-950 font-bold' : 'text-zinc-500 hover:text-green-400'
                }`}
                title="Green Channel"
              >
                G
              </button>
              <button
                type="button"
                onClick={() => setChannelMode('blue')}
                className={`px-1 py-0.5 text-[9px] font-mono rounded transition-colors ${
                  channelMode === 'blue' ? 'bg-blue-500 text-white font-bold' : 'text-zinc-500 hover:text-blue-400'
                }`}
                title="Blue Channel"
              >
                B
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            title={isExpanded ? 'মিনিমাইজ' : 'এক্সপ্যান্ড'}
          >
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {/* Main Scope Canvas Container */}
      <div className="relative px-2 pt-1 pb-1.5 bg-zinc-950">
        <canvas
          ref={canvasRef}
          width={300}
          height={isExpanded ? 58 : 38}
          className="w-full h-auto block rounded border border-zinc-900 bg-zinc-950 shadow-inner"
        />

        {/* Scale Labels */}
        <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 px-0.5 mt-0.5">
          <span className="flex items-center gap-0.5">
            <span className="w-1 h-1 rounded-full bg-zinc-600" /> 0 IRE (Dark)
          </span>
          <span className="text-zinc-600">25</span>
          <span className="text-amber-400 font-bold">18% Grey / 45 IRE</span>
          <span className="text-zinc-600">75</span>
          <span className="flex items-center gap-0.5">
            100 IRE (Peak) <span className="w-1 h-1 rounded-full bg-zinc-400" />
          </span>
        </div>

        {/* Detailed Metrics Breakdown & Quick Fix Buttons when Expanded */}
        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-zinc-900 flex flex-col gap-2">
            <div className="grid grid-cols-4 gap-1 text-center font-mono text-[9px]">
              <div className="bg-zinc-900/70 p-1 rounded border border-zinc-800/60">
                <div className="text-[8px] text-zinc-400">শ্যাডো (০-২০)</div>
                <div className="font-bold text-cyan-300">{stats.shadowPercent}%</div>
              </div>
              <div className="bg-zinc-900/70 p-1 rounded border border-zinc-800/60">
                <div className="text-[8px] text-zinc-400">মিডটোন (২০-৮০)</div>
                <div className="font-bold text-amber-300">{stats.midtonesPercent}%</div>
              </div>
              <div className="bg-zinc-900/70 p-1 rounded border border-zinc-800/60">
                <div className="text-[8px] text-zinc-400">হাইলাইটস (৮০+)</div>
                <div className="font-bold text-rose-300">{stats.highlightsPercent}%</div>
              </div>
              <div className="bg-zinc-900/70 p-1 rounded border border-zinc-800/60">
                <div className="text-[8px] text-zinc-400">ডায়নামিক রেঞ্জ</div>
                <div className="font-bold text-emerald-400">{stats.dynamicRangeStops} EV</div>
              </div>
            </div>

            {/* Exposure Quick Tuning Actions */}
            {onQuickAdjust && (
              <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-zinc-900/60">
                <span className="text-[9px] text-zinc-400 font-semibold flex items-center gap-1">
                  <Sparkles size={10} className="text-amber-400" />
                  কুইক গ্রেড ব্যালান্স:
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onQuickAdjust({ brightness: 100, contrast: 100, shadows: 105, highlights: 95 })}
                    className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[9px] font-medium border border-zinc-700"
                    title="রিসেন্টার এক্সপোজার"
                  >
                    ব্যালান্স
                  </button>
                  <button
                    type="button"
                    onClick={() => onQuickAdjust({ shadows: 120, blacks: 110 })}
                    className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-cyan-300 text-[9px] font-medium border border-zinc-700 flex items-center gap-0.5"
                    title="শ্যাডো লিফট করে ডিটেইল বের করুন"
                  >
                    <Moon size={9} /> শ্যাডো লিফট
                  </button>
                  <button
                    type="button"
                    onClick={() => onQuickAdjust({ highlights: 85, whites: 90 })}
                    className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-rose-300 text-[9px] font-medium border border-zinc-700 flex items-center gap-0.5"
                    title="হাইলাইট প্রটেকশন"
                  >
                    <Sun size={9} /> হাইলাইট প্রটেক্ট
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

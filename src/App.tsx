/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { VideoPreview } from './components/VideoPreview';
import { Timeline } from './components/Timeline';
import { BottomToolbar } from './components/BottomToolbar';
import { ExportModal } from './components/ExportModal';
import { MediaPickerModal } from './components/MediaPickerModal';
import { 
  AspectRatio, 
  FilterSettings, 
  Keyframe, 
  TextOverlay, 
  StickerOverlay, 
  PresetFilter, 
  ColorPalette,
  ActiveToolTab,
  AudioTrack,
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
} from './types/editor';
import { DEFAULT_FILTERS, PRESET_FILTERS, COLOR_PALETTES, SAMPLE_VIDEOS, BGM_TRACKS } from './constants/presets';
import { DEFAULT_RGB_CURVES, interpolateRGBCurves } from './utils/curveUtils';
import { 
  DEFAULT_NODES,
  DEFAULT_SELECTIVE_COLOR,
  DEFAULT_SKIN_TONE,
  DEFAULT_LOG_SETTINGS,
  DEFAULT_VIRTUAL_LIGHT,
  DEFAULT_OPTICS,
  DEFAULT_OBJECT_TRACKER,
  DEFAULT_MASKING,
  DEFAULT_COMPOSITING_LAYERS,
  DEFAULT_CHROMA_KEY
} from './utils/compositingUtils';

export default function App() {
  // Video Media State - Default loaded sample video
  const [videoUrl, setVideoUrl] = useState<string | null>(SAMPLE_VIDEOS[0].url);
  const [videoFileName, setVideoFileName] = useState<string>('Urban_Neon_Lights.mp4');
  const [projectName, setProjectName] = useState<string>('CapCut_Post_01.mp4');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');

  // Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(SAMPLE_VIDEOS[0].duration);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Mobile Bottom Drawer State
  const [activeTab, setActiveTab] = useState<ActiveToolTab | null>(null);
  const [filters, setFilters] = useState<FilterSettings>({ ...DEFAULT_FILTERS });
  const [selectedPresetId, setSelectedPresetId] = useState<string>('none');
  const [filterIntensity, setFilterIntensity] = useState<number>(100);
  const [basePresetSettings, setBasePresetSettings] = useState<Partial<FilterSettings>>({});
  
  // Keyframe and Automation state
  const [keyframes, setKeyframes] = useState<Keyframe[]>([]);
  const [selectedKeyframeId, setSelectedKeyframeId] = useState<string | null>(null);
  const [showLetterbox, setShowLetterbox] = useState<boolean>(false);

  // Background Audio / BGM State
  const [activeAudioTrack, setActiveAudioTrack] = useState<AudioTrack | null>(null);
  const [audioVolume, setAudioVolume] = useState<number>(0.6);

  // Desktop Phone Mockup View Toggle
  const [isPhoneFrameMode, setIsPhoneFrameMode] = useState<boolean>(false);

  // Advanced Color Grading & Compositing Studio States (Node, Selective, Skin, Log, Lights, Optics, Tracker, Layers)
  const [nodes, setNodes] = useState<ColorGradingNode[]>([...DEFAULT_NODES]);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(DEFAULT_NODES[1].id);
  const [selectiveColor, setSelectiveColor] = useState<SelectiveColorSettings>({ ...DEFAULT_SELECTIVE_COLOR });
  const [skinTone, setSkinTone] = useState<SkinToneProtection>({ ...DEFAULT_SKIN_TONE });
  const [logSettings, setLogSettings] = useState<LogProfileSettings>({ ...DEFAULT_LOG_SETTINGS });
  const [virtualLight, setVirtualLight] = useState<VirtualLightSettings>({ ...DEFAULT_VIRTUAL_LIGHT });
  const [opticsSettings, setOpticsSettings] = useState<OpticsSettings>({ ...DEFAULT_OPTICS });
  const [trackerSettings, setTrackerSettings] = useState<ObjectTrackerSettings>({ ...DEFAULT_OBJECT_TRACKER });
  const [maskSettings, setMaskSettings] = useState<MaskingSettings>({ ...DEFAULT_MASKING });
  const [layers, setLayers] = useState<CompositingLayer[]>([...DEFAULT_COMPOSITING_LAYERS]);
  const [chromaKey, setChromaKey] = useState<ChromaKeyerSettings>({ ...DEFAULT_CHROMA_KEY });

  // Overlays
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([
    {
      id: 'initial-text',
      text: 'CapCraft Pro',
      x: 50,
      y: 20,
      fontSize: 20,
      color: '#22d3ee',
      bgColor: 'transparent',
      fontFamily: 'Impact, sans-serif',
      startTime: 0,
      endTime: 15,
    },
  ]);
  const [stickerOverlays, setStickerOverlays] = useState<StickerOverlay[]>([]);

  // Modals
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState<boolean>(false);
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);

  // History stack for Undo / Redo
  const [history, setHistory] = useState<FilterSettings[]>([{ ...DEFAULT_FILTERS }]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  // Video timeupdate with Smooth Keyframe Automation & Interpolation
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      const curTime = video.currentTime;
      setCurrentTime(curTime);

      // Automated Smooth Keyframe Interpolation
      if (keyframes.length > 0) {
        const sorted = [...keyframes].sort((a, b) => a.time - b.time);

        if (curTime <= sorted[0].time) {
          setFilters(sorted[0].settings);
        } else if (curTime >= sorted[sorted.length - 1].time) {
          setFilters(sorted[sorted.length - 1].settings);
        } else {
          // Find surrounding keyframes
          let kfA = sorted[0];
          let kfB = sorted[1];
          for (let i = 0; i < sorted.length - 1; i++) {
            if (curTime >= sorted[i].time && curTime <= sorted[i + 1].time) {
              kfA = sorted[i];
              kfB = sorted[i + 1];
              break;
            }
          }

          // Ease in-out smooth blending
          const span = kfB.time - kfA.time;
          const progress = span > 0 ? (curTime - kfA.time) / span : 0;
          const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

          const blended: FilterSettings = { ...kfA.settings };
          (Object.keys(kfA.settings) as (keyof FilterSettings)[]).forEach((prop) => {
            if (prop === 'curves') {
              if (kfA.settings.curves && kfB.settings.curves) {
                blended.curves = interpolateRGBCurves(kfA.settings.curves, kfB.settings.curves, ease);
              } else {
                blended.curves = kfA.settings.curves || kfB.settings.curves;
              }
            } else {
              const vA = kfA.settings[prop];
              const vB = kfB.settings[prop];
              if (typeof vA === 'number' && typeof vB === 'number') {
                (blended as any)[prop] = Math.round(vA + (vB - vA) * ease);
              }
            }
          });
          setFilters(blended);
        }
      }
    };

    const onLoadedMetadata = () => {
      setDuration(video.duration || 15);
    };

    const onEnded = () => {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('ended', onEnded);
    };
  }, [keyframes]);

  // Sync background music with video playback
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = audioVolume;

    if (isPlaying && activeAudioTrack) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, activeAudioTrack, audioVolume]);

  // Sync Video properties
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = playbackRate;
    videoRef.current.volume = isMuted ? 0 : volume;
  }, [playbackRate, volume, isMuted]);

  // Keyboard shortcut for spacebar play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      if (audioRef.current && activeAudioTrack) audioRef.current.play().catch(() => {});
    }
  };

  const handleSeek = (time: number) => {
    if (!videoRef.current) return;
    const bounded = Math.max(0, Math.min(duration, time));
    videoRef.current.currentTime = bounded;
    setCurrentTime(bounded);
    if (audioRef.current) {
      audioRef.current.currentTime = bounded % (audioRef.current.duration || 100);
    }
  };

  // Local File Import handler (Gallery or Camera)
  const handleFileChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setVideoFileName(file.name);
      setProjectName(file.name.replace(/\.[^/.]+$/, '') + '_graded.mp4');
      setIsPlaying(false);
      setKeyframes([]);
      setSelectedKeyframeId(null);
      setCurrentTime(0);
    }
  };

  const handleSelectSampleVideo = (url: string, name: string) => {
    setVideoUrl(url);
    setVideoFileName(name);
    setProjectName(name.replace(/\.[^/.]+$/, '') + '_graded.mp4');
    setIsPlaying(false);
    setKeyframes([]);
    setSelectedKeyframeId(null);
    setCurrentTime(0);
  };

  const handleNewBlankProject = () => {
    setVideoUrl(SAMPLE_VIDEOS[0].url);
    setVideoFileName('New_Project.mp4');
    setProjectName('Untitled_Video_01.mp4');
    setFilters({ ...DEFAULT_FILTERS });
    setKeyframes([]);
    setSelectedKeyframeId(null);
    setTextOverlays([]);
    setStickerOverlays([]);
    setActiveAudioTrack(null);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Apply Filter Preset
  const handleApplyPreset = (preset: PresetFilter) => {
    setSelectedPresetId(preset.id);
    setBasePresetSettings(preset.settings);

    const intensityFactor = filterIntensity / 100;
    const newFilters: FilterSettings = { ...DEFAULT_FILTERS };

    (Object.keys(DEFAULT_FILTERS) as (keyof FilterSettings)[]).forEach((key) => {
      if (key === 'curves') {
        newFilters.curves = preset.settings.curves || DEFAULT_FILTERS.curves;
        return;
      }
      const defVal = (DEFAULT_FILTERS[key] ?? 100) as number;
      const targetVal = preset.settings[key] !== undefined ? (preset.settings[key] as number) : defVal;
      (newFilters as any)[key] = Math.round(defVal + (targetVal - defVal) * intensityFactor);
    });

    setFilters(newFilters);
    pushHistory(newFilters);

    // If a keyframe is actively selected, update that keyframe too!
    if (selectedKeyframeId) {
      setKeyframes((prev) =>
        prev.map((k) => (k.id === selectedKeyframeId ? { ...k, settings: { ...newFilters } } : k))
      );
    }
  };

  // Apply Color Palette
  const handleApplyPalette = (palette: ColorPalette) => {
    const newFilters: FilterSettings = {
      ...DEFAULT_FILTERS,
      ...palette.recommendedSettings,
    };
    setSelectedPresetId(palette.presetId);
    setFilters(newFilters);
    pushHistory(newFilters);

    if (selectedKeyframeId) {
      setKeyframes((prev) =>
        prev.map((k) => (k.id === selectedKeyframeId ? { ...k, settings: { ...newFilters } } : k))
      );
    }
  };

  useEffect(() => {
    if (selectedPresetId === 'none') return;
    const intensityFactor = filterIntensity / 100;
    const newFilters: FilterSettings = { ...DEFAULT_FILTERS };

    (Object.keys(DEFAULT_FILTERS) as (keyof FilterSettings)[]).forEach((key) => {
      if (key === 'curves') {
        newFilters.curves = basePresetSettings.curves || DEFAULT_FILTERS.curves;
        return;
      }
      const defVal = (DEFAULT_FILTERS[key] ?? 100) as number;
      const targetVal = basePresetSettings[key] !== undefined ? (basePresetSettings[key] as number) : defVal;
      (newFilters as any)[key] = Math.round(defVal + (targetVal - defVal) * intensityFactor);
    });

    setFilters(newFilters);
  }, [filterIntensity, selectedPresetId, basePresetSettings]);

  // Keyframing custom additions
  const handleAddKeyframe = () => {
    const newKf: Keyframe = {
      id: 'kf-' + Date.now(),
      time: Number(currentTime.toFixed(2)),
      name: `ফোকাস ফ্রেম (${currentTime.toFixed(1)}s)`,
      settings: { ...filters },
      easing: 'smooth',
    };

    setKeyframes((prev) => {
      const filtered = prev.filter((k) => Math.abs(k.time - newKf.time) > 0.15);
      return [...filtered, newKf].sort((a, b) => a.time - b.time);
    });
    setSelectedKeyframeId(newKf.id);
  };

  const handleDeleteKeyframe = (id: string) => {
    setKeyframes((prev) => prev.filter((k) => k.id !== id));
    if (selectedKeyframeId === id) {
      setSelectedKeyframeId(null);
    }
  };

  const handleClearAllKeyframes = () => {
    setKeyframes([]);
    setSelectedKeyframeId(null);
  };

  const handleChangeCurves = (newCurves: RGBCurves) => {
    setFilters((prev) => {
      const updated = { ...prev, curves: newCurves };
      pushHistory(updated);
      return updated;
    });

    if (selectedKeyframeId) {
      setKeyframes((prev) =>
        prev.map((k) =>
          k.id === selectedKeyframeId
            ? { ...k, settings: { ...k.settings, curves: newCurves } }
            : k
        )
      );
    }
  };

  const handleResetCurves = () => {
    handleChangeCurves(DEFAULT_RGB_CURVES);
  };

  // Auto Automation Keyframe Generator
  const handleApplyAutomationPreset = (mode: 'sunset' | 'dayNight' | 'cyberShift') => {
    const dur = Math.max(8, duration || 15);

    if (mode === 'dayNight') {
      // Day to night smooth color shift
      const kf1: Keyframe = {
        id: 'auto-dn-1',
        time: 0,
        name: 'সকাল (Bright Dawn)',
        settings: { ...DEFAULT_FILTERS, brightness: 110, temperature: 15, brilliance: 115 },
        easing: 'smooth',
      };
      const kf2: Keyframe = {
        id: 'auto-dn-2',
        time: Number((dur * 0.5).toFixed(1)),
        name: 'গোধূলি (Sunset Ember)',
        settings: { ...DEFAULT_FILTERS, brightness: 104, contrast: 120, saturation: 135, temperature: 40, vignette: 24 },
        easing: 'smooth',
      };
      const kf3: Keyframe = {
        id: 'auto-dn-3',
        time: Number(dur.toFixed(1)),
        name: 'রাতের শহর (Midnight Noir)',
        settings: { ...DEFAULT_FILTERS, brightness: 90, contrast: 135, saturation: 80, temperature: -35, hue: -15, vignette: 36, grain: 24 },
        easing: 'smooth',
      };
      setKeyframes([kf1, kf2, kf3]);
    } else if (mode === 'sunset') {
      // Golden Hour Radiance pulse
      const kf1: Keyframe = {
        id: 'auto-sun-1',
        time: 0,
        name: 'স্বাভাবিক আলো',
        settings: { ...DEFAULT_FILTERS },
        easing: 'smooth',
      };
      const kf2: Keyframe = {
        id: 'auto-sun-2',
        time: Number((dur * 0.45).toFixed(1)),
        name: 'গোল্ডেন আওয়ার পিক',
        settings: { ...DEFAULT_FILTERS, brightness: 108, contrast: 118, saturation: 140, temperature: 45, brilliance: 124, vignette: 22 },
        easing: 'smooth',
      };
      const kf3: Keyframe = {
        id: 'auto-sun-3',
        time: Number(dur.toFixed(1)),
        name: 'নরম গোধূলি',
        settings: { ...DEFAULT_FILTERS, brightness: 100, contrast: 112, saturation: 115, temperature: 20, fade: 14 },
        easing: 'smooth',
      };
      setKeyframes([kf1, kf2, kf3]);
    } else {
      // Cyberpunk Color Shift
      const kf1: Keyframe = {
        id: 'auto-cyber-1',
        time: 0,
        name: 'ইলেক্ট্রিক সায়ান',
        settings: { ...DEFAULT_FILTERS, contrast: 130, saturation: 150, hue: 20, temperature: -25, vignette: 28 },
        easing: 'smooth',
      };
      const kf2: Keyframe = {
        id: 'auto-cyber-2',
        time: Number((dur * 0.5).toFixed(1)),
        name: 'ম্যাজেন্টা নিয়ন',
        settings: { ...DEFAULT_FILTERS, contrast: 135, saturation: 165, hue: -40, temperature: 10, brilliance: 125, vignette: 32 },
        easing: 'smooth',
      };
      const kf3: Keyframe = {
        id: 'auto-cyber-3',
        time: Number(dur.toFixed(1)),
        name: 'গ্রিন ম্যাট্রিক্স',
        settings: { ...DEFAULT_FILTERS, contrast: 140, saturation: 125, hue: 35, temperature: -20, blacks: 80, vignette: 35 },
        easing: 'smooth',
      };
      setKeyframes([kf1, kf2, kf3]);
    }

    setActiveTab('keyframes');
  };

  // Smart Auto Adjust
  const handleAutoAdjust = () => {
    const autoGrade: FilterSettings = {
      ...filters,
      brightness: 104,
      contrast: 114,
      saturation: 118,
      brilliance: 116,
      sharpen: 30,
      highlights: 110,
      shadows: 94,
      whites: 108,
      blacks: 92,
      temperature: 6,
      hue: -2,
      fade: 5,
      vignette: 15,
    };

    setFilters(autoGrade);
    pushHistory(autoGrade);

    if (selectedKeyframeId) {
      setKeyframes((prev) =>
        prev.map((k) => (k.id === selectedKeyframeId ? { ...k, settings: { ...autoGrade } } : k))
      );
    }
  };

  const handleSplitClip = () => {
    handleAddKeyframe();
  };

  // AI Scene Detection
  const handleRunAISceneDetection = async () => {
    setIsAiProcessing(true);
    try {
      const res = await fetch('/api/analyze-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoName: videoFileName,
          duration: duration,
        }),
      });

      const data = await res.json();
      if (data.scenes && Array.isArray(data.scenes)) {
        const generatedKeyframes: Keyframe[] = data.scenes.map((scene: any, idx: number) => {
          const matchedPreset = PRESET_FILTERS.find((p) => p.name.includes(scene.preset)) || PRESET_FILTERS[idx % PRESET_FILTERS.length];
          return {
            id: 'ai-scene-' + idx,
            time: Number(scene.start.toFixed(2)),
            name: scene.title || `সিন ${idx + 1}`,
            settings: { ...DEFAULT_FILTERS, ...(matchedPreset.settings || {}) },
            easing: 'smooth',
          };
        });

        setKeyframes(generatedKeyframes);
      }
    } catch (err) {
      console.warn('AI Scene detection fallback:', err);
      setKeyframes([
        { id: 'kf-scene-1', time: 0, name: 'সিন ১ (শুরু)', settings: { ...DEFAULT_FILTERS }, easing: 'smooth' },
        { id: 'kf-scene-2', time: Number((duration * 0.4).toFixed(2)), name: 'সিন ২ (কন্ট্রাস্ট)', settings: { ...DEFAULT_FILTERS, contrast: 120, saturation: 130 }, easing: 'smooth' },
        { id: 'kf-scene-3', time: Number((duration * 0.75).toFixed(2)), name: 'সিন ৩ (সিনেমা)', settings: { ...DEFAULT_FILTERS, temperature: 25, vignette: 30 }, easing: 'smooth' },
      ]);
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Overlays
  const handleAddText = (text: string, font: string, color: string) => {
    const newTextObj: TextOverlay = {
      id: 'text-' + Date.now(),
      text,
      x: 50,
      y: 70,
      fontSize: 22,
      color,
      bgColor: 'transparent',
      fontFamily: font,
      startTime: Math.max(0, currentTime - 0.5),
      endTime: Math.min(duration, currentTime + 5),
    };
    setTextOverlays((prev) => [...prev, newTextObj]);
  };

  const handleDeleteText = (id: string) => {
    setTextOverlays((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddSticker = (emoji: string) => {
    const newSticker: StickerOverlay = {
      id: 'stk-' + Date.now(),
      emoji,
      name: emoji,
      x: 50 + (Math.random() * 16 - 8),
      y: 50 + (Math.random() * 16 - 8),
      size: 44,
      startTime: Math.max(0, currentTime - 0.5),
      endTime: Math.min(duration, currentTime + 4),
    };
    setStickerOverlays((prev) => [...prev, newSticker]);
  };

  const handleDeleteSticker = (id: string) => {
    setStickerOverlays((prev) => prev.filter((s) => s.id !== id));
  };

  // Undo / Redo
  const pushHistory = (newSettings: FilterSettings) => {
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(newSettings);
    if (newHist.length > 30) newHist.shift();
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setFilters({ ...history[prevIdx] });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setFilters({ ...history[nextIdx] });
    }
  };

  return (
    <div className={`h-[100dvh] w-screen bg-black text-zinc-100 flex items-center justify-center font-sans overflow-hidden select-none ${isPhoneFrameMode ? 'p-2 sm:p-5' : ''}`}>
      {/* Hidden File Inputs: Gallery & Live Camera */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChosen}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="video/*"
        capture="environment"
        onChange={handleFileChosen}
        className="hidden"
      />

      {/* Hidden Audio Element for BGM Music */}
      {activeAudioTrack && (
        <audio
          ref={audioRef}
          src={activeAudioTrack.url}
          loop
          preload="auto"
          className="hidden"
        />
      )}

      {/* Main CapCut Mobile Shell */}
      <div 
        className={`w-full h-full flex flex-col bg-zinc-950 overflow-hidden ${
          isPhoneFrameMode 
            ? 'max-w-[420px] max-h-[880px] rounded-[44px] border-[10px] border-zinc-800 shadow-[0_0_60px_rgba(0,0,0,0.9)] relative' 
            : ''
        }`}
      >
        {/* Dynamic Island / Notch Simulation on Desktop Phone Frame */}
        {isPhoneFrameMode && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-zinc-900 rounded-full z-40 flex items-center justify-center shadow">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 ml-auto mr-3" />
          </div>
        )}

        {/* Top Header */}
        <Header
          projectName={projectName}
          setProjectName={setProjectName}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          onImportClick={() => setIsMediaPickerOpen(true)}
          onExportClick={() => setIsExportOpen(true)}
          onSelectSampleVideo={handleSelectSampleVideo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onUndo={handleUndo}
          onRedo={handleRedo}
          isPhoneFrameMode={isPhoneFrameMode}
          setIsPhoneFrameMode={setIsPhoneFrameMode}
        />

        {/* Studio Suite Quick Bar: Color Grading | 3D Lighting & VFX | Tracking & Mask | Layers & Matte */}
        <div className="h-7 bg-zinc-950 border-b border-zinc-800/80 px-2 flex items-center gap-1.5 overflow-x-auto text-[10px] select-none shrink-0 z-20">
          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider shrink-0 mr-1">
            Studio:
          </span>
          <button
            onClick={() => setActiveTab('nodes')}
            className={`px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 font-medium border transition-all ${
              ['nodes', 'curves', 'selective-color', 'skin-tone', 'log-luts'].includes(activeTab || '')
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <span>🎨 কালার গ্রেডিং</span>
          </button>
          <button
            onClick={() => setActiveTab('virtual-lighting')}
            className={`px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 font-medium border transition-all ${
              ['virtual-lighting', 'optics-flares'].includes(activeTab || '')
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <span>💡 ভার্চুয়াল লাইট ও VFX</span>
          </button>
          <button
            onClick={() => setActiveTab('object-tracking')}
            className={`px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 font-medium border transition-all ${
              activeTab === 'object-tracking'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <span>🎯 ট্র্যাকিং ও মাস্ক</span>
          </button>
          <button
            onClick={() => setActiveTab('layers-compositing')}
            className={`px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 font-medium border transition-all ${
              activeTab === 'layers-compositing'
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <span>📚 লেয়ার্স ও ম্যাট</span>
          </button>
        </div>

        {/* Video Preview Canvas */}
        <VideoPreview
          videoRef={videoRef}
          videoUrl={videoUrl}
          videoFileName={videoFileName}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          playbackRate={playbackRate}
          volume={volume}
          isMuted={isMuted}
          filters={filters}
          aspectRatio={aspectRatio}
          textOverlays={textOverlays}
          stickerOverlays={stickerOverlays}
          showLetterbox={showLetterbox}
          selectiveColor={selectiveColor}
          skinTone={skinTone}
          logSettings={logSettings}
          virtualLight={virtualLight}
          opticsSettings={opticsSettings}
          trackerSettings={trackerSettings}
          maskSettings={maskSettings}
          layers={layers}
          chromaKey={chromaKey}
          onTogglePlay={togglePlay}
          onSeek={handleSeek}
          onPlaybackRateChange={setPlaybackRate}
          onVolumeChange={setVolume}
          onToggleMute={() => setIsMuted(!isMuted)}
          onImportClick={() => setIsMediaPickerOpen(true)}
          setVirtualLight={setVirtualLight}
          setTextOverlays={setTextOverlays}
          setStickerOverlays={setStickerOverlays}
          setTrackerSettings={setTrackerSettings}
        />

        {/* Mobile Multi-Track CapCut Timeline with Distinct Frame Cards & Keyframes */}
        <Timeline
          duration={duration}
          currentTime={currentTime}
          isPlaying={isPlaying}
          keyframes={keyframes}
          selectedKeyframeId={selectedKeyframeId}
          onSelectKeyframe={setSelectedKeyframeId}
          textOverlays={textOverlays}
          stickerOverlays={stickerOverlays}
          videoFileName={videoFileName}
          videoUrl={videoUrl}
          videoRef={videoRef}
          onSeek={handleSeek}
          onTogglePlay={togglePlay}
          onAddKeyframe={handleAddKeyframe}
          onDeleteKeyframe={handleDeleteKeyframe}
          onSplitClip={handleSplitClip}
          onAutoGenerateKeyframes={() => handleApplyAutomationPreset('dayNight')}
        />

        {/* Mobile CapCut Tool Dock & Bottom Drawer */}
        <BottomToolbar
          videoRef={videoRef}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filters={filters}
          setFilters={setFilters}
          selectedPresetId={selectedPresetId}
          onApplyPreset={handleApplyPreset}
          onApplyPalette={handleApplyPalette}
          filterIntensity={filterIntensity}
          setFilterIntensity={setFilterIntensity}
          showLetterbox={showLetterbox}
          setShowLetterbox={setShowLetterbox}
          textOverlays={textOverlays}
          onAddText={handleAddText}
          onDeleteText={handleDeleteText}
          stickerOverlays={stickerOverlays}
          onAddSticker={handleAddSticker}
          onDeleteSticker={handleDeleteSticker}
          onAutoAdjust={handleAutoAdjust}
          onRunAISceneDetection={handleRunAISceneDetection}
          isAiProcessing={isAiProcessing}
          activeAudioTrack={activeAudioTrack}
          onSelectAudioTrack={setActiveAudioTrack}
          audioVolume={audioVolume}
          setAudioVolume={setAudioVolume}
          keyframes={keyframes}
          selectedKeyframeId={selectedKeyframeId}
          onSelectKeyframe={setSelectedKeyframeId}
          onAddKeyframe={handleAddKeyframe}
          onDeleteKeyframe={handleDeleteKeyframe}
          onClearAllKeyframes={handleClearAllKeyframes}
          currentTime={currentTime}
          onSeek={handleSeek}
          onApplyAutomationPreset={handleApplyAutomationPreset}
          onChangeCurves={handleChangeCurves}
          onResetCurves={handleResetCurves}
          nodes={nodes}
          setNodes={setNodes}
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
          selectiveColor={selectiveColor}
          setSelectiveColor={setSelectiveColor}
          skinTone={skinTone}
          setSkinTone={setSkinTone}
          logSettings={logSettings}
          setLogSettings={setLogSettings}
          virtualLight={virtualLight}
          setLightSettings={setVirtualLight}
          opticsSettings={opticsSettings}
          setOpticsSettings={setOpticsSettings}
          trackerSettings={trackerSettings}
          setTrackerSettings={setTrackerSettings}
          maskSettings={maskSettings}
          setMaskSettings={setMaskSettings}
          layers={layers}
          setLayers={setLayers}
          chromaKey={chromaKey}
          setChromaKey={setChromaKey}
        />

        {/* Media Picker Modal */}
        <MediaPickerModal
          isOpen={isMediaPickerOpen}
          onClose={() => setIsMediaPickerOpen(false)}
          onPickGallery={() => galleryInputRef.current?.click()}
          onPickCamera={() => cameraInputRef.current?.click()}
          onSelectSample={handleSelectSampleVideo}
          onNewBlankProject={handleNewBlankProject}
        />

        {/* Export & Save Modal */}
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          projectName={projectName}
          videoDuration={duration}
          videoUrl={videoUrl}
          videoRef={videoRef}
          filters={filters}
          textOverlays={textOverlays}
          stickerOverlays={stickerOverlays}
        />
      </div>
    </div>
  );
}

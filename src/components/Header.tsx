import React, { useState } from 'react';
import { 
  Upload, 
  Download, 
  RotateCcw, 
  RotateCw, 
  Smartphone, 
  Tv, 
  Square, 
  ChevronDown, 
  Sparkles, 
  Clapperboard,
  Monitor,
  X
} from 'lucide-react';
import { AspectRatio } from '../types/editor';

interface HeaderProps {
  projectName: string;
  setProjectName: (name: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  onImportClick: () => void;
  onExportClick: () => void;
  onSelectSampleVideo: (url: string, name: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isProcessing?: boolean;
  isPhoneFrameMode: boolean;
  setIsPhoneFrameMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  projectName,
  setProjectName,
  aspectRatio,
  setAspectRatio,
  onImportClick,
  onExportClick,
  onSelectSampleVideo,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isProcessing = false,
  isPhoneFrameMode,
  setIsPhoneFrameMode,
}) => {
  const [showAspectMenu, setShowAspectMenu] = useState(false);
  const [showSampleMenu, setShowSampleMenu] = useState(false);

  const aspectOptions: { label: string; value: AspectRatio; desc: string }[] = [
    { label: '9:16', value: '9:16', desc: 'TikTok / Reels' },
    { label: '16:9', value: '16:9', desc: 'YouTube Landscape' },
    { label: '1:1', value: '1:1', desc: 'Instagram Square' },
    { label: '4:5', value: '4:5', desc: 'Feed Portrait' },
  ];

  return (
    <header className="h-12 bg-zinc-950 border-b border-zinc-800/80 px-3 flex items-center justify-between select-none z-30 shrink-0 safe-pt">
      {/* Left: Close/Brand + Undo/Redo */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Torenno Brand Logo matching reference design */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-sm shadow-pink-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-xs tracking-tight text-white">
              Torenno
            </span>
            <span className="text-[8px] font-mono text-zinc-400">
              Video Editor
            </span>
          </div>
        </div>

        {/* Project Name Breadcrumb */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-400 ml-2 font-mono bg-zinc-900/80 px-2 py-0.5 rounded-md border border-zinc-800">
          <span>Projects</span>
          <span className="text-zinc-600">/</span>
          <span className="text-cyan-400 font-bold">{projectName || 'Youtube_post04.tn'}</span>
        </div>

        {/* Undo / Redo Mobile buttons */}
        <div className="flex items-center gap-0.5 ml-1 bg-zinc-900/90 rounded-lg p-0.5 border border-zinc-800/80">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
            className="p-1.5 rounded text-zinc-400 hover:text-white disabled:opacity-25 active:scale-90 transition-all"
          >
            <RotateCcw size={13} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
            className="p-1.5 rounded text-zinc-400 hover:text-white disabled:opacity-25 active:scale-90 transition-all"
          >
            <RotateCw size={13} />
          </button>
        </div>
      </div>

      {/* Center: Mobile Aspect Ratio Pill & Demo Menu */}
      <div className="flex items-center gap-1.5">
        <div className="relative">
          <button
            onClick={() => setShowAspectMenu(!showAspectMenu)}
            className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-200 font-semibold px-2.5 py-1 rounded-full transition-colors active:scale-95"
          >
            <Smartphone size={11} className="text-cyan-400" />
            <span>{aspectRatio}</span>
            <ChevronDown size={11} className="text-zinc-500" />
          </button>

          {showAspectMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowAspectMenu(false)} 
              />
              <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 w-48 bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl p-1 z-50">
                <div className="text-[9px] font-semibold uppercase text-zinc-400 px-2 py-1">
                  ক্যানভাস রেশিও
                </div>
                {aspectOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setAspectRatio(opt.value);
                      setShowAspectMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      aspectRatio === opt.value
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className="text-[10px] text-zinc-500">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Demo Video dropdown on mobile/tablet */}
        <div className="relative">
          <button
            onClick={() => setShowSampleMenu(!showSampleMenu)}
            className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 px-2 py-1 rounded-full active:scale-95 transition-colors"
            title="Demo videos"
          >
            <Sparkles size={11} className="text-amber-400" />
            <span className="hidden xs:inline">ডেমো</span>
          </button>

          {showSampleMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowSampleMenu(false)} 
              />
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-1.5 z-50 text-xs">
                <div className="text-[9px] text-zinc-400 px-2 py-0.5 uppercase font-bold">
                  টেস্ট ভিডিও
                </div>
                <button
                  onClick={() => {
                    onSelectSampleVideo(
                      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                      'City_Night_Neon.mp4'
                    );
                    setShowSampleMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-zinc-200 hover:bg-zinc-800"
                >
                  🌃 Urban Neon Lights
                </button>
                <button
                  onClick={() => {
                    onSelectSampleVideo(
                      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                      'Forest_Nature_Drone.mp4'
                    );
                    setShowSampleMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-zinc-200 hover:bg-zinc-800"
                >
                  🌲 Green Nature Drone
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right: Phone Simulation Toggle (on desktop) + Import + Export */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Toggle Phone Frame Mockup View (visible on desktop screens) */}
        <button
          onClick={() => setIsPhoneFrameMode(!isPhoneFrameMode)}
          className={`hidden md:flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
            isPhoneFrameMode
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
          }`}
          title="Toggle Mobile Phone Mockup View"
        >
          {isPhoneFrameMode ? <Smartphone size={12} /> : <Monitor size={12} />}
          <span>{isPhoneFrameMode ? 'মোবাইল মোড' : 'ফুল ভিউ'}</span>
        </button>

        {/* Import Media icon button */}
        <button
          onClick={onImportClick}
          className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs border border-zinc-800 flex items-center gap-1 active:scale-95 transition-all"
          title="Import video"
        >
          <Upload size={13} className="text-zinc-300" />
          <span className="hidden sm:inline text-[11px]">ইমপোর্ট</span>
        </button>

        {/* CapCut Gradient Export Button */}
        <button
          onClick={onExportClick}
          disabled={isProcessing}
          className="flex items-center gap-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs px-2.5 sm:px-3 py-1 sm:py-1 rounded-lg shadow-md shadow-cyan-500/20 active:scale-95 transition-all shrink-0"
        >
          <Download size={13} />
          <span>সেভ</span>
        </button>
      </div>
    </header>
  );
};

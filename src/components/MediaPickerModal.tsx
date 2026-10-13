import React from 'react';
import { 
  X, 
  FolderPlus, 
  Camera, 
  Sparkles, 
  Film, 
  Plus, 
  Check, 
  Smartphone 
} from 'lucide-react';
import { SAMPLE_VIDEOS } from '../constants/presets';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPickGallery: () => void;
  onPickCamera: () => void;
  onSelectSample: (url: string, name: string) => void;
  onNewBlankProject: () => void;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onPickGallery,
  onPickCamera,
  onSelectSample,
  onNewBlankProject,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in select-none">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-2xl p-4 shadow-2xl flex flex-col gap-3 animate-in slide-in-from-bottom-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Film size={15} />
            </div>
            <h3 className="font-bold text-sm text-white">নতুন ভিডিও যোগ করুন</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
          >
            <X size={15} />
          </button>
        </div>

        {/* Main 2 Big Action Cards for Mobile */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Gallery Pick */}
          <button
            onClick={() => {
              onPickGallery();
              onClose();
            }}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700/80 hover:border-cyan-500/60 flex flex-col items-center text-center gap-2 transition-all active:scale-95 shadow-lg group"
          >
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <FolderPlus size={22} />
            </div>
            <div>
              <span className="font-bold text-xs text-white block">মোবাইল গ্যালারি</span>
              <span className="text-[10px] text-zinc-400">মেমোরি থেকে ভিডিও</span>
            </div>
          </button>

          {/* Camera Record */}
          <button
            onClick={() => {
              onPickCamera();
              onClose();
            }}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700/80 hover:border-purple-500/60 flex flex-col items-center text-center gap-2 transition-all active:scale-95 shadow-lg group"
          >
            <div className="w-11 h-11 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <Camera size={22} />
            </div>
            <div>
              <span className="font-bold text-xs text-white block">ক্যামেরা রেকর্ড</span>
              <span className="text-[10px] text-zinc-400">সরাসরি শুট করুন</span>
            </div>
          </button>
        </div>

        {/* Quick Sample Footage Selection */}
        <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-semibold mb-2">
            <span className="flex items-center gap-1 text-cyan-300">
              <Sparkles size={12} className="text-amber-400" />
              টেস্ট ডেমো ফুটেজ (Sample Videos):
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {SAMPLE_VIDEOS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  onSelectSample(s.url, s.title + '.mp4');
                  onClose();
                }}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 text-left flex flex-col gap-1 active:scale-95 transition-all truncate"
              >
                <span className="text-[10px] font-bold text-zinc-200 truncate">{s.title.split(' ')[0]}</span>
                <span className="text-[8px] text-cyan-400">{s.category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Start Fresh Project */}
        <button
          onClick={() => {
            onNewBlankProject();
            onClose();
          }}
          className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Plus size={14} />
          <span>নতুন ব্ল্যাঙ্ক প্রজেক্ট (Start Fresh)</span>
        </button>
      </div>
    </div>
  );
};

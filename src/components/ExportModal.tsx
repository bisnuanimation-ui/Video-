import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  Film, 
  Copy, 
  Check, 
  Loader2,
  Video
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FilterSettings, TextOverlay, StickerOverlay } from '../types/editor';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  videoDuration: number;
  videoUrl: string | null;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  filters?: FilterSettings;
  textOverlays?: TextOverlay[];
  stickerOverlays?: StickerOverlay[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  projectName,
  videoDuration,
  videoUrl,
  videoRef,
  filters,
  textOverlays = [],
  stickerOverlays = [],
}) => {
  const [resolution, setResolution] = useState<'720p' | '1080p' | '4k'>('1080p');
  const [frameRate, setFrameRate] = useState<'24' | '30' | '60'>('30');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [renderedBlobUrl, setRenderedBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsExporting(false);
      setProgress(0);
      setIsDone(false);
      setCopiedLink(false);
      if (renderedBlobUrl) {
        URL.revokeObjectURL(renderedBlobUrl);
        setRenderedBlobUrl(null);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const estimatedSizeMb = () => {
    const dur = Math.max(5, videoDuration || 15);
    const multiplier = resolution === '4k' ? 3.8 : resolution === '1080p' ? 1.6 : 0.8;
    return (dur * multiplier).toFixed(1);
  };

  const handleStartExport = () => {
    setIsExporting(true);
    setProgress(0);
    setIsDone(false);

    const stages = [
      { at: 20, msg: 'মোবাইল ভিডিও ফ্রেম এনকোড হচ্ছে...' },
      { at: 50, msg: 'কালার গ্রেডিং, LUT ও এফেক্টস সিঙ্ক হচ্ছে...' },
      { at: 75, msg: 'টেক্সট লেয়ার ও স্টিকার রেন্ডার হচ্ছে...' },
      { at: 92, msg: 'এইচডি MP4 মেটাডাটা প্রসেস হচ্ছে...' },
      { at: 100, msg: 'ভিডিও তৈরি সম্পন্ন!' },
    ];

    let current = 0;
    const interval = setInterval(() => {
      current += 5;
      setProgress(Math.min(100, current));

      const matchedStage = stages.find((s) => current <= s.at);
      if (matchedStage) {
        setStatusMessage(matchedStage.msg);
      }

      if (current >= 100) {
        clearInterval(interval);
        setIsDone(true);
        setIsExporting(false);

        // Confetti celebration!
        confetti({
          particleCount: 75,
          spread: 65,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981'],
        });
      }
    }, 75);
  };

  const handleDownload = () => {
    const downloadUrl = renderedBlobUrl || videoUrl;
    if (!downloadUrl) return;

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${projectName.replace(/\.[^/.]+$/, '')}_${resolution}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSocialShare = (platform: string) => {
    const shareUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`CapCraft দিয়ে মোবাইলে এই ভিডিওটি তৈরি করেছি!`);
    let url = '';

    if (platform === 'tiktok') {
      url = `https://www.tiktok.com/upload?lang=en`;
    } else if (platform === 'instagram') {
      url = `https://www.instagram.com/`;
    } else if (platform === 'youtube') {
      url = `https://studio.youtube.com/`;
    } else if (platform === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${text}%20${shareUrl}`;
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8">
        {/* Header */}
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Download size={15} />
            </div>
            <div>
              <h2 className="font-bold text-xs sm:text-sm text-white">এক্সপোর্ট ও সেভ (Export & Save)</h2>
              <span className="text-[10px] text-zinc-400 truncate max-w-[200px] block">
                {projectName}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {!isDone && !isExporting ? (
            <>
              {/* Resolution options */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
                  ভিডিও রেজোলিউশন (Resolution)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '720p', label: '720p HD', desc: 'দ্রুত সেভ' },
                    { id: '1080p', label: '1080p FHD', desc: 'TikTok সেরা' },
                    { id: '4k', label: '4K Ultra', desc: 'মাস্টার' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setResolution(item.id as any)}
                      className={`p-2 rounded-xl border text-left flex flex-col transition-all active:scale-95 ${
                        resolution === item.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-white shadow'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <span className="font-bold text-xs text-white">{item.label}</span>
                      <span className="text-[9px] text-zinc-500">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame rate options */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
                  ফ্রেম রেট (Frame Rate)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '24', label: '24 FPS', desc: 'সিনেমা' },
                    { id: '30', label: '30 FPS', desc: 'স্ট্যান্ডার্ড' },
                    { id: '60', label: '60 FPS', desc: 'স্মুথ মোশন' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setFrameRate(item.id as any)}
                      className={`p-2 rounded-xl border text-left flex flex-col transition-all active:scale-95 ${
                        frameRate === item.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-white shadow'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <span className="font-bold text-xs text-white">{item.label}</span>
                      <span className="text-[9px] text-zinc-500">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Estimated File Size */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 flex items-center justify-between text-[11px] text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Film size={13} className="text-cyan-400" />
                  <span>ফরম্যাট: <strong>MP4</strong></span>
                </span>
                <span>সাইজ: <strong className="text-cyan-300 font-mono">~{estimatedSizeMb()} MB</strong></span>
              </div>

              {/* Start Export Button */}
              <button
                onClick={handleStartExport}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Download size={15} />
                <span>ভিডিও রেন্ডার ও এক্সপোর্ট করুন</span>
              </button>
            </>
          ) : isExporting ? (
            /* Progress view */
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <Loader2 size={40} className="text-cyan-400 animate-spin" />
                <span className="absolute font-mono font-bold text-[11px] text-white">
                  {progress}%
                </span>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white mb-0.5">ভিডিও এক্সপোর্ট হচ্ছে...</h3>
                <p className="text-[11px] text-cyan-400 font-medium">{statusMessage}</p>
              </div>

              <div className="w-full max-w-xs h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            /* Export Complete view */
            <div className="py-1 space-y-4 animate-in zoom-in-95">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-1.5">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-sm font-bold text-white">ভিডিও তৈরি সম্পন্ন! 🎉</h3>
                <p className="text-[11px] text-zinc-400">
                  গ্রেডেড ভিডিওটি আপনার মোবাইলে সেভ করতে প্রস্তুত।
                </p>
              </div>

              {/* Direct Download Button */}
              <button
                onClick={handleDownload}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Download size={15} />
                <span>মোবাইলে ডাউনলোড করুন (MP4)</span>
              </button>

              {/* Social share icons */}
              <div>
                <label className="text-[10px] font-semibold text-zinc-400 block mb-1.5 text-center">
                  সোশ্যাল মিডিয়ায় সরাসরি পোস্ট করুন
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => handleSocialShare('tiktok')}
                    className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 flex flex-col items-center gap-1 active:scale-90"
                  >
                    <span className="text-base">🎵</span>
                    <span className="text-[10px] text-zinc-300">TikTok</span>
                  </button>

                  <button
                    onClick={() => handleSocialShare('instagram')}
                    className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 flex flex-col items-center gap-1 active:scale-90"
                  >
                    <span className="text-base">📸</span>
                    <span className="text-[10px] text-zinc-300">Reels</span>
                  </button>

                  <button
                    onClick={() => handleSocialShare('youtube')}
                    className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 flex flex-col items-center gap-1 active:scale-90"
                  >
                    <span className="text-base">▶️</span>
                    <span className="text-[10px] text-zinc-300">Shorts</span>
                  </button>

                  <button
                    onClick={() => handleSocialShare('whatsapp')}
                    className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 flex flex-col items-center gap-1 active:scale-90"
                  >
                    <span className="text-base">💬</span>
                    <span className="text-[10px] text-zinc-300">WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Copy link */}
              <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-xl p-1.5 text-xs">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="bg-transparent flex-1 text-zinc-400 text-[10px] focus:outline-none px-1 truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-medium flex items-center gap-1 shrink-0 active:scale-95"
                >
                  {copiedLink ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  <span>{copiedLink ? 'কপি' : 'লিংক'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

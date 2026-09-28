import React from 'react';
import { AspectRatio } from '../types';
import { Heart, MessageCircle, Bookmark, Share2, Disc3, Music2 } from 'lucide-react';

interface Props {
  aspectRatio: AspectRatio;
  show: boolean;
}

export const SafeZoneOverlay: React.FC<Props> = ({ aspectRatio, show }) => {
  if (!show) return null;

  if (aspectRatio === '9:16') {
    return (
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 overflow-hidden border border-red-500/20">
        {/* Top Header Mockup */}
        <div className="flex items-center justify-between text-white/40 text-xs px-2 pt-2 border-b border-white/5 pb-2">
          <div className="flex space-x-4 mx-auto font-medium tracking-wide">
            <span>Đang Follow</span>
            <span className="text-white/80 font-bold border-b-2 border-white pb-0.5">Dành cho bạn</span>
          </div>
        </div>

        {/* Center Safe Box Guide */}
        <div className="absolute inset-x-8 top-[18%] bottom-[25%] border border-dashed border-emerald-400/40 rounded-lg flex items-center justify-center">
          <span className="absolute top-2 left-2 text-[10px] tracking-wider text-emerald-400/60 uppercase font-mono bg-black/60 px-1.5 py-0.5 rounded">
            Safe Zone (Vùng chữ hiển thị đẹp)
          </span>
        </div>

        {/* Right Action Icons Mockup */}
        <div className="absolute right-3 bottom-24 flex flex-col items-center space-y-4 text-white/50">
          <div className="w-10 h-10 rounded-full border border-white/30 bg-zinc-800/80 flex items-center justify-center text-[10px]">
            Avatar
          </div>
          <div className="flex flex-col items-center">
            <Heart size={24} className="text-white/60" />
            <span className="text-[10px] mt-0.5">88.5K</span>
          </div>
          <div className="flex flex-col items-center">
            <MessageCircle size={24} className="text-white/60" />
            <span className="text-[10px] mt-0.5">1.2K</span>
          </div>
          <div className="flex flex-col items-center">
            <Bookmark size={24} className="text-white/60" />
            <span className="text-[10px] mt-0.5">5.4K</span>
          </div>
          <div className="flex flex-col items-center">
            <Share2 size={24} className="text-white/60" />
            <span className="text-[10px] mt-0.5">Share</span>
          </div>
          <div className="animate-spin duration-3000">
            <Disc3 size={24} className="text-white/60" />
          </div>
        </div>

        {/* Bottom Captions & Audio Mockup */}
        <div className="space-y-1.5 pr-16 pl-2 pb-2 text-white/60">
          <div className="font-semibold text-xs text-white/90">@artist.official</div>
          <div className="text-[11px] text-zinc-400 line-clamp-2">
            Bài hát mới sáng tác tối qua, hy vọng chạm đến trái tim bạn... #sfumato #lyrics #indie
          </div>
          <div className="flex items-center text-[10px] space-x-1.5 text-zinc-400 pt-1">
            <Music2 size={12} />
            <span className="truncate">Âm thanh gốc - Artist Official</span>
          </div>
        </div>
      </div>
    );
  }

  // 1:1 Safe zone
  if (aspectRatio === '1:1') {
    return (
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-center items-center p-6">
        <div className="w-[85%] h-[85%] border border-dashed border-emerald-400/40 rounded-lg flex items-center justify-center relative">
          <span className="absolute top-2 left-2 text-[10px] tracking-wider text-emerald-400/60 uppercase font-mono bg-black/60 px-1.5 py-0.5 rounded">
            Safe Zone (1:1 Square)
          </span>
        </div>
      </div>
    );
  }

  // 16:9 Safe zone
  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-center items-center p-6">
      <div className="w-[85%] h-[75%] border border-dashed border-emerald-400/40 rounded-lg flex items-center justify-center relative">
        <span className="absolute top-2 left-2 text-[10px] tracking-wider text-emerald-400/60 uppercase font-mono bg-black/60 px-1.5 py-0.5 rounded">
          Safe Zone (16:9 Cinema)
        </span>
      </div>
    </div>
  );
};

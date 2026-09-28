import React from 'react';
import { AspectRatio } from '../types';

interface Props {
  aspectRatio: AspectRatio;
  show: boolean;
}

export const SafeZoneOverlay: React.FC<Props> = ({ aspectRatio, show }) => {
  if (!show) return null;

  if (aspectRatio === '9:16') {
    return (
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 overflow-hidden border border-red-500/20">
        {/* Top Danger Zone Indicator */}
        <div 
          className="absolute inset-x-0 top-0 bg-red-500/5 border-b border-dashed border-red-500/20 flex items-center justify-center text-[10px] text-red-400/60 font-mono"
          style={{ height: '11.46%' }}
        >
          <span>▲ Mép trên 220px</span>
        </div>

        {/* Bottom Danger Zone Indicator */}
        <div 
          className="absolute inset-x-0 bottom-0 bg-red-500/5 border-t border-dashed border-red-500/20 flex items-center justify-center text-[10px] text-red-400/60 font-mono"
          style={{ height: '14.58%' }}
        >
          <span>▼ Mép dưới 280px</span>
        </div>

        {/* Center Safe Box Guide (Chuẩn 960 × 1420 px trên khung 1080 × 1920) */}
        <div 
          className="absolute border-2 border-dashed border-emerald-400/60 rounded-xl flex flex-col justify-between p-2 pointer-events-none shadow-[0_0_20px_rgba(52,211,153,0.1)]"
          style={{
            top: '11.46%',    // 220px / 1920px
            bottom: '14.58%', // 280px / 1920px
            left: '5.56%',    // 60px / 1080px
            right: '5.56%',   // 60px / 1080px
          }}
        >
          <div className="flex justify-between items-center">
            <span className="text-[9px] tracking-wider text-emerald-400 font-bold uppercase font-mono bg-black/80 px-2 py-0.5 rounded border border-emerald-500/30">
              SAFE ZONE • 960 × 1420 px
            </span>
            <span className="text-[8px] font-mono text-emerald-400/80 bg-black/70 px-1.5 py-0.5 rounded">
              L/R: 60px
            </span>
          </div>
          <div className="text-right">
            <span className="text-[8px] font-mono text-emerald-400/60 bg-black/70 px-1.5 py-0.5 rounded">
              1080 × 1920 (9:16)
            </span>
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

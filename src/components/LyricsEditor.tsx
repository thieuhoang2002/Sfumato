import React, { useState } from 'react';
import { LyricLine } from '../types';
import { formatTime, parseLyricsText } from '../utils/formatters';
import { 
  FileText, Clock, Trash2, Edit3, Check, X, Plus, 
  Sparkles, RefreshCw, AlertTriangle, Layers, Radio, Link2
} from 'lucide-react';

interface Props {
  lyrics: LyricLine[];
  currentTime: number;
  currentSyncIndex: number;
  isSyncing: boolean;
  spaceAction: 'create_new' | 'sync_existing';
  onSetSpaceAction: (action: 'create_new' | 'sync_existing') => void;
  onUpdateLyrics: (lines: LyricLine[]) => void;
  onSeek: (time: number) => void;
  onSetSyncIndex: (index: number) => void;
  onToggleSyncMode: () => void;
  onStampLine: (index: number, time: number) => void;
  onAddNewLine: (time?: number) => void;
  onDeleteLine: (id: string) => void;
  onEditLineText: (id: string, text: string) => void;
  onClearAll: () => void;
  onChainLyrics: () => void;
}

const SAMPLE_LYRICS = `Đêm buông xuống thành phố không còn ai
Nét cọ ai vừa vẽ vết khói dài
Lời thì thầm tan biến trong hư không
Để lại khoảng lặng mênh mông...
Giữ trọn từng nét chữ của riêng mình
Sfumato - chuyển động của tâm linh.`;

export const LyricsEditor: React.FC<Props> = ({
  lyrics,
  currentTime,
  currentSyncIndex,
  isSyncing,
  spaceAction,
  onSetSpaceAction,
  onUpdateLyrics,
  onSeek,
  onSetSyncIndex,
  onToggleSyncMode,
  onStampLine,
  onAddNewLine,
  onDeleteLine,
  onEditLineText,
  onClearAll,
  onChainLyrics,
}) => {
  const [inputText, setInputText] = useState('');
  const [isEditingRaw, setIsEditingRaw] = useState(false);
  const [editingLineId, setEditingLineId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleApplyText = () => {
    if (!inputText.trim()) return;
    const parsed = parseLyricsText(inputText);
    onUpdateLyrics(parsed);
    setIsEditingRaw(false);
  };

  const handleLoadSample = () => {
    setInputText(SAMPLE_LYRICS);
    const parsed = parseLyricsText(SAMPLE_LYRICS);
    const withTimings = parsed.map((item, idx) => ({
      ...item,
      startTime: idx * 3.8,
      endTime: idx * 3.8 + 3.4,
      synced: true,
    }));
    onUpdateLyrics(withTimings);
  };

  const startEditLine = (line: LyricLine) => {
    setEditingLineId(line.id);
    setEditingText(line.text);
  };

  const saveEditLine = (id: string) => {
    onEditLineText(id, editingText);
    setEditingLineId(null);
  };

  const cancelEditLine = () => {
    setEditingLineId(null);
  };

  const adjustTiming = (index: number, field: 'start' | 'end', delta: number) => {
    const next = [...lyrics];
    const item = next[index];
    if (field === 'start') {
      item.startTime = Math.max(0, parseFloat((item.startTime + delta).toFixed(2)));
      if (item.endTime <= item.startTime) {
        item.endTime = item.startTime + 0.5;
      }
    } else {
      item.endTime = Math.max(item.startTime + 0.2, parseFloat((item.endTime + delta).toFixed(2)));
    }
    onUpdateLyrics(next);
  };

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 overflow-hidden text-xs">
      {/* Editor Header */}
      <div className="p-3.5 border-b border-zinc-900 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText size={16} className="text-zinc-400" />
          <h2 className="font-semibold text-zinc-200">Lyrics Studio</h2>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            {lyrics.length} câu
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {lyrics.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Bạn có chắc muốn xóa tất cả lyrics để bắt đầu mới?')) {
                  onClearAll();
                }
              }}
              title="Xóa tất cả lyrics"
              className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-900/50 transition"
            >
              <Trash2 size={13} />
            </button>
          )}

          <button
            onClick={() => setIsEditingRaw(!isEditingRaw)}
            className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
          >
            {isEditingRaw ? 'Quay lại' : 'Dán toàn bài'}
          </button>
        </div>
      </div>

      {/* Sync Mode Control Bar */}
      <div className="p-3 bg-zinc-900/70 border-b border-zinc-900 flex flex-col space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isSyncing ? 'bg-emerald-400 animate-ping' : 'bg-zinc-600'}`} />
            <span className="font-medium text-zinc-200 text-xs">
              {isSyncing ? 'Đang Bắt Nhịp Tap-to-Sync' : 'Chế độ gõ nhịp Space'}
            </span>
          </div>

          <button
            onClick={onToggleSyncMode}
            className={`px-3 py-1.5 rounded-lg font-semibold transition text-xs flex items-center space-x-1.5 ${
              isSyncing
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950 ring-1 ring-emerald-400'
                : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            <span>{isSyncing ? 'Dừng Sync' : 'Bật Tap-to-Sync'}</span>
          </button>
        </div>

        {/* Spacebar Action Selector */}
        <div className="flex items-center bg-black/50 p-1 rounded-lg border border-zinc-800 text-[11px]">
          <button
            onClick={() => onSetSpaceAction('create_new')}
            className={`flex-1 py-1 rounded transition text-center flex items-center justify-center space-x-1 ${
              spaceAction === 'create_new'
                ? 'bg-zinc-800 text-white font-medium shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Mỗi lần bấm Space sẽ tạo ngay 1 ô lyrics mới tại giây đang phát"
          >
            <Plus size={12} />
            <span>Space: Tạo ô mới</span>
          </button>

          <button
            onClick={() => onSetSpaceAction('sync_existing')}
            className={`flex-1 py-1 rounded transition text-center flex items-center justify-center space-x-1 ${
              spaceAction === 'sync_existing'
                ? 'bg-zinc-800 text-white font-medium shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Gõ Space để khớp mốc lần lượt cho danh sách câu đã dán"
          >
            <Clock size={12} />
            <span>Space: Khớp câu có sẵn</span>
          </button>
        </div>

        {/* Action Buttons: Quick Add & Chain Seamless */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onAddNewLine(currentTime)}
            className="py-1.5 px-2.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-200 hover:text-white transition flex items-center justify-center space-x-1.5 text-[11px] shadow-sm active:scale-[0.99]"
          >
            <Plus size={13} className="text-emerald-400" />
            <span>Thêm ô ({formatTime(currentTime)})</span>
          </button>

          <button
            onClick={onChainLyrics}
            title="Tự động kéo dài thời lượng câu trước tới tận khi câu sau xuất hiện (liền mạch 100%)"
            className="py-1.5 px-2.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 hover:text-white transition flex items-center justify-center space-x-1 text-[11px] shadow-sm active:scale-[0.99]"
          >
            <Link2 size={12} />
            <span>Nối liền các câu</span>
          </button>
        </div>
      </div>

      {/* Main Content: Lyrics list or Paste textarea */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isEditingRaw ? (
          <div className="flex flex-col h-full space-y-3">
            <div className="text-zinc-400 text-xs">
              Dán toàn bộ lời bài hát (mỗi dòng là một câu, hỗ trợ 100% tiếng Việt Unicode):
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Dán lời bài hát vào đây...&#10;Dòng 1&#10;Dòng 2&#10;Dòng 3..."
              className="flex-1 min-h-[220px] bg-zinc-900/80 border border-zinc-800 rounded-lg p-3 text-zinc-100 font-sans focus:outline-none focus:border-zinc-600 resize-none leading-relaxed"
            />
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleLoadSample}
                className="text-zinc-400 hover:text-zinc-200 text-xs flex items-center space-x-1 underline underline-offset-4"
              >
                <Sparkles size={12} />
                <span>Nạp lời mẫu</span>
              </button>
              <button
                onClick={handleApplyText}
                className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition"
              >
                Tạo danh sách
              </button>
            </div>
          </div>
        ) : lyrics.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <Plus size={22} />
            </div>
            <div>
              <div className="text-zinc-200 font-medium text-sm">Chưa có ô lyrics nào</div>
              <p className="text-zinc-500 text-xs mt-1 max-w-[240px]">
                Bật nhạc và bấm <b>Space</b> để tạo ô lyrics theo nhịp, hoặc bấm nút bên dưới:
              </p>
            </div>
            <div className="flex flex-col space-y-2 w-full max-w-[220px]">
              <button
                onClick={() => onAddNewLine(currentTime)}
                className="w-full py-2 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition text-xs flex items-center justify-center space-x-1.5"
              >
                <Plus size={14} />
                <span>Tạo ô lyrics đầu tiên</span>
              </button>
              <button
                onClick={handleLoadSample}
                className="w-full py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition text-xs flex items-center justify-center space-x-1.5"
              >
                <Sparkles size={13} />
                <span>Nạp lời bài hát mẫu</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {lyrics.map((line, idx) => {
              const isCurrent = idx === currentSyncIndex;
              const isPlayingLine =
                currentTime >= line.startTime && currentTime <= (line.endTime || line.startTime + 3);
              const isEditing = editingLineId === line.id;

              return (
                <div
                  key={line.id}
                  className={`p-3 rounded-xl border transition-all text-xs flex flex-col space-y-2 ${
                    isCurrent && isSyncing
                      ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/30'
                      : isPlayingLine
                      ? 'bg-zinc-850 border-zinc-600 text-white shadow-sm'
                      : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {/* Top line metadata & action buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] text-zinc-500 bg-black/40 px-1.5 py-0.5 rounded border border-zinc-800">
                        #{idx + 1}
                      </span>

                      {line.synced ? (
                        <button
                          onClick={() => onSeek(line.startTime)}
                          className="font-mono text-[11px] text-emerald-400 hover:underline flex items-center space-x-1"
                          title="Bấm để phát tại mốc này"
                        >
                          <Clock size={11} />
                          <span>{formatTime(line.startTime)} → {formatTime(line.endTime)}</span>
                        </button>
                      ) : (
                        <span className="font-mono text-[10px] text-zinc-600">Chưa đặt nhịp</span>
                      )}
                    </div>

                    {/* Action buttons: Edit, Stamp, Delete */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onStampLine(idx, currentTime)}
                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[10px] transition"
                        title="Gán thời gian hiện tại cho câu này"
                      >
                        Stamp
                      </button>

                      <button
                        onClick={() => (isEditing ? saveEditLine(line.id) : startEditLine(line))}
                        className={`p-1 rounded transition ${
                          isEditing
                            ? 'bg-emerald-600 text-white'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white'
                        }`}
                        title={isEditing ? 'Lưu chỉnh sửa' : 'Sửa lời câu này'}
                      >
                        {isEditing ? <Check size={12} /> : <Edit3 size={12} />}
                      </button>

                      {isEditing && (
                        <button
                          onClick={cancelEditLine}
                          className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
                          title="Hủy"
                        >
                          <X size={12} />
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteLine(line.id)}
                        className="p-1 rounded bg-zinc-800 hover:bg-red-950/50 text-zinc-400 hover:text-red-400 transition"
                        title="Xóa ô này"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Text display / Inline Edit */}
                  {isEditing ? (
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEditLine(line.id);
                          if (e.key === 'Escape') cancelEditLine();
                        }}
                        autoFocus
                        placeholder="Nhập lời bài hát (tiếng Việt có dấu)..."
                        className="w-full bg-black border border-emerald-500/70 rounded-lg px-2.5 py-1.5 text-white font-sans text-xs focus:outline-none"
                      />
                      <div className="text-[10px] text-zinc-500 flex justify-between">
                        <span>Nhấn Enter để lưu • Esc để hủy</span>
                        <button
                          onClick={() => saveEditLine(line.id)}
                          className="text-emerald-400 hover:underline"
                        >
                          Lưu ngay
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDoubleClick={() => startEditLine(line)}
                      onClick={() => {
                        onSetSyncIndex(idx);
                        if (line.synced) onSeek(line.startTime);
                      }}
                      className="font-medium text-zinc-200 cursor-pointer text-sm leading-snug hover:text-white group flex items-center justify-between"
                      title="Click đúp để sửa lời"
                    >
                      <span className={line.text ? '' : 'italic text-zinc-600'}>
                        {line.text || '(Chưa có lời - Click đúp để nhập)'}
                      </span>
                      <Edit3 size={11} className="opacity-0 group-hover:opacity-60 text-zinc-400 transition" />
                    </div>
                  )}

                  {/* Fine tune start / end times */}
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/50 text-[10px] text-zinc-500 font-mono">
                    <div className="flex items-center space-x-1">
                      <span>Bắt đầu:</span>
                      <button
                        onClick={() => adjustTiming(idx, 'start', -0.1)}
                        className="px-1 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                      >
                        -0.1s
                      </button>
                      <button
                        onClick={() => adjustTiming(idx, 'start', 0.1)}
                        className="px-1 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                      >
                        +0.1s
                      </button>
                    </div>

                    <div className="flex items-center space-x-1">
                      <span>Kết thúc:</span>
                      <button
                        onClick={() => adjustTiming(idx, 'end', -0.1)}
                        className="px-1 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                      >
                        -0.1s
                      </button>
                      <button
                        onClick={() => adjustTiming(idx, 'end', 0.1)}
                        className="px-1 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                      >
                        +0.1s
                      </button>

                      {idx < lyrics.length - 1 && (
                        <button
                          onClick={() => {
                            const next = lyrics[idx + 1];
                            if (next) {
                              const updated = [...lyrics];
                              updated[idx].endTime = next.startTime;
                              onUpdateLyrics(updated);
                            }
                          }}
                          className="px-1.5 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 hover:text-white"
                          title="Kéo dài kết thúc câu này tới lúc câu sau xuất hiện"
                        >
                          Nối câu sau
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="p-3 border-t border-zinc-900 bg-zinc-950/80 flex items-center justify-between text-zinc-500 text-[11px]">
        <button
          onClick={() => onAddNewLine(currentTime)}
          className="text-zinc-300 hover:text-white flex items-center space-x-1 transition"
        >
          <Plus size={13} className="text-emerald-400" />
          <span>Thêm ô mới</span>
        </button>

        <button
          onClick={handleLoadSample}
          className="text-zinc-400 hover:text-white flex items-center space-x-1 transition"
        >
          <RefreshCw size={11} />
          <span>Nạp lại mẫu</span>
        </button>
      </div>
    </div>
  );
};

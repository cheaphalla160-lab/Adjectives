import React, { useState, useEffect } from 'react';
import { bgm } from '../utils/audio';
import { Music, Volume2, VolumeX, Play, Pause, Disc3, Sparkles } from 'lucide-react';

export const AudioPlayerBar: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.25);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const tracks = bgm.getTracks();

  useEffect(() => {
    // Keep in sync with bgm player
    setIsPlaying(bgm.getIsPlaying());
    setIsMuted(bgm.getIsMuted());
    setVolume(bgm.getVolume());
    setCurrentTrack(bgm.getCurrentTrackIndex());
  }, []);

  const handleTogglePlay = () => {
    const active = bgm.toggle();
    setIsPlaying(active);
    bgm.playSfx('pop');
  };

  const handleToggleMute = () => {
    const muted = bgm.toggleMute();
    setIsMuted(muted);
    bgm.playSfx('pop');
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    bgm.setVolume(val);
    if (val > 0 && isMuted) {
      bgm.toggleMute();
      setIsMuted(false);
    }
  };

  const handleSelectTrack = (idx: number) => {
    bgm.switchTrack(idx);
    setCurrentTrack(idx);
    if (!isPlaying) {
      bgm.start();
      setIsPlaying(true);
    }
    bgm.playSfx('pop');
    setIsOpenMenu(false);
  };

  return (
    <div className="relative inline-flex items-center gap-2 bg-amber-100/90 hover:bg-amber-100 border border-amber-200/80 rounded-full px-3 py-1.5 shadow-sm transition-all text-xs text-amber-900 font-medium">
      {/* Play/Pause Button */}
      <button
        onClick={handleTogglePlay}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold transition-all shadow-xs ${
          isPlaying
            ? 'bg-amber-500 text-white hover:bg-amber-600'
            : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'
        }`}
        title={isPlaying ? '暂停轻松背景音乐' : '播放轻松欢快背景音乐'}
      >
        {isPlaying ? (
          <>
            <Pause className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">音乐中</span>
            <span className="inline-flex gap-0.5 items-end h-3 ml-0.5">
              <span className="w-1 bg-white h-2 animate-bounce rounded-full" />
              <span className="w-1 bg-white h-3 animate-bounce [animation-delay:0.15s] rounded-full" />
              <span className="w-1 bg-white h-1.5 animate-bounce [animation-delay:0.3s] rounded-full" />
            </span>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="whitespace-nowrap">开音乐</span>
          </>
        )}
      </button>

      {/* Track info button */}
      <button
        onClick={() => setIsOpenMenu(!isOpenMenu)}
        className="hidden sm:flex items-center gap-1 hover:text-amber-950 px-1 py-0.5 rounded transition-colors whitespace-nowrap"
        title="选择不同的欢快背景乐曲"
      >
        <Music className="w-3.5 h-3.5 text-amber-600" />
        <span className="max-w-[110px] truncate">{tracks[currentTrack]?.name || '背景音乐'}</span>
      </button>

      {/* Mute button */}
      <button
        onClick={handleToggleMute}
        className="p-1 hover:bg-amber-200/60 rounded-full text-amber-700 transition-colors"
        title={isMuted ? '取消静音' : '静音'}
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>

      {/* Volume slider (hidden on smallest screens) */}
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={isMuted ? 0 : volume}
        onChange={handleVolumeChange}
        className="w-14 sm:w-18 accent-amber-500 h-1.5 bg-amber-200 rounded-lg cursor-pointer"
        title="调节背景音乐音量"
      />

      {/* Dropdown Menu for Track Selection */}
      {isOpenMenu && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-amber-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-amber-800 border-b border-amber-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>切换可爱童趣曲目</span>
          </div>
          <div className="mt-1 space-y-1">
            {tracks.map((track) => (
              <button
                key={track.id}
                onClick={() => handleSelectTrack(track.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  currentTrack === track.id
                    ? 'bg-amber-100 text-amber-900 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="truncate">{track.name}</span>
                {currentTrack === track.id && <Disc3 className="w-3.5 h-3.5 text-amber-600 animate-spin" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

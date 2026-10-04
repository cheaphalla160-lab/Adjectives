import React from 'react';
import { GameMode } from '../types/game';
import { AudioPlayerBar } from './AudioPlayerBar';
import { Maximize2, Minimize2 } from 'lucide-react';

interface NavbarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentMode, onSelectMode }) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const navItems: { id: GameMode; label: string; icon: string }[] = [
    { id: 'detective', label: '小神探破案', icon: '🕵️‍♂️' },
    { id: 'avatar_lab', label: '奇妙捏脸工坊', icon: '🎨' },
    { id: 'flashcards', label: '单词图鉴诵读', icon: '📖' },
    { id: 'word_pop', label: '词汇消消乐', icon: '🎈' },
    { id: 'teacher_toolkit', label: '教师备课PK台', icon: '👩‍🏫' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectMode('detective')}
          className="text-left font-fun text-xl sm:text-2xl font-bold tracking-tight text-amber-900 flex items-center gap-2 group cursor-pointer"
        >
          <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">✨</span>
          <span>Look & Describe 英语大冒险</span>
        </button>

        {/* Zone 2: Navigation Links (interactive segmented buttons) */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 bg-amber-100/60 rounded-xl border border-amber-200/60">
          {navItems.map((item) => {
            const isActive = currentMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectMode(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-amber-900 shadow-xs scale-102 font-bold'
                    : 'text-amber-800/80 hover:text-amber-900 hover:bg-white/50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions (BGM Engine + Classroom Fullscreen) */}
        <div className="flex items-center gap-2 shrink-0">
          <AudioPlayerBar />
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-amber-100/80 text-amber-800 rounded-full transition-colors hidden sm:flex items-center justify-center border border-amber-200/70"
            title={isFullscreen ? '退出全屏' : '全屏教室投影'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav bar row */}
      <div className="flex md:hidden items-center gap-1 overflow-x-auto py-1 mt-2 -mx-2 px-2 scrollbar-none">
        {navItems.map((item) => {
          const isActive = currentMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectMode(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-white font-bold'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

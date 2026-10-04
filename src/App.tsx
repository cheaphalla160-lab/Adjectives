import React, { useState, useEffect } from 'react';
import { GameMode, TargetWord } from './types/game';
import { VOCABULARY_LIST } from './data/vocabulary';
import { Navbar } from './components/Navbar';
import { DetectiveGame } from './components/modes/DetectiveGame';
import { AvatarLab } from './components/modes/AvatarLab';
import { FlashcardsView } from './components/modes/FlashcardsView';
import { WordPopGame } from './components/modes/WordPopGame';
import { TeacherToolkit } from './components/modes/TeacherToolkit';
import { bgm, speakWord } from './utils/audio';
import {
  Volume2,
  Sparkles,
  Music,
  Compass,
  Smile,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';

import heroSceneImg from './assets/images/detective_hero_scene_1791094212100.jpg';
import avatarBlondeGirlImg from './assets/images/avatar_blonde_girl_1791094260917.jpg';
import badgeIconImg from './assets/images/avatar_detective_badge_1791094276604.jpg';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('detective');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [bgmPromptDismissed, setBgmPromptDismissed] = useState(false);

  // Prompt to enable cheerful background music on initial load
  const handleStartMusic = () => {
    bgm.start();
    setHasInteracted(true);
    setBgmPromptDismissed(true);
  };

  const handleDismissBgmPrompt = () => {
    setBgmPromptDismissed(true);
    setHasInteracted(true);
  };

  const handleSelectWord = (wordId: TargetWord) => {
    bgm.playSfx('pop');
    speakWord(wordId);
    setCurrentMode('flashcards');
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-slate-800 flex flex-col font-sans selection:bg-amber-200">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar currentMode={currentMode} onSelectMode={setCurrentMode} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Cheerful BGM Welcome Banner (shown until user interacts or dismisses) */}
        {!bgmPromptDismissed && (
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-white p-4 sm:p-5 rounded-3xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xs rounded-2xl flex items-center justify-center text-2xl shrink-0">
                🎵
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-fun">
                  欢迎来到英语外貌特征大冒险！开启背景音乐吗？
                </h3>
                <p className="text-xs text-amber-100 mt-0.5">
                  为小学生量身配设了欢快轻松的童趣背景旋律，让课堂与自学更具趣味与沉浸感！
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleStartMusic}
                className="px-4 py-2 bg-white text-amber-800 hover:bg-amber-50 font-fun font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Music className="w-4 h-4 text-amber-600" />
                <span>开启轻松背景音乐</span>
              </button>
              <button
                onClick={handleDismissBgmPrompt}
                className="px-3 py-2 bg-black/10 hover:bg-black/20 text-white font-bold text-xs rounded-xl transition-colors"
              >
                稍后再说
              </button>
            </div>
          </div>
        )}

        {/* Hero Visual Kicker for Detective / General App intro (Only on top of Detective Mode) */}
        {currentMode === 'detective' && (
          <div className="relative rounded-3xl overflow-hidden shadow-md border-2 border-amber-200/90 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-12 items-center">
              {/* Left Column: Story Description */}
              <div className="md:col-span-7 p-6 sm:p-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 rounded-full text-xs font-bold text-amber-900">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                  <span>小学英语 PEP / 剑桥少儿·外貌特征专项</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold font-fun text-slate-900 tracking-tight leading-tight">
                  外貌特征大侦探：<span className="text-amber-600">小神探破案记</span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                  小镇上来了一群神秘居民！通过倾听与阅读英语线索，迅速锁定拥有
                  <span className="font-bold text-amber-700"> short, thin, straight, blonde, moustache, beard, fat, fair, ugly </span>
                  特征的目标嫌疑人，成为王牌小侦探吧！
                </p>

                {/* Quick Word Badges */}
                <div className="pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    9大核心词汇点读:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {VOCABULARY_LIST.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => handleSelectWord(v.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg text-xs font-semibold text-slate-700 hover:text-amber-900 transition-colors shadow-2xs"
                        title={`点击朗读 ${v.word} (${v.chinese})`}
                      >
                        <span>{v.cuteEmoji}</span>
                        <span>{v.word}</span>
                        <Volume2 className="w-3 h-3 text-amber-500" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Scene Illustration */}
              <div className="md:col-span-5 relative h-64 md:h-full min-h-[220px] overflow-hidden bg-amber-50">
                <img
                  src={heroSceneImg}
                  alt="Cute cartoon detective dog holding a magnifying glass in a sunny classroom"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-white via-transparent to-transparent opacity-60 md:opacity-40" />

                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-amber-200 shadow-xs flex items-center gap-2">
                  <img
                    src={badgeIconImg}
                    alt="Badge"
                    className="w-5 h-5 rounded-full object-contain"
                  />
                  <span className="text-xs font-bold text-amber-900">王牌侦探徽章已激活</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE GAME MODE STAGE */}
        <section aria-label="Game Stage">
          {currentMode === 'detective' && <DetectiveGame />}
          {currentMode === 'avatar_lab' && <AvatarLab />}
          {currentMode === 'flashcards' && <FlashcardsView />}
          {currentMode === 'word_pop' && <WordPopGame />}
          {currentMode === 'teacher_toolkit' && <TeacherToolkit />}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-amber-200 bg-white/90 py-8 px-4 sm:px-8 text-center text-xs text-slate-500 space-y-2">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-fun font-bold text-amber-900 text-sm">
            <span>✨</span>
            <span>Kids English: Look & Describe 英语外貌特征大冒险</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600">
            <span>🎯 核心词: short, thin, straight, blonde, moustache, beard, fat, fair, ugly</span>
            <span>·</span>
            <span>🎵 Web Audio 自主童趣合成器</span>
            <span>·</span>
            <span>🗣️ Web Speech 原生标准童声发音</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400">
          专为小学英语教师备课、课堂互动白板多媒体投影与少儿自主探索打造。
        </p>
      </footer>
    </div>
  );
}

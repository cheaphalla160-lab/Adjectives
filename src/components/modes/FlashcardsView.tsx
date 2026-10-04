import React, { useState } from 'react';
import { VOCABULARY_LIST, CATEGORY_MAP } from '../../data/vocabulary';
import { TargetWord, VocabularyItem } from '../../types/game';
import { CuteCharacterAvatar } from '../CuteCharacterAvatar';
import { bgm, speakWord } from '../../utils/audio';
import { Volume2, Sparkles, BookOpen, Star, Repeat, Check } from 'lucide-react';

export const FlashcardsView: React.FC = () => {
  const [selectedWordId, setSelectedWordId] = useState<TargetWord>('short');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [readStars, setReadStars] = useState<Record<string, number>>({});
  const [speechRate, setSpeechRate] = useState<number>(0.85);

  const selectedWord = VOCABULARY_LIST.find((item) => item.id === selectedWordId) || VOCABULARY_LIST[0];

  const filteredList = VOCABULARY_LIST.filter((item) => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  const handleWordClick = (word: VocabularyItem) => {
    setSelectedWordId(word.id);
    bgm.playSfx('pop');
    speakWord(word.word, speechRate);
  };

  const handleReadChant = () => {
    bgm.playSfx('pop');
    speakWord(selectedWord.chant, speechRate);
  };

  const handleReadExample = () => {
    bgm.playSfx('pop');
    speakWord(selectedWord.example, speechRate);
  };

  const handleMarkRead = () => {
    bgm.playSfx('correct');
    setReadStars((prev) => ({
      ...prev,
      [selectedWord.id]: (prev[selectedWord.id] || 0) + 1,
    }));
  };

  // Helper avatar for card preview
  const getAvatarForWord = (wordId: TargetWord) => {
    switch (wordId) {
      case 'short':
        return { name: 'Shorty', height: 'short', build: 'thin', hairStyle: 'straight', hairColor: 'brown', facialHair: 'none', skinTone: 'fair', faceStyle: 'cute', gender: 'boy' } as const;
      case 'thin':
        return { name: 'Slim', height: 'tall', build: 'thin', hairStyle: 'straight', hairColor: 'black', facialHair: 'none', skinTone: 'fair', faceStyle: 'cute', gender: 'boy' } as const;
      case 'fat':
        return { name: 'Chubby', height: 'short', build: 'fat', hairStyle: 'curly', hairColor: 'brown', facialHair: 'none', skinTone: 'fair', faceStyle: 'cute', gender: 'boy' } as const;
      case 'straight':
        return { name: 'Grace', height: 'tall', build: 'thin', hairStyle: 'straight', hairColor: 'blonde', facialHair: 'none', skinTone: 'fair', faceStyle: 'cute', gender: 'girl' } as const;
      case 'blonde':
        return { name: 'Sunny', height: 'short', build: 'thin', hairStyle: 'straight', hairColor: 'blonde', facialHair: 'none', skinTone: 'fair', faceStyle: 'cute', gender: 'girl' } as const;
      case 'moustache':
        return { name: 'Captain', height: 'tall', build: 'thin', hairStyle: 'straight', hairColor: 'brown', facialHair: 'moustache', skinTone: 'fair', faceStyle: 'cute', gender: 'boy' } as const;
      case 'beard':
        return { name: 'Grandpa', height: 'tall', build: 'fat', hairStyle: 'curly', hairColor: 'brown', facialHair: 'beard', skinTone: 'tan', faceStyle: 'cute', gender: 'boy' } as const;
      case 'fair':
        return { name: 'Snow', height: 'short', build: 'thin', hairStyle: 'straight', hairColor: 'blonde', facialHair: 'none', skinTone: 'fair', faceStyle: 'cute', gender: 'girl' } as const;
      case 'ugly':
        return { name: 'Goofy', height: 'short', build: 'fat', hairStyle: 'curly', hairColor: 'red', facialHair: 'none', skinTone: 'tan', faceStyle: 'ugly', gender: 'boy' } as const;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title & Category Filter Bar */}
      <div className="bg-white/90 p-4 rounded-2xl border border-amber-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-amber-600" />
          <div>
            <h2 className="text-xl font-bold font-fun text-slate-800">
              Picture Flashcards · 核心单词图鉴与诵读
            </h2>
            <p className="text-xs text-slate-500">
              包含外貌 9 大核心目标词、自然拼读规则、押韵童谣与发音纠音练习！
            </p>
          </div>
        </div>

        {/* Speed Control for kids */}
        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
          <span>语速:</span>
          <button
            onClick={() => setSpeechRate(0.75)}
            className={`px-2 py-0.5 rounded ${speechRate === 0.75 ? 'bg-amber-500 text-white' : 'text-amber-800'}`}
          >
            慢速 0.75x
          </button>
          <button
            onClick={() => setSpeechRate(0.9)}
            className={`px-2 py-0.5 rounded ${speechRate === 0.9 ? 'bg-amber-500 text-white' : 'text-amber-800'}`}
          >
            标准 0.9x
          </button>
        </div>
      </div>

      {/* Main Flashcard Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 9 Words Selection Grid */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
              教学单词导航 (Click to Inspect)
            </span>
            <div className="grid grid-cols-1 gap-1.5 max-h-[520px] overflow-y-auto pr-1">
              {VOCABULARY_LIST.map((vocab) => {
                const isSelected = selectedWord.id === vocab.id;
                const starsCount = readStars[vocab.id] || 0;
                return (
                  <button
                    key={vocab.id}
                    onClick={() => handleWordClick(vocab)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-white font-bold shadow-md scale-101'
                        : 'bg-slate-50 hover:bg-amber-100/60 text-slate-700 border border-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{vocab.cuteEmoji}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-fun text-base capitalize">{vocab.word}</span>
                          <span className={`text-[11px] font-mono ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                            {vocab.ipa}
                          </span>
                        </div>
                        <span className={`text-xs block ${isSelected ? 'text-amber-100' : 'text-slate-500'}`}>
                          {vocab.chinese}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {starsCount > 0 && (
                        <span className="flex items-center text-xs text-amber-300 font-bold bg-black/10 px-1.5 py-0.5 rounded-full">
                          ⭐ {starsCount}
                        </span>
                      )}
                      <Volume2 className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Rich Interactive Flashcard Detail Stage */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border-2 border-amber-200 shadow-md space-y-6 relative overflow-hidden">
          {/* Card Category Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{selectedWord.cuteEmoji}</span>
              <div>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {selectedWord.categoryLabel}
                </span>
                <span className="text-xs text-slate-400 ml-2">
                  Unit 1 Appearance & Features
                </span>
              </div>
            </div>

            {/* Read Count Badge */}
            <button
              onClick={handleMarkRead}
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs"
              title="我学会大声读啦！打卡打星"
            >
              <Star className="w-4 h-4 text-amber-500 fill-current" />
              <span>大声读打卡: {readStars[selectedWord.id] || 0} 次</span>
            </button>
          </div>

          {/* Big Word, IPA, Pronunciation Hero */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-amber-50 via-orange-50/40 to-amber-50 p-6 rounded-2xl border border-amber-200">
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h1 className="text-4xl sm:text-5xl font-extrabold font-fun text-slate-900 tracking-tight capitalize">
                  {selectedWord.word}
                </h1>
                <span className="text-lg font-mono text-amber-700 bg-white px-3 py-1 rounded-xl border border-amber-200 shadow-xs">
                  {selectedWord.ipa}
                </span>
              </div>

              <p className="text-lg font-bold text-slate-700">
                中文释义：<span className="text-amber-800">{selectedWord.chinese}</span>
              </p>

              <p className="text-xs text-slate-500 max-w-md">
                {selectedWord.definition}
              </p>

              {/* Antonym contrast */}
              {selectedWord.antonym && (
                <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200">
                  <span className="font-bold text-rose-500">反义对比:</span>
                  <span>vs. {selectedWord.antonym} ({selectedWord.antonymZh})</span>
                </div>
              )}
            </div>

            {/* Big Audio Pronounce Button & Avatar */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <CuteCharacterAvatar
                traits={getAvatarForWord(selectedWord.id)}
                size="md"
                showLabels={false}
              />
              <button
                onClick={() => {
                  bgm.playSfx('pop');
                  speakWord(selectedWord.word, speechRate);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-fun font-bold text-sm rounded-xl shadow-md transition-all"
              >
                <Volume2 className="w-5 h-5 animate-pulse" />
                <span>示范朗读发音</span>
              </button>
            </div>
          </div>

          {/* Phonics & Memory Chant (押韵童谣与发音小诀窍) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phonics Guide */}
            <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-2">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1">
                <span>🔤</span>
                <span>自然拼读与辨析小锦囊 (Phonics & Tips)</span>
              </span>
              <p className="text-xs text-blue-800 leading-relaxed font-medium">
                {selectedWord.phonicsTip}
              </p>
            </div>

            {/* Rhyme Chant */}
            <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1">
                  <span>🎶</span>
                  <span>朗朗上口押韵儿歌 (Rhyming Chant)</span>
                </span>
                <button
                  onClick={handleReadChant}
                  className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-purple-200"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>读儿歌</span>
                </button>
              </div>
              <p className="text-xs font-bold font-fun text-purple-900 bg-white/70 p-2.5 rounded-xl border border-purple-100 italic leading-relaxed">
                "{selectedWord.chant}"
              </p>
            </div>
          </div>

          {/* Practical Sentence Example */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">
                课堂典型例句 (Classroom Example Sentence)
              </span>
              <p className="text-base font-fun font-bold text-slate-800">
                "{selectedWord.example}"
              </p>
              <p className="text-xs text-slate-500">
                {selectedWord.exampleZh}
              </p>
            </div>

            <button
              onClick={handleReadExample}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-xs shrink-0 transition-colors"
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>整句朗读</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

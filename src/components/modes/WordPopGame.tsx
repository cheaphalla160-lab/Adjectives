import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { TargetWord } from '../../types/game';
import { VOCABULARY_LIST } from '../../data/vocabulary';
import { bgm, speakWord } from '../../utils/audio';
import { Volume2, Trophy, Flame, RotateCcw, Check, Sparkles } from 'lucide-react';

export const WordPopGame: React.FC = () => {
  const [gameType, setGameType] = useState<'listen_pop' | 'pair_match'>('listen_pop');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // LISTEN & POP STATE
  const [targetWord, setTargetWord] = useState<TargetWord>('short');
  const [bubbleOptions, setBubbleOptions] = useState<{ word: TargetWord; label: string; zh: string; color: string }[]>([]);
  const [poppedWord, setPoppedWord] = useState<string | null>(null);

  // PAIR MATCH STATE
  interface MatchCard {
    id: string;
    text: string;
    pairKey: string;
    type: 'word' | 'antonym';
    isMatched: boolean;
  }
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Bubble colors
  const colors = [
    'from-rose-400 to-pink-500',
    'from-amber-400 to-orange-500',
    'from-emerald-400 to-teal-500',
    'from-blue-400 to-indigo-500',
    'from-purple-400 to-fuchsia-500',
  ];

  // Initialize Listen & Pop
  const nextListenRound = useCallback(() => {
    setPoppedWord(null);
    const pool = [...VOCABULARY_LIST];
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    setTargetWord(chosen.id);

    // Pick 3 distractors
    const others = pool.filter((w) => w.id !== chosen.id).sort(() => 0.5 - Math.random()).slice(0, 3);
    const roundPool = [chosen, ...others].sort(() => 0.5 - Math.random());

    setBubbleOptions(
      roundPool.map((item, idx) => ({
        word: item.id,
        label: item.word,
        zh: item.chinese,
        color: colors[idx % colors.length],
      }))
    );

    // Auto speak
    setTimeout(() => {
      speakWord(chosen.word, 0.85);
    }, 300);
  }, []);

  // Initialize Pair Match
  const initPairGame = useCallback(() => {
    setSelectedCardId(null);
    const pairs = [
      { key: 'p1', w1: 'short (矮)', w2: 'tall (高)' },
      { key: 'p2', w1: 'thin (瘦)', w2: 'fat (胖)' },
      { key: 'p3', w1: 'straight (直发)', w2: 'curly (卷发)' },
      { key: 'p4', w1: 'fair (浅白)', w2: 'dark (深黑)' },
      { key: 'p5', w1: 'ugly (怪丑)', w2: 'cute (可爱)' },
    ];

    const cardList: MatchCard[] = [];
    pairs.forEach((p, idx) => {
      cardList.push({
        id: `w1-${idx}`,
        text: p.w1,
        pairKey: p.key,
        type: 'word',
        isMatched: false,
      });
      cardList.push({
        id: `w2-${idx}`,
        text: p.w2,
        pairKey: p.key,
        type: 'antonym',
        isMatched: false,
      });
    });

    setCards(cardList.sort(() => 0.5 - Math.random()));
  }, []);

  useEffect(() => {
    if (gameType === 'listen_pop') {
      nextListenRound();
    } else {
      initPairGame();
    }
  }, [gameType, nextListenRound, initPairGame]);

  // Handle Bubble Click in Listen & Pop
  const handleBubbleClick = (word: TargetWord) => {
    if (poppedWord) return;
    setPoppedWord(word);

    if (word === targetWord) {
      // Correct!
      bgm.playSfx('correct');
      const newScore = score + 50 + streak * 10;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        nextListenRound();
      }, 900);
    } else {
      // Wrong!
      bgm.playSfx('wrong');
      setStreak(0);
      speakWord(`Try again! Target was ${targetWord}`);
      setTimeout(() => {
        setPoppedWord(null);
      }, 700);
    }
  };

  // Handle Pair Card Click
  const handleCardClick = (card: MatchCard) => {
    if (card.isMatched) return;
    bgm.playSfx('pop');

    if (!selectedCardId) {
      setSelectedCardId(card.id);
      return;
    }

    if (selectedCardId === card.id) {
      setSelectedCardId(null);
      return;
    }

    const firstCard = cards.find((c) => c.id === selectedCardId);
    if (!firstCard) return;

    if (firstCard.pairKey === card.pairKey && firstCard.type !== card.type) {
      // MATCH!
      bgm.playSfx('correct');
      const newCards = cards.map((c) =>
        c.id === firstCard.id || c.id === card.id ? { ...c, isMatched: true } : c
      );
      setCards(newCards);
      setSelectedCardId(null);
      setScore((s) => s + 80);
      setStreak((st) => st + 1);

      // Check win
      if (newCards.every((c) => c.isMatched)) {
        bgm.playSfx('celebration');
        confetti({ particleCount: 100, spread: 80 });
      }
    } else {
      // MISMATCH
      bgm.playSfx('wrong');
      setSelectedCardId(null);
      setStreak(0);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header & Mode Toggle */}
      <div className="bg-white/90 p-4 rounded-2xl border border-amber-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎈</span>
          <div>
            <h2 className="text-xl font-bold font-fun text-slate-800">
              Word Pop · 听音消消乐与反义词配对
            </h2>
            <p className="text-xs text-slate-500">
              练听力、拼反应、记反义词，活跃课堂气氛的极佳小游戏！
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-amber-100 rounded-xl">
          <button
            onClick={() => {
              setGameType('listen_pop');
              bgm.playSfx('pop');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              gameType === 'listen_pop' ? 'bg-white text-amber-900 shadow-xs' : 'text-amber-800'
            }`}
          >
            🎧 听音戳泡泡
          </button>
          <button
            onClick={() => {
              setGameType('pair_match');
              bgm.playSfx('pop');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              gameType === 'pair_match' ? 'bg-white text-amber-900 shadow-xs' : 'text-amber-800'
            }`}
          >
            🔄 反义特征连连看
          </button>
        </div>

        {/* Score & Streak */}
        <div className="flex items-center gap-3 text-xs font-bold">
          <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-amber-900">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>得分:</span>
            <span className="text-base text-amber-600 tabular-nums">{score}</span>
          </div>
          <div className="flex items-center gap-1 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-900">
            <Flame className="w-4 h-4 text-rose-500 fill-current animate-pulse" />
            <span>连击:</span>
            <span className="text-base text-rose-600 tabular-nums">{streak}</span>
          </div>
        </div>
      </div>

      {/* GAME VIEW 1: LISTEN & POP */}
      {gameType === 'listen_pop' && (
        <div className="bg-gradient-to-b from-sky-50 via-amber-50/50 to-orange-50 p-8 rounded-3xl border-2 border-amber-200 shadow-md space-y-8 text-center relative overflow-hidden">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              Listen & Pop · 仔细听，戳破正确的单词泡泡！
            </span>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  bgm.playSfx('pop');
                  speakWord(targetWord, 0.85);
                }}
                className="w-16 h-16 bg-amber-500 hover:bg-amber-600 text-white rounded-3xl flex items-center justify-center shadow-lg active:scale-95 transition-all mx-auto group"
                title="再听一遍目标单词发音"
              >
                <Volume2 className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              点金色喇叭听发音，在下面 4 个选项中选出正确的一个！
            </p>
          </div>

          {/* Bubbles Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto py-4">
            {bubbleOptions.map((opt) => {
              const isPopped = poppedWord === opt.word;
              const isTarget = opt.word === targetWord;

              return (
                <button
                  key={opt.word}
                  onClick={() => handleBubbleClick(opt.word)}
                  className={`relative aspect-square rounded-full p-4 flex flex-col items-center justify-center text-white font-fun font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95 bg-gradient-to-br ${opt.color} ${
                    isPopped
                      ? isTarget
                        ? 'ring-4 ring-emerald-400 scale-110'
                        : 'opacity-40 line-through'
                      : 'hover:shadow-2xl'
                  }`}
                >
                  {/* Bubble shine overlay */}
                  <span className="absolute top-3 left-4 w-5 h-2.5 bg-white/40 rounded-full rotate-[-30deg]" />

                  <span className="text-xl sm:text-2xl capitalize tracking-tight drop-shadow-sm">
                    {opt.label}
                  </span>
                  <span className="text-xs text-white/90 font-sans font-normal mt-1">
                    {opt.zh}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Skip / Next Round Button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => {
                bgm.playSfx('pop');
                nextListenRound();
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>跳过此题，下一题</span>
            </button>
          </div>
        </div>
      )}

      {/* GAME VIEW 2: PAIR MATCH */}
      {gameType === 'pair_match' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-lg font-bold font-fun text-slate-800">
                反义词与对应特征连连看 (Match the Opposite Pairs)
              </h3>
              <p className="text-xs text-slate-500">
                点击两张互为反义词的卡片，将它们消除！
              </p>
            </div>
            <button
              onClick={() => {
                bgm.playSfx('pop');
                initPairGame();
              }}
              className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重新洗牌</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 py-2">
            {cards.map((card) => {
              const isSelected = selectedCardId === card.id;

              return (
                <button
                  key={card.id}
                  disabled={card.isMatched}
                  onClick={() => handleCardClick(card)}
                  className={`h-24 sm:h-28 rounded-2xl p-3 flex flex-col items-center justify-center font-fun font-bold text-center transition-all ${
                    card.isMatched
                      ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-300 opacity-60'
                      : isSelected
                      ? 'bg-amber-500 text-white shadow-lg ring-4 ring-amber-300 scale-105'
                      : 'bg-slate-50 hover:bg-amber-50 text-slate-800 border-2 border-slate-200 hover:border-amber-300'
                  }`}
                >
                  {card.isMatched ? (
                    <Check className="w-6 h-6 text-emerald-500 animate-bounce" />
                  ) : (
                    <span className="text-sm sm:text-base leading-tight">
                      {card.text}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {cards.every((c) => c.isMatched) && (
            <div className="bg-emerald-50 border-2 border-emerald-400 p-4 rounded-2xl text-center space-y-2">
              <span className="text-2xl">🏆</span>
              <h4 className="text-lg font-bold font-fun text-emerald-900">
                Awesome! 全部反义词配对成功！
              </h4>
              <button
                onClick={() => {
                  bgm.playSfx('pop');
                  initPairGame();
                }}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                再来一局
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

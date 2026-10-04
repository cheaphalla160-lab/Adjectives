import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { CharacterTraits, TargetWord } from '../../types/game';
import { VOCABULARY_LIST } from '../../data/vocabulary';
import { CuteCharacterAvatar } from '../CuteCharacterAvatar';
import { bgm, speakWord } from '../../utils/audio';
import {
  Volume2,
  Sparkles,
  Trophy,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  Search,
  CheckCircle2,
  Flame,
} from 'lucide-react';

export const DetectiveGame: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [suspects, setSuspects] = useState<CharacterTraits[]>([]);
  const [targetSuspect, setTargetSuspect] = useState<CharacterTraits | null>(null);
  const [activeClues, setActiveClues] = useState<{ word: TargetWord; label: string; zh: string }[]>([]);
  const [spokenSentence, setSpokenSentence] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);
  const [showVocabHint, setShowVocabHint] = useState<TargetWord | null>(null);
  const [listeningOnly, setListeningOnly] = useState(false);

  // Helper to generate distinct suspects
  const generateNewCase = useCallback(() => {
    setFeedback('idle');
    setSelectedSuspectId(null);

    const names = [
      'Leo 狮子座', 'Oliver 小奥', 'Mia 米娅', 'Sammy 山姆',
      'Emma 艾玛', 'Toby 托比', 'Zoe 佐伊', 'Felix 菲利克斯',
      'Benny 本尼', 'Chloe 克洛伊', 'Lucas 卢卡斯', 'Lily 莉莉'
    ];

    // Pick 2 or 3 distinct target words to form the clue based on level
    const pool: TargetWord[] = ['short', 'thin', 'straight', 'blonde', 'moustache', 'beard', 'fat', 'fair', 'ugly'];
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const clueCount = level === 1 ? 2 : level <= 3 ? 2 : 3;
    const chosenClueWords = shuffledPool.slice(0, clueCount);

    // Build the target character traits to match the clues
    const target: CharacterTraits = {
      id: 'target-' + Date.now(),
      name: names[Math.floor(Math.random() * names.length)],
      height: chosenClueWords.includes('short') ? 'short' : Math.random() > 0.5 ? 'tall' : 'short',
      build: chosenClueWords.includes('fat') ? 'fat' : chosenClueWords.includes('thin') ? 'thin' : Math.random() > 0.5 ? 'thin' : 'fat',
      hairStyle: chosenClueWords.includes('straight') ? 'straight' : Math.random() > 0.5 ? 'curly' : 'straight',
      hairColor: chosenClueWords.includes('blonde') ? 'blonde' : ['brown', 'black', 'red'][Math.floor(Math.random() * 3)] as any,
      facialHair: chosenClueWords.includes('moustache') && chosenClueWords.includes('beard')
        ? 'both'
        : chosenClueWords.includes('moustache')
        ? 'moustache'
        : chosenClueWords.includes('beard')
        ? 'beard'
        : 'none',
      skinTone: chosenClueWords.includes('fair') ? 'fair' : 'tan',
      faceStyle: chosenClueWords.includes('ugly') ? 'ugly' : 'cute',
      gender: Math.random() > 0.5 ? 'boy' : 'girl',
    };

    // Construct friendly clue objects
    const clues = chosenClueWords.map((word) => {
      const vocab = VOCABULARY_LIST.find((v) => v.id === word);
      return {
        word,
        label: vocab?.word || word,
        zh: vocab?.chinese || '',
      };
    });

    // Construct descriptive sentence
    const parts: string[] = [];
    if (target.height === 'short' && chosenClueWords.includes('short')) parts.push('short');
    if (target.build === 'fat' && chosenClueWords.includes('fat')) parts.push('fat');
    if (target.build === 'thin' && chosenClueWords.includes('thin')) parts.push('thin');
    if (target.skinTone === 'fair' && chosenClueWords.includes('fair')) parts.push('has fair skin');
    if (target.faceStyle === 'ugly' && chosenClueWords.includes('ugly')) parts.push('looks funny and ugly');

    const hairParts: string[] = [];
    if (chosenClueWords.includes('straight')) hairParts.push('straight');
    if (chosenClueWords.includes('blonde')) hairParts.push('blonde');
    if (hairParts.length > 0) parts.push(`has ${hairParts.join(' ')} hair`);

    if (chosenClueWords.includes('moustache') && chosenClueWords.includes('beard')) {
      parts.push('has a moustache and a beard');
    } else if (chosenClueWords.includes('moustache')) {
      parts.push('has a moustache');
    } else if (chosenClueWords.includes('beard')) {
      parts.push('has a beard');
    }

    const pronoun = target.gender === 'boy' ? 'He' : 'She';
    const sentence = `${pronoun} is ${parts.slice(0, 2).join(' and ')}${parts.length > 2 ? ', and ' + parts.slice(2).join(', ') : ''}.`;

    // Generate 3 distractors that differ on AT LEAST one of the clue traits
    const countSuspects = level >= 4 ? 6 : 4;
    const list: CharacterTraits[] = [target];

    for (let i = 1; i < countSuspects; i++) {
      const distractor: CharacterTraits = {
        id: `distractor-${i}-${Date.now()}`,
        name: names[(i * 3 + Math.floor(Math.random() * 5)) % names.length],
        height: Math.random() > 0.5 ? 'short' : 'tall',
        build: Math.random() > 0.5 ? 'thin' : 'fat',
        hairStyle: Math.random() > 0.5 ? 'straight' : 'curly',
        hairColor: (['blonde', 'brown', 'black', 'red'] as const)[Math.floor(Math.random() * 4)],
        facialHair: (['none', 'moustache', 'beard'] as const)[Math.floor(Math.random() * 3)],
        skinTone: Math.random() > 0.5 ? 'fair' : 'tan',
        faceStyle: Math.random() > 0.7 ? 'ugly' : 'cute',
        gender: Math.random() > 0.5 ? 'boy' : 'girl',
      };

      // Ensure distractor does NOT match ALL clues
      let matchesAll = true;
      for (const clue of chosenClueWords) {
        if (clue === 'short' && distractor.height !== 'short') matchesAll = false;
        if (clue === 'fat' && distractor.build !== 'fat') matchesAll = false;
        if (clue === 'thin' && distractor.build !== 'thin') matchesAll = false;
        if (clue === 'straight' && distractor.hairStyle !== 'straight') matchesAll = false;
        if (clue === 'blonde' && distractor.hairColor !== 'blonde') matchesAll = false;
        if (clue === 'moustache' && distractor.facialHair !== 'moustache' && distractor.facialHair !== 'both') matchesAll = false;
        if (clue === 'beard' && distractor.facialHair !== 'beard' && distractor.facialHair !== 'both') matchesAll = false;
        if (clue === 'fair' && distractor.skinTone !== 'fair') matchesAll = false;
        if (clue === 'ugly' && distractor.faceStyle !== 'ugly') matchesAll = false;
      }

      if (matchesAll) {
        // Invert one clue trait deliberately
        const wordToInvert = chosenClueWords[0];
        if (wordToInvert === 'short') distractor.height = 'tall';
        else if (wordToInvert === 'fat') distractor.build = 'thin';
        else if (wordToInvert === 'thin') distractor.build = 'fat';
        else if (wordToInvert === 'straight') distractor.hairStyle = 'curly';
        else if (wordToInvert === 'blonde') distractor.hairColor = 'black';
        else if (wordToInvert === 'moustache') distractor.facialHair = 'none';
        else if (wordToInvert === 'beard') distractor.facialHair = 'none';
        else if (wordToInvert === 'fair') distractor.skinTone = 'tan';
        else if (wordToInvert === 'ugly') distractor.faceStyle = 'cute';
      }

      list.push(distractor);
    }

    // Shuffle suspects array
    const shuffledSuspects = [...list].sort(() => 0.5 - Math.random());

    setSuspects(shuffledSuspects);
    setTargetSuspect(target);
    setActiveClues(clues);
    setSpokenSentence(sentence);

    // Speak clue initially after small delay
    setTimeout(() => {
      speakWord(sentence);
    }, 400);
  }, [level]);

  useEffect(() => {
    generateNewCase();
  }, [generateNewCase]);

  const handleSelectSuspect = (suspect: CharacterTraits) => {
    if (feedback === 'correct') return;
    setSelectedSuspectId(suspect.id || '');

    if (suspect.id === targetSuspect?.id) {
      // Correct!
      setFeedback('correct');
      const newScore = score + 100 + streak * 20;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      bgm.playSfx('correct');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
      });

      // Voice praise
      setTimeout(() => {
        speakWord('Great job! That is correct!');
      }, 500);
    } else {
      // Wrong guess
      setFeedback('wrong');
      setStreak(0);
      bgm.playSfx('wrong');
      speakWord('Try again! Look closely at the clues!');
    }
  };

  const handleNextCase = () => {
    bgm.playSfx('pop');
    if (feedback === 'correct') {
      setLevel((prev) => Math.min(prev + 1, 10));
    }
    generateNewCase();
  };

  const handlePlayAudio = () => {
    bgm.playSfx('pop');
    speakWord(spokenSentence);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Game Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/90 p-4 rounded-2xl border border-amber-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-amber-200">
            🔍
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-fun text-slate-800 tracking-tight">
                Case #{level} · 小神探破案：谁是嫌疑人？
              </h2>
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                难度 Lv.{level}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              仔细观察每位小镇居民的外貌特征，找到符合侦探线索的目标！
            </p>
          </div>
        </div>

        {/* Stats: Score & Streak */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-amber-900">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>得分:</span>
            <span className="text-base font-bold tabular-nums text-amber-600">{score}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-900">
            <Flame className="w-4 h-4 text-rose-500 fill-current animate-pulse" />
            <span>连对:</span>
            <span className="text-base font-bold tabular-nums text-rose-600">{streak}</span>
          </div>

          <button
            onClick={() => setListeningOnly(!listeningOnly)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              listeningOnly
                ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50'
            }`}
            title="盲听挑战：隐藏文本线索，仅凭英语听力破案！"
          >
            🎧 {listeningOnly ? '纯听力模式 ON' : '纯听力挑战'}
          </button>
        </div>
      </div>

      {/* Detective Clues Board */}
      <div className="relative bg-gradient-to-br from-amber-50 to-orange-50/60 p-6 rounded-3xl border-2 border-dashed border-amber-300 shadow-sm overflow-hidden">
        {/* Decorative badge stamp */}
        <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none text-9xl">
          🕵️
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-amber-500 text-white px-2 py-0.5 rounded-md shadow-xs">
                CASE CLUE 侦探线索档案
              </span>
              <span className="text-xs text-amber-900/80">点击喇叭反复收听纯正发音</span>
            </div>

            {/* Read aloud and Clue description */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayAudio}
                className="w-12 h-12 shrink-0 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl flex items-center justify-center shadow-md active:scale-95 transition-transform"
                title="大声朗读线索句子"
              >
                <Volume2 className="w-6 h-6 animate-pulse" />
              </button>

              <div className="space-y-1">
                {listeningOnly ? (
                  <p className="text-lg font-bold font-fun text-purple-900 italic">
                    [已开启听力挑战] 点击金色大喇叭，仔细听发音找人！
                  </p>
                ) : (
                  <p className="text-xl sm:text-2xl font-bold font-fun text-slate-900 tracking-tight">
                    "{spokenSentence}"
                  </p>
                )}
                {!listeningOnly && (
                  <p className="text-xs text-amber-800">
                    提示：关注句子中提到的身材、发型、肤色或胡子等核心特征单词！
                  </p>
                )}
              </div>
            </div>

            {/* Target Words Highlight Chips */}
            {!listeningOnly && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-bold text-slate-500">本案核心词:</span>
                {activeClues.map((clue) => (
                  <button
                    key={clue.word}
                    onClick={() => {
                      setShowVocabHint(clue.word);
                      speakWord(clue.label);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-amber-100/60 border border-amber-300 rounded-xl text-xs font-bold text-amber-950 shadow-xs transition-colors"
                  >
                    <span className="text-amber-600">{clue.label}</span>
                    <span className="text-slate-400">({clue.zh})</span>
                    <HelpCircle className="w-3 h-3 text-amber-500" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick refresh case button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                bgm.playSfx('pop');
                generateNewCase();
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-amber-100/50 border border-amber-300 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>换一案</span>
            </button>
          </div>
        </div>
      </div>

      {/* Suspects Lineup Grid */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold font-fun text-slate-800 text-lg">
              Suspect Lineup 居民队列 (请点击你认为对的那一位)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            共 {suspects.length} 位居民正在接受观察
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-2">
          {suspects.map((suspect, idx) => {
            const isSelected = selectedSuspectId === suspect.id;
            const isTarget = suspect.id === targetSuspect?.id;

            let borderStyle = 'border-slate-200 hover:border-amber-400 hover:shadow-md';
            if (isSelected) {
              if (feedback === 'correct') {
                borderStyle = 'border-emerald-500 bg-emerald-50/50 ring-4 ring-emerald-200';
              } else if (feedback === 'wrong') {
                borderStyle = 'border-rose-400 bg-rose-50/40 ring-4 ring-rose-200 animate-shake';
              }
            }

            return (
              <div
                key={suspect.id || idx}
                onClick={() => handleSelectSuspect(suspect)}
                className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all cursor-pointer bg-slate-50/40 ${borderStyle}`}
              >
                {/* Number Badge */}
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                  #{idx + 1}
                </div>

                {/* Status Indicator */}
                {isSelected && feedback === 'correct' && (
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow-md animate-bounce">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}

                {/* Suspect Avatar */}
                <CuteCharacterAvatar
                  traits={suspect}
                  size="md"
                  showLabels={true}
                  className="my-1"
                />

                {/* Inspect Button */}
                <button
                  className={`mt-2 text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                    isSelected && feedback === 'correct'
                      ? 'bg-emerald-600 text-white'
                      : isSelected && feedback === 'wrong'
                      ? 'bg-rose-500 text-white'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-amber-100 hover:text-amber-900'
                  }`}
                >
                  {isSelected && feedback === 'correct'
                    ? '🎯 找到嫌疑人啦！'
                    : isSelected && feedback === 'wrong'
                    ? '❌ 不符合线索，再看看'
                    : '指认这位嫌疑人'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback Banner & Next Level Button */}
      {feedback === 'correct' && (
        <div className="bg-emerald-50 border-2 border-emerald-400 p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-3xl shadow-md">
              🎉
            </div>
            <div>
              <h4 className="text-xl font-bold font-fun text-emerald-900">
                Congratulations! 破案成功！
              </h4>
              <p className="text-xs text-emerald-800 mt-1">
                你准确找出了特征为 <span className="font-bold">{activeClues.map(c => c.label).join(', ')}</span> 的目标！
                获得 +100 积分奖励！
              </p>
            </div>
          </div>

          <button
            onClick={handleNextCase}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-bold text-base rounded-2xl shadow-md active:scale-95 transition-transform shrink-0"
          >
            <span>破下一案 Case #{level + 1}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Quick Word Hint Modal */}
      {showVocabHint && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          {(() => {
            const v = VOCABULARY_LIST.find((item) => item.id === showVocabHint);
            if (!v) return null;
            return (
              <div className="bg-white max-w-md w-full rounded-3xl p-6 border-2 border-amber-300 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{v.cuteEmoji}</span>
                    <h3 className="text-2xl font-bold font-fun text-slate-800">
                      {v.word}
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">{v.ipa}</span>
                  </div>
                  <button
                    onClick={() => speakWord(v.word)}
                    className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full transition-colors"
                    title="朗读"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-amber-900 font-bold">
                    <span>中文含义:</span>
                    <span>{v.chinese}</span>
                  </div>
                  <p className="text-xs text-slate-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    💡 <strong>速记口诀 / Chant:</strong> "{v.chant}"
                  </p>
                  <p className="text-xs text-slate-600 bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                    🗣️ <strong>发音小锦囊:</strong> {v.phonicsTip}
                  </p>
                </div>

                <button
                  onClick={() => setShowVocabHint(null)}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl transition-colors"
                >
                  我明白啦，继续办案！
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

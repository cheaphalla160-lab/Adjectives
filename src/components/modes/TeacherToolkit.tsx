import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { TargetWord, CharacterTraits } from '../../types/game';
import { VOCABULARY_LIST } from '../../data/vocabulary';
import { CuteCharacterAvatar } from '../CuteCharacterAvatar';
import { bgm, speakWord } from '../../utils/audio';
import {
  Volume2,
  Trophy,
  Users,
  CheckCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const TeacherToolkit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pk_mode' | 'lesson_plan' | 'word_table'>('pk_mode');

  // Red Team vs Blue Team PK State
  const [redScore, setRedScore] = useState(0);
  const [blueScore, setBlueScore] = useState(0);
  const [currentPkClue, setCurrentPkClue] = useState<string>('She has straight blonde hair and fair skin.');
  const [currentPkWord, setCurrentPkWord] = useState<TargetWord>('blonde');
  const [pkRound, setPkRound] = useState(1);
  const [pkSuspects, setPkSuspects] = useState<CharacterTraits[]>([
    {
      id: 's1',
      name: 'Emma (候选 A)',
      height: 'short',
      build: 'thin',
      hairStyle: 'straight',
      hairColor: 'blonde',
      facialHair: 'none',
      skinTone: 'fair',
      faceStyle: 'cute',
      gender: 'girl',
    },
    {
      id: 's2',
      name: 'Leo (候选 B)',
      height: 'tall',
      build: 'fat',
      hairStyle: 'curly',
      hairColor: 'brown',
      facialHair: 'beard',
      skinTone: 'tan',
      faceStyle: 'cute',
      gender: 'boy',
    },
    {
      id: 's3',
      name: 'Felix (候选 C)',
      height: 'short',
      build: 'thin',
      hairStyle: 'straight',
      hairColor: 'black',
      facialHair: 'moustache',
      skinTone: 'tan',
      faceStyle: 'cute',
      gender: 'boy',
    },
  ]);
  const [correctSuspectId, setCorrectSuspectId] = useState<string>('s1');
  const [pkFeedback, setPkFeedback] = useState<string | null>(null);

  const nextPkRound = () => {
    bgm.playSfx('pop');
    setPkFeedback(null);
    setPkRound((r) => r + 1);

    interface PkQuestion {
      clue: string;
      targetId: string;
      word: TargetWord;
      candidates: CharacterTraits[];
    }

    const questions: PkQuestion[] = [
      {
        clue: 'He is fat and has a big beard on his chin!',
        targetId: 's2',
        word: 'beard',
        candidates: [
          { id: 's1', name: '候选 A', height: 'tall', build: 'thin', hairStyle: 'straight', hairColor: 'blonde', facialHair: 'none', skinTone: 'fair', faceStyle: 'cute', gender: 'girl' },
          { id: 's2', name: '候选 B', height: 'short', build: 'fat', hairStyle: 'curly', hairColor: 'brown', facialHair: 'beard', skinTone: 'tan', faceStyle: 'cute', gender: 'boy' },
          { id: 's3', name: '候选 C', height: 'short', build: 'thin', hairStyle: 'straight', hairColor: 'black', facialHair: 'moustache', skinTone: 'fair', faceStyle: 'cute', gender: 'boy' },
        ],
      },
      {
        clue: 'He is thin, has a moustache, and straight black hair!',
        targetId: 's3',
        word: 'moustache',
        candidates: [
          { id: 's1', name: '候选 A', height: 'short', build: 'fat', hairStyle: 'curly', hairColor: 'red', facialHair: 'beard', skinTone: 'fair', faceStyle: 'cute', gender: 'boy' },
          { id: 's2', name: '候选 B', height: 'tall', build: 'thin', hairStyle: 'curly', hairColor: 'blonde', facialHair: 'none', skinTone: 'fair', faceStyle: 'cute', gender: 'girl' },
          { id: 's3', name: '候选 C', height: 'tall', build: 'thin', hairStyle: 'straight', hairColor: 'black', facialHair: 'moustache', skinTone: 'fair', faceStyle: 'cute', gender: 'boy' },
        ],
      },
      {
        clue: 'Look at the silly monster! It is short, fat, and ugly!',
        targetId: 's1',
        word: 'ugly',
        candidates: [
          { id: 's1', name: '候选 A', height: 'short', build: 'fat', hairStyle: 'curly', hairColor: 'red', facialHair: 'none', skinTone: 'tan', faceStyle: 'ugly', gender: 'boy' },
          { id: 's2', name: '候选 B', height: 'tall', build: 'thin', hairStyle: 'straight', hairColor: 'blonde', facialHair: 'none', skinTone: 'fair', faceStyle: 'cute', gender: 'girl' },
          { id: 's3', name: '候选 C', height: 'tall', build: 'fat', hairStyle: 'straight', hairColor: 'brown', facialHair: 'beard', skinTone: 'fair', faceStyle: 'cute', gender: 'boy' },
        ],
      },
    ];

    const q = questions[(pkRound - 1) % questions.length];
    setCurrentPkClue(q.clue);
    setCurrentPkWord(q.word);
    setCorrectSuspectId(q.targetId);
    setPkSuspects(q.candidates);

    setTimeout(() => {
      speakWord(q.clue);
    }, 300);
  };

  const handleScoreTeam = (team: 'red' | 'blue') => {
    bgm.playSfx('correct');
    confetti({ particleCount: 60, spread: 70 });
    if (team === 'red') {
      setRedScore((s) => s + 1);
      setPkFeedback('🔴 红队抢答成功！得分 +1！');
    } else {
      setBlueScore((s) => s + 1);
      setPkFeedback('🔵 蓝队抢答成功！得分 +1！');
    }
  };

  const resetPkScores = () => {
    bgm.playSfx('pop');
    setRedScore(0);
    setBlueScore(0);
    setPkRound(1);
    setPkFeedback(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Teacher Top Navigation */}
      <div className="bg-white/90 p-4 rounded-2xl border border-amber-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👩‍🏫</span>
          <div>
            <h2 className="text-xl font-bold font-fun text-slate-800">
              Teacher's Toolkit · 备课助手与课堂大屏PK
            </h2>
            <p className="text-xs text-slate-500">
              专为小学英语教师设计：大屏红蓝队竞争白板、核心句型剖析与易错点教案。
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-amber-100 rounded-xl">
          <button
            onClick={() => setActiveTab('pk_mode')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'pk_mode' ? 'bg-white text-amber-900 shadow-xs' : 'text-amber-800'
            }`}
          >
            🏆 红蓝队白板PK大屏
          </button>
          <button
            onClick={() => setActiveTab('lesson_plan')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'lesson_plan' ? 'bg-white text-amber-900 shadow-xs' : 'text-amber-800'
            }`}
          >
            📋 核心句型与易错指南
          </button>
          <button
            onClick={() => setActiveTab('word_table')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'word_table' ? 'bg-white text-amber-900 shadow-xs' : 'text-amber-800'
            }`}
          >
            📊 9大单词教案总表
          </button>
        </div>
      </div>

      {/* VIEW 1: WHITEBOARD PK MODE */}
      {activeTab === 'pk_mode' && (
        <div className="space-y-6">
          {/* Big Scoreboard Bar */}
          <div className="grid grid-cols-2 gap-4">
            {/* Red Team Score */}
            <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white p-5 rounded-3xl shadow-md flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                  TEAM A
                </span>
                <h3 className="text-2xl font-bold font-fun">🔴 红队 (Red Team)</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-extrabold font-fun tabular-nums">
                  {redScore}
                </span>
                <button
                  onClick={() => handleScoreTeam('red')}
                  className="px-3 py-1.5 bg-white text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  +1 加分
                </button>
              </div>
            </div>

            {/* Blue Team Score */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-5 rounded-3xl shadow-md flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                  TEAM B
                </span>
                <h3 className="text-2xl font-bold font-fun">🔵 蓝队 (Blue Team)</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-extrabold font-fun tabular-nums">
                  {blueScore}
                </span>
                <button
                  onClick={() => handleScoreTeam('blue')}
                  className="px-3 py-1.5 bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  +1 加分
                </button>
              </div>
            </div>
          </div>

          {/* PK Question Screen */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-amber-300 shadow-lg space-y-6 text-center">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                PK Round 第 {pkRound} 轮 · 听指令抢答
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetPkScores}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重置比分</span>
                </button>
              </div>
            </div>

            {/* Clue Speech */}
            <div className="max-w-2xl mx-auto space-y-3">
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    bgm.playSfx('pop');
                    speakWord(currentPkClue);
                  }}
                  className="w-14 h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl flex items-center justify-center shadow-md active:scale-95 transition-transform"
                >
                  <Volume2 className="w-7 h-7" />
                </button>
                <div className="text-left">
                  <p className="text-2xl font-bold font-fun text-slate-900 leading-snug">
                    "{currentPkClue}"
                  </p>
                  <span className="text-xs text-slate-400">
                    请两队选手上前，以最快速度指出哪一位候选人符合描述！
                  </span>
                </div>
              </div>
            </div>

            {/* Candidate Lineup (3 large choices) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {pkSuspects.map((candidate) => {
                const isCorrect = candidate.id === correctSuspectId;

                return (
                  <div
                    key={candidate.id}
                    onClick={() => {
                      if (isCorrect) {
                        bgm.playSfx('correct');
                        speakWord('Correct! You got it right!');
                      } else {
                        bgm.playSfx('wrong');
                      }
                    }}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer bg-slate-50/70 hover:shadow-md ${
                      isCorrect ? 'border-amber-300 hover:border-amber-500' : 'border-slate-200'
                    }`}
                  >
                    <CuteCharacterAvatar traits={candidate} size="lg" showLabels={true} />
                  </div>
                );
              })}
            </div>

            {/* Feedback & Next Round */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
              <div className="text-xs text-slate-500">
                {pkFeedback ? (
                  <span className="text-base font-bold text-emerald-600 font-fun animate-bounce block">
                    {pkFeedback}
                  </span>
                ) : (
                  <span>正确答案是：候选人具有对应特征。老师可直接为胜出队伍点击加分！</span>
                )}
              </div>

              <button
                onClick={nextPkRound}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-fun font-bold text-sm rounded-xl shadow-md transition-all active:scale-95"
              >
                出下一道 PK 题 Round #{pkRound + 1}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: LESSON PLAN & COMMON PITFALLS */}
      {activeTab === 'lesson_plan' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-xl font-bold font-fun text-slate-800">
              备课教案与句型架构 (Grammar Structures & Teaching Notes)
            </h3>
            <p className="text-xs text-slate-500">
              帮助小学英语老师高效理清教学难点，引导学生正确使用 Be动词 与 Have/Has！
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rule 1: He/She is + Adjective */}
            <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
              <span className="text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md">
                句型结构 1: He / She is + 形容词
              </span>
              <p className="text-xs text-slate-600">
                当用来描述身材、整体外观时，直接使用系动词 <strong>is / are</strong>：
              </p>
              <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1.5 text-xs">
                <p>• He is <strong>short</strong>. (他个子矮。)</p>
                <p>• She is <strong>thin</strong>. (她很苗条瘦弱。)</p>
                <p>• The monster is <strong>ugly</strong>. (小怪物长得很滑稽丑怪。)</p>
                <p>• The cute bear is <strong>fat</strong>. (小熊胖乎乎的。)</p>
              </div>
            </div>

            {/* Rule 2: He/She has + Noun / Noun Phrase */}
            <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-3">
              <span className="text-xs font-bold text-blue-900 bg-blue-200 px-2 py-0.5 rounded-md">
                句型结构 2: He / She has + 名词短语
              </span>
              <p className="text-xs text-slate-600">
                当描述身体局部特征（发型、肤色、胡子）时，必须使用 <strong>has</strong>：
              </p>
              <div className="bg-white p-3 rounded-xl border border-blue-200 space-y-1.5 text-xs">
                <p>• He has a <strong>moustache</strong>. (他留着八字小胡子。注意冠词 a)</p>
                <p>• He has a <strong>beard</strong>. (他留着络腮大胡子。注意冠词 a)</p>
                <p>• She has <strong>straight blonde</strong> hair. (她留着金色直发。hair 不可数，不加 a)</p>
                <p>• Snow White has <strong>fair</strong> skin. (白雪公主皮肤白皙。)</p>
              </div>
            </div>
          </div>

          {/* Key Pitfalls for Kids */}
          <div className="p-5 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-3">
            <h4 className="font-bold text-sm text-rose-900 flex items-center gap-1.5">
              <span>⚠️</span>
              <span>小学生最容易混淆的 4 大易错点 (Common Kid Mistakes)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-rose-100 space-y-1">
                <span className="font-bold text-rose-700">1. Moustache vs. Beard 胡子部位混淆</span>
                <p className="text-slate-600">
                  口诀：<strong>Moustache 亲亲嘴在上面</strong>（嘴唇上方）；<strong>Beard 摸下巴在下面</strong>（下巴与腮帮子）。
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-rose-100 space-y-1">
                <span className="font-bold text-rose-700">2. Straight 拼写不发音的 gh</span>
                <p className="text-slate-600">
                  字母组合 <strong>gh</strong> 不发音 (silent)，整个词发 /streɪt/。请提醒孩子们千万别漏写 gh！
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-rose-100 space-y-1">
                <span className="font-bold text-rose-700">3. Blonde 与 Blond</span>
                <p className="text-slate-600">
                  传统上描述女生金发写作 <strong>blonde</strong>，描述男生写作 <strong>blond</strong>。现在两者通用。
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-rose-100 space-y-1">
                <span className="font-bold text-rose-700">4. 友善的情感态度教育</span>
                <p className="text-slate-600">
                  讲解 <strong>fat</strong> 和 <strong>ugly</strong> 时，应引导孩子用在卡通萌宠、怪兽故事（如功夫熊猫、可爱的怪物大学），切勿用来讥笑同学。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: VOCABULARY MASTER TABLE */}
      {activeTab === 'word_table' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <div className="border-b pb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold font-fun text-slate-800">
              9 大核心单词备课总览表 (Vocabulary Matrix)
            </h3>
            <span className="text-xs text-slate-400">
              共 9 个课标重难点外貌词汇
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                <tr>
                  <th className="py-2.5 px-3">单词 (Word)</th>
                  <th className="py-2.5 px-3">音标 (IPA)</th>
                  <th className="py-2.5 px-3">词性分类</th>
                  <th className="py-2.5 px-3">中文释义</th>
                  <th className="py-2.5 px-3">反义词对照</th>
                  <th className="py-2.5 px-3">发音点读</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {VOCABULARY_LIST.map((v) => (
                  <tr key={v.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-2.5 px-3 font-fun font-bold text-slate-900 text-sm">
                      {v.cuteEmoji} {v.word}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{v.ipa}</td>
                    <td className="py-2.5 px-3 text-slate-600">{v.categoryLabel}</td>
                    <td className="py-2.5 px-3 text-amber-900 font-semibold">{v.chinese}</td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {v.antonym ? `${v.antonym} (${v.antonymZh})` : '-'}
                    </td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => speakWord(v.word)}
                        className="p-1 hover:bg-amber-100 text-amber-600 rounded-lg transition-colors"
                        title="朗读"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CharacterTraits, TargetWord } from '../../types/game';
import { CuteCharacterAvatar } from '../CuteCharacterAvatar';
import { bgm, speakWord } from '../../utils/audio';
import {
  Volume2,
  Sparkles,
  CheckCircle2,
  Shuffle,
  RefreshCw,
  Trophy,
} from 'lucide-react';

interface MissionRequirement {
  traitKey: keyof CharacterTraits;
  targetValue: any;
  word: TargetWord;
  label: string;
  zh: string;
}

export const AvatarLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sandbox' | 'missions'>('missions');
  const [missionIndex, setMissionIndex] = useState(0);

  // Avatar Traits state
  const [traits, setTraits] = useState<CharacterTraits>({
    name: 'My Buddy',
    height: 'short',
    build: 'thin',
    hairStyle: 'straight',
    hairColor: 'blonde',
    facialHair: 'none',
    skinTone: 'fair',
    faceStyle: 'cute',
    gender: 'boy',
    outfitColor: '#38BDF8',
  });

  // Pre-made exciting missions that specifically test the 9 core vocabulary words!
  const missions: {
    title: string;
    description: string;
    requirements: MissionRequirement[];
  }[] = [
    {
      title: '任务 1: 金发小侦探 (Blonde & Straight Hair)',
      description: '请制作一位【矮个子 (short)】、【金发 (blonde)】且拥有【柔顺直发 (straight)】的小伙伴！',
      requirements: [
        { traitKey: 'height', targetValue: 'short', word: 'short', label: 'short', zh: '身材矮小' },
        { traitKey: 'hairColor', targetValue: 'blonde', word: 'blonde', label: 'blonde', zh: '金色头发' },
        { traitKey: 'hairStyle', targetValue: 'straight', word: 'straight', label: 'straight', zh: '直发发型' },
      ],
    },
    {
      title: '任务 2: 络腮胡老船长 (Fat & Beard)',
      description: '大胡子老船长登场！他体型【圆滚滚微胖 (fat)】，下巴留着厚厚一把【络腮大胡子 (beard)】！',
      requirements: [
        { traitKey: 'build', targetValue: 'fat', word: 'fat', label: 'fat', zh: '体型圆胖' },
        { traitKey: 'facialHair', targetValue: 'beard', word: 'beard', label: 'beard', zh: '下巴大胡子' },
      ],
    },
    {
      title: '任务 3: 优雅小绅士 (Thin, Fair & Moustache)',
      description: '制作一位身形【苗条精瘦 (thin)】、肤色【白皙 (fair)】、嘴唇上方有一撇【八字小胡子 (moustache)】的优雅绅士！',
      requirements: [
        { traitKey: 'build', targetValue: 'thin', word: 'thin', label: 'thin', zh: '身材瘦苗条' },
        { traitKey: 'skinTone', targetValue: 'fair', word: 'fair', label: 'fair', zh: '白皙浅肤色' },
        { traitKey: 'facialHair', targetValue: 'moustache', word: 'moustache', label: 'moustache', zh: '唇上小胡子' },
      ],
    },
    {
      title: '任务 4: 奇趣丑萌怪兽 (Short, Fat & Ugly)',
      description: '外星萌怪驾到！它长得【怪模怪样 (ugly)】，个子【矮小 (short)】，肚子【胖乎乎 (fat)】！',
      requirements: [
        { traitKey: 'faceStyle', targetValue: 'ugly', word: 'ugly', label: 'ugly', zh: '滑稽丑萌怪脸' },
        { traitKey: 'height', targetValue: 'short', word: 'short', label: 'short', zh: '矮小' },
        { traitKey: 'build', targetValue: 'fat', word: 'fat', label: 'fat', zh: '胖乎乎' },
      ],
    },
  ];

  const currentMission = missions[missionIndex];

  // Check which requirements are satisfied
  const isRequirementMet = (req: MissionRequirement) => {
    if (req.traitKey === 'facialHair') {
      if (req.targetValue === 'moustache') {
        return traits.facialHair === 'moustache' || traits.facialHair === 'both';
      }
      if (req.targetValue === 'beard') {
        return traits.facialHair === 'beard' || traits.facialHair === 'both';
      }
    }
    return traits[req.traitKey] === req.targetValue;
  };

  const allRequirementsMet =
    activeTab === 'missions' &&
    currentMission.requirements.every((req) => isRequirementMet(req));

  const updateTrait = <K extends keyof CharacterTraits>(key: K, val: CharacterTraits[K]) => {
    bgm.playSfx('pop');
    setTraits((prev) => ({ ...prev, [key]: val }));
  };

  // Generate dynamic full English descriptive sentence
  const generateDescriptionSentence = () => {
    const heightWord = traits.height === 'short' ? 'short' : 'tall';
    const buildWord = traits.build === 'fat' ? 'fat' : 'thin';
    const skinWord = traits.skinTone === 'fair' ? 'fair skin' : 'tan skin';
    const hairWord = `${traits.hairStyle} ${traits.hairColor} hair`;

    let facialDesc = '';
    if (traits.facialHair === 'both') {
      facialDesc = 'a moustache and a beard';
    } else if (traits.facialHair === 'moustache') {
      facialDesc = 'a moustache';
    } else if (traits.facialHair === 'beard') {
      facialDesc = 'a beard';
    }

    const pronoun = traits.gender === 'boy' ? 'He' : 'She';
    const faceDesc = traits.faceStyle === 'ugly' ? 'with a funny ugly monster face' : 'with a cheerful cute face';

    return `${pronoun} is ${heightWord} and ${buildWord}, has ${skinWord}, ${hairWord}${facialDesc ? ', and ' + facialDesc : ''} (${faceDesc}).`;
  };

  const handleRandomize = () => {
    bgm.playSfx('magic');
    setTraits({
      name: 'Buddy ' + Math.floor(Math.random() * 100),
      height: Math.random() > 0.5 ? 'short' : 'tall',
      build: Math.random() > 0.5 ? 'thin' : 'fat',
      hairStyle: Math.random() > 0.5 ? 'straight' : 'curly',
      hairColor: (['blonde', 'brown', 'black', 'red'] as const)[Math.floor(Math.random() * 4)],
      facialHair: (['none', 'moustache', 'beard', 'both'] as const)[Math.floor(Math.random() * 4)],
      skinTone: Math.random() > 0.5 ? 'fair' : 'tan',
      faceStyle: Math.random() > 0.7 ? 'ugly' : 'cute',
      gender: Math.random() > 0.5 ? 'boy' : 'girl',
      outfitColor: ['#38BDF8', '#F472B6', '#10B981', '#F59E0B', '#8B5CF6'][Math.floor(Math.random() * 5)],
    });
  };

  const handleClaimMissionReward = () => {
    bgm.playSfx('celebration');
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
    speakWord('Super! You matched every single word perfectly!');

    setTimeout(() => {
      setMissionIndex((prev) => (prev + 1) % missions.length);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header and Mode switcher */}
      <div className="bg-white/90 p-4 rounded-2xl border border-amber-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            <h2 className="text-xl font-bold font-fun text-slate-800">
              Avatar Lab · 奇妙捏脸工坊与造句台
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            亲手调制发型、身材、肤色与胡子，动态生成地道英语外貌描述句！
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-amber-100/70 rounded-xl border border-amber-200">
          <button
            onClick={() => {
              setActiveTab('missions');
              bgm.playSfx('pop');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'missions'
                ? 'bg-white text-amber-900 shadow-xs font-bold'
                : 'text-amber-800/80 hover:text-amber-900'
            }`}
          >
            🎯 任务挑战模式
          </button>
          <button
            onClick={() => {
              setActiveTab('sandbox');
              bgm.playSfx('pop');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'sandbox'
                ? 'bg-white text-amber-900 shadow-xs font-bold'
                : 'text-amber-800/80 hover:text-amber-900'
            }`}
          >
            ✨ 自由捏脸创造
          </button>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Avatar Preview & Sentence Generator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-b from-amber-50 to-orange-50/50 p-6 rounded-3xl border-2 border-amber-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
            {/* Top Toolbar */}
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-800 bg-amber-200/60 px-2.5 py-1 rounded-full">
                实时外貌角色预览
              </span>
              <button
                onClick={handleRandomize}
                className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900 bg-white px-2.5 py-1 rounded-lg border border-amber-200 shadow-xs"
                title="随机换装"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>随机造型</span>
              </button>
            </div>

            {/* Avatar Component */}
            <div className="py-4">
              <CuteCharacterAvatar traits={traits} size="xl" showLabels={true} />
            </div>

            {/* Generated English Sentence Box */}
            <div className="w-full mt-4 bg-white p-4 rounded-2xl border border-amber-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>英语句型生成器 (Sentence Maker)</span>
                </span>
                <button
                  onClick={() => {
                    bgm.playSfx('pop');
                    speakWord(generateDescriptionSentence());
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 px-3 py-1 rounded-lg shadow-xs transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>大声读出</span>
                </button>
              </div>
              <p className="text-sm font-semibold font-fun text-slate-800 leading-relaxed bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                "{generateDescriptionSentence()}"
              </p>
            </div>
          </div>

          {/* Mission Objective Box (Visible in Mission Mode) */}
          {activeTab === 'missions' && (
            <div className="bg-white p-5 rounded-3xl border-2 border-indigo-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="font-bold font-fun text-indigo-900 text-sm flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>{currentMission.title}</span>
                </h4>
                <span className="text-xs text-indigo-500 font-bold">
                  关卡 {missionIndex + 1} / {missions.length}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {currentMission.description}
              </p>

              {/* Requirements Checklist */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-500">特征匹配清单:</span>
                {currentMission.requirements.map((req, idx) => {
                  const met = isRequirementMet(req);
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold border transition-all ${
                        met
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          className={`w-4 h-4 ${met ? 'text-emerald-600' : 'text-slate-300'}`}
                        />
                        <span>{req.zh}</span>
                        <span className="font-mono text-amber-600 font-bold">[{req.label}]</span>
                      </div>
                      <span className="text-[11px] font-bold">
                        {met ? '✅ 已达成' : '⏳ 待调整'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Claim reward button */}
              {allRequirementsMet ? (
                <button
                  onClick={handleClaimMissionReward}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-bold text-sm rounded-xl shadow-md transition-all animate-bounce"
                >
                  🎉 完美匹配！点击领奖晋级！
                </button>
              ) : (
                <div className="text-center text-xs text-slate-400 py-1">
                  在右侧面板点击对应属性，让所有指标变绿吧！
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Interactive Attribute Customization Deck */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold font-fun text-slate-800 text-lg">
              特征控制器 (Click to Adjust Appearance)
            </h3>
            <span className="text-xs text-slate-400">
              对应核心 9 大教学单词
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Height: short vs tall */}
            <div className="space-y-2 p-3 bg-amber-50/50 rounded-2xl border border-amber-200/60">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span>1. 身高特征 (Height)</span>
                <button
                  onClick={() => speakWord('short')}
                  className="text-amber-600 hover:text-amber-800 flex items-center gap-0.5"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>short</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateTrait('height', 'short')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    traits.height === 'short'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-100/50'
                  }`}
                >
                  🧸 short (矮小的)
                </button>
                <button
                  onClick={() => updateTrait('height', 'tall')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    traits.height === 'tall'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-100/50'
                  }`}
                >
                  🦒 tall (高大的)
                </button>
              </div>
            </div>

            {/* 2. Build: thin vs fat */}
            <div className="space-y-2 p-3 bg-blue-50/50 rounded-2xl border border-blue-200/60">
              <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                <span>2. 体型特征 (Build)</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => speakWord('thin')} className="text-blue-600 hover:text-blue-800 text-[11px]">
                    thin
                  </button>
                  <button onClick={() => speakWord('fat')} className="text-blue-600 hover:text-blue-800 text-[11px]">
                    fat
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateTrait('build', 'thin')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    traits.build === 'thin'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50'
                  }`}
                >
                  📏 thin (苗条瘦的)
                </button>
                <button
                  onClick={() => updateTrait('build', 'fat')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    traits.build === 'fat'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50'
                  }`}
                >
                  🐼 fat (圆滚胖的)
                </button>
              </div>
            </div>

            {/* 3. Hair Style: straight vs curly */}
            <div className="space-y-2 p-3 bg-purple-50/50 rounded-2xl border border-purple-200/60">
              <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                <span>3. 发型纹理 (Hair Style)</span>
                <button
                  onClick={() => speakWord('straight')}
                  className="text-purple-600 hover:text-purple-800 flex items-center gap-0.5"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>straight</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateTrait('hairStyle', 'straight')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    traits.hairStyle === 'straight'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-50'
                  }`}
                >
                  ✨ straight (笔直发)
                </button>
                <button
                  onClick={() => updateTrait('hairStyle', 'curly')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    traits.hairStyle === 'curly'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-50'
                  }`}
                >
                  🌀 curly (卷曲发)
                </button>
              </div>
            </div>

            {/* 4. Hair Color: blonde vs others */}
            <div className="space-y-2 p-3 bg-amber-50/50 rounded-2xl border border-amber-200/60">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span>4. 发色 (Hair Color)</span>
                <button
                  onClick={() => speakWord('blonde')}
                  className="text-amber-600 hover:text-amber-800 flex items-center gap-0.5"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>blonde</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateTrait('hairColor', 'blonde')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    traits.hairColor === 'blonde'
                      ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-500 shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50'
                  }`}
                >
                  🌻 blonde (金黄色)
                </button>
                <button
                  onClick={() => updateTrait('hairColor', 'brown')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    traits.hairColor === 'brown'
                      ? 'bg-amber-800 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50'
                  }`}
                >
                  🌰 brown (深棕色)
                </button>
                <button
                  onClick={() => updateTrait('hairColor', 'black')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    traits.hairColor === 'black'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  ⚫ black (黑色)
                </button>
                <button
                  onClick={() => updateTrait('hairColor', 'red')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    traits.hairColor === 'red'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-rose-50'
                  }`}
                >
                  🔥 red (红发)
                </button>
              </div>
            </div>

            {/* 5. Facial Hair: moustache vs beard */}
            <div className="space-y-2 p-3 bg-orange-50/50 rounded-2xl border border-orange-200/60 md:col-span-2">
              <div className="flex items-center justify-between text-xs font-bold text-orange-950">
                <span>5. 胡子区别辨析 (Facial Hair: Moustache vs Beard)</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => speakWord('moustache')} className="text-orange-600 hover:text-orange-800 text-[11px]">
                    moustache (小胡子)
                  </button>
                  <button onClick={() => speakWord('beard')} className="text-orange-600 hover:text-orange-800 text-[11px]">
                    beard (大胡子)
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => updateTrait('facialHair', 'none')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                    traits.facialHair === 'none'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-orange-50'
                  }`}
                >
                  🚫 none (无胡须)
                </button>
                <button
                  onClick={() => updateTrait('facialHair', 'moustache')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                    traits.facialHair === 'moustache'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-orange-50'
                  }`}
                >
                  🥸 moustache (唇上八字胡)
                </button>
                <button
                  onClick={() => updateTrait('facialHair', 'beard')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                    traits.facialHair === 'beard'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-orange-50'
                  }`}
                >
                  🧔 beard (下巴大胡子)
                </button>
                <button
                  onClick={() => updateTrait('facialHair', 'both')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                    traits.facialHair === 'both'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-orange-50'
                  }`}
                >
                  🧔‍♂️ both (两者皆有)
                </button>
              </div>
            </div>

            {/* 6. Skin Tone: fair vs tan */}
            <div className="space-y-2 p-3 bg-pink-50/50 rounded-2xl border border-pink-200/60">
              <div className="flex items-center justify-between text-xs font-bold text-pink-900">
                <span>6. 肤色色泽 (Skin Tone)</span>
                <button
                  onClick={() => speakWord('fair')}
                  className="text-pink-600 hover:text-pink-800 flex items-center gap-0.5"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>fair</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateTrait('skinTone', 'fair')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    traits.skinTone === 'fair'
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-pink-50'
                  }`}
                >
                  🌸 fair (白皙浅肤色)
                </button>
                <button
                  onClick={() => updateTrait('skinTone', 'tan')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    traits.skinTone === 'tan'
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50'
                  }`}
                >
                  ☀️ tan (阳光小麦色)
                </button>
              </div>
            </div>

            {/* 7. Face Style: cute vs ugly */}
            <div className="space-y-2 p-3 bg-indigo-50/50 rounded-2xl border border-indigo-200/60">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                <span>7. 表情外观风格 (Appearance)</span>
                <button
                  onClick={() => speakWord('ugly')}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>ugly</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateTrait('faceStyle', 'cute')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    traits.faceStyle === 'cute'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-indigo-50'
                  }`}
                >
                  ✨ cute (甜美可爱)
                </button>
                <button
                  onClick={() => updateTrait('faceStyle', 'ugly')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    traits.faceStyle === 'ugly'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-indigo-50'
                  }`}
                >
                  👾 ugly (滑稽丑萌怪模)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

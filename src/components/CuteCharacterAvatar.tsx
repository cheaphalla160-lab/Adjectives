import React from 'react';
import { CharacterTraits } from '../types/game';

interface AvatarProps {
  traits: CharacterTraits;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabels?: boolean;
  highlightTrait?: string;
  onClick?: () => void;
  className?: string;
}

export const CuteCharacterAvatar: React.FC<AvatarProps> = ({
  traits,
  size = 'md',
  showLabels = false,
  highlightTrait,
  onClick,
  className = '',
}) => {
  const isShort = traits.height === 'short';
  const isFat = traits.build === 'fat';
  const isStraight = traits.hairStyle === 'straight';
  const isBlonde = traits.hairColor === 'blonde';
  const hasMoustache = traits.facialHair === 'moustache' || traits.facialHair === 'both';
  const hasBeard = traits.facialHair === 'beard' || traits.facialHair === 'both';
  const isFair = traits.skinTone === 'fair';
  const isUgly = traits.faceStyle === 'ugly';

  // Skin tones
  const skinColor = isFair ? '#FFE6D9' : '#E2A779';
  const shadowSkinColor = isFair ? '#F5C9B3' : '#C78453';
  const blushColor = isFair ? '#FF9EAA' : '#E07A5F';

  // Hair colors
  const hairColorHex = (() => {
    switch (traits.hairColor) {
      case 'blonde':
        return '#FFD147'; // Bright cheerful sunny blonde
      case 'brown':
        return '#78350F';
      case 'black':
        return '#27272A';
      case 'red':
        return '#DC2626';
      default:
        return '#FFD147';
    }
  })();

  const hairShadowHex = (() => {
    switch (traits.hairColor) {
      case 'blonde':
        return '#F59E0B';
      case 'brown':
        return '#451A03';
      case 'black':
        return '#18181B';
      case 'red':
        return '#991B1B';
      default:
        return '#F59E0B';
    }
  })();

  // Outfit colors
  const shirtColor = traits.outfitColor || (traits.gender === 'boy' ? '#38BDF8' : '#F472B6');
  const pantsColor = '#3B82F6';

  // Size mapping
  const sizeClasses = {
    sm: 'w-24 h-28',
    md: 'w-36 h-44',
    lg: 'w-48 h-56',
    xl: 'w-60 h-72',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center select-none transition-transform duration-200 ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${className}`}
    >
      <div className={`relative ${sizeClasses} flex items-center justify-center`}>
        <svg
          viewBox="0 0 240 300"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            <filter id={`shadow-${traits.name}`} x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.15" />
            </filter>
            <linearGradient id={`blondeGlow-${traits.name}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF275" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Pedestal / Shadow under feet */}
          <ellipse
            cx="120"
            cy={isShort ? 275 : 288}
            rx={isFat ? 52 : 36}
            ry="9"
            fill="#CBD5E1"
            opacity="0.6"
          />

          {/* LEGS & SHOES */}
          {isShort ? (
            // Short legs
            <g id="short-legs">
              {/* Left leg */}
              <rect x={isFat ? 88 : 96} y="225" width={isFat ? 20 : 16} height="36" rx="8" fill={pantsColor} />
              <ellipse cx={isFat ? 98 : 104} cy="265" rx="14" ry="9" fill="#1E293B" />
              <ellipse cx={isFat ? 98 : 104} cy="263" rx="12" ry="4" fill="#FFFFFF" opacity="0.3" />

              {/* Right leg */}
              <rect x={isFat ? 132 : 128} y="225" width={isFat ? 20 : 16} height="36" rx="8" fill={pantsColor} />
              <ellipse cx={isFat ? 142 : 136} cy="265" rx="14" ry="9" fill="#1E293B" />
              <ellipse cx={isFat ? 142 : 136} cy="263" rx="12" ry="4" fill="#FFFFFF" opacity="0.3" />
            </g>
          ) : (
            // Tall legs
            <g id="tall-legs">
              {/* Left leg */}
              <rect x={isFat ? 88 : 98} y="210" width={isFat ? 22 : 16} height="65" rx="8" fill={pantsColor} />
              <ellipse cx={isFat ? 99 : 106} cy="278" rx="15" ry="10" fill="#1E293B" />
              <ellipse cx={isFat ? 99 : 106} cy="275" rx="13" ry="5" fill="#FFFFFF" opacity="0.3" />

              {/* Right leg */}
              <rect x={isFat ? 130 : 126} y="210" width={isFat ? 22 : 16} height="65" rx="8" fill={pantsColor} />
              <ellipse cx={isFat ? 141 : 134} cy="278" rx="15" ry="10" fill="#1E293B" />
              <ellipse cx={isFat ? 141 : 134} cy="275" rx="13" ry="5" fill="#FFFFFF" opacity="0.3" />
            </g>
          )}

          {/* BODY / TORSO */}
          {isFat ? (
            // Fat round body
            <g id="fat-body">
              {/* Arms */}
              <path
                d="M 60 170 Q 40 195 55 215 Q 65 220 75 200 Z"
                fill={shirtColor}
              />
              <circle cx="55" cy="216" r="10" fill={skinColor} />

              <path
                d="M 180 170 Q 200 195 185 215 Q 175 220 165 200 Z"
                fill={shirtColor}
              />
              <circle cx="185" cy="216" r="10" fill={skinColor} />

              {/* Round Chubby Tummy */}
              <ellipse cx="120" cy="190" rx="56" ry="45" fill={shirtColor} />
              {/* Cute belt/shirt stripe */}
              <path
                d="M 75 215 Q 120 230 165 215"
                stroke="#1E293B"
                strokeWidth="4"
                fill="none"
              />
              <rect x="112" y="215" width="16" height="12" rx="3" fill="#FBBF24" />
            </g>
          ) : (
            // Thin slender body
            <g id="thin-body">
              {/* Slender Arms */}
              <path
                d="M 80 165 Q 65 190 72 210 Q 78 215 88 195 Z"
                fill={shirtColor}
              />
              <circle cx="72" cy="212" r="7" fill={skinColor} />

              <path
                d="M 160 165 Q 175 190 168 210 Q 162 215 152 195 Z"
                fill={shirtColor}
              />
              <circle cx="168" cy="212" r="7" fill={skinColor} />

              {/* Slim Torso */}
              <rect x="94" y="155" width="52" height="60" rx="14" fill={shirtColor} />
              {/* Tie or badge */}
              <polygon points="120,165 125,185 120,195 115,185" fill="#EF4444" />
            </g>
          )}

          {/* BACK HAIR (For long straight or big curly hair) */}
          {isStraight ? (
            <g id="back-hair-straight">
              <path
                d="M 65 95 C 60 150, 60 185, 62 205 Q 80 208 85 190 L 85 105 Z"
                fill={hairColorHex}
              />
              <path
                d="M 175 95 C 180 150, 180 185, 178 205 Q 160 208 155 190 L 155 105 Z"
                fill={hairColorHex}
              />
            </g>
          ) : (
            <g id="back-hair-curly">
              <circle cx="68" cy="115" r="18" fill={hairColorHex} />
              <circle cx="62" cy="140" r="16" fill={hairColorHex} />
              <circle cx="172" cy="115" r="18" fill={hairColorHex} />
              <circle cx="178" cy="140" r="16" fill={hairColorHex} />
            </g>
          )}

          {/* NECK */}
          <rect
            x={isFat ? 108 : 112}
            y="136"
            width={isFat ? 24 : 16}
            height="22"
            rx="5"
            fill={shadowSkinColor}
          />

          {/* HEAD / FACE */}
          {isFat ? (
            // Chubby round cheeks
            <g id="fat-head">
              <ellipse cx="120" cy="100" rx="48" ry="46" fill={skinColor} />
              {/* Chubby cheeks */}
              <ellipse cx="80" cy="112" rx="14" ry="12" fill={skinColor} />
              <ellipse cx="160" cy="112" rx="14" ry="12" fill={skinColor} />
              {/* Rosy blush */}
              <circle cx="82" cy="112" r="8" fill={blushColor} opacity="0.45" />
              <circle cx="158" cy="112" r="8" fill={blushColor} opacity="0.45" />
            </g>
          ) : (
            // Thin oval head
            <g id="thin-head">
              <ellipse cx="120" cy="98" rx="38" ry="43" fill={skinColor} />
              {/* Rosy blush */}
              <circle cx="94" cy="110" r="6" fill={blushColor} opacity="0.4" />
              <circle cx="146" cy="110" r="6" fill={blushColor} opacity="0.4" />
            </g>
          )}

          {/* EARS */}
          <circle cx={isFat ? 70 : 80} cy="100" r="9" fill={skinColor} />
          <circle cx={isFat ? 70 : 80} cy="100" r="5" fill={shadowSkinColor} />
          <circle cx={isFat ? 170 : 160} cy="100" r="9" fill={skinColor} />
          <circle cx={isFat ? 170 : 160} cy="100" r="5" fill={shadowSkinColor} />

          {/* FACE EXPRESSION: CUTE VS UGLY (Silly Monster Style) */}
          {isUgly ? (
            <g id="ugly-face">
              {/* Funny mismatched goofy googly eyes */}
              <circle cx="102" cy="90" r="14" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
              <circle cx="106" cy="88" r="6" fill="#0F172A" />
              <circle cx="104" cy="86" r="2" fill="#FFFFFF" />

              <circle cx="138" cy="94" r="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
              <circle cx="135" cy="95" r="4" fill="#0F172A" />

              {/* Playful goofy eyebrows */}
              <path d="M 90 75 Q 105 82 114 74" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 130 84 Q 140 76 148 83" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />

              {/* Big goofy crooked smile with single tooth */}
              <path
                d="M 98 116 Q 120 134 142 114"
                stroke="#0F172A"
                strokeWidth="3.5"
                fill="#831843"
              />
              <rect x="114" y="116" width="9" height="9" rx="1" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />

              {/* Quirky cute green monster spots / warts */}
              <circle cx="88" cy="96" r="4" fill="#84CC16" />
              <circle cx="148" cy="116" r="5" fill="#84CC16" />
              {/* Cute little goofy antennae / horn */}
              <path d="M 120 55 Q 128 35 138 38" stroke="#84CC16" strokeWidth="4" fill="none" strokeLinecap="round" />
              <circle cx="138" cy="38" r="5" fill="#EAB308" />
            </g>
          ) : (
            <g id="cute-face">
              {/* Cute sparkling cartoon eyes */}
              <ellipse cx="104" cy="95" rx="8" ry="9" fill="#1E293B" />
              <circle cx="102" cy="92" r="3.5" fill="#FFFFFF" />
              <circle cx="106" cy="97" r="1.5" fill="#FFFFFF" />

              <ellipse cx="136" cy="95" rx="8" ry="9" fill="#1E293B" />
              <circle cx="134" cy="92" r="3.5" fill="#FFFFFF" />
              <circle cx="138" cy="97" r="1.5" fill="#FFFFFF" />

              {/* Gentle curved eyebrows */}
              <path d="M 96 82 Q 104 78 112 82" stroke="#475569" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 128 82 Q 136 78 144 82" stroke="#475569" strokeWidth="2.5" fill="none" strokeLinecap="round" />

              {/* Cute button nose */}
              <circle cx="120" cy="106" r="2.5" fill={shadowSkinColor} />

              {/* Sweet happy open smile */}
              <path
                d="M 108 116 Q 120 130 132 116"
                stroke="#1E293B"
                strokeWidth="2.5"
                fill="#EF4444"
              />
            </g>
          )}

          {/* FACIAL HAIR: MOUSTACHE & BEARD */}
          {/* BEARD (Under chin and cheeks) */}
          {hasBeard && (
            <g id="beard">
              <path
                d="M 85 106 Q 85 142 120 148 Q 155 142 155 106 Q 146 135 120 138 Q 94 135 85 106 Z"
                fill={hairColorHex}
                stroke={hairShadowHex}
                strokeWidth="2"
              />
              {/* Beard texture strokes */}
              <path d="M 112 138 Q 120 146 128 138" stroke={hairShadowHex} strokeWidth="1.5" fill="none" />
              <path d="M 105 132 Q 120 142 135 132" stroke={hairShadowHex} strokeWidth="1.5" fill="none" />
            </g>
          )}

          {/* MOUSTACHE (Above lip, below nose) */}
          {hasMoustache && (
            <g id="moustache">
              {/* Left wing */}
              <path
                d="M 120 113 Q 104 108 96 116 Q 106 122 120 116 Z"
                fill={hairColorHex}
                stroke={hairShadowHex}
                strokeWidth="1.5"
              />
              {/* Right wing */}
              <path
                d="M 120 113 Q 136 108 144 116 Q 134 122 120 116 Z"
                fill={hairColorHex}
                stroke={hairShadowHex}
                strokeWidth="1.5"
              />
              {/* Center cute notch */}
              <circle cx="120" cy="113" r="3" fill={hairColorHex} />
            </g>
          )}

          {/* FRONT HAIR (STRAIGHT VS CURLY / BLONDE VS OTHER) */}
          {isStraight ? (
            <g id="front-hair-straight">
              {/* Sleek straight bangs */}
              <path
                d="M 80 85 C 80 50, 160 50, 160 85 C 150 72, 135 68, 120 72 C 105 68, 90 72, 80 85 Z"
                fill={hairColorHex}
              />
              {/* Straight bangs fringe */}
              <path
                d="M 84 80 L 88 95 L 94 80 L 102 96 L 110 79 L 120 95 L 130 79 L 138 96 L 146 80 L 152 95 L 156 80"
                stroke={hairColorHex}
                strokeWidth="2.5"
                fill="none"
              />
              {/* Blonde shine highlight */}
              {isBlonde && (
                <path
                  d="M 95 62 Q 120 54 145 62"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.65"
                  fill="none"
                />
              )}
            </g>
          ) : (
            <g id="front-hair-curly">
              {/* Bouncy cute curls */}
              <circle cx="85" cy="68" r="16" fill={hairColorHex} />
              <circle cx="105" cy="58" r="18" fill={hairColorHex} />
              <circle cx="135" cy="58" r="18" fill={hairColorHex} />
              <circle cx="155" cy="68" r="16" fill={hairColorHex} />
              <circle cx="120" cy="52" r="19" fill={hairColorHex} />

              {/* Curly texture swirls */}
              <path d="M 88 64 Q 94 70 88 74" stroke={hairShadowHex} strokeWidth="2" fill="none" />
              <path d="M 115 54 Q 124 60 118 66" stroke={hairShadowHex} strokeWidth="2" fill="none" />
              <path d="M 148 64 Q 154 70 148 74" stroke={hairShadowHex} strokeWidth="2" fill="none" />

              {isBlonde && (
                <circle cx="118" cy="48" r="6" fill="#FFF275" opacity="0.7" />
              )}
            </g>
          )}

          {/* Active Highlight Ring (when selecting or clue target) */}
          {highlightTrait && (
            <circle
              cx="120"
              cy="150"
              r="115"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="4"
              strokeDasharray="8 8"
              className="animate-spin-slow"
            />
          )}
        </svg>
      </div>

      {/* Name and Traits Label Deck */}
      {showLabels && (
        <div className="mt-2 text-center max-w-[200px]">
          <span className="font-bold text-slate-800 text-sm tracking-tight block truncate">
            {traits.name}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1 mt-1 text-[11px] text-slate-600">
            <span className={traits.height === 'short' ? 'font-bold text-amber-700' : ''}>
              {traits.height === 'short' ? 'short (矮)' : 'tall (高)'}
            </span>
            <span className="text-slate-300">·</span>
            <span className={traits.build === 'fat' ? 'font-bold text-blue-700' : 'font-bold text-emerald-700'}>
              {traits.build === 'fat' ? 'fat (胖)' : 'thin (瘦)'}
            </span>
            <span className="text-slate-300">·</span>
            <span className={traits.hairColor === 'blonde' ? 'font-bold text-amber-600' : ''}>
              {traits.hairColor === 'blonde' ? 'blonde (金发)' : traits.hairColor}
            </span>
            {traits.hairStyle === 'straight' && (
              <>
                <span className="text-slate-300">·</span>
                <span className="font-bold text-purple-700">straight (直发)</span>
              </>
            )}
            {hasMoustache && (
              <>
                <span className="text-slate-300">·</span>
                <span className="font-bold text-orange-700">moustache (小胡子)</span>
              </>
            )}
            {hasBeard && (
              <>
                <span className="text-slate-300">·</span>
                <span className="font-bold text-amber-800">beard (大胡子)</span>
              </>
            )}
            {isFair && (
              <>
                <span className="text-slate-300">·</span>
                <span className="font-bold text-pink-700">fair (白皙)</span>
              </>
            )}
            {isUgly && (
              <>
                <span className="text-slate-300">·</span>
                <span className="font-bold text-indigo-700">ugly (怪萌)</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

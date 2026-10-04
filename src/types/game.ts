export type TargetWord =
  | 'short'
  | 'thin'
  | 'straight'
  | 'blonde'
  | 'moustache'
  | 'beard'
  | 'fat'
  | 'fair'
  | 'ugly';

export interface VocabularyItem {
  id: TargetWord;
  word: string;
  ipa: string;
  chinese: string;
  category: 'height' | 'build' | 'hair_type' | 'hair_color' | 'facial_hair' | 'complexion' | 'looks';
  categoryLabel: string;
  definition: string;
  example: string;
  exampleZh: string;
  antonym?: string;
  antonymZh?: string;
  chant: string;
  phonicsTip: string;
  cuteEmoji: string;
}

export interface CharacterTraits {
  id?: string;
  name: string;
  height: 'short' | 'tall';
  build: 'thin' | 'fat';
  hairStyle: 'straight' | 'curly';
  hairColor: 'blonde' | 'brown' | 'black' | 'red';
  facialHair: 'none' | 'moustache' | 'beard' | 'both';
  skinTone: 'fair' | 'tan';
  faceStyle: 'cute' | 'ugly';
  gender: 'boy' | 'girl';
  outfitColor?: string;
}

export type GameMode =
  | 'detective'
  | 'avatar_lab'
  | 'flashcards'
  | 'word_pop'
  | 'teacher_toolkit';

export interface CaseClue {
  targetTrait: TargetWord;
  text: string;
  audioText: string;
}

export interface DetectiveCase {
  id: string;
  caseNumber: number;
  suspects: CharacterTraits[];
  correctSuspectId: string;
  clues: CaseClue[];
  descriptionSentence: string;
}

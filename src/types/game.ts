/**
 * Digital Mystery Room - Core Type Definitions
 * Academic B.Tech CSE Semester Project
 */

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type GameScreen = 'LANDING' | 'HUB' | 'STORY' | 'ROOM' | 'VICTORY' | 'GAME_OVER';

export type RoomId = 'the-vault' | 'secret-lab' | 'cyber-room' | 'haunted-room';

export type RoomObjectId = string;

export interface RoomObjectInfo {
  id: RoomObjectId;
  name: string;
  subtitle: string;
  description: string;
  detailedInspection: string;
  image?: string;
  hasClue: boolean;
  clueId?: string;
  hasPuzzle: boolean;
  puzzleId?: number;
  position: {
    x: number; // percentage in room
    y: number; // percentage in room
  };
  unlockCondition?: string;
  isUnlocked?: boolean;
}

export interface ClueItem {
  id: string;
  title: string;
  type: 'Numerical' | 'Symbolic' | 'Decryption' | 'Schematic' | 'Chronometric' | 'Occult';
  summary: string;
  content: string;
  associatedObject: RoomObjectId;
  targetPuzzleId: number;
  badgeLabel: string;
  discoveredAt?: number;
}

export interface RuneSymbol {
  id: string;
  glyph: string;
  name: string;
}

export interface PuzzleInfo {
  id: number;
  roomId?: RoomId;
  title: string;
  codename: string;
  description: string;
  instructions: string;
  relatedClueIds: string[];
  maxHints: number;
  hints: string[];
  points: number;
  puzzleType?: 'numeric' | 'symbol' | 'cipher' | 'logic' | 'final-code';
  config?: {
    expectedCode?: string;
    expectedCodes?: string[];
    availableRunes?: RuneSymbol[];
    expectedSequence?: string[];
    ciphertext?: string;
    shift?: number;
    plaintext?: string;
    switchesSolution?: boolean[];
    checklistItems?: Array<{ id: number; label: string }>;
  };
}

export interface RoomDefinition {
  id: RoomId;
  title: string;
  icon: string;
  tagline: string;
  description: string;
  story: string;
  status: 'Available';
  difficultyRecommendation: string;
  backgroundImage: string;
  themeColor: {
    border: string;
    glow: string;
    accent: string;
    badgeBg: string;
    text: string;
  };
  objects: RoomObjectInfo[];
  clues: ClueItem[];
  puzzles: PuzzleInfo[];
  finalCode: string;
}

export interface RoomProgress {
  roomId: RoomId;
  difficulty: Difficulty;
  timeRemaining: number; // seconds
  initialTime: number; // seconds
  hintsRemaining: number;
  hintsUsed: number;
  discoveredClueIds: string[];
  solvedPuzzleIds: number[];
  inspectedObjectIds: string[];
  score: number;
  isEscaped: boolean;
  startedAt: number;
  elapsedTime: number;
  completedAt?: number;
}

export interface GameProgress {
  screen: GameScreen;
  currentRoomId: RoomId;
  difficulty: Difficulty;
  rooms: Record<RoomId, RoomProgress>;
  soundEnabled: boolean;

  // Active room mirrors for backward-compatibility & direct access:
  timeRemaining: number;
  initialTime: number;
  hintsRemaining: number;
  hintsUsed: number;
  discoveredClueIds: string[];
  solvedPuzzleIds: number[];
  inspectedObjectIds: string[];
  score: number;
  isEscaped: boolean;
  startedAt: number;
  elapsedTime: number;
}

export interface GameScoreBreakdown {
  basePuzzlePoints: number;
  timeBonus: number;
  clueDiscoveryBonus: number;
  hintPenalty: number;
  difficultyMultiplier: number;
  finalScore: number;
  rank: string;
  title: string;
}

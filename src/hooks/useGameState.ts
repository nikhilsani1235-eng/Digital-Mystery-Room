/**
 * Multi-Room Game State Management Hook
 * Supports independent per-room persistence in localStorage, active room loop,
 * timer management, score computation, clue discovery, and Mystery Game Hub switching.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Difficulty,
  GameScreen,
  RoomId,
  RoomObjectId,
  RoomProgress,
  GameProgress,
  GameScoreBreakdown,
  RoomObjectInfo,
} from '../types/game';
import {
  DIFFICULTY_CONFIG,
  ROOMS_CONFIG,
  getRoomDefinition,
  getRoomObjects,
  getRoomClues,
  getRoomPuzzles,
} from '../data/gameData';
import { sound } from '../utils/audio';

const HUB_STORAGE_KEY = 'digital_mystery_room_hub_v2';
const LEGACY_STORAGE_KEY = 'digital_mystery_room_state_v1';

const ALL_ROOM_IDS: RoomId[] = ['the-vault', 'secret-lab', 'cyber-room', 'haunted-room'];

const createInitialRoomProgress = (roomId: RoomId, difficulty: Difficulty = 'MEDIUM'): RoomProgress => {
  const config = DIFFICULTY_CONFIG[difficulty];
  return {
    roomId,
    difficulty,
    timeRemaining: config.timeLimitSeconds,
    initialTime: config.timeLimitSeconds,
    hintsRemaining: config.maxHints,
    hintsUsed: 0,
    discoveredClueIds: [],
    solvedPuzzleIds: [],
    inspectedObjectIds: [],
    score: 0,
    isEscaped: false,
    startedAt: Date.now(),
    elapsedTime: 0,
  };
};

const createDefaultRooms = (): Record<RoomId, RoomProgress> => {
  return {
    'the-vault': createInitialRoomProgress('the-vault', 'MEDIUM'),
    'secret-lab': createInitialRoomProgress('secret-lab', 'MEDIUM'),
    'cyber-room': createInitialRoomProgress('cyber-room', 'MEDIUM'),
    'haunted-room': createInitialRoomProgress('haunted-room', 'MEDIUM'),
  };
};

export function useGameState() {
  const [screen, setScreenState] = useState<GameScreen>('LANDING');
  const [currentRoomId, setCurrentRoomId] = useState<RoomId>('the-vault');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [rooms, setRooms] = useState<Record<RoomId, RoomProgress>>(() => {
    try {
      const saved = localStorage.getItem(HUB_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const loaded: Record<RoomId, RoomProgress> = createDefaultRooms();
          ALL_ROOM_IDS.forEach((id) => {
            if (parsed[id]) {
              loaded[id] = { ...loaded[id], ...parsed[id] };
            }
          });
          return loaded;
        }
      }

      // Check legacy single-room storage for migration
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy);
        const defaults = createDefaultRooms();
        if (parsedLegacy) {
          defaults['cyber-room'] = {
            ...defaults['cyber-room'],
            timeRemaining: parsedLegacy.timeRemaining ?? defaults['cyber-room'].timeRemaining,
            difficulty: parsedLegacy.difficulty ?? 'MEDIUM',
            hintsRemaining: parsedLegacy.hintsRemaining ?? defaults['cyber-room'].hintsRemaining,
            hintsUsed: parsedLegacy.hintsUsed ?? 0,
            discoveredClueIds: parsedLegacy.discoveredClueIds ?? [],
            solvedPuzzleIds: parsedLegacy.solvedPuzzleIds ?? [],
            inspectedObjectIds: parsedLegacy.inspectedObjectIds ?? [],
            score: parsedLegacy.score ?? 0,
            isEscaped: parsedLegacy.isEscaped ?? false,
          };
        }
        return defaults;
      }
    } catch {
      // Fallback
    }
    return createDefaultRooms();
  });

  const [activeObject, setActiveObject] = useState<RoomObjectInfo | null>(null);
  const [activePuzzleId, setActivePuzzleId] = useState<number | null>(null);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState<{ title: string; message: string } | null>(null);

  // Sync sound setting to sound engine
  useEffect(() => {
    sound.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Persist all rooms independently to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HUB_STORAGE_KEY, JSON.stringify(rooms));
    } catch {
      // Storage error fallback
    }
  }, [rooms]);

  // Current room progress slice
  const activeRoom = rooms[currentRoomId] || rooms['cyber-room'];

  // Notification clear timeout
  const notifTimerRef = useRef<NodeJS.Timeout | null>(null);
  const notify = useCallback((title: string, message: string) => {
    if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    setActiveNotification({ title, message });
    notifTimerRef.current = setTimeout(() => {
      setActiveNotification(null);
    }, 4500);
  }, []);

  // Countdown timer loop for active room
  useEffect(() => {
    if (screen !== 'ROOM' || activeRoom.isEscaped || activeRoom.timeRemaining <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setRooms((prev) => {
        const cur = prev[currentRoomId];
        if (!cur || cur.isEscaped || cur.timeRemaining <= 0) return prev;

        if (cur.timeRemaining <= 1) {
          sound.playWrong();
          setScreenState('GAME_OVER');
          return {
            ...prev,
            [currentRoomId]: {
              ...cur,
              timeRemaining: 0,
            },
          };
        }

        const newTime = cur.timeRemaining - 1;
        if (newTime <= 120 && newTime % 15 === 0) {
          sound.playTimerWarning();
        }

        return {
          ...prev,
          [currentRoomId]: {
            ...cur,
            timeRemaining: newTime,
            elapsedTime: cur.elapsedTime + 1,
          },
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [screen, currentRoomId, activeRoom.isEscaped, activeRoom.timeRemaining]);

  const toggleSound = useCallback(() => {
    sound.playClick();
    setSoundEnabled((prev) => !prev);
  }, []);

  const setScreen = useCallback((newScreen: GameScreen) => {
    sound.playClick();
    setScreenState(newScreen);
  }, []);

  const selectRoom = useCallback((roomId: RoomId) => {
    sound.playClick();
    setCurrentRoomId(roomId);
    setActiveObject(null);
    setActivePuzzleId(null);
    const targetRoom = rooms[roomId];
    if (targetRoom && targetRoom.isEscaped) {
      // If completed previously, open story to let them replay or review
      setScreenState('STORY');
    } else if (targetRoom && targetRoom.inspectedObjectIds.length > 0) {
      // If already started, resume room
      setScreenState('ROOM');
      notify(
        'Resuming Room',
        `Investigating ${ROOMS_CONFIG[roomId].title}. Your saved progress has been restored.`
      );
    } else {
      // Brand new room start
      setScreenState('STORY');
    }
  }, [rooms, notify]);

  const startNewGame = useCallback((difficulty: Difficulty) => {
    sound.playClick();
    setRooms((prev) => ({
      ...prev,
      [currentRoomId]: createInitialRoomProgress(currentRoomId, difficulty),
    }));
    setActiveObject(null);
    setActivePuzzleId(null);
  }, [currentRoomId]);

  const resetRoom = useCallback((roomIdToReset?: RoomId) => {
    sound.playClick();
    const target = roomIdToReset || currentRoomId;
    const diff = rooms[target]?.difficulty || 'MEDIUM';
    setRooms((prev) => ({
      ...prev,
      [target]: createInitialRoomProgress(target, diff),
    }));
    setActiveObject(null);
    setActivePuzzleId(null);
    notify('Room Reset', `${ROOMS_CONFIG[target].title} progress has been reset. Other rooms are preserved.`);
  }, [currentRoomId, rooms, notify]);

  const continueSavedGame = useCallback(() => {
    sound.playClick();
    // Find first room with in-progress state or default to current
    const inProgressRoom = ALL_ROOM_IDS.find(
      (id) => !rooms[id].isEscaped && rooms[id].inspectedObjectIds.length > 0 && rooms[id].timeRemaining > 0
    );
    const target = inProgressRoom || currentRoomId;
    setCurrentRoomId(target);
    setScreenState('ROOM');
    notify('Session Restored', `Resuming ${ROOMS_CONFIG[target].title}.`);
  }, [rooms, currentRoomId, notify]);

  const hasSavedGame = useCallback(() => {
    return ALL_ROOM_IDS.some(
      (id) => !rooms[id].isEscaped && rooms[id].inspectedObjectIds.length > 0 && rooms[id].timeRemaining > 0
    );
  }, [rooms]);

  const inspectObject = useCallback((objectId: RoomObjectId) => {
    sound.playClick();
    const roomObjects = getRoomObjects(currentRoomId);
    const obj = roomObjects.find((o) => o.id === objectId);
    if (!obj) return;

    setActiveObject(obj);

    setRooms((prev) => {
      const cur = prev[currentRoomId];
      if (!cur) return prev;

      const inspected = cur.inspectedObjectIds.includes(objectId)
        ? cur.inspectedObjectIds
        : [...cur.inspectedObjectIds, objectId];

      let newClues = cur.discoveredClueIds;
      if (obj.hasClue && obj.clueId && !newClues.includes(obj.clueId)) {
        newClues = [...newClues, obj.clueId];
        sound.playClueFound();
        const roomClues = getRoomClues(currentRoomId);
        const clue = roomClues.find((c) => c.id === obj.clueId);
        if (clue) {
          notify('Clue Discovered!', `Found "${clue.title}". Added to Clue Inventory.`);
        }
      }

      return {
        ...prev,
        [currentRoomId]: {
          ...cur,
          inspectedObjectIds: inspected,
          discoveredClueIds: newClues,
        },
      };
    });
  }, [currentRoomId, notify]);

  const solvePuzzle = useCallback((puzzleId: number) => {
    const roomPuzzles = getRoomPuzzles(currentRoomId);
    const puzzle = roomPuzzles.find((p) => p.id === puzzleId);
    if (!puzzle) return;

    sound.playCorrect();

    setRooms((prev) => {
      const cur = prev[currentRoomId];
      if (!cur) return prev;
      if (cur.solvedPuzzleIds.includes(puzzleId)) return prev;

      const solved = [...cur.solvedPuzzleIds, puzzleId];
      const newScore = cur.score + puzzle.points;

      // Check special clue unlocks for rooms
      let discoveredClues = cur.discoveredClueIds;
      // In cyber room: puzzle 1 unlocks clue 8
      if (currentRoomId === 'cyber-room' && puzzleId === 1 && !discoveredClues.includes('clue-8')) {
        discoveredClues = [...discoveredClues, 'clue-8'];
        notify('Vault Opened!', 'Obtained Clue 08: Master Door Override Dossier.');
      } else if (currentRoomId === 'the-vault' && puzzleId === 102 && !discoveredClues.includes('v-clue-3')) {
        discoveredClues = [...discoveredClues, 'v-clue-3'];
        notify('Safe Unlocked!', 'Obtained Emergency Keycard Dossier.');
      } else if (currentRoomId === 'secret-lab' && puzzleId === 201 && !discoveredClues.includes('lab-clue-2')) {
        discoveredClues = [...discoveredClues, 'lab-clue-2'];
        notify('Cabinet Opened!', 'Retrieved Incident Log & Terminal Decryption Token.');
      } else if (currentRoomId === 'haunted-room' && puzzleId === 302 && !discoveredClues.includes('h-clue-3')) {
        discoveredClues = [...discoveredClues, 'h-clue-3'];
        notify('Drawer Unlocked!', 'Obtained the Manor Exit Diary.');
      } else {
        notify('Puzzle Solved!', `Cleared "${puzzle.title}". Lockdown security reduced.`);
      }

      // Check if this is the final escape puzzle for this room
      const isFinalPuzzle =
        puzzle.puzzleType === 'final-code' ||
        puzzleId === 5 ||
        puzzleId === 103 ||
        puzzleId === 203 ||
        puzzleId === 303;

      if (isFinalPuzzle) {
        sound.playDoorUnlock();
        setScreenState('VICTORY');
        return {
          ...prev,
          [currentRoomId]: {
            ...cur,
            solvedPuzzleIds: solved,
            discoveredClueIds: discoveredClues,
            score: newScore,
            isEscaped: true,
            completedAt: Date.now(),
          },
        };
      }

      return {
        ...prev,
        [currentRoomId]: {
          ...cur,
          solvedPuzzleIds: solved,
          discoveredClueIds: discoveredClues,
          score: newScore,
        },
      };
    });
  }, [currentRoomId, notify]);

  const useHint = useCallback((puzzleId: number): string | null => {
    const roomPuzzles = getRoomPuzzles(currentRoomId);
    const puzzle = roomPuzzles.find((p) => p.id === puzzleId);
    if (!puzzle) return null;

    if (activeRoom.hintsRemaining <= 0) {
      sound.playWrong();
      notify('No Hints Left', 'You have exhausted all hints allocated for this room.');
      return null;
    }

    sound.playClick();
    const hintIdx = Math.min(activeRoom.hintsUsed, puzzle.hints.length - 1);
    const hintText = puzzle.hints[hintIdx];

    setRooms((prev) => {
      const cur = prev[currentRoomId];
      if (!cur) return prev;
      return {
        ...prev,
        [currentRoomId]: {
          ...cur,
          hintsRemaining: Math.max(0, cur.hintsRemaining - 1),
          hintsUsed: cur.hintsUsed + 1,
        },
      };
    });

    notify('Hint Unlocked', hintText);
    return hintText;
  }, [currentRoomId, activeRoom.hintsRemaining, activeRoom.hintsUsed, notify]);

  const calculateScoreBreakdown = useCallback((): GameScoreBreakdown => {
    const config = DIFFICULTY_CONFIG[activeRoom.difficulty];
    const roomPuzzles = getRoomPuzzles(currentRoomId);

    const basePuzzlePoints = activeRoom.solvedPuzzleIds.reduce((sum, pid) => {
      const p = roomPuzzles.find((item) => item.id === pid);
      return sum + (p ? p.points : 0);
    }, 0);

    const timeBonus = Math.floor(activeRoom.timeRemaining * 1.5);
    const clueDiscoveryBonus = activeRoom.discoveredClueIds.length * 60;
    const hintPenalty = activeRoom.hintsUsed * 50;

    const rawTotal = Math.max(0, basePuzzlePoints + timeBonus + clueDiscoveryBonus - hintPenalty);
    const finalScore = Math.floor(rawTotal * config.multiplier);

    let rank = 'Cadet 3rd Class';
    let title = 'Field Escape Apprentice';

    if (finalScore >= 2500) {
      rank = 'S-Tier Cyber Phantom';
      title = 'Master Cryptographer & Escape Prodigy';
    } else if (finalScore >= 1800) {
      rank = 'A-Tier Elite Hacker';
      title = 'Senior Mystery Investigator';
    } else if (finalScore >= 1200) {
      rank = 'B-Tier Detective';
      title = 'Proficient Digital Mystery Solver';
    } else if (finalScore >= 700) {
      rank = 'C-Tier Analyst';
      title = 'Competent Logic Operator';
    }

    return {
      basePuzzlePoints,
      timeBonus,
      clueDiscoveryBonus,
      hintPenalty,
      difficultyMultiplier: config.multiplier,
      finalScore,
      rank,
      title,
    };
  }, [activeRoom, currentRoomId]);

  // Aggregate progress object for backward compatibility
  const progress: GameProgress = {
    screen,
    currentRoomId,
    difficulty: activeRoom.difficulty,
    rooms,
    soundEnabled,
    timeRemaining: activeRoom.timeRemaining,
    initialTime: activeRoom.initialTime,
    hintsRemaining: activeRoom.hintsRemaining,
    hintsUsed: activeRoom.hintsUsed,
    discoveredClueIds: activeRoom.discoveredClueIds,
    solvedPuzzleIds: activeRoom.solvedPuzzleIds,
    inspectedObjectIds: activeRoom.inspectedObjectIds,
    score: activeRoom.score,
    isEscaped: activeRoom.isEscaped,
    startedAt: activeRoom.startedAt,
    elapsedTime: activeRoom.elapsedTime,
  };

  return {
    progress,
    rooms,
    currentRoomId,
    activeObject,
    activePuzzleId,
    isInventoryOpen,
    isHintModalOpen,
    isHowToPlayOpen,
    isAboutOpen,
    activeNotification,
    setActiveObject,
    setActivePuzzleId,
    setIsInventoryOpen,
    setIsHintModalOpen,
    setIsHowToPlayOpen,
    setIsAboutOpen,
    selectRoom,
    startNewGame,
    continueSavedGame,
    hasSavedGame,
    resetRoom,
    setScreen,
    toggleSound,
    inspectObject,
    solvePuzzle,
    useHint,
    calculateScoreBreakdown,
  };
}

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createMahjongLayout,
  reshuffleActiveTiles,
  type GameDifficulty,
  type MahjongTileData,
} from "@/utils/layout";
import { canMatch, findHintPair, isTileOpen } from "@/utils/match";

type MoveSnapshot = {
  combo: number;
  removedIds: [string, string];
  score: number;
  tiles: MahjongTileData[];
};

const MATCH_SCORE = 100;
const COMBO_BONUS = 25;
const DEFAULT_DIFFICULTY: GameDifficulty = "intermediate";

export function useMahjong() {
  const [tiles, setTiles] = useState<MahjongTileData[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hintIds, setHintIds] = useState<string[]>([]);
  const [history, setHistory] = useState<MoveSnapshot[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [difficulty, setDifficulty] = useState<GameDifficulty>(DEFAULT_DIFFICULTY);

  const remainingCount = useMemo(() => tiles.filter((tile) => !tile.removed).length, [tiles]);
  const isReady = tiles.length > 0;
  const isCleared = isReady && remainingCount === 0;

  useEffect(() => {
    newGame(DEFAULT_DIFFICULTY);
  }, []);

  useEffect(() => {
    if (!isReady || isCleared) {
      return;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isCleared, startedAt]);

  function newGame(nextDifficulty: GameDifficulty = difficulty) {
    setTiles(createMahjongLayout(nextDifficulty));
    setSelectedIds([]);
    setHintIds([]);
    setHistory([]);
    setScore(0);
    setCombo(0);
    setStartedAt(Date.now());
    setElapsedSeconds(0);
  }

  function changeDifficulty(nextDifficulty: GameDifficulty) {
    setDifficulty(nextDifficulty);
    newGame(nextDifficulty);
  }

  function selectTile(tileId: string) {
    const tile = tiles.find((candidate) => candidate.id === tileId);

    if (!tile || !isTileOpen(tile, tiles)) {
      return;
    }

    setHintIds([]);

    if (selectedIds.includes(tileId)) {
      setSelectedIds([]);
      return;
    }

    if (selectedIds.length === 0) {
      setSelectedIds([tileId]);
      return;
    }

    const first = tiles.find((candidate) => candidate.id === selectedIds[0]);

    if (!first) {
      setSelectedIds([tileId]);
      return;
    }

    if (!canMatch(first, tile)) {
      setSelectedIds([tileId]);
      setCombo(0);
      return;
    }

    const nextCombo = combo + 1;
    const nextScore = score + MATCH_SCORE + nextCombo * COMBO_BONUS;
    const removedIds: [string, string] = [first.id, tile.id];

    setHistory((current) => [
      ...current,
      {
        combo,
        removedIds,
        score,
        tiles,
      },
    ]);
    setTiles((current) =>
      current.map((candidate) =>
        removedIds.includes(candidate.id) ? { ...candidate, removed: true } : candidate,
      ),
    );
    setSelectedIds([]);
    setScore(nextScore);
    setCombo(nextCombo);
  }

  function showHint() {
    const pair = findHintPair(tiles);
    setHintIds(pair ? [pair[0].id, pair[1].id] : []);
  }

  function shuffleBoard() {
    setTiles((current) => reshuffleActiveTiles(current));
    setSelectedIds([]);
    setHintIds([]);
    setCombo(0);
  }

  function undo() {
    const previous = history.at(-1);

    if (!previous) {
      return;
    }

    setTiles(previous.tiles);
    setScore(previous.score);
    setCombo(previous.combo);
    setSelectedIds([]);
    setHintIds(previous.removedIds);
    setHistory((current) => current.slice(0, -1));
  }

  return {
    canUndo: history.length > 0,
    combo,
    difficulty,
    elapsedSeconds,
    hintIds,
    isCleared,
    remainingCount,
    score,
    selectedIds,
    tiles,
    clearSelection: () => setSelectedIds([]),
    changeDifficulty,
    newGame,
    selectTile,
    showHint,
    shuffleBoard,
    undo,
  };
}

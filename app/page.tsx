"use client";

import { useState } from "react";
import { CardPreviewModal } from "@/components/CardPreviewModal";
import { GameHeader } from "@/components/GameHeader";
import { MahjongBoard } from "@/components/MahjongBoard";
import { DEFAULT_LANGUAGE, type SupportedLanguageCode } from "@/data/wordCards";
import { useMahjong } from "@/hooks/useMahjong";

export default function Home() {
  const game = useMahjong();
  const [selectedLanguage, setSelectedLanguage] =
    useState<SupportedLanguageCode>(DEFAULT_LANGUAGE);
  const [showTranslations, setShowTranslations] = useState(true);
  const selectedTile =
    game.tiles.find((tile) => tile.id === game.selectedIds[game.selectedIds.length - 1]) ?? null;

  return (
    <main className="game-shell">
      <GameHeader
        combo={game.combo}
        difficulty={game.difficulty}
        elapsedSeconds={game.elapsedSeconds}
        isCleared={game.isCleared}
        remainingCount={game.remainingCount}
        score={game.score}
        selectedLanguage={selectedLanguage}
        showTranslations={showTranslations}
        canUndo={game.canUndo}
        onDifficultyChange={game.changeDifficulty}
        onHint={game.showHint}
        onLanguageChange={setSelectedLanguage}
        onNewGame={game.newGame}
        onShuffle={game.shuffleBoard}
        onToggleTranslations={() => setShowTranslations((current) => !current)}
        onUndo={game.undo}
      />
      <MahjongBoard
        hintIds={game.hintIds}
        selectedLanguage={selectedLanguage}
        selectedIds={game.selectedIds}
        showTranslations={showTranslations}
        tiles={game.tiles}
        onTileClick={game.selectTile}
      />
      <footer className="company-footer">
        <a href="https://onmaeumkr.com" target="_blank" rel="noreferrer">
          <img src="/brand/onmaeum-korean-logo.png" alt="한국어교육AI연구개발원" />
          <strong>한국어교육AI연구개발원</strong>
          <span>onmaeumkr.com</span>
        </a>
      </footer>
      <CardPreviewModal
        selectedLanguage={selectedLanguage}
        showTranslations={showTranslations}
        tile={selectedTile}
        onClose={() => game.clearSelection()}
      />
    </main>
  );
}

"use client";

import { useState } from "react";
import { LANGUAGE_OPTIONS } from "@/data/languages";
import { getUiText } from "@/data/uiText";
import type { SupportedLanguageCode } from "@/data/wordCards";
import type { GameDifficulty } from "@/utils/layout";

type GameHeaderProps = {
  canUndo: boolean;
  combo: number;
  difficulty: GameDifficulty;
  elapsedSeconds: number;
  isCleared: boolean;
  remainingCount: number;
  selectedLanguage: SupportedLanguageCode;
  showTranslations: boolean;
  score: number;
  onHint: () => void;
  onDifficultyChange: (difficulty: GameDifficulty) => void;
  onLanguageChange: (language: SupportedLanguageCode) => void;
  onNewGame: () => void;
  onShuffle: () => void;
  onToggleTranslations: () => void;
  onUndo: () => void;
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function GameHeader({
  canUndo,
  combo,
  difficulty,
  elapsedSeconds,
  isCleared,
  remainingCount,
  selectedLanguage,
  showTranslations,
  score,
  onHint,
  onDifficultyChange,
  onLanguageChange,
  onNewGame,
  onShuffle,
  onToggleTranslations,
  onUndo,
}: GameHeaderProps) {
  const text = getUiText(selectedLanguage);
  const [isLanguageSheetOpen, setIsLanguageSheetOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const selectedLanguageLabel =
    LANGUAGE_OPTIONS.find((language) => language.code === selectedLanguage)?.label ?? "English";

  return (
    <header className="game-header">
      <div className="brand-title">
        <img
          className="brand-logo sinavro-brand-logo"
          src="/icon.png"
          alt="시나브로"
        />
        <div className="title-block">
          <h1>
            <span>
              Sina
              <span style={{ color: "#22c55e", fontWeight: "bold" }}>V</span>
              ro
            </span>
          </h1>
          <p>Visual Vocabulary for Korean Learners</p>
        </div>
      </div>

      <section className="stats" aria-label={text.status}>
        <div className="stat">
          <span>{text.remaining}</span>
          <strong>{remainingCount}</strong>
        </div>
        <div className="stat">
          <span>{text.time}</span>
          <strong>{formatTime(elapsedSeconds)}</strong>
        </div>
        <div className="stat">
          <span>{text.score}</span>
          <strong>{score}</strong>
        </div>
        <div className="stat">
          <span>{text.combo}</span>
          <strong>{combo}</strong>
        </div>
        <div className="stat">
          <span>{text.status}</span>
          <strong>{isCleared ? text.clear : text.inProgress}</strong>
        </div>
      </section>

      <nav className="actions desktop-actions" aria-label={text.status}>
        <label className="language-control difficulty-control">
          <span>난이도</span>
          <select
            value={difficulty}
            onChange={(event) => onDifficultyChange(event.target.value as GameDifficulty)}
          >
            <option value="beginner">간단 · 10쌍</option>
            <option value="intermediate">보통 · 15쌍</option>
            <option value="advanced">많음 · 20쌍</option>
          </select>
        </label>
        <label className="language-control">
          <span>{text.language}</span>
          <select
            value={selectedLanguage}
            onChange={(event) => onLanguageChange(event.target.value as SupportedLanguageCode)}
            disabled={!showTranslations}
          >
            {LANGUAGE_OPTIONS.map((language) => (
              <option key={language.code} value={language.code}>
                {language.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className={showTranslations ? "toggle active" : "toggle"}
          onClick={onToggleTranslations}
          aria-pressed={showTranslations}
        >
          {showTranslations ? text.translationOn : text.translationOff}
        </button>
        <button type="button" onClick={onHint}>
          {text.hint}
        </button>
        <button type="button" onClick={onShuffle} disabled={isCleared}>
          {text.shuffle}
        </button>
        <button type="button" onClick={onUndo} disabled={!canUndo}>
          {text.undo}
        </button>
        <button className="primary" type="button" onClick={() => onNewGame()}>
          {text.newGame}
        </button>
      </nav>

      <nav className="mobile-actions" aria-label={text.status}>
        <button className="primary" type="button" onClick={() => onNewGame()}>
          {text.newGame}
        </button>
        <button type="button" onClick={onHint}>
          {text.hint}
        </button>
        <button type="button" onClick={onShuffle} disabled={isCleared}>
          {text.shuffle}
        </button>
        <button
          className="mobile-language-trigger"
          type="button"
          onClick={() => {
            setIsMoreMenuOpen(false);
            setIsLanguageSheetOpen(true);
          }}
        >
          <span aria-hidden="true">🌐</span>
          <span>{selectedLanguageLabel}</span>
        </button>
        <div className="more-menu-wrap">
          <button
            className="more-menu-trigger"
            type="button"
            aria-label="More game controls"
            aria-expanded={isMoreMenuOpen}
            onClick={() => setIsMoreMenuOpen((current) => !current)}
          >
            ⋮
          </button>
          {isMoreMenuOpen ? (
            <div className="more-menu" role="menu">
              <label className="more-difficulty-control">
                <span>난이도</span>
                <select
                  value={difficulty}
                  onChange={(event) => {
                    onDifficultyChange(event.target.value as GameDifficulty);
                    setIsMoreMenuOpen(false);
                  }}
                >
                  <option value="beginner">간단 · 10쌍</option>
                  <option value="intermediate">보통 · 15쌍</option>
                  <option value="advanced">많음 · 20쌍</option>
                </select>
              </label>
              <button
                type="button"
                className={showTranslations ? "toggle active" : "toggle"}
                onClick={() => {
                  onToggleTranslations();
                  setIsMoreMenuOpen(false);
                }}
              >
                {showTranslations ? text.translationOn : text.translationOff}
              </button>
              <button
                type="button"
                disabled={!canUndo}
                onClick={() => {
                  onUndo();
                  setIsMoreMenuOpen(false);
                }}
              >
                {text.undo}
              </button>
            </div>
          ) : null}
        </div>
      </nav>

      {isLanguageSheetOpen ? (
        <div
          className="language-sheet-backdrop"
          role="presentation"
          onClick={() => setIsLanguageSheetOpen(false)}
        >
          <section
            className="language-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={text.language}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="language-sheet-header">
              <h2>{text.language}</h2>
              <button
                type="button"
                aria-label="Close language menu"
                onClick={() => setIsLanguageSheetOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="language-sheet-list">
              {LANGUAGE_OPTIONS.map((language) => (
                <button
                  type="button"
                  key={language.code}
                  className={language.code === selectedLanguage ? "selected" : ""}
                  onClick={() => {
                    onLanguageChange(language.code);
                    setIsLanguageSheetOpen(false);
                  }}
                >
                  {language.label}
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </header>
  );
}

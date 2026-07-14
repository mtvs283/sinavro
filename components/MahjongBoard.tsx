import { MahjongTile } from "@/components/MahjongTile";
import type { SupportedLanguageCode } from "@/data/wordCards";
import type { MahjongTileData } from "@/utils/layout";
import { isTileOpen } from "@/utils/match";

type MahjongBoardProps = {
  hintIds: string[];
  selectedLanguage: SupportedLanguageCode;
  selectedIds: string[];
  showTranslations: boolean;
  tiles: MahjongTileData[];
  onTileClick: (tileId: string) => void;
};

export function MahjongBoard({
  hintIds,
  selectedLanguage,
  selectedIds,
  showTranslations,
  tiles,
  onTileClick,
}: MahjongBoardProps) {
  return (
    <section className="board-wrap" aria-label="마작 솔리테어 보드">
      <div className="board">
        <img className="board-teacher-logo" src="/brand/teacher-logo.png" alt="TK쌤" />
        {tiles.map((tile) => (
          <MahjongTile
            key={tile.id}
            tile={tile}
            isOpen={isTileOpen(tile, tiles)}
            isSelected={selectedIds.includes(tile.id)}
            isHinted={hintIds.includes(tile.id)}
            selectedLanguage={selectedLanguage}
            showTranslations={showTranslations}
            onClick={onTileClick}
          />
        ))}
      </div>
    </section>
  );
}

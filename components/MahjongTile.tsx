import type { SupportedLanguageCode } from "@/data/wordCards";
import type { MahjongTileData } from "@/utils/layout";

type MahjongTileProps = {
  isHinted: boolean;
  isOpen: boolean;
  isSelected: boolean;
  selectedLanguage: SupportedLanguageCode;
  showTranslations: boolean;
  tile: MahjongTileData;
  onClick: (tileId: string) => void;
};

export function MahjongTile({
  isHinted,
  isOpen,
  isSelected,
  tile,
  onClick,
}: MahjongTileProps) {
  const partOfSpeechLabel = {
    adjective: "형용사",
    noun: "명사",
    verb: "동사",
  }[tile.category];
  const classes = [
    "tile",
    isOpen ? "open" : "closed",
    isSelected ? "selected" : "",
    isHinted ? "hinted" : "",
    tile.removed ? "removed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      disabled={!isOpen || tile.removed}
      onClick={() => onClick(tile.id)}
      style={
        {
          "--tile-x": `${tile.col * 10.5 + tile.layer * 2}%`,
          "--tile-y": `${tile.row * 15 - tile.layer * 4}%`,
          zIndex: tile.layer * 100 + tile.row * 10 + tile.col,
        } as React.CSSProperties
      }
      aria-label={`${tile.label} 카드`}
      aria-pressed={isSelected}
    >
      <span className="tile-card">
        <span className="tile-face tile-front">
          <span className="tile-category">{partOfSpeechLabel}</span>
          <span className="tile-label">{tile.label}</span>
        </span>
        <span className="tile-face tile-back">
          {tile.imageSrc ? (
            <span className="tile-picture">
              <img src={tile.imageSrc} alt="" />
            </span>
          ) : null}
        </span>
      </span>
    </button>
  );
}

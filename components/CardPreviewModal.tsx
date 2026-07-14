import type { SupportedLanguageCode } from "@/data/wordCards";
import { getUiText } from "@/data/uiText";
import type { MahjongTileData } from "@/utils/layout";

type CardPreviewModalProps = {
  selectedLanguage: SupportedLanguageCode;
  showTranslations: boolean;
  tile: MahjongTileData | null;
  onClose: () => void;
};

function shortTranslation(value: string) {
  return value.split(";")[0].split(",")[0].trim() || value;
}

export function CardPreviewModal({
  selectedLanguage,
  showTranslations,
  tile,
  onClose,
}: CardPreviewModalProps) {
  if (!tile) {
    return null;
  }

  const text = getUiText(selectedLanguage);
  const translation = tile.translations[selectedLanguage];
  const translatedWord = translation?.word ? shortTranslation(translation.word) : "";

  return (
    <aside className="preview-modal" aria-label="선택한 단어 카드">
      <button className="preview-close" type="button" onClick={onClose} aria-label="Close">
        ×
      </button>
      <div className="preview-image">
        {tile.imageSrc ? <img src={tile.imageSrc} alt="" /> : <span>{text.noImage}</span>}
      </div>
      <div className="preview-copy">
        <strong>{tile.label}</strong>
        {showTranslations && translatedWord ? <span>{translatedWord}</span> : null}
        {showTranslations && translation?.definition ? <p>{translation.definition}</p> : null}
      </div>
    </aside>
  );
}

import { DEFAULT_LANGUAGE, WORD_CARDS, type SupportedLanguageCode } from "@/data/wordCards";

export type TileContent = {
  groupId: string;
  category: "noun" | "verb" | "adjective";
  label: string;
  subLabel: string;
  imageSrc?: string;
  translations: Record<
    SupportedLanguageCode,
    {
      language: string;
      word: string;
      definition: string;
    }
  >;
};

export type TilePosition = {
  row: number;
  col: number;
  layer: number;
};

export type GameDifficulty = "beginner" | "intermediate" | "advanced";

export const DIFFICULTY_PAIR_COUNTS: Record<GameDifficulty, number> = {
  beginner: 10,
  intermediate: 15,
  advanced: 20,
};

export type MahjongTileData = TileContent &
  TilePosition & {
    id: string;
    removed: boolean;
  };

const LAYOUTS: Record<
  GameDifficulty,
  { baseRows: number[]; baseRowOffset: number; topRows: number[]; topRowOffset: number }
> = {
  beginner: { baseRows: [4, 4, 4, 4], baseRowOffset: 1, topRows: [2, 2], topRowOffset: 2 },
  intermediate: { baseRows: [4, 6, 6, 6, 4], baseRowOffset: 0, topRows: [2, 2], topRowOffset: 2 },
  advanced: { baseRows: [6, 8, 8, 8, 6], baseRowOffset: 0, topRows: [2, 2], topRowOffset: 2 },
};

function buildPositions(difficulty: GameDifficulty): TilePosition[] {
  const layout = LAYOUTS[difficulty];
  const positions: TilePosition[] = [];

  layout.baseRows.forEach((count, row) => {
    const startCol = Math.floor((8 - count) / 2);
    for (let i = 0; i < count; i += 1) {
      positions.push({ row: row + layout.baseRowOffset, col: startCol + i, layer: 0 });
    }
  });

  layout.topRows.forEach((count, index) => {
    const startCol = Math.floor((8 - count) / 2);
    for (let i = 0; i < count; i += 1) {
      positions.push({ row: index + layout.topRowOffset, col: startCol + i, layer: 1 });
    }
  });

  return positions;
}

function buildDeck(pairCount: number): TileContent[] {
  if (WORD_CARDS.length < pairCount) {
    throw new Error(`Need at least ${pairCount} word cards, found ${WORD_CARDS.length}`);
  }

  return shuffleArray(WORD_CARDS)
    .slice(0, pairCount)
    .flatMap((card) => {
      const defaultTranslation = card.translations[DEFAULT_LANGUAGE]?.word || card.guide;
      const seed: Omit<TileContent, "groupId"> = {
        category: card.category,
        imageSrc: card.imageSrc,
        label: card.korean,
        subLabel: defaultTranslation,
        translations: card.translations,
      };
      const groupId = card.id;

      return [
        { groupId, ...seed },
        { groupId, ...seed },
      ];
    });
}

export function shuffleArray<T>(items: T[]): T[] {
  const next = [...items];

  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }

  return next;
}

export function createMahjongLayout(
  difficulty: GameDifficulty = "intermediate",
): MahjongTileData[] {
  const positions = buildPositions(difficulty);
  const contents = shuffleArray(buildDeck(positions.length / 2));

  return positions.map((position, index) => ({
    ...position,
    ...contents[index],
    id: `tile-${position.layer}-${position.row}-${position.col}-${index}`,
    removed: false,
  }));
}

export function reshuffleActiveTiles(tiles: MahjongTileData[]): MahjongTileData[] {
  const activeContents = shuffleArray(
    tiles
      .filter((tile) => !tile.removed)
      .map(({ category, groupId, imageSrc, label, subLabel, translations }) => ({
        category,
        groupId,
        imageSrc,
        label,
        subLabel,
        translations,
      })),
  );
  let contentIndex = 0;

  return tiles.map((tile) => {
    if (tile.removed) {
      return tile;
    }

    const nextContent = activeContents[contentIndex];
    contentIndex += 1;
    return { ...tile, ...nextContent };
  });
}

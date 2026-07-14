import type { MahjongTileData } from "./layout";

function sameCell(a: MahjongTileData, b: MahjongTileData) {
  return a.row === b.row && a.col === b.col;
}

function activeTiles(tiles: MahjongTileData[]) {
  return tiles.filter((tile) => !tile.removed);
}

export function canMatch(a: MahjongTileData, b: MahjongTileData) {
  return a.id !== b.id && a.groupId === b.groupId;
}

export function isTileOpen(tile: MahjongTileData, tiles: MahjongTileData[]) {
  if (tile.removed) {
    return false;
  }

  const active = activeTiles(tiles);
  const covered = active.some(
    (candidate) => candidate.layer > tile.layer && sameCell(candidate, tile),
  );

  if (covered) {
    return false;
  }

  const hasLeftBlocker = active.some(
    (candidate) =>
      candidate.layer === tile.layer &&
      candidate.row === tile.row &&
      candidate.col === tile.col - 1,
  );
  const hasRightBlocker = active.some(
    (candidate) =>
      candidate.layer === tile.layer &&
      candidate.row === tile.row &&
      candidate.col === tile.col + 1,
  );

  return !hasLeftBlocker || !hasRightBlocker;
}

export function getOpenTiles(tiles: MahjongTileData[]) {
  return activeTiles(tiles).filter((tile) => isTileOpen(tile, tiles));
}

export function findHintPair(tiles: MahjongTileData[]) {
  const openTiles = getOpenTiles(tiles);

  for (let i = 0; i < openTiles.length; i += 1) {
    for (let j = i + 1; j < openTiles.length; j += 1) {
      if (canMatch(openTiles[i], openTiles[j])) {
        return [openTiles[i], openTiles[j]] as const;
      }
    }
  }

  return null;
}

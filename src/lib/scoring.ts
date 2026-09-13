export const POINTS_FOR_POSITION = (position: number) => 2000 - position;

/**
 * Computes the points a single played song is worth for a user.
 *
 * A song not yet played (`position === null`) is worth 0 points. A song
 * marked as the user's top pick is worth double points if it's also that
 * user's best (lowest/highest-charting) played position, and zero points
 * otherwise (the double-or-nothing gamble on the declared top pick).
 */
export const computeSongPoints = (
  entry: { isTopPick: boolean; position: number | null },
  bestPosition: number | null,
): number => {
  if (entry.position === null) {
    return 0;
  }

  const basePoints = POINTS_FOR_POSITION(entry.position);

  if (entry.isTopPick) {
    return entry.position === bestPosition ? basePoints * 2 : 0;
  }

  return basePoints;
};

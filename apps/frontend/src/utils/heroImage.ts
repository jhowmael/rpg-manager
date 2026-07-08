/** Avatar mockado para heróis (DiceBear). */
export function getMockHeroImage(seed: string): string {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}`;
}

export function rollMockHeroImageSeed(baseId: string): string {
  return `hero-${baseId}-${Date.now()}`;
}

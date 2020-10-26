export const getGameData = async (gameId: number) => {
  const [histogram, metadata] = await Promise.all([getHistogram(gameId), getGameMetadata(gameId)]);
  return { histogram, metadata };
};

const getHistogram = async (gameId: number): Promise<Histogram | null> => {
  try {
    const res = await fetch('https://store.steampowered.com/appreviewhistogram/' + gameId);
    const json: { success: number; results: Histogram } = await res.json();
    if (!json.success) return null;
    return json.results;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return null;
  }
};

const getGameMetadata = async (gameId: number): Promise<GameMetadata | null> => {
  try {
    const res = await fetch('https://store.steampowered.com/apphover/' + gameId);
    const hoverHTML = await res.text();
    const container = document.createElement('div');
    container.innerHTML = hoverHTML;
    const releaseDateText = container.querySelector<HTMLElement>('.hover_release')?.innerText;
    const releaseDate = releaseDateText
      ? new Date(releaseDateText.replace(/^.*:/, '').replace(/年|月|日/g, '/'))
      : null;
    const tags = Array.from(container.querySelectorAll<HTMLElement>('.app_tag')).map(({ innerText }) => innerText);
    return { releaseDate, tags };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return null;
  }
};

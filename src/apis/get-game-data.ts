export const getGameData = async (gameId: number) => {
  try {
    const [histogram, apphover] = await Promise.all([getHistogram(gameId), getUserTags(gameId)]);
    return { histogram, apphover };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return null;
  }
};

interface HistogramResponseData {
  end_date: number;
  start_date: number;
  recent: ReviewPeriod[];
  rollup_type: 'month' | 'week';
  rollups: ReviewPeriod[];
  weeks: never[];
}
interface ReviewPeriod {
  date: number;
  recommendations_up: number;
  recommendations_down: number;
}
const getHistogram = async (gameId: number) => {
  const res = await fetch('https://store.steampowered.com/appreviewhistogram/' + gameId);
  const json: { success: number; results: HistogramResponseData } = await res.json();
  if (!json.success) return null;
  return json.results;
};

const getUserTags = async (gameId: number) => {
  const res = await fetch('https://store.steampowered.com/apphover/' + gameId);
  const hoverHTML = await res.text();
  const container = document.createElement('div');
  container.innerHTML = hoverHTML;
  const releaseDateText = container.querySelector<HTMLElement>('.hover_release')?.innerText;
  const releaseDate = releaseDateText ? new Date(releaseDateText.replace(/^.*:/, '').replace(/年|月|日/g, '/')) : null;
  const tags = Array.from(container.querySelectorAll<HTMLElement>('.app_tag')).map(({ innerText }) => innerText);
  return { releaseDate, tags };
};

import { COMMON_HTTP_HEADER } from '../utils/constants';

export const fetchGameData = async (gameId: number) => {
  const [review, metadata] = await Promise.all([fetchReviewHistogram(gameId), fetchGameMetadata(gameId)]);
  return { review, metadata };
};

interface ReviewHistogramRaw {
  end_date: number;
  start_date: number;
  recent?: RecommendationRecordRaw[];
  rollup_type: 'month' | 'week';
  rollups?: RecommendationRecordRaw[];
  weeks: never[];
}
interface RecommendationRecordRaw {
  date: number;
  recommendations_up: number;
  recommendations_down: number;
}
const fetchReviewHistogram = async (gameId: number): Promise<ReviewHistogram | null> => {
  try {
    const res = await fetch('https://store.steampowered.com/appreviewhistogram/' + gameId, {
      headers: COMMON_HTTP_HEADER,
    });
    const json: { success: number; results: ReviewHistogramRaw } = await res.json();
    if (!json.success) return null;

    const { recent, rollups, ...rest } = json.results;

    return {
      ...rest,
      recent: recent?.map(convertRecommendationRecord) || [],
      rollups: rollups?.map(convertRecommendationRecord) || [],
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return null;
  }
};

const convertRecommendationRecord = ({
  date,
  recommendations_up,
  recommendations_down,
}: RecommendationRecordRaw): RecommendationRecord => {
  return [date, recommendations_up, recommendations_down];
};

const fetchGameMetadata = async (gameId: number): Promise<GameMetadata | null> => {
  try {
    const res = await fetch('https://store.steampowered.com/apphover/' + gameId, {
      headers: COMMON_HTTP_HEADER,
    });
    const hoverHTML = await res.text();
    if (!hoverHTML.trim()) return null;

    const container = document.createElement('div');
    container.innerHTML = hoverHTML;

    const name = container.querySelector('h4')?.innerText || null;
    const releaseDateText = container.querySelector<HTMLElement>('.hover_release')?.innerText;
    const releaseDate = releaseDateText
      ? new Date(releaseDateText.replace(/^.*:/, '').replace(/年|月|日/g, '/')).getTime()
      : null;
    const tags = Array.from(container.querySelectorAll<HTMLElement>('.app_tag')).map(({ innerText }) => innerText);
    return { name, releaseDate, tags };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return null;
  }
};

import { useEffect } from 'react';

export const GamesParser = () => {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(extractPageData());
  }, []);

  return null;
};

const leadingPartPattern = /^\n\s+(?=var rgGames = )/;
const tailingPartPattern = /\n\s+(?=var sessionID = )/;
const dataLinePattern = /^var ([_a-zA-Z0-9]+) = (.+);$/;

export const extractPageData = () => {
  const candidates = Array.from(document.querySelectorAll('script[language="javascript"]'));
  const targetTag = candidates.find((candidate) => {
    return leadingPartPattern.test(candidate.innerHTML);
  });

  if (!targetTag) return null;

  const innerHTML = targetTag.innerHTML.trimStart();
  const { index: tailIndex = innerHTML.length } = innerHTML.match(tailingPartPattern) || { index: undefined };
  const contents = innerHTML.slice(0, tailIndex);

  const lines = contents
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => dataLinePattern.test(line));

  const pageData = lines.reduce<Record<string, any>>((acc, line) => {
    const match = line.match(dataLinePattern)!;
    const [key, value] = match.slice(1);
    try {
      acc[key] = JSON.parse(value);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e, value);
    }
    return acc;
  }, {});

  return pageData;
};

import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';

interface GameListProps {
  listClosed: boolean;
  ended: boolean;
  games: GameItem[];
  onNextSearch: () => Promise<void>;
  checkExactMatch: (title: string) => boolean;
}

export const GameList = ({ listClosed, ended, games, onNextSearch, checkExactMatch }: GameListProps) => {
  const refs = useMemo(() => {
    return {
      isSearching: false,
      container: null as null | HTMLDivElement,
    };
  }, []);

  const onScroll = ended
    ? undefined
    : () => {
        const { container } = refs;
        if (!container || refs.isSearching) return;
        if (container.scrollTop === container.scrollHeight - container.clientHeight) {
          refs.isSearching = true;
          setTimeout(() => {
            onNextSearch().then(() => {
              refs.isSearching = false;
            });
          }, 0);
        }
      };

  const { hasExactMatch, reorderedGames } = useMemo(() => {
    let hasExactMatch = false;
    const reorderedGames = games.reduce<GameItem[]>((acc, game) => {
      if (checkExactMatch(game.title)) {
        acc.unshift(game);
        hasExactMatch = true;
      } else {
        acc.push(game);
      }
      return acc;
    }, []);
    return { reorderedGames, hasExactMatch };
  }, [games]);

  return (
    <Wrapper
      style={listClosed ? { width: 0 } : undefined}
      ref={(container) => (refs.container = container)}
      onScroll={onScroll}
    >
      {reorderedGames.map(({ href, title, thumbnail }, idx) => (
        <GameItemAnchor key={idx} href={href} exact={hasExactMatch && !idx} target="_blank">
          <img {...thumbnail} />
          <br />
          <div>{title}</div>
        </GameItemAnchor>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 400px;
  overflow-y: scroll;
  overflow-x: hidden;
`;
const GameItemAnchor = styled.a<{ exact: boolean }>`
  display: block;
  width: 100%;
  padding: 0 20px 8px 0;
  border-bottom: solid 2px #1b2838;
  box-sizing: border-box;
  color: #c7d5e0;
  background: #16202d;
  font-size: 16px;
  ${({ exact }) => (exact ? exactStyle : '')}
  div {
    padding-left: 4px;
  }
`;
const exactStyle = css`
  font-weight: bold;
  position: sticky;
  top: 0;
`;

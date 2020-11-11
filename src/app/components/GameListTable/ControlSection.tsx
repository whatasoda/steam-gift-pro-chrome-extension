import React from 'react';
import styled from 'styled-components';
import { Button, ButtonGroup } from '@blueprintjs/core';
import type { ComponentProps } from './container';
import { TagPicker } from './TagPicker';
import { GameListFilter } from './GameListFilter';
import { GameListEditor } from './GameListEditor';
import { ReviewTermPicker } from './ReviewTermPicker';
import { ReviewRangePicker } from './ReviewRangePicker';

interface ControlSectionProps extends ComponentProps {}

export const ControlSection = ({
  table,
  gameLists,
  users,
  indexes,
  info,
  entityActions,
  termController,
  gameListEditController,
}: ControlSectionProps) => {
  const { onUpdateAllGameData, isLoading } = entityActions;
  const { tags } = info;
  const { columns } = table;
  return (
    <Wrapper>
      <ButtonWrapper vertical>
        <Button
          disabled={isLoading}
          icon="refresh"
          onClick={onUpdateAllGameData}
          text={isLoading ? '更新中' : '表示中のゲームの情報を更新'}
        />
        <ReviewTermPicker controller={termController} />
        <ReviewRangePicker table={table} indexes={indexes} info={info} />
        <GameListFilter table={table} indexes={indexes} gameLists={gameLists} users={users} />
      </ButtonWrapper>
      <StyledTagPicker tags={tags} column={columns[indexes.tags]} />
      <GameListEditor gameListEditController={gameListEditController} gameLists={gameLists} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 160px;
  display: flex;
`;

const ButtonWrapper = styled(ButtonGroup)`
  width: 230px;
  margin-right: 10px;
  flex: 0 0 auto;
`;

const StyledTagPicker = styled(TagPicker)`
  vertical-align: middle;
  margin-right: 10px;
  width: 500px;
  height: 160px;
`;

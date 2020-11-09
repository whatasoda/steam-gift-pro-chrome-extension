import React from 'react';
import styled from 'styled-components';
import { Button } from '@blueprintjs/core';
import type { ComponentProps } from './container';
import { TagPicker } from './TagPicker';
import { GameListFilter } from './GameListFilter';
import { ReviewRangePicker } from './ReviewRangePicker';
import { GameListEditor } from './GameListEditor';
import { ReviewTermPicker } from './ReviewTermPicker';
import { ControllerRefs } from './Layout';

interface ControlSectionProps extends ComponentProps {
  setControllers: (next: (curr: ControllerRefs) => ControllerRefs) => void;
}

export const ControlSection = ({
  getShownAppIds,
  table,
  gameLists,
  users,
  indexes,
  gameListInfo,
  entityActions,
  termController,
  setControllers,
}: ControlSectionProps) => {
  const { onUpdateAllGameData } = entityActions;
  const { minmax, tags } = gameListInfo;
  const { columns } = table;
  return (
    <Wrapper>
      <GameListEditor
        getShownAppIds={getShownAppIds}
        entityActions={entityActions}
        gameLists={gameLists}
        onControllerInit={(controller) => setControllers((curr) => ({ ...curr, gameListEditor: controller }))}
      />
      <GameListFilter table={table} indexes={indexes} gameLists={gameLists} users={users} />
      <ButtonWrapper>
        <Button onClick={onUpdateAllGameData} fill text="全データ更新" />
        <ReviewTermPicker controller={termController} />
      </ButtonWrapper>
      <ReviewRangePicker icon="thumbs-up" column={columns[indexes.up]} minmax={minmax.up} />
      <ReviewRangePicker icon="flow-review" column={columns[indexes.comp]} minmax={minmax.comp} />
      <ReviewRangePicker icon="thumbs-down" column={columns[indexes.down]} minmax={minmax.down} />
      <StyledTagPicker tags={tags} column={columns[indexes.tags]} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 230px;
`;

const ButtonWrapper = styled.div`
  display: inline-block;
  vertical-align: middle;
  width: 150px;
  margin-right: 10px;
  height: 100%;
  padding-top: 44px;
  box-sizing: border-box;
`;

const StyledTagPicker = styled(TagPicker)`
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
  width: 500px;
  height: 226px;
`;

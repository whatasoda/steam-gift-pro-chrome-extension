import React from 'react';
import styled from 'styled-components';
import { Button, ButtonGroup } from '@blueprintjs/core';
import type { ComponentProps } from './container';
import type { ControllerRefs } from './Layout';
import { TagPicker } from './TagPicker';
import { GameListFilter } from './GameListFilter';
import { GameListEditor } from './GameListEditor';
import { ReviewTermPicker } from './ReviewTermPicker';
import { ReviewRangePicker } from './ReviewRangePicker';

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
  const { tags } = gameListInfo;
  const { columns } = table;
  return (
    <Wrapper>
      <ButtonWrapper vertical>
        <Button onClick={onUpdateAllGameData} fill text="全データ更新" />
        <ReviewTermPicker controller={termController} />
        <ReviewRangePicker table={table} indexes={indexes} gameListInfo={gameListInfo} />
      </ButtonWrapper>
      <GameListEditor
        getShownAppIds={getShownAppIds}
        entityActions={entityActions}
        gameLists={gameLists}
        onControllerInit={(controller) => setControllers((curr) => ({ ...curr, gameListEditor: controller }))}
      />
      <GameListFilter table={table} indexes={indexes} gameLists={gameLists} users={users} />
      <StyledTagPicker tags={tags} column={columns[indexes.tags]} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 230px;
  display: flex;
`;

const ButtonWrapper = styled(ButtonGroup)`
  width: 200px;
  margin-right: 10px;
  flex: 0 0 auto;
`;

const StyledTagPicker = styled(TagPicker)`
  vertical-align: middle;
  margin-left: 10px;
  width: 500px;
  height: 150px;
`;

import React, { useEffect, useMemo, useRef } from 'react';
import { Button, ButtonGroup, EditableText, H5, HTMLSelect, Icon, IOptionProps, TextArea } from '@blueprintjs/core';
import type { ComponentProps } from './container';
import { useGameListEdit } from './utils';
import styled from 'styled-components';

interface GameListEditorProps extends Pick<ComponentProps, 'getShownAppIds' | 'entityActions' | 'gameLists'> {
  onControllerInit: (controller: { current: ReturnType<typeof useGameListEdit> }) => void;
}

export const GameListEditor = ({
  getShownAppIds,
  entityActions: { fetchGameLists },
  onControllerInit,
  gameLists,
}: GameListEditorProps) => {
  const controller = useGameListEdit(getShownAppIds, fetchGameLists, gameLists);
  const controllerRef = useRef(controller);
  controllerRef.current = controller;
  const {
    draft,
    saveChanges,
    createGameList,
    editTarget,
    setEditTarget,
    setName,
    setDescription,
    addShownGames,
    removeShownGames,
  } = controller;
  useEffect(() => {
    onControllerInit(controllerRef);
  }, []);

  const options = useMemo<IOptionProps[]>(() => {
    return [
      { value: '', label: '編集するゲームリストを選択' },
      ...Object.values(gameLists).map<IOptionProps>((entity) => ({
        value: entity!.index,
        label: entity!.data.name,
      })),
    ];
  }, [gameLists]);

  return (
    <Wrapper>
      <ButtonGroup>
        <StyledSelect
          value={editTarget || ''}
          options={options}
          onChange={(event) => setEditTarget(event.currentTarget.value || null)}
        />
        <Button icon="add" onClick={() => createGameList('新しいゲームリスト')} />
      </ButtonGroup>

      {draft ? (
        <EditorWrapper>
          <TitleWrapper>
            <EditableText key={draft.name} defaultValue={draft.name} onConfirm={setName} />
            <Icon icon="edit" />
          </TitleWrapper>
          <StyledTextArea
            key={draft.description}
            defaultValue={draft.description}
            placeholder="メモ"
            onBlur={(event) => setDescription(event.currentTarget.value)}
          />
          <ButtonGroup vertical>
            <Button text="表示中のアイテムを追加" onClick={() => addShownGames()} />
            <Button text="表示中のアイテムを除外" onClick={() => removeShownGames()} />
            <Button text="保存" onClick={() => saveChanges()} />
          </ButtonGroup>
        </EditorWrapper>
      ) : null}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 250px;
`;

const EditorWrapper = styled.div`
  margin-top: 6px;
`;

const StyledSelect = styled(HTMLSelect)`
  width: 100%;
`;

const TitleWrapper = styled(H5)`
  margin: 0 0 4px 4px;
`;

const StyledTextArea = styled(TextArea)`
  display: block;
  resize: none;
  width: 100%;
  margin-bottom: 6px;
`;

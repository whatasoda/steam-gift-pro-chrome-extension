import React, { useMemo } from 'react';
import {
  Button,
  ButtonGroup,
  EditableText,
  H5,
  HTMLSelect,
  Icon,
  IOptionProps,
  Menu,
  Popover,
  TextArea,
} from '@blueprintjs/core';
import type { ComponentProps } from './container';
import styled from 'styled-components';

interface GameListEditorProps extends Pick<ComponentProps, 'gameLists' | 'gameListEditController'> {}

export const GameListEditor = ({ gameListEditController, gameLists }: GameListEditorProps) => {
  const {
    draft,
    hasUnsavedChange,
    resetDraft,
    saveChanges,
    createGameList,
    editTarget,
    setEditTarget,
    setName,
    setDescription,
    addShownGames,
    removeShownGames,
  } = gameListEditController;

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
      <Header>
        <StyledSelect
          value={editTarget || ''}
          options={options}
          onChange={(event) => setEditTarget(event.currentTarget.value || null)}
        />
        <Popover
          content={
            <Menu>
              <Menu.Item
                text="新しいゲームリストを作成"
                disabled={hasUnsavedChange}
                onClick={() => createGameList('新しいゲームリスト')}
              />
            </Menu>
          }
          children={<Button icon="more" minimal />}
        />
      </Header>

      {draft ? (
        <EditorWrapper>
          <TitleWrapper>
            <EditableText key={draft.name} maxLength={16} defaultValue={draft.name} onConfirm={setName} />
            <Icon icon="edit" />
          </TitleWrapper>
          <StyledTextArea
            key={draft.description}
            defaultValue={draft.description}
            placeholder="メモ"
            onBlur={(event) => setDescription(event.currentTarget.value)}
          />
          <ButtonGroup>
            <Button disabled={!hasUnsavedChange} text="保存" onClick={() => saveChanges()} />
            <Popover
              position="bottom"
              content={
                <Menu>
                  <Menu.Item text="変更を破棄" disabled={!hasUnsavedChange} onClick={() => resetDraft()} />
                  <Menu.Item text="表示中の全アイテムをリストに追加" onClick={() => addShownGames()} />
                  <Menu.Item text="表示中の全アイテムをリストから除外" onClick={() => removeShownGames()} />
                </Menu>
              }
              children={<Button icon="more" />}
            />
          </ButtonGroup>
        </EditorWrapper>
      ) : null}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 300px;
`;

const EditorWrapper = styled.div`
  margin-top: 6px;
`;

const Header = styled.div`
  display: flex;
  width: 100%;
`;

const StyledSelect = styled(HTMLSelect)`
  flex: 1 0 auto;
`;

const TitleWrapper = styled(H5)`
  margin-left: 6px;
`;

const StyledTextArea = styled(TextArea)`
  display: block;
  resize: none;
  width: 100%;
  margin: 6px 0;
`;

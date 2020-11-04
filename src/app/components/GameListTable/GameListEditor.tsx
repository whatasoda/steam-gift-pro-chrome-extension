import { Button, EditableText, HTMLSelect, IOptionProps, TextArea } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import { GameListRecord, useGameListEdit } from './utils';

interface GameListEditorProps {
  controller: ReturnType<typeof useGameListEdit>;
  gameLists: GameListRecord;
}

export const GameListEditor = ({ controller, gameLists }: GameListEditorProps) => {
  const { draft, saveChanges, createGameList, setEditTarget } = controller;
  const options = useMemo<IOptionProps[]>(() => {
    return [
      { value: '', label: '編集するゲームリストを選択してください' },
      ...Object.values(gameLists).map<IOptionProps>((entity) => ({
        value: entity!.index,
        label: entity!.data.name,
      })),
    ];
  }, [gameLists]);

  return (
    <div>
      <HTMLSelect
        defaultValue=""
        options={options}
        onChange={(event) => setEditTarget(event.currentTarget.value || null)}
      />
      {draft ? (
        <div>
          <EditableText key={draft.name} defaultValue={draft.name} onConfirm={controller.setName} />
          <TextArea
            key={draft.description}
            defaultValue={draft.description}
            onBlur={(event) => controller.setDescription(event.currentTarget.value)}
          />
          <Button text="保存" onClick={() => saveChanges()} />
        </div>
      ) : (
        <div>
          編集するゲームリストを選択するか、
          <Button text="新しいゲームリストを作成" onClick={() => createGameList('新しいゲームリスト')} />
          してください
        </div>
      )}
    </div>
  );
};

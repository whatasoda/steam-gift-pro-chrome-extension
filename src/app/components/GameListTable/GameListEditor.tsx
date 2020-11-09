import React, { useEffect, useMemo, useRef } from 'react';
import { Button, EditableText, HTMLSelect, IOptionProps, TextArea } from '@blueprintjs/core';
import type { ComponentProps } from './container';
import { useGameListEdit } from './utils';

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
  const { draft, saveChanges, createGameList, setEditTarget, setName, setDescription } = controller;
  useEffect(() => {
    onControllerInit(controllerRef);
  }, []);

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
          <EditableText key={draft.name} defaultValue={draft.name} onConfirm={setName} />
          <TextArea
            key={draft.description}
            defaultValue={draft.description}
            onBlur={(event) => setDescription(event.currentTarget.value)}
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

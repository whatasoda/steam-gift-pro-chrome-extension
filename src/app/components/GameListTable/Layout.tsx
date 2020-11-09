import React, { useState } from 'react';
import { Card } from '@blueprintjs/core';
import type { ComponentProps } from './container';
import type { useGameListEdit } from './utils';
import { ControlSection } from './ControlSection';
import { Table } from './Table';

export interface ControllerRefs {
  gameListEditor?: { current: ReturnType<typeof useGameListEdit> };
}

export const Layout = (props: ComponentProps) => {
  const [controllerRefs, setControllerRefs] = useState<ControllerRefs>({});
  const { table, entityActions } = props;

  return (
    <Card elevation={2} className="bp3-dark">
      <ControlSection {...props} setControllers={setControllerRefs} />
      <Table table={table} entityActions={entityActions} controllerRefs={controllerRefs} />
    </Card>
  );
};

import React from 'react';
import { Card } from '@blueprintjs/core';
import { ComponentProps } from './container';
import { ControlSection } from './ControlSection';
import { Table } from './Table';

export const Layout = ({
  table,
  gameListInfo,
  indexes,
  termController,
  gameListFilterController,
  gameListEditController,
  entityActions,
}: ComponentProps) => (
  <Card elevation={2} className="bp3-dark">
    <ControlSection
      table={table}
      indexes={indexes}
      gameListInfo={gameListInfo}
      termController={termController}
      entityActions={entityActions}
      gameListFilterController={gameListFilterController}
      gameListEditController={gameListEditController}
    />
    <Table table={table} entityActions={entityActions} gameListEditController={gameListEditController} />
  </Card>
);

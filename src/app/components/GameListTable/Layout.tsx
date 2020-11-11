import React from 'react';
import { Card } from '@blueprintjs/core';
import type { ComponentProps } from './container';
import { ControlSection } from './ControlSection';
import { Table } from './Table';

export const Layout = (props: ComponentProps) => (
  <Card elevation={2} className="bp3-dark">
    <ControlSection {...props} />
    <Table
      table={props.table}
      entityActions={props.entityActions}
      gameListEditController={props.gameListEditController}
    />
  </Card>
);

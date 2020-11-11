import React from 'react';
import styled, { css } from 'styled-components';
import { Colors } from '@blueprintjs/core';

interface TableWrapperProps {
  th?: ReturnType<typeof css>;
  customCSS?: ReturnType<typeof css>;
  wrapperProps?: JSX.IntrinsicElements['div'];
  tableProps?: JSX.IntrinsicElements['table'];
}

export const ScrollableTable: React.FC<TableWrapperProps> = ({ customCSS, tableProps, wrapperProps, children }) => (
  <StyledScrollArea {...(wrapperProps as Omit<typeof wrapperProps, 'ref'>)}>
    <StyledTable {...(tableProps as Omit<typeof tableProps, 'ref'>)} customCSS={customCSS} children={children} />
  </StyledScrollArea>
);

const StyledTableBase = styled.table.attrs({
  className: 'bp3-html-table bp3-interactive bp3-html-table-condensed' as string /* cast to string to avoid string literal */,
})`
  width: 100%;
  th {
    position: sticky;
    top: 0;
    background-color: inherit;
    background-color: ${Colors.WHITE};
    box-shadow: inset 0 -1px 0 0 rgba(16, 22, 26, 0.15);
    padding-left: 5px !important;
    padding-right: 5px !important;
  }
  &.bp3-dark th {
    background-color: ${Colors.DARK_GRAY4};
    box-shadow: inset 0 -1px 0 0 rgba(255, 255, 255, 0.15);
  }
  td {
    box-shadow: none !important;
    vertical-align: middle !important;
  }
`;

const StyledTable = styled(StyledTableBase)<Pick<TableWrapperProps, 'customCSS'>>`
  ${({ customCSS }) => (customCSS ? customCSS : '')}
`;

const StyledScrollArea = styled.div`
  overflow: auto;
  position: relative;
  &::before {
    content: '';
    display: block;
    position: sticky;
    top: 100%;
    width: 100%;
    height: 0;
    box-shadow: 0 0 45px 45px ${Colors.WHITE};
  }
  &.bp3-dark::before {
    box-shadow: 0 0 45px 45px ${Colors.DARK_GRAY4};
  }
  &::after {
    content: '';
    display: block;
    height: 50px;
  }
`;

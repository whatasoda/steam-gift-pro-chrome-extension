import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, Card, Colors } from '@blueprintjs/core';

interface MonthPickerProps {
  className?: string;
  value?: Date;
  maxYear?: number;
  minYear?: number;
  onChange?: (date: Date) => void;
}

const DEFAULT_MIN_YEAR = 2000;
const DEFAULT_MAX_YEAR = new Date().getFullYear();

const MONTHSS = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];

export const MonthPicker = (props: MonthPickerProps) => {
  const { className, value = new Date(), minYear = DEFAULT_MIN_YEAR, maxYear = DEFAULT_MAX_YEAR, onChange } = props;
  const yearFromProps = value.getUTCFullYear();
  const monthFromProps = value.getUTCMonth();

  const [month, setMonth] = useState(monthFromProps);
  const [year, setYear] = useState(yearFromProps);
  const yearRef = useRef(yearFromProps);

  useEffect(() => {
    yearRef.current = yearFromProps;
    if (monthFromProps !== month) {
      setMonth(monthFromProps);
    }
  }, [yearFromProps, monthFromProps]);

  const setValue = (nextMonth: number) => {
    setMonth(nextMonth);
    yearRef.current = year;
    if (onChange) {
      const nextValue = new Date(year, nextMonth, 0, 0, 0, 0, 0);
      nextValue.setUTCFullYear(year, nextMonth);
      onChange(nextValue);
    }
  };

  return (
    <StyledCard className={className}>
      <YearContainer>
        <Button icon="chevron-left" minimal disabled={year <= minYear} onClick={() => setYear(year - 1)} />
        <span>{year}</span>
        <Button icon="chevron-right" minimal disabled={year >= maxYear} onClick={() => setYear(year + 1)} />
      </YearContainer>
      <MonthContainer>
        {MONTHSS.map((key, value) => {
          const isSelected = yearRef.current === year && value === month;
          return (
            <Button
              key={key}
              text={key}
              minimal
              style={isSelected ? { backgroundColor: Colors.BLUE3, color: Colors.WHITE } : undefined}
              onClick={() => isSelected || setValue(value)}
            />
          );
        })}
      </MonthContainer>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  width: 210px;
  text-align: center;
`;

const YearContainer = styled.div`
  display: grid;
  grid-template-columns: 35px 60px 35px;
  align-items: center;
  margin: -6px 20px 0;
`;

const MonthContainer = styled.div`
  display: grid;
  margin: 4px -4px 0;
  grid-template-columns: 40px 40px 40px 40px;
  grid-template-rows: 30px 30px 30px;
  gap: 6px;
`;

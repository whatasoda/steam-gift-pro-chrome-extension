import React from 'react';

interface ButtonProps {
  disabled?: boolean;
  text: string;
  onClick: () => void;
}

export const SteamButton = ({ text, onClick, disabled }: ButtonProps) => (
  <a
    href="#"
    style={{ marginBottom: '8px' }}
    className={['btn_darkblue_white_innerfade', 'btn_medium', disabled ? 'btn_disabled' : ''].join(' ')}
    children={<span children={text} />}
    onClick={(event) => (event.preventDefault(), onClick())}
  />
);

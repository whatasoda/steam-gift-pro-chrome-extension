import React, { memo } from 'react';

interface ButtonProps {
  disabled?: boolean;
  text: string;
  onClick?: () => void;
  download?: { url: string; name: string };
}

export const SteamButton = memo(({ text, onClick, disabled, download }: ButtonProps) => (
  <a
    href={download ? download.url : '#'}
    style={{ marginBottom: '8px' }}
    className={['btn_darkblue_white_innerfade', 'btn_medium', disabled ? 'btn_disabled' : ''].join(' ')}
    children={<span children={text} />}
    onClick={(event) => (event.preventDefault(), onClick?.())}
  />
));

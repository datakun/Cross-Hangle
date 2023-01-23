import React from 'react';

type SvgButtonProps = {
  src: string;
  onClick?: () => void;
};

export function SvgButton(props: SvgButtonProps) {
  return (
    <div
      className="unselectable"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <span
        className="material-icons"
        onClick={props.onClick}
        style={{
          cursor: 'pointer',
          padding: 4,
        }}
      >
        {props.src}
      </span>
    </div>
  );
}

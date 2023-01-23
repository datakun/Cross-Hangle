import * as React from 'react';

type BoardProps = {
  //
} & React.ComponentProps<'div'>;

export function GameBoard(props: BoardProps) {
  console.log('render Board');

  return <div>Board</div>;
}

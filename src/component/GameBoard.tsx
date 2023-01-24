import * as React from 'react';

type BoardProps = {
  //
} & React.ComponentProps<'div'>;

export function GameBoard(props: BoardProps) {
  // 게임 보드
  console.log('render Board');

  return (
    <div className="gameBoardContainer">
      <div className="gameBoard">
        {Array.from({ length: 6 }, (_, row) => (
          <div className="gameBoardRow" key={row}>
            {Array.from({ length: 6 }, (_, column) => (
              <div className="gameBoardBox" key={column}>
                {row}_{column}
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* 툴팁 */}
    </div>
  );
}

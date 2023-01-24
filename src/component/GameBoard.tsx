import * as React from 'react';
import { Api } from '../api';
import { Util } from '../util';

type BoardProps = {
  //
} & React.ComponentProps<'div'>;

type Words = {
  [word: string]: {
    row: number;
    col: number;
    to: 'row' | 'column';
    def: string;
  };
};

type Box = {
  correct: string;
  input: string;
  indexes: number[];
};

type Crossword = {
  boxes: (null | Box)[][];
  words: Words;
};

export function GameBoard(props: BoardProps) {
  // 게임 보드
  console.log('render Board');

  const [crossword, setCrossword] = React.useState<null | Crossword>(null);

  // 컴포넌트가 준비되면 문제 생성하기
  React.useEffect(() => {
    async function fetchCrossword() {
      const now = new Date();
      const nowDate = Util.getDateString(now);

      // localStorage 에서 nowDate 의 crossword 를 가져온다.
      const stateString = localStorage.getItem('CrossHangle_gameState') ?? '{}';
      const stateJson = JSON.parse(stateString);
      let todayCrossword: Crossword = stateJson[nowDate];

      // 만약 localStorage 에 없다면 api 를 통해 가져온 후 localStorage 에 저장한다.
      if (todayCrossword === undefined) {
        const todayWords: Words = await Api.getTodayCrossword(nowDate);
        todayCrossword = {
          boxes: [],
          words: todayWords,
        };

        // 빈 배열 생성
        for (let i = 0; i < 6; i++) {
          todayCrossword.boxes.push([null, null, null, null, null, null]);
        }

        // 단어 채우기
        let index = 1;
        for (const word in todayWords) {
          const { row, col, to } = todayWords[word];

          for (let x = 0; x < word.length; x++) {
            const box: Box = {
              correct: word[x],
              input: '',
              indexes: [index],
            };

            if (to === 'row') {
              if (todayCrossword.boxes[row][col + x] === null) {
                todayCrossword.boxes[row][col + x] = box;
              } else {
                todayCrossword.boxes[row][col + x]?.indexes.push(index);
              }
            } else {
              if (todayCrossword.boxes[row + x][col] === null) {
                todayCrossword.boxes[row + x][col] = box;
              } else {
                todayCrossword.boxes[row + x][col]?.indexes.push(index);
              }
            }
          }

          index++;
        }
        stateJson[nowDate] = todayCrossword;
        localStorage.setItem('CrossHangle_gameState', JSON.stringify(stateJson));
      }

      setCrossword(todayCrossword);
    }

    fetchCrossword();
  }, []);

  return (
    <div className="gameBoardContainer">
      {crossword !== null ? (
        <div className="gameBoard">
          {Array.from({ length: 6 }, (_, row) => (
            <div className="gameBoardRow" key={row}>
              {Array.from({ length: 6 }, (_, column) => {
                const box = crossword.boxes[row][column];
                if (box === null) {
                  return <div className="gameBoardBox emptyBox" key={column} />;
                }

                return (
                  <div className="gameBoardBox" key={column}>
                    {box.input}
                    <div className="boxIndex">{box.indexes.join(',')}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <div>로딩 중...</div>
      )}
      {/* 툴팁 */}
    </div>
  );
}

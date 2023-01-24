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
  row: number;
  column: number;
  correct: string;
  input: string;
  to: 'row' | 'column' | 'all';
  indexes: number[];
  rowWord: string;
  columnWord: string;
};

type Crossword = {
  boxes: (null | Box)[][];
  words: Words;
};

export function GameBoard(props: BoardProps) {
  // 게임 보드
  console.log('render Board');

  const [crossword, setCrossword] = React.useState<null | Crossword>(null);
  const [selectedBox, setSelectedBox] = React.useState<null | Box>(null);
  const [highlightedBoxes, setHighlightedBoxes] = React.useState<Box[]>([]);

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

          if (to === 'row') {
            for (let x = 0; x < word.length; x++) {
              const oldBox = todayCrossword.boxes[row][col + x];
              if (oldBox === null) {
                todayCrossword.boxes[row][col + x] = {
                  row: row,
                  column: col + x,
                  correct: word[x],
                  input: '',
                  to: to,
                  indexes: [index],
                  rowWord: word,
                  columnWord: '',
                };
              } else {
                oldBox.to = 'all';
                oldBox.indexes.push(index);
                oldBox.indexes.sort();
                oldBox.rowWord = word;
              }
            }
          } else {
            for (let x = 0; x < word.length; x++) {
              const oldBox = todayCrossword.boxes[row + x][col];
              if (oldBox === null) {
                todayCrossword.boxes[row + x][col] = {
                  row: row + x,
                  column: col,
                  correct: word[x],
                  input: '',
                  to: to,
                  indexes: [index],
                  rowWord: '',
                  columnWord: word,
                };
              } else {
                oldBox.to = 'all';
                oldBox.indexes.push(index);
                oldBox.indexes.sort();
                oldBox.columnWord = word;
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

  const handleBoxClick = (e: React.MouseEvent, box: Box) => {
    e.stopPropagation();

    if (crossword === null) {
      return;
    }

    const findHighlightedBox = (boxWord: string, to: 'row' | 'column') => {
      const highlightedBoxes: Box[] = [];
      const word = crossword.words[boxWord];
      for (let i = 0; i < boxWord.length; i++) {
        const otherBox = crossword.boxes[word.row + (to === 'column' ? i : 0)][word.col + (to === 'row' ? i : 0)];
        if (otherBox) {
          highlightedBoxes.push(otherBox);
        }
      }

      setHighlightedBoxes(highlightedBoxes);
    };

    // highlighted box 를 찾아서 표시하기
    if (box.to === 'row') {
      if (Util.isEquals(selectedBox, box)) {
        return;
      }

      findHighlightedBox(box.rowWord, 'row');
    } else if (box.to === 'column') {
      if (Util.isEquals(selectedBox, box)) {
        return;
      }

      findHighlightedBox(box.columnWord, 'column');
    } else {
      let toFindRow = true;
      // 이전에 선택된 박스가 있고, highlightedBoxes 의 아이템 중 to 가 row 인 박스가 있다면 toFindRow 를 false 로 바꾼다.
      if (selectedBox !== null && Util.isEquals(selectedBox, box)) {
        for (const highlightedBox of highlightedBoxes) {
          if (highlightedBox.to === 'row') {
            toFindRow = false;
            break;
          }
        }
      }

      if (toFindRow === true) {
        findHighlightedBox(box.rowWord, 'row');
      } else {
        findHighlightedBox(box.columnWord, 'column');
      }
    }

    setSelectedBox(box);
  };

  const handleEmptyBoxClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (highlightedBoxes.length !== 0) {
      setHighlightedBoxes([]);
    }
    if (selectedBox !== null) {
      setSelectedBox(null);
    }
  };

  return (
    <div className="gameBoardContainer" onClick={(e) => handleEmptyBoxClick(e)}>
      {crossword !== null ? (
        <div>
          <div className="gameBoard">
            {Array.from({ length: 6 }, (_, row) => (
              <div className="gameBoardRow" key={row}>
                {Array.from({ length: 6 }, (_, column) => {
                  const box = crossword.boxes[row][column];
                  if (box === null) {
                    return <div className="gameBoardBox emptyBox" key={column} onClick={(e) => handleEmptyBoxClick(e)} />;
                  }

                  let isSelected = false;
                  if (selectedBox !== null) {
                    if (box.row === selectedBox.row && box.column === selectedBox.column) {
                      isSelected = true;
                    }
                  }

                  let isHighlighted = false;
                  if (isSelected === false) {
                    for (const highlightedBox of highlightedBoxes) {
                      if (box.row === highlightedBox.row && box.column === highlightedBox.column) {
                        isHighlighted = true;
                        break;
                      }
                    }
                  }

                  return (
                    <div className={'gameBoardBox' + (isSelected ? ' selected' : '') + (isHighlighted ? ' highlighted' : '')} key={column} onClick={(e) => handleBoxClick(e, box)}>
                      {box.input}
                      <div className="boxIndex">{box.indexes.join(',')}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {/* 정의 */}
          {highlightedBoxes.length > 0 ? <div className="definitionContainer">{crossword.words[highlightedBoxes.map((box) => box.correct).join('')].def}</div> : null}
        </div>
      ) : (
        <div>로딩 중...</div>
      )}
    </div>
  );
}

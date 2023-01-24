import * as React from 'react';

type KeyboardProps = {
  onKeyboardClick?: (key: string) => void;
} & React.ComponentProps<'div'>;

function Keyboard(props: KeyboardProps) {
  // 키보드 버튼
  console.log('render Keyboard');

  return (
    <div className="keyboardContainer">
      <div className="keyboardRow">
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅃ')}>
          ㅃ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅉ')}>
          ㅉ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㄸ')}>
          ㄸ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㄲ')}>
          ㄲ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅆ')}>
          ㅆ
        </div>
        <div className="emptyButton"></div>
        <div className="emptyButton"></div>
        <div className="emptyButton"></div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅒ')}>
          ㅒ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅖ')}>
          ㅖ
        </div>
      </div>
      <div className="keyboardRow">
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅂ')}>
          ㅂ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅈ')}>
          ㅈ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㄷ')}>
          ㄷ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㄱ')}>
          ㄱ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅅ')}>
          ㅅ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅛ')}>
          ㅛ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅕ')}>
          ㅕ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅑ')}>
          ㅑ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅐ')}>
          ㅐ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅔ')}>
          ㅔ
        </div>
      </div>
      <div className="keyboardRow">
        <div className="spacer"></div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅁ')}>
          ㅁ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㄴ')}>
          ㄴ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅇ')}>
          ㅇ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㄹ')}>
          ㄹ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅎ')}>
          ㅎ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅗ')}>
          ㅗ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅓ')}>
          ㅓ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅏ')}>
          ㅏ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅣ')}>
          ㅣ
        </div>
        <div className="spacer"></div>
      </div>
      <div className="keyboardRow">
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('enter')} style={{ flex: 1.5, fontWeight: 400, fontSize: '1.2em' }}>
          확인
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅋ')}>
          ㅋ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅌ')}>
          ㅌ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅊ')}>
          ㅊ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅍ')}>
          ㅍ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅠ')}>
          ㅠ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅜ')}>
          ㅜ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('ㅡ')}>
          ㅡ
        </div>
        <div className="keyButton" onClick={() => props.onKeyboardClick?.('backspace')} style={{ flex: 1.5 }}>
          <span className="material-icons">backspace</span>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Keyboard);

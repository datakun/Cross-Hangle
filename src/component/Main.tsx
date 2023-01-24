import * as React from 'react';
import { GameBoard } from './GameBoard';
import Header from './Header';
import Keyboard from './Keyboard';

export function Main() {
  // 메인 화면

  // 모달 표시 여부
  const [visibleStatistics, setStatisticsVisible] = React.useState(false);
  const [visibleSettings, setVisibleSettings] = React.useState(false);

  // 게임 데이터

  // 컴포넌트가 준비되면 문제 생성하기
  React.useEffect(() => {
    //
  }, []);

  const handleStatisticsClick = React.useCallback(() => {
    setStatisticsVisible(true);
  }, []);

  const handleSettingsClick = React.useCallback(() => {
    setVisibleSettings(true);
  }, []);

  const handleKeyboardClick = React.useCallback((key: string) => {
    console.log(key);
  }, []);

  return (
    <div className="main">
      <Header round={1} onStatisticsClick={handleStatisticsClick} onSettingsClick={handleSettingsClick} />
      <GameBoard />
      <Keyboard onKeyboardClick={handleKeyboardClick} />
    </div>
  );
}

import * as React from 'react';
import { GameBoard } from './GameBoard';
import { Header } from './Header';
import { Keyboard } from './Keyboard';

export function Main() {
  const handleStatisticsClick = () => {
    //
  };

  const handleSettingsClick = () => {
    //
  };

  const handleKeyboardClick = (key: string) => {
    //
    console.log(key);
  };

  return (
    <div className="main">
      <Header round={1} onStatisticsClick={handleStatisticsClick} onSettingsClick={handleSettingsClick} />
      <GameBoard />
      <Keyboard onKeyboardClick={handleKeyboardClick} />
    </div>
  );
}

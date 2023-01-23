import * as React from 'react';
import { SvgButton } from './common/SvgButton';

type HeaderProps = {
  round: number;
  onStatisticsClick?: () => void;
  onSettingsClick?: () => void;
} & React.ComponentProps<'div'>;

export function Header(props: HeaderProps) {
  // 도움말 버튼 / 타이틀 / 통계 버튽 / 옵션 버튼
  console.log('render Header');

  return (
    <div>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <SvgButton src={'leaderboard'} onClick={props.onStatisticsClick} />
        <div style={{ padding: 8, paddingBottom: 4 }}>
          <h1 style={{ margin: 0 }}>매일 십자말 풀이</h1>
          <h3 style={{ margin: 0, marginTop: -4, textAlign: 'right', letterSpacing: 2 }}>{props.round}번째</h3>
        </div>
        <SvgButton src={'settings'} onClick={props.onSettingsClick} />
      </div>
      <hr style={{ margin: 0 }} />
    </div>
  );
}

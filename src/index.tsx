import * as React from 'react';
import ReactDOM from 'react-dom/client';

import { Main } from './component/Main';

let root = document.getElementById('root');
if (!root) {
  root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
}

ReactDOM.createRoot(root).render(<Main />);

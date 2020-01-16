import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App';
const packageJson = require('../../package.json');

try {
  // https://jslog.me/dashboard
  // TODO: change to cordova fetch or web worker fetch
  import('../services/JsLog').then(module => {
    try {
      new module.default({ key : '01b649df0f7d22f53bd82a4cb519e8ac5b57b5e2', version : packageJson.version });
    } catch (error) {
      console.error(error);
    }
  })
} catch (error) {
  console.erro(error);
}

ReactDOM.render(React.createElement(App, {}), document.getElementById('root'));

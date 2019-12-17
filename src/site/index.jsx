import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App';

// Service worker to cache responses
// import runtime from 'serviceworker-webpack-plugin/lib/runtime';

// if ('serviceWorker' in navigator) {
//   const registration = runtime.register();
// }

ReactDOM.render(React.createElement(App, {}), document.getElementById('root'));

var serviceWorkerOption = {
  "assets": [
    "/race-day-app4f0283c6ce28e888000e978e537a6a56.png",
    "/race-day-appa6137456ed160d7606981aa57c559898.png",
    "/race-day-app2273e3d8ad9264b7daa5bdbf8e6b47f8.png",
    "/race-day-appindex.css",
    "/race-day-appindex.js",
    "/race-day-appindex.js.LICENSE",
    "/race-day-appindex.html"
  ]
};
        
        !function(e){var n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,function(n){return e[n]}.bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="app",t(t.s=0)}([function(e,n){self.addEventListener("install",(function(e){self.skipWaiting()})),self.addEventListener("activate",(function(e){console.log("activating");var n=["runtime"];e.waitUntil(caches.keys().then((function(e){return e.filter((function(e){return!n.includes(e)}))})).then((function(e){return Promise.all(e.map((function(e){return caches.delete(e)})))})).then((function(){console.log("claiming"),self.clients.claim()})))})),self.addEventListener("fetch",(function(e){e.request.url.indexOf("tile.osm.org")>=0&&e.respondWith(caches.match(e.request).then((function(n){return n||caches.open("runtime").then((function(n){return fetch(e.request).then((function(t){return t.ok?n.put(e.request,t.clone()).then((function(){return t})):t}))}))})))}))}]);
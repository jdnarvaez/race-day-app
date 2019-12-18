var serviceWorkerOption = {
  "assets": [
    "/a6137456ed160d7606981aa57c559898.png",
    "/2273e3d8ad9264b7daa5bdbf8e6b47f8.png",
    "/4f0283c6ce28e888000e978e537a6a56.png",
    "/index.css",
    "/index.js",
    "/index.js.LICENSE",
    "/index.html"
  ]
};
        
        !function(e){var t={};function n(r){if(t[r])return t[r].exports;var u=t[r]={i:r,l:!1,exports:{}};return e[r].call(u.exports,u,u.exports,n),u.l=!0,u.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var u in e)n.d(r,u,function(t){return e[t]}.bind(null,u));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/race-day-app",n(n.s=0)}([function(e,t){self.addEventListener("activate",(function(e){var t=["runtime"];e.waitUntil(caches.keys().then((function(e){return e.filter((function(e){return!t.includes(e)}))})).then((function(e){return Promise.all(e.map((function(e){return caches.delete(e)})))})).then((function(){return self.clients.claim()})))})),self.addEventListener("fetch",(function(e){(e.request.url.indexOf("usabmx.com")>=0||e.request.url.indexOf("tile.osm.org")>=0||e.request.url.indexOf("fonts.googleapis.com")>=0)&&e.respondWith(caches.match(e.request).then((function(t){return t||caches.open("runtime").then((function(t){return fetch(e.request).then((function(n){return t.put(e.request,n.clone()).then((function(){return n}))}))}))})))}))}]);
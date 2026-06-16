define("use-sync-external-store/shim",["exports","react"],function(e){
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";var t=require("react");var n="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},r=t.useState,u=t.useEffect,o=t.useLayoutEffect,i=t.useDebugValue;function c(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!n(e,r)}catch(e){return!0}}var s="undefined"==typeof window||void 0===window.document||void 0===window.document.createElement?function(e,t){return t()}:function(e,t){var n=t(),s=r({inst:{value:n,getSnapshot:t}}),a=s[0].inst,f=s[1];return o(function(){a.value=n,a.getSnapshot=t,c(a)&&f({inst:a})},[e,n,t]),u(function(){return c(a)&&f({inst:a}),e(function(){c(a)&&f({inst:a})})},[e]),i(n),n};e.useSyncExternalStore=void 0!==t.useSyncExternalStore?t.useSyncExternalStore:s});
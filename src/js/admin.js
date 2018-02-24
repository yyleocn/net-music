const normalize_css = require('normalize.css');

import '../css/admin.scss';
const jQ = require('jquery');
window.jQ = jQ;

import loginInit from './login';

new Promise((resolve_, reject_) => {
    let config = JSON.parse(sessionStorage.getItem('uploadConfig'));
    if (!config.QinniuToken) {
        reject_();
    }
    resolve_(config);
}).then().catch(loginInit)
// import * as Leancloud from './leancloud.js';
// console.log(Leancloud);

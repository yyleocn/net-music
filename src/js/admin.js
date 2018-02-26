const normalize_css = require('normalize.css');
import '../css/admin.scss';

import jQ from 'jquery';
window.jQ = jQ;

import loginInit from './login';
import './sweetAlertCustom';

new Promise((resolve_, reject_) => {
    let config = JSON.parse(sessionStorage.getItem('uploadConfig'));
    if (!config.QinniuToken) {
        reject_();
    }
    resolve_(config);
}).then().catch(loginInit);


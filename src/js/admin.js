"use strict";
const normalize_css = require('normalize.css');
import '../css/admin.scss';

import PubSub from 'pubsub-js';
import jQ from 'jquery';

window.jQ = jQ;

import loginInit from './login/login';
import manageInit from './manage/manage';
import './component/sweetAlertCustom';

new Promise((resolve_, reject_) => {
    let config = JSON.parse(sessionStorage.getItem('uploadConfig'));
    if (!config.QinniuToken) {
        reject_();
    }
    resolve_(config);
}).then(
    (config_) => {
        manageInit(jQ('#app'),config_);
    }
).catch((err_) => {
    console.warn(err_);
    loginInit(jQ('#app'));
});

PubSub.subscribe('fileLoaded', (msg_, data_) => {
    console.log(data_);
});
"use strict";
const normalize_css = require('normalize.css');
import '../css/admin.scss';

import PubSub from 'pubsub-js';
import jQ from 'jquery';

window.jQ = jQ;

import leanCloud from './component/leancloud';
import loginInit from './login/login';
import manageInit from './manage/manage';
import './component/sweetAlertCustom';

let appInit = () => {
    if (leanCloud.User.current()) {
        manageInit(jQ('#app'), '123');
        return;
    }
    loginInit(jQ('#app'));
};



window.leanCloud = leanCloud;
// PubSub.subscribe('fileLoaded', (msg_, data_) => {
//     console.log(data_);
// });
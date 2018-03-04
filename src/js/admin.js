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

let tokenURL = '//localhost:12321/token';

let appInit = () => {
    if (leanCloud.User.current()) {
        jQ.ajax(tokenURL).then(
            (data_)=>{
                console.log(data_);
            }
        );
        manageInit(jQ('#app'), '123');
        return;
    }
    loginInit(jQ('#app'), leanCloud);
};

appInit();

window.leanCloud = leanCloud;
// PubSub.subscribe('fileLoaded', (msg_, data_) => {
//     console.log(data_);
// });
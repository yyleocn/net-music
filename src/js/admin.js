"use strict";
const normalize_css = require('normalize.css');
import '../css/admin.scss';

import PubSub from 'pubsub-js';
import jQ from 'jquery';

window.jQ = jQ;

import leanCloud from './component/leancloud';
import loginInit from './login/login';
import manageInit from './manage/manage';
import * as myLib from './component/myLib';

import './component/sweetAlertCustom';

let tokenURL = '//localhost:12321/token';
let config = {
    leanCloud: leanCloud,
    bucket: 'net-music',
    storageURL: '//p3yt25jp4.bkt.clouddn.com/',
};


let appInit = () => {
    if (leanCloud.User.current()) {
        let userInfo = leanCloud.User.current().toJSON();
        if (userInfo.username !== 'XiaoLe') {
            swal.error({
                title_: '用户权限不足，请重新登录',
            });
            leanCloud.User.logOut();
            setTimeout(() => {
                myLib.reload('url');
            }, 3000);
        }
        jQ.ajax(tokenURL).then(
            (token_) => {
                config.token = token_;
                manageInit(jQ('#app'), config);
            }
        );
        return;
    }
    loginInit(jQ('#app'), leanCloud);
};

appInit();

window.lc = leanCloud;
PubSub.subscribe('passID3Tags', (msg_, data_) => {
    console.log(data_);
});
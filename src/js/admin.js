const normalize_css = require('normalize.css');

import '../css/admin.scss';
const jQ = require("jquery");

jQ.ajax(
    {
        url: '/get-token.php',
        type: 'post',
        data: {
            user: 'XiaoLe',
            password: '123654',
        },
    }
).then((response_) => {
    console.log(response_);
}).catch((err_) => {
    console.log(err_.responseText);
});

// import * as Leancloud from './leancloud.js';
// console.log(Leancloud);
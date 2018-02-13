import '../css/admin.scss';

const axios = require('axios');
const qs = require('qs');
import * as Leancloud from './leancloud.js';

axios.post('/get-token.php',
    qs.stringify({
        user: 'XiaoLe',
        password: '123654789',
    })
).then((response_) => {
    console.log(response_.data);
}).catch((err_) => {
    console.log(err_.response.data);
    console.dir(err_);
});

console.log(Leancloud);
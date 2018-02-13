import '../css/admin.scss';

const AV = require('leancloud-storage');
const axios = require('axios');
const qs = require('qs');

const APP_ID = 'XnSndmRe6ecqgsV5lz8DLCHV-gzGzoHsz';
const APP_KEY = '4UVaXps7tlTlC3UzTAogSrwS';


AV.init({
    appId: APP_ID,
    appKey: APP_KEY,
});

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
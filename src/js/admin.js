const AV = require('leancloud-storage');
const axios = require('axios');

const APP_ID = 'XnSndmRe6ecqgsV5lz8DLCHV-gzGzoHsz';
const APP_KEY = '4UVaXps7tlTlC3UzTAogSrwS';


AV.init({
    appId: APP_ID,
    appKey: APP_KEY,
});

axios.post('/get-token.php')
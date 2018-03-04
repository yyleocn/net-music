"use strict";
const AV = require('leancloud-storage');

const APP_ID = 'FEAOpy92CJnM1Vo4bUS2rGdr-gzGzoHsz';
const APP_KEY = 'Dj7clW3Eed20WeOA60rdpKWn';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY,
});
export default AV;
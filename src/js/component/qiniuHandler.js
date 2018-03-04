"use strict";
import jQ from 'jquery';
import * as qiniu from 'qiniu-js';

let promiseUpload = ({token_, key_, file_, onProgress_}) => {
    console.log('Promise upload.');
    return new Promise((resolve_, reject_) => {
        if (!file_) {
            reject_('Invalid upload file, upload fail.');
            return;
        }
        if (!token_) {
            reject_('Invalid upload token, upload fail.');
            return;
        }
        let observable = qiniu.upload(
            file_,
            key_,
            token_,
            {
                fname: '',
                params: {},
                mimeType: null
            },
            {
                useCdnDomain: true,
                region: qiniu.region.z2
            },
        );
        observable.subscribe({
            next: onProgress_,
            error: reject_,
            complete: resolve_,
        });
    });
};

let fileList = ({token_, prefix_, bucket_}) => {
    let queryString = jQ.param({
        bucket: bucket_,
        prefix: prefix_,
    });
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `//rsf.qbox.me/list?${queryString}`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader(
        'Authorization', `UpToken ${token_}`
    );
    xhr.onreadystatechange = (event_) => {
        let target = event_.currentTarget;
        if (target.readyState !== 4) {
            return;
        }
        if (target.status >= 200 && target.status < 300) {
            console.log(
                `请求成功，返回结果如下：\n${target.responseText}`
            );
        } else if (target.status >= 400) {
            console.log('请求失败。');
        }
    };
    xhr.send();


    // return jQ.ajax({
    //     type: 'get',
    //     url: '//rsf.qbox.me/list',
    //     data: {
    //         bucket: bucket_,
    //         prefix: prefix_,
    //     },
    //     headers: {
    //         'Authorization': `QBox ${token_}`,
    //     },
    // }).then(
    //     (data_) => {
    //         console.log(data_);
    //     }
    // )
};

export {
    promiseUpload,
    fileList,
} ;
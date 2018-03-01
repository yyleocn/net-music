"use strict";
import * as qiniu from 'qiniu-js';

let promiseUpload = ({
                         token_, key_, file_, onProgress_
                     }) => {
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

export default promiseUpload;
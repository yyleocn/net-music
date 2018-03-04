"use strict";

import jQ from 'jquery';
import * as QiNiuHandler from '../component/qiniuHandler';
import readMediaID3 from  '../component/readMediaID3';
import fileMD5Hash from  '../component/fileMD5Hash';


import * as myLib from '../component/myLib';

let fileLoaderInit = (target_, config_) => {
    let view = {
        template: jQ(`
        <label class="loaderLabel">
            <span class="tag">
                选择上传文件<br>支持拖放
            </span>
            <input type="file" name="fileSelector">
        </label>
        `),
        render(target_) {
            if (!target_ instanceof jQ) {
                throw 'Invalid target.';
            }
            target_.eq(0).empty().append(this.template);
            this.subDom = {
                label: this.template,
                input: this.template.find('input:file'),
            };
        },
    };
    let controller = {
        fileExistCheck(md5_) {
            // QiNiuHandler.fileList({
            //     token_:config_.token,
            //     bucket_:config_.bucket,
            //     prefix_:md5_,
            // });
            return myLib.ajaxDetect({
                url_: config_.storageURL + md5_,
            });
        },
        fileExist(md5_) {
            console.log('File exist.');
            return swal.confirm({
                title_: '服务器端已存在相同文件，是否直接加载结果。'
            }).then(
                (choice_) => {
                    if (!choice_) {
                        return
                    }
                    PubSub.publish('loadInfoByKey', md5_)
                }
            );
        },

        passID3Tags(tags_) {
            console.log('Pass ID3 tag');
            PubSub.publish('passID3Tags', tags_);
        },

        fileLoad(file_) {
            let fileMD5 = '';
            let ID3Tag = {};
            if (!file_) {
                return;
            }

            let fileUpload = () => {
                return QiNiuHandler.promiseUpload({
                    token_: config_.token,
                    key_: fileMD5,
                    file_: file_,
                });
            };

            let fileID3Loaded = (tags_) => {
                ID3Tag = tags_;
                return swal.confirm({
                    title_: '读取完毕',
                    text_: `“${file_.name}”的Key为“${fileMD5}”开始上传？`,
                }).then(
                    (res_) => {
                        if (!res_) {
                            return userCancel();
                        }
                        return fileUpload().then(
                            () => {
                                if (ID3Tag.coverImg) {
                                    let binaryArr = new Uint8Array(ID3Tag.coverImg.data);
                                    let blobObj = new Blob([binaryArr.buffer]);
                                    return QiNiuHandler.promiseUpload({
                                        token_: config_.token,
                                        key_: fileMD5 + '-cover',
                                        file_: blobObj,
                                    }).then(
                                        () => {
                                            ID3Tag.cover = true;
                                        }
                                    );
                                }
                            }
                        )
                    }
                );
            };

            let userCancel = () => {
                console.log('Upload cancel');
                return swal.error({
                    title_: '用户取消了上传',
                });
            };

            fileMD5Hash(
                file_
            ).then(
                (res_) => {
                    fileMD5 = res_;
                    return this.fileExistCheck(fileMD5);
                }
            ).then(
                () => {
                    this.fileExist(fileMD5);
                },
                (res_) => {
                    return readMediaID3(file_).then(
                        fileID3Loaded,
                        () => {
                            return swal.confirm({
                                title_: 'ID3读取错误',
                                text_: '没有读取到ID3信息，可能不是音频文件，是否继续上传？',
                            }).then(
                                (res_) => {
                                    if (res_) {
                                        return fileUpload();
                                    }
                                    return userCancel();
                                }
                            );
                        }
                    ).then(
                        () => {
                            ID3Tag.key = fileMD5;
                            this.passID3Tags(
                                ID3Tag || {fileName: file_.name}
                            );
                        },
                        myLib.errorProcess()
                    );
                }
            ).catch(
                myLib.errorProcess
            );

        },
        eventBind() {
            let fileUpload = () => {

            };
            let fileInputChange = (event_) => {
                let file = event_.currentTarget.files[0];
                event_.currentTarget.value = '';
                if (!file) {
                    return;
                }
                this.fileLoad(file);
            };
            this.view.subDom.input.on('change', fileInputChange);
        },
        init(view_, model_, target_) {
            this.view = view_;
            this.model = model_;
            this.view.render(target_);
            this.eventBind();
        },
    };
    controller.init(view, {}, target_);
    console.log('FileLoader init.');
};

export default fileLoaderInit;
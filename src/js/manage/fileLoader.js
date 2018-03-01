"use strict";

import jQ from 'jquery';
import jsmediatags from 'jsmediatags';
import promiseUpload from './uploader';

let storageURL = '//p3yt25jp4.bkt.clouddn.com/';

import * as myLib from '../component/myLib';

let fileLoaderInit = (target_, token_) => {
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
        fileReaderHandler() {

        },
        fileExistCheck(url_) {
            return myLib.ajaxDetect({
                url_: url_,
            });
        },
        fileAvailable() {
            return swal.confirm({
                title_: '服务器端已存在相同文件，是否直接加载结果。'
            }).then(
                (choice_) => {
                    console.log(choice_);
                }
            );
        },
        fileID3Read(file_) {
            return new Promise((resolve_, reject_) => {
                jsmediatags.read(file_, {
                    onSuccess: (tag_) => {
                        let tags = undefined;
                        if (tag_.tags) {
                            tags = {};
                            [
                                'album', 'artist', 'title',
                            ].forEach((key_) => {
                                tags[key_] = tag_.tags[key_];
                            });
                            if (tag_.tags.picture) {
                                tags.cover = tag_.tags.picture;
                            }
                            resolve_(tags);
                        }
                        reject_('没有读取到文件的ID3信息');
                    },
                    onError: (err_) => {
                        reject_('没有读取到文件的ID3信息');
                        console.log('error', err_);
                    },
                });
            })
        },

        passID3Tags(tags_) {
            PubSub.publish('passID3Tags', tags_);
        },

        fileLoad(file_) {
            let fileMD5 = '';
            let ID3Tag = undefined;
            if (!file_) {
                return;
            }

            let fileUpload = () => {
                return promiseUpload({
                    token_: token_,
                    key_: fileMD5,
                    file_: file_,
                });
            };
            let userCancel = () => {
                return swal.error({
                    title_: '用户取消了上传',
                })
            };

            myLib.fileMD5Hash(
                file_
            ).then(
                (res_) => {
                    fileMD5 = res_;
                    return this.fileExistCheck(storageURL + res_);
                }
            ).then(
                this.fileAvailable,
                (res_) => {
                    return this.fileID3Read(file_).then(
                        (tags_) => {
                            ID3Tag = tags_;
                            return swal.confirm({
                                title_: '读取完毕',
                                text_: `“${file_.name}”的MD5为“${fileMD5}”，确认开始上传`,
                            }).then(
                                () => {
                                    return fileUpload().then(
                                        () => {
                                            if (tags_.cover) {
                                                let binaryArr = new Uint8Array(tags_.cover.data);
                                                let blobObj = new Blob([binaryArr.buffer]);
                                                return promiseUpload({
                                                    token_: token_,
                                                    key_: fileMD5 + '-cover',
                                                    file_: blobObj,
                                                });
                                            }
                                        }
                                    )
                                },
                                userCancel
                            );
                        },
                        () => {
                            return swal.confirm({
                                title_: 'ID3读取错误',
                                text_: '没有读取到ID3信息，可能不是音频文件，是否继续上传？',
                            }).then(fileUpload, userCancel);
                        }
                    ).then(
                        () => {
                            if (ID3Tag) {
                                this.passID3Tags(ID3Tag);
                            }
                        }
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
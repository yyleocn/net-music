"use strict";

import jQ from 'jquery';
import * as QiNiuHandler from '../component/qiniuHandler';
import readMediaID3 from '../component/readMediaID3';
import fileMD5Hash from '../component/fileMD5Hash';


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
            async fileExist (md5_) {
                if (
                    await swal.confirm({
                        title_: '服务器端已存在相同文件，是否直接加载结果。'
                    })
                ) {
                    console.log(`Load info by key (${md5_})`);
                    PubSub.publish('loadInfoByKey', md5_);
                }
            },

            passID3Tags(tags_) {
                console.log(`Pass ID3 tag.`);
                PubSub.publish('passID3Tags', tags_);
            },

            userCancel: () => {
                return swal.error({
                    title_: '用户取消了上传',
                });
            },


            async fileLoad(file_) {
                if (!file_) {
                    return;
                }

                let fileMD5 = await fileMD5Hash(file_);
                let checkRes = await this.fileExistCheck(fileMD5);
                if (checkRes) {
                    return this.fileExist(fileMD5);
                }
                let mediaInfo = {
                    fileName: file_.name,
                    md5: fileMD5,
                };
                let mediaID3 = await readMediaID3(file_);

                if (mediaID3) {
                    if (
                        await swal.confirm({
                            title_: '读取完毕',
                            text_: `文件名：${file_.name}\nMD5：${fileMD5}”\n开始上传？`,
                        })
                    ) {
                        // continue if true
                    } else {
                        return this.userCancel();
                    }
                } else {
                    if (
                        await swal.confirm({
                            title_: 'ID3读取错误',
                            text_: '没有读取到ID3信息，可能不是音频文件，是否继续上传？',
                        })
                    ) {
                        // continue if true
                    } else {
                        return this.userCancel();
                    }
                }

                let uploadRes = await QiNiuHandler.promiseUpload({
                    token_: config_.token,
                    key_: fileMD5,
                    file_: file_,
                });
                console.log('Upload finish', uploadRes);
                if (mediaID3) {
                    if (mediaID3.coverImg) {
                        let binaryArr = new Uint8Array(mediaID3.coverImg.data);
                        let blobObj = new Blob([binaryArr.buffer]);
                        let coverImgUploadRes = await QiNiuHandler.promiseUpload({
                            token_: config_.token,
                            key_: fileMD5 + '-cover',
                            file_: blobObj,
                        });
                        mediaID3.cover = true;
                    }
                    Object.assign(mediaInfo, mediaID3);
                }
                return this.passID3Tags(mediaInfo);
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
                    this.fileLoad(file).catch((err_) => {
                        console.warn(err_);
                    });
                };
                this.view.subDom.input.on('change', fileInputChange);
            },
            init(view_, model_, target_) {
                this.view = view_;
                this.model = model_;
                this.view.render(target_);
                this.eventBind();
            },
        }
    ;
    controller.init(view, {}, target_);
    console.log('FileLoader init.');
};

export default fileLoaderInit;
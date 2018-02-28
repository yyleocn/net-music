"use strict";
import * as qiniu from 'qiniu-js'


let editorInit = (target_, token_) => {
    let defaultCoverURL = '//p3yt25jp4.bkt.clouddn.com/default.png';
    let view = {
        template: jQ(`
        <form id="editor">
            <table class="table">
                <tbody>
                <tr class="title">
                    <th>歌曲名</th>
                    <td><input type="text" placeholder="" maxlength="20" size="15" name="title"></td>
                    <td rowspan="6" class="coverBox">
                        <object data="" class="cover" width="200px">
                            <img src="//p3yt25jp4.bkt.clouddn.com/default.png" width="200px">
                        </object>
                    </td>
                </tr>
                <tr class="artist">
                    <th>歌手</th>
                    <td><input type="text" placeholder="" maxlength="20" size="15" name="artist"></td>
                </tr>
                <tr class="album">
                    <th>专辑</th>
                    <td><input type="text" placeholder="" maxlength="20" size="15" name="album"></td>
                </tr>
                <tr class="cover">
                    <th>封面</th>
                    <td><input type="text" placeholder="" maxlength="20" size="15" name="cover"></td>
                </tr>
                <tr class="fileName">
                    <th>文件名</th>
                    <td><input type="text" placeholder="" maxlength="20" size="15" name="title" disabled></td>
                </tr>
                <tr class="MD5">
                    <th>MD5</th>
                    <td><input type="text" placeholder="" maxlength="20" size="15" name="md5" disabled></td>
                </tr>
                <tr class="url">
                    <th>URL</th>
                    <td><input type="text" placeholder="" maxlength="20" size="15" name="url" disabled></td>
                </tr>
                </tbody>
            </table>
            <input type="submit" class="save" value="保存">
        </form>
        `),
        render(target_, tags_) {
            return new Promise((reject_, reserve_) => {
                if (!target_ instanceof jQ) {
                    throw 'Invalid target.';
                }
                target_.eq(0).empty().append(this.template);
                this.subDom = {
                    form: this.template,
                };
                reject_();
            });
        },
    };
    let model = {
        data: {},
        renderHandler: undefined,
        setAttr(attr_) {
            if (!attr_) {
                return;
            }
            if (attr_.file || attr_.url) {
                this.data = Object.assign({}, attr_);
            }
            Object.assign(this.data, attr_);
            if (this.renderHandler instanceof Function) {
                this.renderHandler();
            }
        },
    };
    let controller = {
        eventBind() {
            this.view.subDom.form.on('submit', (event_) => {
                event_.preventDefault();
                if (this.model.data.file) {
                    this.fileUpload(this.model.data.file);
                }
            });
        },
        fileUpload(file_) {
            let next = (response_) => {
                console.log(response_.total.percent);
            };
            console.log(file_);
            let config = {
                useCdnDomain: true,
                region: qiniu.region.z2
            };
            let putExtra = {
                fname: "",
                params: {},
                mimeType: null
            };
            let observable = qiniu.upload(
                file_,
                file_.name,
                token_,
                putExtra,
                config
            );
            observable.subscribe(next);
        },
        infoSave(data_) {

        },
        init(view_, model_, target_) {
            this.view = view_;
            this.model = model_;
            this.model.renderHandler = () => {
                this.view.render(
                    target_, this.model.data).then(this.eventBind()
                );
            };
            this.model.renderHandler(target_);
            PubSub.subscribe('fileLoaded', (msg_, data_) => {
                this.model.setAttr(data_);
            });
        },
    };
    controller.init(view, model, target_);
};


export default editorInit;
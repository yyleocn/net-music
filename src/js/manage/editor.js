"use strict";

let defaultCoverURL = '//p3yt25jp4.bkt.clouddn.com/default.png';

let editorInit = (target_) => {
    let view = {
        template: jQ(`
        <form id="editor">
            <table class="table">
                <tbody>
                <tr class="title">
                    <th>歌曲名</th>
                    <td><input type="text" placeholder="" maxlength="20" size="15" name="title"></td>
                    <td rowspan="6" class="coverBox">
                        <img src="//p3yt25jp4.bkt.clouddn.com/default.png" class="cover"  width="200px">
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
                    <td><input type="text" placeholder="" maxlength="20" size="15" name="fileName" disabled></td>
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
        render(target_, data_) {
            let template = this.template;
            return new Promise((resolve_, reject_) => {
                if (!target_ instanceof jQ) {
                    throw 'Invalid target.';
                }
                if (data_.tags) {
                    [
                        'title',
                        'artist',
                        'album',
                    ].forEach((key_) => {
                        template.find(`input[name=${key_}]`).val(data_.tags[key_]);
                    });
                    if (data_.tags.cover) {
                        let binary64String = data_.tags.cover.data.map(
                            item_ =>
                                String.fromCharCode(item_)
                        ).join('');
                        template.find(`img.cover`).attr(
                            'src',
                            "data:" + data_.tags.cover.format + ";base64," + window.btoa(binary64String)
                        );
                        window.test = () => {

                            let binaryArr = new Uint8Array(data_.tags.cover.data);
                            let blobObj = new Blob([binaryArr.buffer]);
                        };
                    }
                }
                if (data_.file) {
                    template.find('input[name=fileName]').val(data_.file.name);
                }
                target_.eq(0).empty().append(this.template);
                this.subDom = {
                    form: this.template,
                };
                resolve_();
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
            });
        },
        infoSave(data_) {

        },
        init(view_, model_, target_) {
            this.view = view_;
            this.model = model_;
            this.model.renderHandler = () => {
                this.view.render(
                    target_, this.model.data
                ).then(() => {
                    this.eventBind();
                }).catch((err_) => {
                    console.log(err_);
                });
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
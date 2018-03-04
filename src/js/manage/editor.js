"use strict";

let defaultCoverURL = '//p3yt25jp4.bkt.clouddn.com/default.png';

let editorInit = (target_, leanCloud_) => {
    let view = {
        template: jQ(`
        <form id="editor">
            <table class="table">
                <tbody>
                <tr class="title">
                    <th>歌曲名</th>
                    <td><input type="text" placeholder="" maxlength="20" size="20" name="title"></td>
                    <td rowspan="6" class="coverBox">
                        <img src="//p3yt25jp4.bkt.clouddn.com/default.png" class="cover"  width="200px">
                    </td>
                </tr>
                <tr class="artist">
                    <th>歌手</th>
                    <td><input type="text" placeholder="" maxlength="20" size="20" name="artist"></td>
                </tr>
                <tr class="album">
                    <th>专辑</th>
                    <td><input type="text" placeholder="" maxlength="20" size="20" name="album"></td>
                </tr>
                <tr class="key">
                    <th>Key</th>
                    <td><input type="text" placeholder="" maxlength="20" size="20" name="key" disabled></td>
                </tr>
                <tr class="fileName">
                    <th>文件名</th>
                    <td>
                    <input type="text" placeholder="" maxlength="20" size="20" name="fileName" disabled></textarea>
                    </td>
                </tr>
                <tr class="cover">
                    <th>封面</th>
                    <td>
                        <label class="coverSelector">选择封面文件<input type="file" name="coverSelector"></label>
                    </td>
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
                [
                    'title',
                    'artist',
                    'album',
                    'fileName',
                    'key',
                ].forEach((key_) => {
                    template.find(`[name=${key_}]`).val(data_[key_] || '');
                });
                if (data_.cover) {
                    this.template.find('img.cover').attr('src', data_.cover);
                }
                target_.eq(0).empty().append(this.template);
                this.subDom = {
                    form: this.template,
                    coverImg: this.template.find('img.cover'),
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
            if (attr_.url) {
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
            this.view.subDom.coverImg.on('error', (event_) => {
                if (event_.currentTarget.src !== defaultCoverURL) {
                    event_.currentTarget.src = defaultCoverURL;
                }
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
            PubSub.subscribe('passID3Tags', (msg_, data_) => {
                this.model.setAttr(data_);
            });
        },
    };
    controller.init(view, model, target_, leanCloud_);
    console.log(leanCloud_);
};


export default editorInit;
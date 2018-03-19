"use strict";
import readMediaID3 from '../component/readMediaID3';

let defaultCoverURL = '//p3yt25jp4.bkt.clouddn.com/default.png';


let editorInit = ({target: target_, config: config_}) => {
    let view = {
        template: jQ(`
        <form id="editor">
            <table class="table">
                <tbody>
                <tr class="title">
                    <th>歌曲名</th>
                    <td><input type="text" placeholder="" maxlength="20" size="20" name="title"></td>
                    <td rowspan="4" class="coverBox">
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
                    <th>MD5</th>
                    <td><input type="text" placeholder="" maxlength="20" size="20" name="md5" disabled></td>
                </tr>
                <tr class="fileName">
                    <th>封面</th>
                    <td>
                        <label class="fileSelector">选择封面文件<input type="file" name="coverSelector"></label>
                    </td>
                    <td class="buttonBox">
                        <label class="fileSelector">加载ID3信息<input type="file" name="ID3Selector"></label>
                    </td>
                </tr>
                <tr class="cover">
                    <th>文件名</th>
                    <td>
                    <input type="text" placeholder="" maxlength="20" size="20" name="fileName" disabled></textarea>
                    </td>
                    <td class="buttonBox">
                        <input type="submit" class="save" value="保存">
                    </td>
                </tr>
                </tbody>
            </table>
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
                    'md5',
                ].forEach((key_) => {
                    template.find(`[name=${key_}]`).val(data_[key_] || '');
                });
                if (data_.md5 && data_.cover) {
                    this.template.find('img.cover').attr('src', config_.storageURL + data_.md5 + '-cover');
                }
                target_.eq(0).empty().append(this.template);
                this.subDom = {
                    form: this.template,
                    coverImg: this.template.find('img.cover'),
                    inputArr: this.template.find('input:text[disabled!=disabled]'),
                    coverSelector: this.template.find('input[name=coverSelector]'),
                    ID3Selector: this.template.find('input[name=ID3Selector]'),
                };
                resolve_();
            });
        },
    };
    let model = {
        data: {},
        setAttr(attr_) {
            if (!attr_) {
                return;
            }
            if (attr_.key) {
                this.data = Object.assign({}, attr_);
            }
            Object.assign(this.data, attr_);
            if (this.renderHandler instanceof Function) {
                this.renderHandler();
            }
        },
    };
    let controller = {
        infoSave() {
            let songHandler = config_.leanCloud.Object.extend('song');
            let songObj = new songHandler();
            console.log(this.model.data);
            [
                'title',
                'artist',
                'album',
                'key',
            ].forEach((key_) => {
                songObj.set(key_, this.model.data[key_]);
            });
            songObj.save();
        },
        infoLoad(key_) {
            let modelObj = this.model;
            let query = new config_.leanCloud.Query('song');
            query.equalTo('key', key_);
            query.find().then((data_) => {
                if (data_.length) {
                    this.model.setAttr(data_[0].toJSON());
                    return
                }
                this.model.setAttr({
                    key: key_,
                    cover: true,
                })
            });
        },
        eventBind() {
            this.view.subDom.form.on('submit', (event_) => {
                event_.preventDefault();
                this.infoSave();
            });
            this.view.subDom.coverImg.on('error', (event_) => {
                if (event_.currentTarget.src !== defaultCoverURL) {
                    event_.currentTarget.src = defaultCoverURL;
                }
            });
            this.view.subDom.inputArr.on('change', (event_) => {
                let key = event_.currentTarget.name;
                this.model.data[key] = event_.currentTarget.value.trim();
            });
            this.view.subDom.ID3Selector.on('change', (event_) => {
                let file = event_.currentTarget.files[0];
                event_.currentTarget.value = '';
                if (!file) {
                    return;
                }
                readMediaID3(file).then(
                    (data_) => {
                        this.model.setAttr(data_);
                    }
                )
            });
        },
        init({view:view_,model:model_,target:target_}) {
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
            PubSub.subscribe('loadInfoByKey', (msg_, data_) => {
                this.infoLoad(data_);
            });

        },
    };
    controller.init({
        view:view,
        model:model,
        target:target_,
    });
};


export default editorInit;
"use strict";

import jQ from 'jquery';
import jsmediatags from 'jsmediatags';
// import * as myLib from './../component/myLib';

let fileLoaderInit = (target_) => {
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
            }
        },
    };
    let controller = {
        fileReader: new FileReader(),
        fileReaderHandler() {

        },
        fileLoad(file_) {
            jsmediatags.read(file_, {
                onSuccess: (tag_) => {
                    PubSub.publish('setMediaTags',tag_);
                },
                onError: (err_) => {
                    console.log('error', err_);
                },
            });
        },
        eventBind() {
            let fileUpload = () => {

            };
            let fileInputChange = (event_) => {
                let file = event_.currentTarget.files[0];
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
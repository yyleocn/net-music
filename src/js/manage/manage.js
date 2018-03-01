"use strict";

import jQ from 'jquery';
import fileLoader from './fileLoader';
import editorInit from './editor';

let manageInit = (target_, config_) => {
    console.log('Manage init');
    let view = {
        template: jQ(`
        <div id="manage">
            <div class="title">
                <svg class="icon large" aria-hidden="true">
                    <use xlink:href="#icon-music"></use>
                </svg>
                <div>
                    小乐de云音乐　歌曲管理
                </div>
            </div>
            <ul class="songList"></ul>
            <div class="fileLoader"></div>
            <div class="editor"></div>
        </div>
        `),
        render(target_) {
            if (!target_ instanceof jQ) {
                throw 'Invalid target.';
            }
            target_.eq(0).empty().append(this.template);
            this.subDom = {
                songList: this.template.find('.songList'),
                fileLoader: this.template.find('.fileLoader'),
                editor: this.template.find('.editor'),
            };
        },
    };
    let model = undefined;
    let controller = {
        eventBind() {
        },
        init(view_, model_, target_) {
            this.view = view_;
            this.model = model_;
            this.view.render(target_);
            this.eventBind();

            //sub component render
            fileLoader(this.view.subDom.fileLoader, config_.QinniuToken);
            editorInit(this.view.subDom.editor);
        }
    };
    controller.init(view, model, target_);
};

export default manageInit;
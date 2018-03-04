"use strict";

import jQ from 'jquery';
import fileLoader from './fileLoader';
import editorInit from './editor';
import * as myLib from '../component/myLib';

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
                <button class="logout">注销</button>
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
                logout: this.template.find('.logout'),
            };
        },
    };
    let model = undefined;
    let controller = {
        logout(){
            swal.confirm({
                title_:'确认要注销么？',
            }).then((res_)=>{
                if(!res_){
                    return;
                }
                config_.leanCloud.User.logOut();
                swal.success({
                    title_: '注销成功，再见',
                });
                setTimeout(()=>{
                    myLib.reload('url');
                },2000)
            });
        },
        eventBind() {
            this.view.subDom.logout.on('click',this.logout);
        },
        init(view_, model_, target_) {
            this.view = view_;
            this.model = model_;
            this.view.render(target_);
            this.eventBind();
            //sub component render
            fileLoader(this.view.subDom.fileLoader, config_);
            editorInit(this.view.subDom.editor, config_);
        }
    };
    controller.init(view, model, target_);
};

export default manageInit;
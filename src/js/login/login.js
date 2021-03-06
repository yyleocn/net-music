"use strict";
import jQ from 'jquery';
import * as myLib from '../component/myLib';

let loginInit = ({target: target_, config: config_}) => {
    let view = {
        template: jQ(`
        <form id="login">
            <div class="title">
                <svg class="icon large" aria-hidden="true">
                    <use xlink:href="#icon-music"></use>
                </svg>
                <div>
                    小乐de云音乐
                </div>
            </div>
            <input type="text" name="account" placeholder="账号" class="input">
            <input type="password" name="password" placeholder="密码" class="input">
            <div>
                <input type="reset" value="重置" class="button reset">&emsp;
                <input type="submit" value="登陆" class="button submit">
            </div>
        </form>
        `),
        render(target_) {
            if (!target_ instanceof jQ) {
                throw 'Invalid target.';
            }
            target_.eq(0).empty().append(this.template);
        }
    };
    let model = {};
    let controller = {
        eventBind() {
            this.view.template.on('submit', (event_) => {
                event_.preventDefault();
                let form = this.view.template;
                let loginData = {
                    account: form.find('input[name=account]').val(),
                    password: form.find('input[name=password]').val(),
                };
                config_.leanCloud.User.logIn(
                    loginData.account,
                    loginData.password
                ).then(
                    (loginUser_) => {
                        swal.success({
                            title_: '登录成功，跳转中',
                        });
                        setTimeout(() => {
                            myLib.reload('url');
                        }, 2000);
                    },
                    (err_) => {
                        let errMsg = '登录错误';
                        switch (err_.code) {
                            case 210:
                            case 211: {
                                errMsg = '账号密码错误';
                                break;
                            }
                        }
                        swal.error({
                            title_: errMsg,
                        });
                    }
                );
            });
        },
        init({view: view_, model: model_, target: target_}) {
            this.view = view_;
            this.model = model_;
            this.view.render(target_);
            this.eventBind();
        }
    };
    controller.init({
        view: view,
        model: model,
        target: target_,
    });
};

export default loginInit;

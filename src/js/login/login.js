"use strict";
import jQ from 'jquery';
import * as myLib from './../component/myLib';

let loginInit = (target_) => {
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
                let postData = {
                    account: form.find('input[name=account]').val(),
                    password: form.find('input[name=password]').val(),
                };
                jQ.ajax({
                    url: '/get-token.php',
                    type: 'post',
                    data: postData,
                }).then((response_) => {
                    sessionStorage.setItem(
                        'uploadConfig', JSON.stringify(response_)
                    );
                    myLib.reload('url');
                }).catch((err_) => {
                    console.log(err_);
                    swal.error({
                        title_: err_.responseText,
                    });
                });
            });
        },
        init(view_, model_, target_) {
            this.view = view_;
            this.model = model_;
            this.view.render(target_);
            this.eventBind();
        }
    };
    controller.init(view, model, target_);
};

export default loginInit;

const jQ = require("jquery");

let loginInit = () => {
    let view = {
        targetDom: undefined,
        template: `
        <div id="login">
            <div class="title">
                <svg class="icon large" aria-hidden="true">
                    <use xlink:href="#icon-music"></use>
                </svg>
                <div>
                    小乐de云音乐
                </div>
            </div>
            <input type="text" name="user" placeholder="账号">
            <input type="password" name="password" placeholder="密码">
        </div>
        `,
        render: function() {
            if (!this.targetDom) {
                console.log("View not init");
                return;
            }
            
        },
        init: function(target) {
            this.targetDom = jQ(target);
        }
    };
};

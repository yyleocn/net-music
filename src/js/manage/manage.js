let manageInit = () => {
    let view = {
        template: jQ(`
        <div id="manage">
            <div class="title">
                <svg class="icon large" aria-hidden="true">
                    <use xlink:href="#icon-music"></use>
                </svg>
                <div>
                    小乐de云音乐&emsp;歌曲管理
                </div>
            </div>
            <ul class="songList"></ul>
            <div class="fileSelector"></div>
            <div class="edit"></div>
        </div>
        `),
        render(target_) {
            if (!target_ instanceof jQ) {
                throw 'Invalid target.';
            }
            target_.eq(0).empty().append(this.template);
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
        }
    };
    controller.init(
        view,
        model,
        jQ('#app')
    );
}

export default manageInit;
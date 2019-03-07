{
    let view = {
        el: '.wrapper > main',
        template: `
        <h1>歌曲信息</h1>
        <form class="form">
            <div class="form-group">
                <label for="email">歌曲名:</label>
                <input type="text" class="form-control"  value='__key__'>
            </div>
            <div class="form-group">
                <label for="pwd">歌手:</label>
                <input type="text" class="form-control" id="pwd" value='__singer__'>
            </div>
            <div class="form-group">
                <label for="pwd">外链:</label>
                <input type="text" class="form-control" id="pwd"  value='__link__'>
            </div>
            <button type="submit" class="btn btn-primary">提交</button>
        </form>
        `,
        render(data = {}) {
            let placeholders = ['key', 'link', 'singer']
            let html = this.template
            placeholders.map((value) => {
                html = html.replace(`__${value}__`, data[value] || '')
            })
            $(this.el).html(html)
        }
    }



    let model = {}

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model
            this.view.render(this.model.data)
            eventHub.on('upload', (data) => {
                this.view.render(data)
            })
        }

    }

    controller.init(view, model)
}
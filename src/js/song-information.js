{
    let view = {
        el: '.wrapper > main',
        template: `
        <h1>歌曲信息</h1>
        <form class="form">
            <div class="form-group">
                <label for="email">歌曲名:</label>
                <input type="text" name='songName' class="form-control"  value='__songName__'>
            </div>
            <div class="form-group">
                <label for="pwd">歌手:</label>
                <input type="text" name='singer' class="form-control" id="pwd" value='__singer__'>
            </div>
            <div class="form-group">
                <label for="pwd">外链:</label>
                <input type="text" name='url' class="form-control" id="pwd"  value='__url__'>
            </div>
            <button type="submit" class="btn btn-primary">上传</button>
        </form>
        `,
        render(data = {}) {
            let placeholders = ['songName', 'url', 'singer']
            let html = this.template
            placeholders.map((value) => {
                html = html.replace(`__${value}__`, data[value] || '')
            })
            $(this.el).html(html)
        }
    }
    let model = {
        data: {
            songName: '', singer: '', url: '', id: ''
        },
        create(data) {
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('songName', data.songName);
            song.set('singer', data.singer);
            song.set('url', data.url);
            return song.save()

        },
        updata(newSong) {
            let { id, attributes } = newSong
            Object.assign(this.data, {
                id,
                ...attributes
            })
        }
    }


    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            eventHub.on('upload', (data) => {
                this.view.render()
                this.view.render(data)
            })
            eventHub.on('select',(songImformation)=>{
                console.log(songImformation)
                this.view.render(songImformation)
            })
        },
        bindEvents() {
            $(this.view.el).on('submit', 'form', (x) => {
                x.preventDefault()
                let needs = ['singer', 'songName', 'url']
                let data = {}
                needs.map((value) => {
                    data[value] = $(this.view.el).find(`[name=${value}]`).val()
                })
                this.model.create(data)
                    .then((newSong) => {
                        this.model.updata(newSong)
                        this.view.render()
                        eventHub.emit('create',this.model.data)
                    }, (error) => { console.error('Failed to create new object, with error message: ' + error.message) })


            })
        }

    }

    controller.init(view, model)
}
{
    let view = {
        el: '.songList',
        template: `
        
        `,
        render(data) {
            $(this.el).html(this.template)
        },
        insertli(songName) {
            //只接受歌曲名
            let tr = $('<tr></tr>')
            let td = $('<td></td>')
            $('.songList').append(tr)
            $('.songList').find(tr).append(td)
            td.text(songName)



        }
    }
    let model = {
        data: {}, //{songs:[{songName:'xxx',singer:'xxx'....},{},{}]}
        find() {
            var query = new AV.Query('Song')
            return query.find().then((data) => {
                let songs
                songs = data.map((value) => {
                    return value.attributes
                })
                this.data.songs = songs
            })
        }

    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.view.data)
            eventHub.on('create', (data) => {
                this.view.insertli(data.songName)
            })
            this.model.find()
                .then(() => {
                    this.model.data.songs.map((value) => {    
                        this.view.insertli(value.songName)
                    })
                })
        }
    }
    controller.init(view, model)
}
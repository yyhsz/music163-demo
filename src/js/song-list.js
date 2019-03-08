{
    let view = {
        el: '.songList',
        template: `
        
        `,
        render(data) {
            $(this.el).html(this.template)
        },
        insertLi(songName, singer) {
            let tr = $('<tr></tr>')
            let td = $('<td></td>')
            $('.songList').append(tr)
            $('.songList').find(tr).append(td)
            td.text(songName + ' - ' + singer)
        },
        updateLi(songName, singer) {
            $(this.el).find('.active').find('td').text(songName + ' - ' + singer)
        },
        activeLi(target) {
            target.addClass('active').siblings().removeClass('active')
        }
    }
    let model = {
        data: { songs: [] }, //{songs:[{songName:'xxx',singer:'xxx',id:'xxx'....},{},{}]}
        find() {
            var query = new AV.Query('Song')
            return query.find().then((data) => {
                songs = data.map((value) => {
                    let { id, attributes } = value
                    let copy = {}
                    Object.assign(copy, {
                        id,
                        ...attributes
                    })
                    return copy
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
                this.view.insertLi(data.songName, data.singer)
            })
            this.bindEvents()
            this.bindEventHub()
            this.model.find()
                .then(() => {
                    this.model.data.songs.map((value) => {
                        this.view.insertLi(value.songName, value.singer)
                    })
                })
        },
        bindEvents() {
            $(this.view.el).on('click', 'td', (x) => {
                this.view.activeLi($(x.currentTarget).parent())
                let message = []
                this.model.data.songs.map((value) => {
                    if (value.songName === $(x.currentTarget).text().split(' - ')[0]) {
                        message.push(value)
                    }
                })
                eventHub.emit('read', message[0])//传入歌曲信息
            })
        },
        bindEventHub() {
            eventHub.on('create', (data) => {
                this.model.data.songs.push(data)
            })
            eventHub.on('update', (data) => {
                // let selectedSong 
                // this.model.data.songs.map((value) => {
                //     if (value.songName === $(this.view.el).find('.active').find('td').text().split(' - ')[0]) {
                //         selectedSong = value
                //     }
                // }) //selectedSong是我点击的标签对应的数据
                this.view.updateLi(data.songName,data.singer)
            })
        }
    }
    controller.init(view, model)
}
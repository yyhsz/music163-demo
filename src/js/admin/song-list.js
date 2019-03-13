{///包含增删改查中的查看歌曲信息
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
        data: [], //{songs:[{songName:'xxx',singer:'xxx',id:'xxx'....},{},{}]}
        find() {
            var query = new AV.Query('Song')
            return query.find().then((data) => {
                songs = data.map((value) => {
                    let copy = {}
                    let { id, attributes: { songName, singer, url, cover, lyrics } } = value
                    copy.id = id
                    copy.songName = songName
                    copy.singer = singer
                    copy.url = url
                    copy.cover = cover
                    copy.lyrics = lyrics
                    return copy
                })
                this.data = songs
            })
        },
        uploadModelData(data) {  //data是leancloud传回来的数据
            let copy = {}
            let { id, attributes: { songName, singer, url, cover, lyrics } } = data
            copy.id = id
            copy.songName = songName
            copy.singer = singer
            copy.url = url
            copy.cover = cover
            copy.lyrics = lyric
            this.data.push(copy)
        },
        updateModelData(data) {
            this.data.map((value) => {
                if (value.id === data.id) {
                    Object.assign(value, data)
                }
            })
        }

    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.view.data)
            this.bindEvents()
            this.bindEventHub()
            this.model.find()
                .then(() => {
                    this.model.data.map((value) => {
                        this.view.insertLi(value.songName, value.singer)
                    })
                })
        },
        bindEvents() {
            $(this.view.el).on('click', 'td', (x) => {
                this.view.activeLi($(x.currentTarget).parent())
                eventHub.emit('read', $(x.currentTarget).text().split(' - ')[0])//给表单传入被点击的歌曲的名字
            })
        },
        bindEventHub() {
            eventHub.on('create', (data) => {
                this.model.uploadModelData(data)
                this.view.insertLi(data.attributes.songName, data.attributes.singer)
            })
            eventHub.on('update', (data) => {
                this.model.updateModelData(data)
                this.view.updateLi(data.songName, data.singer)
            })

        }
    }
    controller.init(view, model)
}
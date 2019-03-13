{///包含增删改查中的上传歌曲，改动歌曲信息的功能
    let view = {
        el: '.wrapper main #imformation',
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
            <div class="form-group">
                <label for="pwd">封面链接:</label>
                <input type="text" name='cover' class="form-control" id="pwd"  value='__cover__'>
            </div>
            <div class="form-group">
                <label for="pwd">歌词:</label>
                <textarea name='lyrics'>__lyrics__</textarea>
            
            </div>
           
            <button type="submit" class="btn btn-primary">__btn__</button>
        </form>
        `,
        render(data = {}, btnContent = '上传') {
            let placeholders = ['songName', 'url', 'singer', 'cover', 'lyrics']
            let html = this.template.replace('__btn__', btnContent)
            placeholders.map((value) => {
                html = html.replace(`__${value}__`, data[value] || '')
            })
            $(this.el).html(html)
        },
    }
    let model = {
        data: [],
        currentSongId: '',
        uploadToLeanCloud(data) {
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('songName', data.songName);
            song.set('singer', data.singer);
            song.set('url', data.url);
            song.set('cover', data.cover)
            song.set('lyrics', data.lyrics)
            song.set('ACL', { "*": { "read": true, "write": true } })
            return song.save()
        },
        find() {
            var query = new AV.Query('Song')
            return query.find()
        },
        updateLeanCloud(data) {
            var song = AV.Object.createWithoutData('Song', data.id);
            for (let key in data) {
                song.set(`${key}`, data[key])
            }
            return song.save();
        },
        uploadModelData(data) {
            if (Array.isArray(data)) { //每次刷新页面都从leancloud获得所有的歌曲数据
                this.data = data
            } else {    //每次上传新歌曲就要将数据传入model.data
                let copy = {}
                let { id, attributes: { songName, singer, url, cover, lyrics } } = data
                copy.id = id
                copy.songName = songName
                copy.singer = singer
                copy.url = url
                copy.cover = cover
                copy.lyrics = lyrics


                // let { id, attributes } = data

                // Object.assign(copy, {
                //     id,
                //     ...attributes
                // })

                this.data.push(copy)
            }



        },
        updateModelData(data) {
            this.data.map((value) => {
                if (value.id === data.id) {
                    Object.assign(value, data)
                }
            })
        },
        //根据在列表中选中的要修改的歌曲，从this.model.data中找到该歌曲的id
        findID(songName) {
            this.data.forEach((value) => {
                if (value.songName === songName) {
                    this.currentSongId = value.id
                }
            })
        },
        clearCurrentSongId() {
            this.currentSongId = ''
        }
    }
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
            this.model.clearCurrentSongId()
            this.model.find()
                .then((data) => {
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
                    this.model.uploadModelData(songs)//每次刷新页面都重新装载model.data
                })

        },
        bindEvents() {
            $(this.view.el).on('submit', 'form', (x) => {
                x.preventDefault()
                let needs = ['singer', 'songName', 'url', 'cover', 'lyrics']
                let data = {}
                needs.map((value) => {
                    data[value] = $(this.view.el).find(`[name=${value}]`).val()
                })
                //如果用户在改动歌曲信息，那么从表单读出data数据后，把当前选中歌曲的id也传入data

                if (`${this.model.currentSongId}`) {  //这个id不止有数字还有字母不能直接取反
                    data.id = this.model.currentSongId

                }
                if ($(this.view.el).find('button').text() === '提交改动') {

                    eventHub.emit('update', data)
                    //提交完了改动就把存在model.data里选中的歌曲id清空
                    this.model.clearCurrentSongId()

                } else {
                    this.model.uploadToLeanCloud(data)
                        .then((newSong) => {
                            eventHub.emit('create', newSong)
                        }, (error) => { console.error('上传leancloud失败, with error message: ' + error.message) })
                }
            })
        },
        bindEventHub() {
            eventHub.on('writeSongImformation', (data) => { //拖曳或点击文件后，将文件信息写入表单中
                this.view.render(data)
            })
            eventHub.on('read', (songName) => {
                //根据列表中被选中的歌曲从this.model.data选出歌曲信息
                let songInformation = this.model.data.filter((value) => {
                    return (value.songName === songName)
                })
                this.model.findID(songName)
                this.view.render(songInformation[0], '提交改动')
            })
            eventHub.on('create', (data) => {
                this.view.render()  //清空表单中的歌曲信息
                this.model.uploadModelData(data)//将新歌曲信息写入this.model.data

            })
            eventHub.on('update', (data) => {//data中包含id信息
                this.view.render()
                $('.loading').addClass('active')
                this.model.updateLeanCloud(data)
                    .then(() => {
                        this.model.updateModelData(data)
                        $('.loading').removeClass('active')
                        alert('保存成功')
                    }, (error) => { alert('保存失败'); $('.loading').removeClass('active') })
            })
        }
    }
    controller.init(view, model)
}
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
            <button type="submit" class="btn btn-primary">__btn__</button>
        </form>
        `,
        render(data = {}, btnContent = '上传') {
            let placeholders = ['songName', 'url', 'singer', 'qiniuId']
            let html = this.template.replace('__btn__', btnContent)
            placeholders.map((value) => {
                html = html.replace(`__${value}__`, data[value] || '')
            })
            $(this.el).html(html)
        },
    }
    let model = {
        data: {
            songName: '', singer: '', url: '', LCId: ''
        },
        uploadToLeanCloud(data) {
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('songName', data.songName);
            song.set('singer', data.singer);
            song.set('url', data.url);
            return song.save()
        },
        updateLeanCloud(data, LCId) {
            var song = AV.Object.createWithoutData('Song', LCId);
            for (let key in data) {
                song.set(`${key}`, data[key])
            }
            return song.save();
        },
        updateModelData(data) { //
            if (data.attributes) {
                let { LCId, attributes } = data
                Object.assign(this.data, {
                    LCId,
                    ...attributes
                })
            } else {
                this.data.songName = data.songName
                this.data.singer = data.singer
                this.data.url = data.url
                this.data.LCId = data.id

            }

        }
    }
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
        },
        bindEvents() {
            $(this.view.el).on('submit', 'form', (x) => {
                x.preventDefault()
                let needs = ['singer', 'songName', 'url']
                let data = {}
                needs.map((value) => {
                    data[value] = $(this.view.el).find(`[name=${value}]`).val()
                })
                if ($(this.view.el).find('button').text() === '提交改动') {
                    eventHub.emit('update', data, this.model.data.LCId)
                } else {
                    eventHub.emit('create', data)
                }
            })
        },
        bindEventHub() {
            eventHub.on('writeSongImformation', (data) => {
                this.view.render(data)
            })
            eventHub.on('read', (data) => {
                this.view.render(data, '提交改动')
                this.model.updateModelData(data)
            })
            eventHub.on('create', (data) => {
                this.model.uploadToLeanCloud(data)
                    .then((newSong) => {
                        this.model.updateModelData(newSong)//更新this.model.data
                        this.view.render()  //清空表单中的歌曲信息
                    }, (error) => { console.error('Failed to create new object, with error message: ' + error.message) })

            })
            eventHub.on('update', (data, LCId) => {
                this.view.render()
                $('.loading').addClass('active')
                this.model.updateLeanCloud(data, LCId)
                    .then(() => {
                        $('.loading').removeClass('active')
                        alert('保存成功')
                    },(error)=>{alert('保存失败')})
            })
        }
    }
    controller.init(view, model)
}
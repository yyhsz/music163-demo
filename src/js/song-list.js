{
    let view = {
        el: '.songList',
        template: `
        
        `,
        render(data) {
            $(this.el).html(this.template)
        },
        insertLi(songName) {
            //只接受歌曲名
            let tr = $('<tr></tr>')
            let td = $('<td></td>')
            $('.songList').append(tr)
            $('.songList').find(tr).append(td)
            td.text(songName)
        },
        activeLi(target){
            target.addClass('active').siblings().removeClass('active')
        }
    }
    let model = {
        data: {songs:[]}, //{songs:[{songName:'xxx',singer:'xxx',id:'xxx'....},{},{}]}
        find() {
            var query = new AV.Query('Song')
            return query.find().then((data) => {
                songs = data.map((value) => {
                    return value.attributes
                })
                this.data.songs = songs
            })
        },
        bindEventHub(){
            eventHub.on('upload',(data)=>{
                this.data.songs.push(data)
            })
        }
        

    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.view.data)
            eventHub.on('create', (data) => {
                console.log(2)
                this.view.insertLi(data.songName)
            })
            this.bindEvents()
            this.model.bindEventHub()
            this.model.find()
                .then(() => {
                    this.model.data.songs.map((value) => {    
                        this.view.insertLi(value.songName)
                    })
                })
        },
        bindEvents(){
            $(this.view.el).on('click','td',(x)=>{
                this.view.activeLi($(x.currentTarget).parent())
                let message = []
                this.model.data.songs.map((value)=>{
                    if(value.songName === $(x.currentTarget).text()){
                        message.push(value)
                    }
                })
                eventHub.emit('select',message[0])//传入歌曲的id信息
            })
        }
    }
    controller.init(view, model)
}
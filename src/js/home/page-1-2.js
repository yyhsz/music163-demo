{
    let view = {
        el: 'section.songs',
        init(){
            this.$el = $(this.el)
        },
        
        render(data){
            let {songs} = data  
            //只获取最新10首歌
            latestSongs = songs.filter((value,key)=>{
                return  (key>songs.length-11 && key<songs.length)
            })
            console.log(latestSongs)
            latestSongs.map((value)=>{
                this.$el.find('#songs').prepend($(`
                <li>
                <a href="./song.html?id=${value.id}">
                <h3>${value.songName}</h3>
                <p>
                <svg class="icon icon-sq">
                <use xlink:href="#icon-sq"></use>
                </svg>
                ${value.singer}
                </p>
                <a class="playButton" href="./song.html?id=${value.id}">
                <svg class="icon icon-play">
                <use xlink:href="#icon-play"></use>
                </svg>
                </a>
                </a>

                </li>`)[0])
            })
            
        }
        
    }
    let model = {
        data: { songs: [] }, //{songs:[{songName:'xxx',singer:'xxx',id:'xxx'....},{},{}]}
        find() {
            var query = new AV.Query('Song')
            return query.find().then((data) => {
                songs = data.map((value) => {
                    let copy = Object.assign({id:value.id}, value.attributes)
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
            this.view.init()
            this.bindEvents()
            this.model.find()
                .then(()=>{
                   this.view.render(this.model.data)
                })
        },
        bindEvents() {

        }
    }
    controller.init(view,model)
}
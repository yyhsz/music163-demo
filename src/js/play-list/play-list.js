/*
通过网址中的查询参数找到数据库对应的歌单
遍历歌单中的歌名+歌手去另一数据库中找到对应的歌，并将其加载
*/
{
    let view = {
        el: '.songList>ul',
        render(data) {
            data[0].songs.forEach((value) => {
                $(this.el).append(`
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
                </li>
                `)
            })
        }
    }
    let model = {
        data: [], //{ playlistname:xxx,id:xxx,cover:xxx,songs:{songName:xxx,singer:xxx,id:xxx,url:xxx},}
        getImformation(id) { //从歌单中找到歌单对应的歌曲名和歌手
            var query = new AV.Query('PlayList');
            return query.get(id).then((playList) => {
                this.data.push(Object.assign({ id: playList.id }, playList.attributes))
                return this.data
            }, function (error) {
                // 异常处理
            });
        },
        getSongsURL(playList) {//playList就是歌单包含的歌曲信息这个数组
            var query = new AV.Query('Song')
            return query.find().then((data) => {//data
                let songs = playList[0].songs
                songs.forEach((value, key) => {
                    data.forEach(element => {
                        if (value.songName === element.attributes.songName && value.singer === element.attributes.singer) {
                            
                            songs[key].id = element.id
                        }
                    })
                })
                this.data.songs = songs
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.model.getImformation('5c8b26dffe88c2006f74429c')
                .then((playList) => {
                    this.model.getSongsURL(playList)
                        .then(() => {
                            this.view.render(this.model.data)
                        })
                })

        },
        getPlayListId() {
            let array = window.location.search.substring(1).split('&').filter(value => value)
            let id = ''
            array.map((value, key) => {
                if (array[key].split('=')[0] === 'id') {
                    id = array[key].split('=')[1]
                }
            })
            return id
        },

    }
    controller.init(view, model)
}
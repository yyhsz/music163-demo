//设置歌单
//歌单应该包括：歌单名，封面链接，歌单中的歌名+歌手
{   
    let playList = [
        '春天是一首情歌，轻吟浅唱着',
        'https://i.loli.net/2019/03/10/5c85012c82c43.jpg',
        [
            {songName:'刚刚好',singer:'陈壹千ac'},
            {songName:'刚刚好',singer:'薛之谦'},
            {songName:'刚刚好',singer:'陈壹千ac'},
            {songName:'刚刚好',singer:'薛之谦'},
            {songName:'刚刚好',singer:'陈壹千ac'},
            {songName:'刚刚好',singer:'薛之谦'}
        ]
    ]

    let view = {

    }
    let model = {
        data:[],
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
        createPlayList(data){
            console.log(1)
            var PlayList = AV.Object.extend('PlayList');
            var playList = new PlayList();
            playList.set('playListName', data[0]);
            playList.set('cover', data[1]);
            playList.set('songs', data[2]);  //data[2]是数组
            return playList.save()
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.model.createPlayList(playList)
        },
        bindEvents(){

        }
    }
    controller.init(view,model)

















}


{
  let view = {
    el: '#app',
    template: `
        <audio muted src = '__url__'></audio>     
      `,
    render(song) {
      $(this.el).html(this.template.replace('__url__', song.url))
    },
    play() {  
      $(this.el).find('audio')[0].play()
      // let promise = 
      // console.log(promise)
      // if (promise !== undefined) {
      //   promise.then((x)=> {
      //     // Autoplay started!
      //     console.log(x)
      //     $(this.el).find('audio')[0]
      //   },(x)=>{
      //     console.log(x)
      //   }).catch(error => {
      //     console.log(4)
      //     // Autoplay was prevented.
      //     // Show a "Play" button so that user can start playback.
      //   });
      // }
    }

  }
  let model = {
    data: {    //id='',songName,singer,url
    },
    get(id) {
      var query = new AV.Query('Song');
      return query.get(id).then(song => {
        Object.assign(this.data, { id, ...song.attributes })
        return this.data
      }, function (error) {
        console.log('获取歌曲失败')
        console.log(error)
      });
    }

  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.bindEvents()
      this.model.get(this.getSongId())
        .then(() => {
          this.view.render(this.model.data);
          this.view.play()
        })

    },
    bindEvents() {

    },
    getSongId() {
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
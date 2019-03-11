
{
  let view = {
    el: '#app',
    template: `
        <audio src = '__url__'></audio>   




      `,
    render(data) {
      // $(this.el).html(this.template.replace('__url__', song.url))
      let {attributes} = data
      $(this.el).find('.page').css('background-image',song.cover)
    },
    play() {
        $(this.el).find('audio')[0].play()

    }

  }
  let model = {
    data: {    //id='',songName,singer,url
    },
    status:'paused',
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
          console.log(this.model.data)
          this.view.render(this.model.data);
          this.view.play()
        })

    },
    bindEvents() {
      $(this.view.el).on('click','.play',()=>{

      })
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
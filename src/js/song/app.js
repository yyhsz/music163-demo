
{
  let view = {
    el: '#app',
    template: `
        
      `,
    render(data) {
      $(this.el).find('.pageBackground').css('background-image', `url(${data.cover})`)
      $(this.el).find('audio').attr('src', data.url)
      $(this.el).find('.disc .cover').attr('src', data.cover)
    },
    play() {
      $(this.el).find('audio')[0].play()
    },
    pause() {
      $(this.el).find('audio')[0].pause()
    }

  }
  let model = {
    data: {    //id='',songName,singer,url,cover
    },
    status: 'playing',
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
      $(this.view.el).find('.disc').on('click',(x) => {
        switch (this.model.status) {
          case 'playing'://暂停
            this.model.status = 'paused'
            this.view.pause()
            $(this.view.el).find('.icon-wrapper').addClass('active')
            $(this.view.el).find('.icon-play').addClass('active')
            $(this.view.el).find('.disc-container').addClass('paused')            
            break
          case 'paused':
            this.model.status = 'playing'
            this.view.play()
            $(this.view.el).find('.icon-wrapper').removeClass('active')
            $(this.view.el).find('.icon-play').removeClass('active')
            $(this.view.el).find('.disc-container').removeClass('paused')
        }
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
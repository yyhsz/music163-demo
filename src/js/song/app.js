
{
  let view = {
    el: '#app',
    template: `
        
      `,
    render(data) {
      $(this.el).find('.pageBackground').css('background-image', `url(${data.cover})`)
      $(this.el).find('audio').attr('src', data.url)
      $(this.el).find('.disc .cover').attr('src', data.cover)
      $(this.el).find('.song-description h1').html($(this.el).find('.song-description h1').html().replace('__songName__ - __singer__', `${data.songName} - ${data.singer}`))
      data.lyrics.split('\n').map((v) => {
        let p = document.createElement('p')
        let arr = v.split(']')
        let time = arr[0].split('[')[1].split(':')[0] * 60 + +(arr[0].split('[')[1].split(':')[1])              //把歌词中的时间戳转换成用秒表示
        $(p).attr('data-time', time)
        $(p).text(arr[1])
        $(this.el).find('.lyric .lines').append(p)
      })
    },
    play() {
      $(this.el).find('audio')[0].play()
    },
    pause() {
      $(this.el).find('audio')[0].pause()
    },
    n: 0,
    showLyrics(time) {

      let allp = $(this.el).find('.lyric>.lines>p')
      if (time > allp.eq(allp.length - 1).attr('data-time')) {
        $(this.el).find('.lyric>.lines').css('transform', `translateY(${-26 * (allp.length-1)}px)`)
        allp.eq(allp.length-1).addClass('active')
        allp.eq(allp.length-1).siblings().removeClass('active')
      } else {
        for (let key = 0; key < allp.length; key++) {
          if (key === allp.length) {
            allp[key]
          } else {
            let currentTime = allp.eq(key).attr('data-time')
            let nextTime = allp.eq(key + 1).attr('data-time')
            if (currentTime <= time && time < nextTime) {
              if (allp.eq(key).offset().top - $(this.el).find('.lyric').offset().top !== 0) {
                $(this.el).find('.lyric>.lines').css('transform', `translateY(${-26 * (key - 1)}px)`)
                allp.eq(key).addClass('active')
                allp.eq(key).siblings().removeClass('active')

                // console.log(allp[key])
                // console.log(-24*(key-1))

                // console.log(allp[key])
                // console.log(allp.eq(key).offset().top - $(this.el).find('.lyric').offset().top)
              }
              break
            }
          }
        }
      }
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
          this.view.render(this.model.data);
          this.view.play()
        })
    },
    bindEvents() {
      $(this.view.el).find('.disc').on('click', (x) => {
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
      $(this.view.el).find('audio').on('ended', () => {
        this.model.status = 'paused'
        $(this.view.el).find('.icon-wrapper').addClass('active')
        $(this.view.el).find('.icon-play').addClass('active')
        $(this.view.el).find('.disc-container').addClass('paused')
      })
      $(this.view.el).find('audio').on('timeupdate', (x) => {
        this.view.showLyrics(x.currentTarget.currentTime)
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
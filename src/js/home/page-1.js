{


    alert('模块1')

    let view = {
        el: '.page-1',
        init() {
            this.$el = $(this.el)
        },
        show() {
            this.$el.addClass('active')
        },
        hide() {
            this.$el.removeClass('active')
        }

    }
    let model = {

    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.bindEvents()
            this.bindEventHub()
            this.loadModule1()
            this.loadModule2()
        },
        bindEvents() {

        },
        bindEventHub() {
            eventHub.on('selectTab', (tabName) => {
                if (tabName === 'page-1') {
                    this.view.show()
                } else {
                    this.view.hide()
                }
            })
        },
        loadModule1() {
            let script1 = $('<script></script>')[0]
            script1.src = '../src/js/home/page-1-1.js'
            document.body.append(script1)
        },
        loadModule2() {
            let script2 = $('<script></script>')[0]
            script2.src = '../src/js/home/page-1-2.js'
            document.body.append(script2)
        }

    }
    controller.init(view, model)
}
{
    let view = {
        el:'#tabs',
        init(){
            this.$el = $(this.el)

        }
    }
    let model = {

    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.bindEvents()
        },
        bindEvents(){
            this.view.$el.on('click','.tabs-nav >li',(e)=>{
                $(e.currentTarget).addClass('active').siblings().removeClass('active')
                eventHub.emit('selectTab',$(e.currentTarget).attr('tabName'))
            })
        }
    }
    controller.init(view,model)
}
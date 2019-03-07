{
    let view = {
        el:'.newSong',
    }
    let model = {

    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            window.eventHub.on('upload',(data)=>{
                this.active()
            })
        },
        active(){
            $(this.view.el).addClass('active')
        }
    }
    controller.init(view,model)
}
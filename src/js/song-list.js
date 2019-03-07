{
    let view = {
        el:'.songList',
        template:`
        <tr>
            <td>歌曲1</td>
        </tr>
        <tr>
            <td>歌曲2</td>
        </tr>
        <tr>
            <td>歌曲3</td>
        </tr>
        <tr>
            <td>歌曲4</td>
        </tr>
        <tr>
            <td>歌曲5</td>
        </tr>
        <tr>
            <td>歌曲6</td>
        </tr>
        <tr>
            <td>歌曲7</td>
        </tr>
        `,
        render(data){
            $(this.el).html(this.template)
        }
    }
    let model = {

    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.view.data)
        }
    }
    controller.init(view,model)
}
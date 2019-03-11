{
    let view = {
        el: '#uploadArea',
        find(selector) {
            return $(this.el + selector)[0]
        }
    }
    let model = {

    }
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model
            this.uploader = this.initQiniu()
            eventHub.on('create',()=>{  
                this.uploader.start()//不自动上传到七牛，等上传按钮按了才上传
            })
        },
        initQiniu() {
            var uploader = Qiniu.uploader({
                runtimes: 'html5',    //上传模式,依次退化
                browse_button: this.view.find(''),       //上传选择的点选按钮，**必需**
                uptoken_url: 'http://localhost:8088/uptoken',
                domain: 'http://pnxvjs409.bkt.clouddn.com/',   //bucket 域名，下载资源时用到，**必需**
                get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
                max_file_size: '40mb',           //最大文件体积限制
                dragdrop: true,                   //开启可拖曳上传
                drop_element: this.view.find(''), //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                auto_start: false,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': function (up, files) {
                        plupload.each(files, function (file) {
                            // 文件添加进队列后,处理相关的事情
                            let domain = up.getOption('domain');
                            let sourceLink = domain + encodeURIComponent(file.name);
                            let singer = file.name.split('.')[0].split(` - `)[0]
                            let songName = file.name.split('.')[0].split(` - `)[1]
                            eventHub.emit('writeSongImformation', {
                                url: sourceLink,
                                songName: songName,
                                singer: singer,
                                qiniuId:file.id
                            })
                        });
                    },
                    'BeforeUpload': function (up, file) {
                        // 每个文件上传前,处理相关的事情



                    },
                    'UploadProgress': function (up, file) {
                        // 每个文件上传时,处理相关的事情
                        //激活上传加载动画
                        $('.loading').addClass('active')

                    },
                    'FileUploaded': function (up, file, info) {
                        // uploadStatus.textContent = '上传完毕'
                        // 每个文件上传成功后,处理相关的事情
                        // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
                        // {
                        //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                        //    "key": "gogopher.jpg"
                        //  }
                        // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                        // var domain = up.getOption('domain');
                        // var response = JSON.parse(info.response);
                        // var sourceLink = domain + encodeURIComponent(file.name);
                        // var singer = response.key.split('.')[0].split(` - `)[0]
                        // var songName = response.key.split('.')[0].split(` - `)[1]

                        //成功后，关闭上传动画
                        $('.loading').removeClass('active')
                        alert('上传成功')


                    },
                    'Error': function (up, err, errTip) {
                        //上传出错时,处理相关的事情
                        //同样关闭上传动画，但是提示报错
                        $('.loading').removeClass('active')
                        alert('上传失败')

                    },
                    'UploadComplete': function () {
                        //队列文件处理完毕后,处理相关的事情

                    },
                }
            });
            return uploader

        }
    }
    controller.init(view, model)
}
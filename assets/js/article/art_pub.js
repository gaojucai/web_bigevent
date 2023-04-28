$(function(){
    let layer = layui.layer
    let form = layui.form
    initCate()
    // 初始化富文本编辑器
    initEditor()
    function initCate(){
        $.ajax({
            type:'GET',
            url:'/my/article/cates',
            success:res=>{
                if(res.status !== 0){
                    return layer.msg('初始化文章分类失败!!')
                }
                let htmlStr = template('tpl-cate',res)
                $('[name="cate_id"]').html(htmlStr)
                form.render()
            }
        })
    }
      // 1. 初始化图片裁剪器
    var $image = $('#image')
    
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    
    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 为选择封面按钮添加点击事件
    $('#btnChooseImage').click(function(){
        $('#coverFile').click()
    })
    // 监听coverFile 的change 事件 获取用户选择的文件列表
    $('#coverFile').change(function(e){
        // 获取到文件的列表数组
        var file = e.target.files[0]
        // 判断用户是否选择了文件
        if(file.length === 0){
            return
        }
        // 根据文件 创建对应的url地址
        var newImgURL = URL.createObjectURL(file)

        // 为裁剪区重新设置图片
        $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域

    })

    // 定义文章的发布状态
    let art_state = '已发布'
    // 为存为草稿按钮 绑定点击事件处理函数
    $('#btnSave2').click(function(){
        art_state = '草稿'
    })

    // 为表单注册提交事件
    $('#form-pub').submit(function(e){
        // 阻止默认提交行为
        e.preventDefault()
        // 基于form表单 快速创建一个FormData对象
        let fd = new FormData($(this)[0])
        // 将文章发布状态存到fd中
        fd.append('state',art_state)
        $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {       
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append('cover_img',blob)
            // 发起ajax请求
            publishArticle(fd)
        })
    })
    // 定义一个发布文章的方法
    function publishArticle(fd){
        $.ajax({
            type:'POST',
            url:'/my/article/add',
            data:fd,
            contentType:false,
            processData:false,
            success:res=>{
                if(res.status !==0){
                    return layer.msg('新增文章失败!!')
                }
                layer.msg('新增图书成功!!')
                // 文章发布成功后跳转到文章列表界面
                location.href = '/article/art_list.html'
            }
        })
    }
})
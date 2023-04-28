$(function(){
    initArtCateList()
    let layer = layui.layer
    let form = layui.form
    // 获取文章分类的列表
    function initArtCateList(){
        $.ajax({
            type: "GET",
            url:'/my/article/cates',
            success:res=>{
                // console.log(res)
                let htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
            }
        })
    }
    let indexAdd = null
    // 为添加类别按钮绑定点击事件
    $('#btnAddCate').click(function(){
        indexAdd = layer.open({
        type:1,
        area: ['500px', '250px'],
        title: '添加文章分类'
        ,content: $('#dialog-add').html()
        });
    })
    // 为添加分类绑定提交事件
    $('body').on('submit','#form-add',function(e){
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:res=>{
                console.log(res)
                if(res.status !== 0){
                    return layer.msg('添加失败')
                }
                initArtCateList()
                layer.msg(res.message)
                layer.close(indexAdd)
            }
        })
    })
    let indexEdit = null
    // 给编辑绑定点击事件
    $('tbody').on('click','.btn-edit',function(){
        indexEdit = layer.open({
            type:1,
            area: ['500px', '250px'],
            title: '修改文章分类'
            ,content: $('#dialog-edit').html()
            });

        let id = $(this).attr('data-id')
        $.ajax({
            type:'GET',
            url:'/my/article/cates/'+id,
            success:res=>{
                console.log(res)
                form.val('form-edit',res.data)
            }
        })
    })
    // 更新文章
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault()
        $.ajax({
            type:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:res=>{
                if(res.status !== 0){
                    return layer.msg('更新文章失败!!')
                }
                layer.msg('更新文章成功!!')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 给删除按钮添加点击按钮
    $('tbody').on('click','.btn-delete',function(){
        // console.log(1)
        let id = $(this).attr('data-id')
        // 提示用户是否要确认删除
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                type:'GET',
                url:'/my/article/deletecate/' + id,
                success:res=>{
                    if(res.status !== 0){
                        return layer.msg('删除分类失败!!')
                    }
                    layer.msg('删除分类成功!!!')
                    layer.close(index);
                    initArtCateList()
                }
            })
            
          });

        
    })
})
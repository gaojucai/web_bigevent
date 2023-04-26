$(function(){
    let form = layui.form
    let layer = layui.layer
    form.verify({
        nickname:function(value){
            if(value.length<1&&value.length>6){
                return '昵称长度必须在1~6个字符之间!'
            }
        }
    })

    initUserInfo()

   // 初始化用户的基本信息
   function initUserInfo(){
    $.ajax({
        type:'GET',
        url:'/my/userinfo',
        success:res=>{
            if(res.status !== 0){
                return layer.msg(res.message)
            }
            // console.log(res)
            // 调用form.val()快速为表单赋值
            form.val('formUserInfo',res.data)
        }
    })
   }

//    重置表单
   $('#btnReset').click(function(e){
    // 阻止表单默认行为
    e.preventDefault()
    initUserInfo()
   })

   $('.layui-form').submit(function(e){
    e.preventDefault()
    $.ajax({
        type:'POST',
        url:'/my/userinfo',
        data:$(this).serialize(),
        success:res=>{
            if(res.status !== 0){
                return layer.msg(res.message)
            }
            layer.msg(res.message)
            // 调用父页面中的方法 重新渲染用户的头像和用户的信息
            window.parent.getUserInfo()
        }
    })
   })
})
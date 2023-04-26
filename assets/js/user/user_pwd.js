$(function(){
    let form = layui.form
    let layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ] ,
          samePwd:function(value){
            if(value === $('[name=oldPwd]').val()){
                return '新旧密码不能一致'
            }
          },
          rePwd:function(value){
            if(value !== $('[name=newPwd]').val()){
                return '两次密码输入不一致'
            }
          }
    })


    $('.layui-form').submit(function(e){
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url:'/my/updatepwd',
            data:$('.layui-form').serialize(),
            success:res=>{
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})
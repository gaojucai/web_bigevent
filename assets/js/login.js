$(function(){
    // 点击去注册
    $('#link_reg').click(function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击去登录
    $('#link_login').click(function(){
        $('.login-box').show()
        $('.reg-box').hide()
    })
    let form = layui.form
    let layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
          repwd:function(value){
            let val = $('.reg-box [name=password]').val()
            if(val !== value){
                return '两次密码不一致'
            }
          }
    })
    // 注册按钮
    $('#form_reg').submit(function(e){
        e.preventDefault()
        $.ajax({
            type:'POST',
            url:'/api/reguser',
            data:{
                username:$('#form_reg [name=username]').val(),
                password:$('#form_reg [name=password]').val(),
            },
            success:res=>{
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                $('#link_login').click()
            }
        })
    })
    // 登录按钮
    $('#form_login').submit(function(e){
        e.preventDefault()
        $.ajax({
            url:'/api/login',
            type:'POST',
            data:$(this).serialize(),
            success:res=>{
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                localStorage.setItem('token',res.token)
                location.href = '/index.html'
            }
        })
    })
})
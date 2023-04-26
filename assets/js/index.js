$(function(){
    getUserInfo()
    let layer = layui.layer
    // 添加点击事件
    $('#btnLogout').click(function(){
        layer.confirm('确认退出登录?', {icon: 3, title:'提示'}, function(index){
            localStorage.removeItem('token')
            location.href = './login.html'
            layer.close(index);
        });
    })
})

function getUserInfo(){
    $.ajax({
        type: "GET",
        url:'/my/userinfo',
        // headers:{
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success:res=>{
            // console.log(res)
            if(res.status !== 0){
                return layer.msg(res.message)
            }
            renderAvatar(res.data)
        },
    })
}
function renderAvatar(user){
    let name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp' + name)
    if(user.user_pic !== null){
        // 有头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    }else{
        // 没头像
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}
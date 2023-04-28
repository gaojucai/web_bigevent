$.ajaxPrefilter(function(options){
    options.url = 'http://big-event-api-t.itheima.net' + options.url
    // 统一为有权限的接口 设置headers请求头
    if(options.url.indexOf('/my/') !== -1){
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complete 回调函数 
    // 无论是否执行成功 都会执行这个函数里面的代码
    options.complete = res=>{
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
            localStorage.removeItem('token')
            location.href = './login.html'
        }
    }
    
})
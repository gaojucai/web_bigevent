$(function(){
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(data){
        const dt = new Date(data)

        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1  )
        let d= padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss=  padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 补零函数
    function padZero(n){
        return n>9?n:'0'+n
    }
    // 定义一个查询的参数对象 将来请求数据的时候 需要将请求参数对象提交到服务器
    let p = {
        pagenum:1,  // 页码值 默认请求第一页
        pagesize:'2',  // 每页显示几条数据 默认每页显示2条
        cate_id:'',  // 文章分类的Id
        state:''     // 文章发布状态
    }
    initTable()
    initCate()
    // 获取文章列表请求
    function initTable(){
        // console.log(p);
        $.ajax({
            type:'GET',
            url:'/my/article/list',
            data:p,
            success:res=>{
                // console.log(res)
                if(res.status !== 0){
                    return layer.msg('获取文章列表失败')
                }
                let htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate(){
        $.ajax({
            type:'GET',
            url:'/my/article/cates',
            success:res=>{
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                let htmlStr = template('tpl-cate',res)
                // console.log(htmlStr)
                $('[name="cate_id"]').html(htmlStr)
                // 通过layui重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 筛选分类
    $('#form-search').submit(function(e){
        e.preventDefault()
        // 获取表单中选择项的值
        let cate_id = $('[name="cate_id"]').val()
        // console.log(cate_id)
        let state = $('[name="state"]').val()
        // 为查询参数对象 q 中对应的属性赋值
        p.cate_id = cate_id
        p.state = state
        // 根据最新的筛选条件 重新渲染表格的数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total){
        // 使用laypage.render()方法来渲染分页的结构
        laypage.render({
            elem:'pageBox', // 分页容器的Id
            count:total,    // 总数据条数
            limit:p.pagesize, // 每页显示几条数据
            curr:p.pagenum,    // 设置默认被选中的分页
            layout:['count','limit','prev', 'page','next','skip'],
            limits:[2,3,5,10],
            // 分页发生切换的时候 触发jump回调
            jump:function(obj,first){
                // console.log(first)
                // 把最新的页码值 赋值到q这个查询参数对象中
                p.pagenum = obj.curr
                // 把最新的条目数 赋值到p这个查询参数对象的pagesize属性中
                p.pagesize = obj.limit
                // initTable()
                // 可以通过first 的值 来判断 是通过哪种方式 触发的jump回调
                // 如果first的值为true 证明是方式2触发的
                // 否则就是方式1触发的
                if(!first){
                    initTable()
                }
            }


        })
    }

    $('tbody').on('click','.btn-delete',function(){
        // 获取删除按钮的个数
        let len = $('.btn-delete').length
        // 获取文章id
        let id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                type:'GET',
                url:'/my/article/delete/' +id,
                success:res=>{
                    if(res.status !== 0){
                        return layer.msg('删除文章失败!!')
                    }
                    layer.msg('删除文章成功!!!')
                    // 当数据删除完成后 需要判断当前这一页中 是否还有剩余的数据
                    // 如果没有剩余的数据了 则让页码值-1之后再重新调用initTable
                    if(len === 1){
                        // 如果len 的值等于1 证明删除完毕之后 页面上就没有任何数据了 
                        // 判断页码值是否等于1
                        p.pagenum = p.pagenum === 1 ? 1 : p.pagenum - 1
                    }
                    initTable()
                }
            })
            
            layer.close(index);
          });
    })
})
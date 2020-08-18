// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) { //options是调用ajax时传递过来的配置对象
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // 统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my/') !== -1) { //判断URL中是否有以 /my 开头的请求路径
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }



    // // 不登录不允许访问后台主页
    // // 每次在调用这些有权限的接口时，不论成功还是失败，都会必须执行complete回调函数
    // options.complete = function(res) {
    //     // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
    //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败!') {
    //         // 如果状态为1，且身份认证失败，就
    //         //1、 强制清空token
    //         localStorage.removeItem('token');
    //         //2、强制跳转到登录页面
    //         location.href = '/login.html';
    //     }
    // }
})
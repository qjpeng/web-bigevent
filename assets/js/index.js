$(function() {
    // 调用getUserInfo获取用户信息
    getUserInfo();

    // 获取layer对象
    var layer = layui.layer;
    // 绑定点击事件,实现退出功能
    $('#btnLogout').on('click', function() {
        // 使用layer对象方法，提示用户是否确定退出
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 1、清空本地储存中的token
            localStorage.removeItem('token');
            // 2、重新跳转到登录页面
            location.href = '/login.html';
            // 关闭询问框
            layer.close(index);
        });
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers请求头配置对象
        // headers: { Authorization: localStorage.getItem('token') || '' },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败');
            }
            // 调用renderAvatar  渲染用户头像
            renderAvatar(res.data)
        }
    })
}
// 渲染用户头像
function renderAvatar(user) {
    // 1、获取用户的名称
    var name = user.nickname || user.username;
    // 2、设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3、按需渲染用户的头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide(); // 隐藏文字头像
    } else {
        // 渲染文字头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase(); //获取用户名称的第一个文本字符
        $('.text-avatar').html(first).show()
    }
}
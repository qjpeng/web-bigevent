$(function() {
    // 获取layUI对象方法
    var form = layui.form;
    var layer = layui.layer


    // 表单验证   正则表达式
    form.verify({
        nicknane: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间'
            }
        }
    })

    initUserInfo()
        // 获取用户基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户基本信息失败！')
                }
                console.log(res.data);
                // layui 表单赋值 / 取值
                // 语法：form.val('filter', object);
                form.val("formUserInfo", res.data)
            }
        })
    }

    // 重置表单的数据
    $('#btnReset').on('click', function(e) {
        // 阻止表单的默认重置行为
        e.preventDefault();
        initUserInfo()

    })


    // 更新用户的基本信息
    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        // 组织表单的默认提交行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(), //$(this)指向当前表单  serialize()快速获取表单中所填写的的数据
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户基本信息失败')
                }
                layer.msg('更新用户基本信息成功');
                // 调用父页面index.js中的方法,更新用户信息后重新渲染用户头像和用户信息
                window.parent.getUserInfo()
            }
        })
    })


})
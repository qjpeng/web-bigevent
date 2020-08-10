$(function() {
    // 点击去注册  切换到注册页面
    $("#link_reg").on('click', function() {
            $(".login_box").hide()
            $(".reg_box").show()
        })
        // 点击去登录  切换到登录页面
    $("#link_login").on('click', function() {
        $(".login_box").show()
        $(".reg_box").hide()
    })


    // 从layUI中获取到form对象   只要导入了layUI.all.js就会有layui.form这个对象
    var form = layui.form;
    // 从layUI中获取到layer对象   只要导入了layUI.all.js就会有layui.layer这个对象
    var layer = layui.layer;


    //  通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个名为pwd的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的校验规则
        repwd: function(value) { // 通过形参拿到的是确认密码框的内容
            var pwd = $('.reg_box [name=password]').val();
            // 如果密码框的内容不等于确认密码框的内容
            if (pwd !== value) {
                return '两次密码不一致';
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        // 阻止默认的提交行为
        e.preventDefault()
            // 发起Ajax的POST请求
        data = {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            $.post('/api/reguser', data,
                function(res) {
                    if (res.status !== 0) {
                        // return console.log(res.message); //res.message请求结果的描述消息
                        // 利用layUI的layer.msg方法提示信息
                        return layer.msg(res.message)
                    }
                    layer.msg('注册成功！请登录');
                    // 模拟点击行为   当注册成功后，自动跳转到登录页面
                    $('#link_login').click();
                }
            )
    })


    // 监听登录表单的提交事件
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: ('/api/login'),
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败!');
                }
                layer.msg('登录成功!');
                // 将登录成功的token字符串，保存到localStorage中。有权限的接口都需要使用token才能获取
                localStorage.setItem('token', res.token);
                // 登录成功后跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})
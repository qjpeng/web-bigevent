$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initCate();
    // 初始化富文本编辑器
    initEditor()

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                // 调用模板引擎，渲染分类的下拉表单
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 调用form.render()方法,让layUI监听到动态创建的列表，重新渲染页面
                form.render()
            }
        })
    }


    // 图片封面裁剪
    // 1. 初始化图片裁剪器
    var $image = $('#image')
        // 2. 裁剪选项
    var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
    });

    // 为文件选择框绑定change事件    当选择的文件发生了变化就会调用这个事件处理函数
    $('#coverFile').on('change', function(e) {
        // 获取选择的文件的文件列表
        var files = e.target.files;
        //判断用户是否选择了文件
        if (files.length === 0) {
            return layer.msg('请选择文件！')
        }
        // 1、拿到用户选择的文件
        var files = e.target.files[0]
            // 2、根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files)
            // 3、先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布';
    // 1.为发布按钮绑定点击事件
    $('#btnSave2').on('click', function() {
            art_state = '草稿';
        })
        // 2.为表单绑定submit事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        // 3.基于form表单，快速创建一个FormData对象
        var fd = new FormData($(this)[0]);
        // 将文章的发布状态存到fd中
        fd.append('state', art_state);
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                    // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    });
    // 定义发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                    // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }

})
$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initArtCateList()

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        // 弹出层 
        indexAdd = layer.open({ //只要调用layer.open，就会有一个返回值
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            // 用content属性指定弹出层的内容
            content: $('#dialog-add').html(),
        });
    })

    // 不能通过id名绑定提交事件  因为添加分类弹出框是动态创建到页面中的
    // $('#form-add').on('click', function () {})
    // 通过代理的形式，为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！')
                }
                // 获取文章的分类列表
                initArtCateList();
                layer.msg('新增文章分类成功！');
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd);
            }
        })
    })

    // 通过代理的形式，为编辑分类的表单绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '#btn-edit', function() {
        indexEdit = layer.open({ //只要调用layer.open，就会有一个返回值
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            // 用content属性指定弹出层的内容
            content: $('#dialog-edit').html(),
        });

        // 获取当前点击的编辑按钮id值
        var id = $(this).attr('data-id');
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data)
            }
        })

    })

    // 通过代理的形式，为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(), //快速拿到当前表单中的数据
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败！')
                }
                layer.msg('更新分类信息成功！');
                layer.close(indexEdit);
                initArtCateList()
            }
        })
    })

    // 通过代理的形式，为删除按钮绑定点击事件
    $('body').on('click', '#btn-delete', function() {
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类成功！');
                    layer.close(index);
                    initArtCateList()
                }
            })
        });

    })

})
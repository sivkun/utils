/**
 * 同步模块开发
 * 调用所有依赖时，所有模块必须存在。
 */
~(function (F) {
    /**
     * 定义模块方法
     * @param str 模块路由
     * @param fn 模块方法
     */
    F.define = function (str, fn) {
        //解析模块路由
        var parts = str.split('.'),
            old = parent = this,
            i = len = 0;
        if (parts[0] === 'F') {
            parts = parts.slice(1);
        }
        if (parts[0] === 'define' || parts[0] === 'module') {
            return;
        }

        for (len = parts.length; i < len; i++) {
            if (typeof parent[parts[i]] === 'undifined') {
                parent[parts[i]] = {}
            }
            old = parent;
            parent = parent[parts[i]];
        }

        if (fn) {
            old[parts[--i]] = fn();
        }
        return this;
    }

    F.module = function () {
        var args = [].slice.call(arguments),
            fn = args.pop(),
            parts = args[0] && args[0] instanceof Array ? args[0] : args,
            modules = [],
            modIDs = '',
            i = 0,
            ilen = parts.length,
            parent, j, jlen;
        while (i < ilen) {
            if (typeof parts[i] === 'string') {
                parent = this;
                modIDs = parts[i].replace(/^F\./, '').split('.');
                for (j = 0, jlen = modIDs.length; j < jlen; j++) {
                    parent = parent[modIDs[j]] || false;
                }
                modules.push(parent);
            } else {
                modules.push(parts[i]);
            }
            i++;
        }
        fn.apply(null, modules);
    }
})((function () {
    //定义模块管理器单体对象
    return window.F = {}
})())

//F.string 模块
F.define('string', function () {
    //接口方法
    return {
        trim: function (str) {
            return str.replace(/^\s+|\s+$/g, '');
        }
    }
});
F.string.trim(' 测试  ！  ')

F.define('dom', function () {
    var $ = function (id) {
        $.dom = document.getElementById(id);
        return $;
    };
    $.html = function (html) {
        if (html) {
            this.dom.innerHTML = html;
            return this;
        } else {
            return this.dom.innerHTML;
        }
    }
    return $;
});

F.dom('test').html();

F.define('dom.addClass');
F.dom.addClass = function (type, fn) {
    return function (className) {
        //如果不存在该类
        if (!~this.dom.className.indexOf(className)) {
            this.dom.className += ' ' + className;
        }
    }
}();

F.dom('test').addClass('test')

F.module(['dom', document], function (dom, doc) {
    dom('test').html('  new add!  ')
    doc.body.style.background = 'red';
})

F.module('dom', 'string.trim', function (dom, trim) {
    var html = dom('test').html();
    var str = trim(html);
    console.log('|' + html + '|', '|' + str + '|');
})


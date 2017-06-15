(function () {
    //-->creatCHR: 创建ajax对象兼容所有浏览器
    function createXHR() {
        var xhr = null,
            flag = false;
        ary = [function () {
            return new XMLHttpRequest();
        }, function () {
            return new ActiveXObject('Microsoft.XMLHTTP');
        }, function () {
            return new ActiveXObject('MsXML12.XMLHTTP');
        }, function () {
            return new ActiveXObject('MsXML3.XMLHTTP');
        }];
        for (var i = 0, len = ary.length; i < len; i++) {
            var curFn = ary[i];
            try {
                xhr = curFn(); //执行没有出错:此方法使我们想要的,下次直接执行这个小方法就可以了;
                // 这就需要我们把createXHR重写为消防法
                createXHR = curFn;
                flag = true;
                break;// 成功直接退出循环
            } catch (e) {
                // 报错跳过继续执行下一次;
            }
        }
        if (!flag) {
            throw new Error("your browser is not support ajax, please change your browser, try again");
        }
        return xhr;
    }


//-->实现ajax请求的公用方法;
// //当一个方法传递的参数过多,而且还不固定,我们使用对象统一传值(把需要传递的参数都先放在一个对象中,一起传递进去即可)
    function ajax(options) {
        //把需要使用的参数设定一个规则和初始值
        var _default = {
            url: "", // 请求地址
            type: "get", // 请求方式
            async: true, //请求同步还是一部
            dataType: "json", // 设置请求回来的内容格式, json就是json格式对象; text: 就是字符串
            data: null, //放在请求主题当中
            getHead: null, //当readystate===2 的时候执行的方法(获得请求头)
            success: null // 当raadystate===4的时候执行的回调方法
        };
        //-->使用用户自己传进来的值覆盖默认值
        for(var key in options){
            if(options.hasOwnProperty(key)){
                _default[key] = options[key];
            }
        }
       // console.log(_default);
        //-->如果当前请求似乎是GET, 我们需要在url末尾加随机数清除缓存\
        if (_default.type === "get") {
            _default.url.indexOf("?") >=0 ? _default.url+="&": _default.url+="?";
            _default.url += "_=" + Math.random();
            //  -->"/getList"与"/getList?a=3"： 添加随机数是不一样的
        }

        //-->send AJAX
        //console.log(_default);
        var xhr = createXHR();
        // console.log(xhr);
        xhr.open(_default.type, _default.url, _default.async);
        //console.log(_default);
        //xhr.open('head', "note.txt", true);

        xhr.onreadystatechange = function () {
            if(/^2\d{2}$/.test(xhr.status)) { // jttp状态吗  200请求成功,连接建立 200
                // console.log(xhr.readyState);
                if(xhr.readyState === 2) {
                    //-->想要在ready state等于二的时候做一些操作,需要保证ajax是异步请求
                    if (typeof _default.getHead === "function") {
                        _default.getHead.call(xhr);
                    }
                }

                if(xhr.readyState === 4) {

                    var val = xhr.responseText;
                    // 如果传递的类型是json, 说明要传递json格式对象
                    //console.log( typeof val);
                    if(_default.dataType === "json"){
                        val = JSON.parse(val);
                    }
                    //console.log(1111);
                    _default.success && _default.success.call(xhr, val);
                }


            }
        };
        xhr.send(_default.data);
    }

    window.ajax = ajax;
})();
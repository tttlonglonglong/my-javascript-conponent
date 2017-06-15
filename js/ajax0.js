
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

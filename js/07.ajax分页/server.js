"use strict";
var http = require("http");
var url = require("url");//解析求求连接
var fs = require("fs");

var server1 = http.createServer(function (req, res) {
    //-->解析客户端请求url地址
    var urlobj = url.parse(req.url, true);//url解析成对象
    var pathname = urlobj["pathname"];
    var query =  urlobj["query"];

    //-->静态资源文件的处理:  服务器接收请求后,把文件中的源代码返回给客户端渲染即可
    var reg = /\.(HTML|CSS|JS|ICO)/i;
    if (reg.test(pathname)) {
        var suffix = reg.exec(pathname)[1].toUpperCase();
       // console.log(reg.exec(pathname), suffix);
        var suffixMIME= suffix==="HTML"?"text/html":( suffix==="CSS"?"text/css":"text/javascript");
        //console.log(suffixMIME);
        try{
            res.writeHead(200, {'content-type': suffixMIME + ';charset=utf-8;'});
            res.end(fs.readFileSync("."+ pathname, "utf-8"));
        }catch (e) {
            res.writeHead(404);
            res.end("file is not found");
        }
        return ;

    }

    //-->API接口文档中的数据请求处理
    var data = JSON.parse(fs.readFileSync('./json/data.json'));
   // console.log(JSON.stringify(data));
    //console.log(pathname);
    if(pathname ==="/getList"){
        var n = query["n"];
        console.log(query);

        //->在全部的数据中把n这一页对应的数据获取到
        var ary =[];
        for(var i = (n-1)*10; i<= n*10-1; i++){
            // 通过规律计算索引比所有的索引都要大, 直接跳出即可(说明它已经是最后一页了)
            if(i>data.length - 1){
                break;
            }
            ary.push(data[i]);
        }
        res.writeHead(200, {'content-type': 'application/json'});
        res.end(JSON.stringify({
            code: 0,
            msg: "成功",
            total: Math.ceil(data.length/10), // 每页数据是十条,算出有多少页
            data: ary
        }));
        return;
    }

    if (pathname === "/getInfo") {
        var  studentId = query["id"];
        console.log(query, studentId);
        var  obj = null;
        for (i=0; i<data.length;i++){
            if(data[i]["id"] == studentId) { //data[i]["id"]: i是不变量,"id"是字符串
                obj = data[i];
                console.log(studentId);
            }
        }
        var result = {code: 1, msg: "内容不存在!", data: null};
        if(obj) {
            result = {
                code: 0,
                msg: "成功",
                data: obj
            }
        }
         res.writeHead(200, {'content-type': 'application/json'});
        res.end(JSON.stringify( result ));
        return ;
    }

    // 请求的接口地址不存在, 返回404
   res.writeHead(404);
    res.end("request api url is not defined`");

});
server1.listen(88, function () {
    console.log(" server is success,listening on 88 port");
})
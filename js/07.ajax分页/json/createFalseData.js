// var nameStr = "赵钱孙李周吴郑王冯陈楚卫蒋沈韩杨朱秦尤许何吕施张孔操燕华金魏曹姜";//->0-31
// var nameStr2 = "一二三四五六七八九";//->0-8
// function ran(n, m) {
//     return Math.round(Math.random() * (m - n) + n);
// }
// var ary = [];
// for (var i = 1; i <= 86; i++) {
//     var obj = {};
//     obj["num"] = i < 10 ? "00" + i : "0" + i;
//     obj["name"] = nameStr[ran(0, 31)] + nameStr2[ran(0, 8)];
//     obj["sex"] = ran(0, 1);
//     obj["score"] = ran(59, 99);
//     ary.push(obj);
// }
// console.log(JSON.stringify(ary));

var Str1 = "赵钱孙李周吴郑王冯陈楚卫蒋沈韩杨朱秦尤许何吕施张孔操燕华金魏曹姜";//0-31
var Str2 = "一二三四五六七八九壹贰叁肆伍陆柒捌玖拾";//0--17
function getRandom(n, m) {
    return Math.round(Math.random() * (m - n) + n);
}

var ary = [];
for (var i = 1; i <= 99; i++) {
    var obj = {};
    obj["id"] = i;
    obj["name"] = Str1[getRandom(0, 31)] + Str2[getRandom(0, 17)];
    obj["sex"] = getRandom(0, 1);
    obj["score"] = 99;
    ary.push(obj);
}
console.log(JSON.stringify(ary));
ary2 = [1, 2, 3];
console.log(typeof JSON.stringify(ary2));
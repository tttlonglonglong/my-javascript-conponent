(function () {

    //-->bind: 给当前元素的某一个行为绑定方法(this问题和重复问题)
    function bind(curEle, eventType, eventFn) {
        if("addEventListener" in document){
            curEle.addEventListener(eventType, eventFn, false);

        } else {
            var tempFn = function () {
            //this是window
            eventFn.call(curEle);
            };
            tempFn.photo = eventFn;//给每个事件函数设置一个标识符
            tempFn.type = eventType;
            if(! curEle["myBind"+eventType]){
                curEle["myBind"+eventType] = [];//给每个类型的事件,自定义一个事件池
            }
            var ary =  curEle["myBind"+eventType];
            //--重复问题: 在每一次往自定义属性容器中存储的时候,首先判断之前是否存在了,如果存在说明重复了,就不要忘往自定义属性或者事件池中存储了

            for(var i=0;i<ary.length;i++){
                if(ary[i].photo===eventFn){
                    return;
                }
            }
            ary.push(tempFn);

            curEle.attachEvent("on"+eventType,tempFn);}


    }


    //-->unbind: 移除当前元素绑定的某一个方法
    function unbind(curEle, eventType, eventFn) {
        if("removeAllListeners" in document) {
            curEle.removeEventListener(eventType, eventFn, false);
            return;
        }

        var ary = curEle["myBind"+eventType];
        if(ary && ary instanceof Array){ //事件池存在才做这个事件
            for(var i=0;i<ary.length--;i++){
                var cur = ary[i];
                if(cur.photo === eventFn){ // 事件池已经存在这个事件就删除
                    curEle.detachEvent("on"+eventType, cur);//-->移除事件池中的事件
                    ary.splice(i,1);//---->移除自定义属性中存储的
                    break;
                }
            }
        }
    }

    /*解决回调函数执行顺序的问题*/
    // -->on: 吧当前元素的,某一个行为的所有方法都存到一个自定义容器当其中
    function on(curEle, eventType, eventFn) {
        if(! curEle["myBind"+eventType]){
            curEle["myBind"+eventType] = [];//给每个类型的事件,自定义一个事件池
        }
        var ary =  curEle["myBind"+eventType];
        //--重复问题: 在每一次往自定义属性容器中存储的时候,首先判断之前是否存在了,如果存在说明重复了,就不要忘往自定义属性或者事件池中存储了
        for(var i=0;i<ary.length;i++){
            if(ary[i] == eventFn){
                return;
            }
        }
        ary.push(eventFn);

        //如果想在顶级的实收执行run方法,我们需要把run方法添加在浏览器的内置事件池中
        // -->每当执行一次on方法,都会重新给当前元素绑定run方法,但是这里是使用了上面写的bind方法来实现的(bind解决run重复问题)
        bind(curEle, eventType, run);
    }

    //-->run:使我们唯一给当前元素的某个行为在内置事件池中绑定的方法,当前行为触发,执行run方法,我们在run中分别把存储在自己容器中的方法一次执行
    function run(e) {
        e = e || window.event;
        // 为了后期绑定方法中使用时间对象方便,我们统一的把事件兼容处理掉
        var flag = e.target? true : false;
        if(!flag){
            e.target = e.srcElement;
            e.pageY= (document.documentElement.scrollTop||document.body.scrollTop)+e.clientY;
            e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+ e.clientX;
            e.preventDefault=function(){//阻止默认事件
                e.returnValue=false;
            };
            e.stopPropagation=function(){//阻止冒泡
                e.cancelBubble=true;
            };
        }

        var ary =  this["myBind"+e.type];
        console.log(e.type);
        console.log("ie");
        for(var i=0; i< ary.length-1; i++){
            var tempFn = ary[i];//aru存的是每个事件的事件函数
            if(typeof tempFn === "function"){//清除的事件指向了null

                tempFn.call(this, e);//-->因为在内置事件池中绑定的方法执行的时候,this都是当前的操作的元素,并且浏览器好会给其传递一个事件对象,而我们自己穿件的容器中存储的党阀其实都是相当于要给当前元素绑定事件,为了和内置统一,我们让其执行的时候,this变为当前元素,并且给它传递一个事件对象
            } else{
                //-->当前项是null,我们在把它移除
                ary.splice(i, 1);
                i--;

            }

        }

    }

    //-->在自己定义的容器中,把需要的删除的方法从容器中删除掉
    function off() {
        var ary =  this["myBind"+e. Type];
        if(ary && ary instanceof Array){ //事件池存在才做这个事件
            for(var i=0;i<ary.length--;i++){
                var cur = ary[i];
                if(cur === eventFn){ // 事件池已经存在这个事件就删除
                    //ary.splice(i,1);//---->移除自定义属性中存储的
                    //为了防止塌陷问题,我们在移除的时候不要把元素素组中的每一个方法对应的索引进行改变(数组长度就不能变),所以不能使用splice进行删除
                    ary[i] = null;
                    break;
                }
            }
        }
    }

    window.myEvent = {
        on: on,
        off: off
    }

})();
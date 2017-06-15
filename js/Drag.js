/**
 * Created by 39753 on 2016/10/19.
 */
//面向对象封装的订阅发布：on-绑定事件  fire-发布事件  off-解除事件
function EventEmitter(){} //事件的订阅发布类；
EventEmitter.prototype.on=function(type,fn){//绑定事件：在某个行为上绑定某些方法；
    if(!this['aEmitter'+type]){
        this['aEmitter'+type]=[];
    }
    var a=this['aEmitter'+type];
    for(var i=0; i< a.length; i++){
        if(a[i]==fn) return;
    }
    a.push(fn);
};
EventEmitter.prototype.fire=function(type,e){//事件发布
    var a=this['aEmitter'+type];
    if(a && a.length){
        for(var i=0; i< a.length; i++){
            if(typeof a[i]=='function'){
                a[i].call(this,e)
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }
};
EventEmitter.prototype.off=function(type,fn){
    var a=this['aEmitter'+type];
    if(a && a.length){
        for(var i=0; i< a.length; i++){
            if(a[i]==fn){
                a[i]=null;
                break;
            }
        }
    }
};
//Drag面向对象的封装--》所有的this都指向实例；
function Drag(ele){
    this.ele=ele;
    this.x=null;
    this.y=null;
    this.mx=null;
    this.my=null;
    this.DOWN=processThis(this.down,this);
    this.MOVE=processThis(this.move,this);
    this.UP=processThis(this.up,this);
    on(this.ele,'mousedown',this.DOWN)//on调用的是系统事件；这里主要处理down方法中的this指向实例的问题；
}
Drag.prototype=new EventEmitter;//这样写的缺点：Drag.prototype被污染；
//Drag.prototype.__proto__=EventEmitter.prototype;//缺点：IE下不支持__proto__
Drag.prototype.constructor=Drag;//修改constructor指向；
Drag.prototype.down=function(e){
    this.x=this.ele.offsetLeft;
    this.y=this.ele.offsetTop;
    this.mx= e.clientX;
    this.my= e.clientY;
    if(this.ele.setCapture){
        this.ele.setCapture();
        on(this.ele,'mousemove',this.MOVE);
        on(this.ele,'mouseup',this.UP);
    }else{
        on(document,'mousemove',this.MOVE);
        on(document,'mouseup',this.UP);
        e.preventDefault();//阻止默认事件
    }
    this.fire('selfDown',e);
};
Drag.prototype.move=function(e){
    this.ele.style.left= e.clientX-this.mx+this.x+'px';
    this.ele.style.top= e.clientY-this.my+this.y+'px';
};
Drag.prototype.up=function(){
    if(this.ele.releaseCapture){
        this.ele.releaseCapture();
        off(this.ele,'mousemove',this.MOVE);
        off(this.ele,'mouseup',this.UP);
    }else{
        off(document,'mousemove',this.MOVE);
        off(document,'mouseup',this.UP);
    }
};










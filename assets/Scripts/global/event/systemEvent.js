var notification = require('./../tools/notification')
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    init(){
        var self = this
        cc.game.addPersistRootNode(self.node)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, self.onKeyUp, self);
        cc.game.on(cc.game.EVENT_HIDE,self.gameHide,self);//游戏暂停监听
        cc.game.on(cc.game.EVENT_SHOW,self.gameShow,self);////游戏继续监听
    },

    onDestroy () {
        var self = this
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, self.onKeyUp, self);
    },

    onKeyUp (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                console.log('a键')
                break;
        }
    },

    gameHide () {
        console.log('游戏进入后台')
    },

    gameShow (event) {
        console.log('游戏进入前台')
    },

    listenEvent(name,callBack,target){
        var self = this
        notification.on(name,function(data){
            console.log('[本地]接收到了事件 '+name)
            console.log(data)
            if(callBack){
                callBack.call(target,data)
            }
        },self)
    },

    cancelEvent(name,callBack,target){
        var self = this
        notification.off(name,callBack,target)
    },

    listenEventOnce(name,callBack,target){
        var self = this
        notification.on(name,function(data){
            if(callBack){
                callBack.call(target,data)
            }
            notification.off(name,callBack,self)
        },self)
    },

    emitEvent(name,msg){
        var self = this
        notification.emit(name,msg)
    }
});
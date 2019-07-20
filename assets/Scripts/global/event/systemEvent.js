var notification = require('./../tools/notification')
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    init(){
        var self = this
        cc.game.addPersistRootNode(self.node)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, self.onKeyUp, self);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, self.onKeyDown, self);
        cc.game.on(cc.game.EVENT_HIDE,self.gameHide,self);
        cc.game.on(cc.game.EVENT_SHOW,self.gameShow,self);
        cc.game.on(cc.game.EVENT_GAME_INITED,self.gameInit,self);
        cc.game.on(cc.game.EVENT_RENDERER_INITED, self.gameRenderInit,self);
    },

    onDestroy () {
        var self = this
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, self.onKeyUp, self);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, self.onKeyDown, self);
        cc.game.off(cc.game.EVENT_HIDE,self.gameHide,self);
        cc.game.off(cc.game.EVENT_SHOW,self.gameShow,self);
        cc.game.off(cc.game.EVENT_GAME_INITED,self.gameInit,self);
        cc.game.off(cc.game.EVENT_RENDERER_INITED, self.gameRenderInit,self);
    },

    onKeyUp (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                console.log('a键')
                break;
        }
    },

    onKeyDown (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.back:
                
                break;
        }
    },

    gameRenderInit () {
        console.log('游戏渲染初始化')
    },

    gameInit () {
        console.log('游戏初始化')
    },

    gameHide () {
        console.log('游戏进入后台')
        G.globalSocket.setMsgBlock(true)
        G.audioManager.pauseAll()
        cc.game.pause()
    },

    gameShow () {
        console.log('游戏进入前台')
        G.globalSocket.setMsgBlock(false)
        G.audioManager.resumeAll()
        cc.game.resume()
    },

    listenEvent(name,callBack,target){
        var self = this
        notification.on(name,callBack,target)
    },

    cancelEvent(name,callBack,target){
        var self = this
        notification.off(name,callBack,target)
    },

    listenEventOnce(name,callBack,target){
        var self = this
        var fun = function(data){
            if(callBack){
                callBack.call(target,data)
            }
            notification.off(name,fun,target)
        }
        notification.on(name,fun,target)
    },

    emitEvent(name,msg){
        var self = this
        notification.emit(name,msg)
    }
});
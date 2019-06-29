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
        cc.game.on('game_over', self.gameOver,self);
    },

    onDestroy () {
        var self = this
        cc.game.emit("game_over"); //通知游戏界面游戏结束
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, self.onKeyUp, self);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, self.onKeyDown, self);
        cc.game.off(cc.game.EVENT_HIDE,self.gameHide,self);
        cc.game.off(cc.game.EVENT_SHOW,self.gameShow,self);
        cc.game.off(cc.game.EVENT_GAME_INITED,self.gameInit,self);
        cc.game.off(cc.game.EVENT_RENDERER_INITED, self.gameRenderInit,self);
    },

    gameOver (event) {
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
        if(cc.director.getScene().name != 'HallScene'){
            console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
            var data = {
                account: G.selfUserData.getUserAccount(),
                sign: G.selfUserData.getUserSign()
            }
            G.httpManage.sendRequest(Constants.HTTP_NET_EVENT.GET_GAMEDESTORY,data)
        }
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
        G.audioManager.pauseAll()
    },

    gameShow () {
        console.log('游戏进入前台')
        G.audioManager.resumeAll()
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
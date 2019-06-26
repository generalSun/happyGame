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

    listenEvent(name,callBack){
        var self = this
        self.node.on(name,callBack)
    },

    cancelEvent(name,callBack){
        var self = this
        self.node.off(name,callBack)
    },

    listenEventOnce(name,callBack){
        var self = this
        self.node.once(name,callBack)
    },

    emitEvent(name,msg){
        var self = this
        self.node.emit(name,msg)
    }
});
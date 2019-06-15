cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        cc.game.addPersistRootNode(this.node)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.game.on(cc.game.EVENT_HIDE,this.gameHide,this);//游戏暂停监听
        cc.game.on(cc.game.EVENT_SHOW,this.gameShow,this);////游戏继续监听
    },

    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onKeyUp (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.l:
                
                break;
        }
    },

    gameHide () {
        console.log('游戏进入后台')
    },

    gameShow (event) {
        console.log('游戏进入前台')
    },
});
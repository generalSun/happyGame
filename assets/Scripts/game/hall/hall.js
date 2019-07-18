var Constants = require('./../../config/Constants')
var TAG = 'hall.js'
cc.Class({
    extends: cc.Component,

    properties: {
        creatRoomNode:cc.Node,
        creatRoomView:cc.Node,
        enterRoomNode:cc.Node,
        playerNode:cc.Sprite,
        girlSprite:cc.Sprite,
        creatRoomButton:cc.Button,
        enterRoomButton:cc.Button,
    },

    onLoad () {
        console.log(TAG,'onLoad')
        G.audioManager.playBGM('hall_bg.ogg')
        var self = this
        self.m_socketProcess = self.node.getComponent('hall_socketProcess')
        self.m_createRoomScript = self.creatRoomNode.getComponent('createRoom')
        self.m_createRoomViewScript = self.creatRoomView.getComponent('createRoomView')

        self.m_enterRoomScript = self.enterRoomNode.getComponent('enterRoom')

        self.m_playerScript = self.playerNode.node.getComponent('hall_player')

        G.globalSocket.send(Constants.SOCKET_EVENT_c2s.GAME_STATUS)
    },

    start(){
        var self = this
        self.m_enterRoomScript.init(self.m_socketProcess)
        self.m_createRoomScript.init()
        self.m_createRoomViewScript.init(self)
    },

    getCreateRoom(){
        var self = this
        return self.m_createRoomScript
    },

    getCreateRoomView(){
        var self = this
        return self.m_createRoomViewScript
    },

    getEnterRoom(){
        var self = this
        return self.m_enterRoomScript
    },

    getPlayerInfo(){
        var self = this
        return self.m_playerScript
    },

    showCenter(){
        var self = this
        self.creatRoomButton.node.active = true
        self.enterRoomButton.node.active = true
        self.girlSprite.node.stopAllActions()
        self.girlSprite.node.runAction(cc.moveTo(0.5,cc.v2(-233,-33)))
    },

    hideCenter(){
        var self = this
        self.creatRoomButton.node.active = false
        self.enterRoomButton.node.active = false
        self.girlSprite.node.stopAllActions()
        self.girlSprite.node.runAction(cc.moveTo(0.5,cc.v2(-433,-33)))
    },

    //更换场景
    changeScene(type){
        if(!type)return;
        var gameScene = type+'GameScene'
        G.gameInfo.isLogined = true
        G.gameInfo.isInGame = true
        G.gameInfo.isGamePlay = false
        if(cc.director.getScene().name != gameScene){
            cc.director.loadScene(gameScene)
        }
    },

    onDestroy(){
        var self = this
    }
});

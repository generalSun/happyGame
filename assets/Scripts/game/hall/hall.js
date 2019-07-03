var Constants = require('./../../config/Constants')
var socketProcess = require('./hall_socketProcess')

cc.Class({
    extends: cc.Component,

    properties: {
        head:cc.Sprite,
        nickName:cc.Label,
        gold:cc.Label,
        creatRoomNode:cc.Node,
        enterRoomNode:cc.Node,
    },

    onLoad () {
        G.audioManager.playBGM('hall_bg.ogg')
        var self = this
        self.m_checkHasGame = false
        self.m_socketProcess = new socketProcess()
        self.m_socketProcess.init(self)
        self.creatRoomNode.active = false
        self.enterRoomNode.active = false
        self.nickName.string = G.selfUserData.getUserName()
        self.gold.string = G.selfUserData.getUserCoins()
        var userId = G.selfUserData.getUserId()
        self.m_socketProcess.requestUserBaseInfo(userId)
    },

    onCreateRoomClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        self.creatRoomNode.active = true
        self.creatRoomNode.getComponent('createRoom').init(G.gameListInfo,self.m_socketProcess)
    },

    onJoinRoomClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        self.enterRoomNode.active = true
        self.enterRoomNode.getComponent('enterRoom').init(self.m_socketProcess)
    },

    //更换场景
    changeScene(){
        var info = G.selfUserData.getUserRoomInfo()
        if(!info)return;
        var type = info.conf.type
        var gameScene = type+'GameScene'
        G.gameInfo.isLogined = true
        G.gameInfo.isInGame = true
        G.gameInfo.isGamePlay = false
        if(cc.director.getScene().name != gameScene){
            cc.director.loadScene(gameScene)
        }
    },

    update(dt){
        var self = this
        var roomID = G.selfUserData.getUserRoomID()
        if(roomID && !self.m_checkHasGame){
            self.m_socketProcess.requestEnterRoom(roomID);
            self.m_checkHasGame = true
        }else{
            self.m_checkHasGame = true
        }
    },

    setButtonCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        var setNode = self.node.getChildByName('setNode')
        if(setNode){
            setNode.active = true;
            return;
        }
        console.log('thert is not the node set')
        cc.loader.loadRes('prefabs/setNode', cc.Prefab, function(err, prefab) {
            if (err) {
                cc.log(err.message || err);
                return;
            }
            var node = cc.instantiate(prefab);
            node.active = true;
            self.node.addChild(node);
        });
    },

    showPlayerInfo(event,customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        var scene = cc.find('Canvas')
        var playerInfoNode = scene.getChildByName('playerInfoNode')
        if(playerInfoNode){
            playerInfoNode.active = true;
            var playerInfoScript = playerInfoNode.getComponent('playerInfo')
            var data = {
                name:G.selfUserData.getUserName(),
                userId:G.selfUserData.getUserId(),
                gold:G.selfUserData.getUserCoins(),
            }
            playerInfoScript.show(data)
            return;
        }
        console.log('thert is not the node set')
        cc.loader.loadRes('prefabs/playerInfoNode', cc.Prefab, function(err, prefab) {
            if (err) {
                cc.log(err.message || err);
                return;
            }
            var node = cc.instantiate(prefab);
            node.active = true;
            scene.addChild(node);
            var playerInfoScript = node.getComponent('playerInfo')
            var data = {
                name:G.selfUserData.getUserName(),
                userId:G.selfUserData.getUserId(),
                gold:G.selfUserData.getUserCoins(),
            }
            playerInfoScript.show(data)
        });
    },

    onDestroy(){
        var self = this
        self.m_socketProcess.onDestroy()
    }
});

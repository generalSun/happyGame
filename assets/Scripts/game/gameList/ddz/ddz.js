var config = require('./config')
var handCard = require('./handCard')
var disCard = require('./disCard')

cc.Class({
    extends: cc.Component,

    properties: {
        parentNode:cc.Sprite,
        buttonNode:cc.Node,
        desktopInfo:cc.Node,
        playerPrefab: cc.Prefab,
        ruleInfo:cc.Node,
        morePrefab:cc.Prefab,
        pokerAtlas:[cc.SpriteAtlas]
    },

    onLoad () {
        var self = this
        self.m_deskScript = self.desktopInfo.getComponent('desktopInfo');
        self.m_ruleScript = self.ruleInfo.getComponent('ruleInfo');
        self.m_player = new Array();
        self.m_meChairID = config.INVALID_CHAIR;
        self.loadPrefab();
        self.initZorder()
    },

    initZorder(){
        var self = this
        self.buttonNode.zIndex = config.sceneZOrder.buttonNode
        self.m_moreNode.zIndex = config.sceneZOrder.moreNode
    },

    loadPrefab () {
        var self = this
        self.m_meChairID = 1
        for(var i = 0; i < config.maxPlayerNum; i++){
            var localtionID = self.convertServerIDtoLocalID(i)
            var pos = config.playerPos[localtionID]
            var player = cc.instantiate(self.playerPrefab);
            player.setPosition(pos.x,pos.y)
            var playerScript = player.getComponent('player')
            self.m_player.push(playerScript)
            self.parentNode.node.addChild(player);

            playerScript.setChair(localtionID)
            playerScript.seatDown({
                config:config
            })
            playerScript.setHandCardNode(true,new handCard(),self.pokerAtlas)
            playerScript.setDisCardNode(true,new disCard(),self.pokerAtlas)
        }

        self.m_moreNode = cc.instantiate(self.morePrefab);
        self.m_moreNode.pointScene = self
        self.parentNode.node.addChild(self.m_moreNode);
    },

    dealPoker(){
        var self = this
        var pokerInfo = {
            [0]:{
                pokers:[1,2,3,4,5,6,7,8,9,10,11,12,13,1,2,3,4,1,2,3,4]
            },
            [1]:{
                pokers:[1,2,3,4,5,6,7,13,1,2,3,4,1,2,3,4]
            },
            [2]:{
                pokers:[1,2,11,12,13,1,2,3,4,1,2,3,4]
            },
            [3]:{
                pokers:[1,2,3,4,13,1,2,3,4,1,2,3,4]
            },
        }
        for(var i = 0; i < self.m_player.length; i++){
            var player = self.m_player[i]
            var hand = player.getHandCardNode()
            var chair = player.getChair()
            var pokers = pokerInfo[chair].pokers
            hand.clear()
            hand.addCard(pokers,true)
        }
    },

    //服务器id转换为本地椅子号
    convertServerIDtoLocalID(wChairId){
        if(wChairId >= config.maxPlayerNum){
            return config.INVALID_CHAIR;
        }
        var self = this
        var localtionID = wChairId;
        if(self.m_meChairID != config.INVALID_CHAIR){
            var wViewChairID = wChairId + config.maxPlayerNum - self.m_meChairID
            localtionID = wViewChairID % config.maxPlayerNum
        }
        if(config.maxPlayerNum == 3){
            if(localtionID == 2){
                localtionID = 3
            }
        }
        return localtionID
    },
    
    getPlayerByLocalChair(localChair){
        var self = this
        for(var key in self.m_player){
            var chair = self.m_player[key].getChair()
            if(chair == localChair){
                return self.m_player[key]
            }
        }
    },

    onChatClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        self.dealPoker()
    },

    onVoiceClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
    },

    onPositionClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
    },

    onMoreClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        if(self.m_moreNode.active)return;
        self.m_moreNode.active = true
    },
});

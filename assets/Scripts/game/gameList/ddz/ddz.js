var config = require('./config')
var handCard = require('./handCard')
var disCard = require('./disCard')

cc.Class({
    extends: cc.Component,

    properties: {
        desktopInfo:cc.Node,
        playerPrefab: cc.Prefab,
        ruleInfo:cc.Node,
        morePrefab:cc.Prefab,
        pokerAtlas:[cc.SpriteAtlas]
    },

    onLoad () {
        var self = this
        self.deskScript = self.desktopInfo.getComponent('desktopInfo');
        self.ruleScript = self.ruleInfo.getComponent('ruleInfo');
        self.m_player = new Array();
        self.m_meChairID = config.INVALID_CHAIR;
        self.loadPrefab();
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
            self.node.addChild(player);

            playerScript.setChair(localtionID)
            playerScript.seatDown({
                config:config
            })
            playerScript.setHandCardNode(true,new handCard(),self.pokerAtlas)
            playerScript.setDisCardNode(true,new disCard(),self.pokerAtlas)
        }

        self.m_moreNode = cc.instantiate(self.morePrefab);
        self.m_moreNode.pointScene = self
        self.node.addChild(self.m_moreNode);
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

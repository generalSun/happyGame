var TAG = 'hall_event.js'
cc.Class({
    extends: cc.Component,

    properties: {
        setNodePerfab:cc.Prefab,
        playerInfoNodePerfab:cc.Prefab
    },

    onLoad () {
        console.log(TAG,'onLoad')
        var self = this
        self.m_handler = self.node.getComponent('hall')
    },

    onCreateRoomClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        self.m_handler.getCreateRoom().show()
        self.m_handler.hideCenter()
    },

    onJoinRoomClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        self.m_handler.getEnterRoom().show()
    },

    setButtonCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        var setNode = self.node.getChildByName('setNode')
        if(!setNode){
            setNode = cc.instantiate(self.setNodePerfab);
            self.node.addChild(setNode);
        }
        setNode.active = true;
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
        if(!playerInfoNode){
            playerInfoNode = cc.instantiate(self.playerInfoNodePerfab);
            scene.addChild(playerInfoNode);
        }
        playerInfoNode.active = true;
        var playerInfoScript = playerInfoNode.getComponent('playerInfo')
        var data = {
            name:G.selfUserData.getUserName(),
            userId:G.selfUserData.getUserId(),
            gold:G.selfUserData.getUserCoins(),
            diamond:G.selfUserData.getUserDiamond(),
            roomCard:G.selfUserData.getUserGems(),
        }
        playerInfoScript.show(data)
    },

    closeEnterRoomButtonCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        self.m_handler.getEnterRoom().hide()
    },

    backCallBack(event,customEventData){
        var self = this
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        self.m_handler.getCreateRoom().hide()
        self.m_handler.showCenter()
    },
});

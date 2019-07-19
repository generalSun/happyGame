var Constants = require('./../config/Constants')
var TAG = 'playerEvent.js'
cc.Class({
    extends: cc.Component,

    properties: {
        operateLayer:[cc.Node],
        playerInfoNode:cc.Prefab
    },

    onLoad () {
        var self = this
        self.m_chair = 0
        self.m_config = null
        self.m_playerScript = self.node.getComponent('player')

        var showOperateByInfo = function(args){
            var self = this
            for(var i = 0; i < args.length; i++){
                var info = args[i]
                var operate = self.getChildByName(info.name)
                if(operate){
                    operate.active = info.visible
                }
            }
        }
    
        var refreshOperate = function(){
            var self = this
            var children = self.children
            var visibleOperate = new Array()
            var space = 30
            var totalWidth = -1*space
            for(var i = 0; i < children.length; i++){
                var operate = children[i]
                if(cc.isValid(operate) && operate.active){
                    visibleOperate.push(operate)
                    totalWidth = totalWidth + operate.width + space
                }
            }
            var proW = 0
            for(var i = 0; i < visibleOperate.length; i++){
                var operate = visibleOperate[i]
                if(cc.isValid(operate)){
                    operate.x = -1*totalWidth/2 + proW + operate.width/2 + i*space
                    proW = proW + operate.width
                }
            }
        }

        for(var i = 0; i < self.operateLayer.length; i++){
            var operateNode = self.operateLayer[i]
            if(cc.isValid(operateNode)){
                operateNode.showOperateByInfo = showOperateByInfo.bind(operateNode)
                operateNode.refreshOperate = refreshOperate.bind(operateNode)
            }
        }

        // self.m_operate01 = self.operateLayer[0]//出牌 outCardButton tipButton ybqButton buchuButton
        // self.m_operate02 = self.operateLayer[1]//不叫地主 bjButton bqButton jdzButton qdzButton
        // self.m_operate03 = self.operateLayer[2]//1分 oneButton twoButton threeButton
        // self.m_operate04 = self.operateLayer[3]//准备 readyButton
    },

    showOperateByIndex(index,info){
        index = index || 0
        var self = this
        for(var i = 0; i < self.operateLayer.length; i++){
            var operateNode = self.operateLayer[i]
            operateNode.active = i == index
            if(i == index){
                operateNode.showOperateByInfo(info)
                operateNode.refreshOperate()
            }
        }
    },

    setChair (chair) {
        var self = this
        self.m_chair = chair
    },

    getChair () {
        var self = this
        return self.m_chair
    },

    setConfig (config) {
        var self = this
        self.m_config = config
    },

    isSelf(){
        var self = this
        if(self.m_chair == self.m_config.chair.home){
            return true
        }
        return false
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
            playerInfoNode = cc.instantiate(self.playerInfoNode);
            scene.addChild(playerInfoNode);
        }
        var playerInfoScript = playerInfoNode.getComponent('playerInfo')
        var data = {
            name:self.m_playerScript.getNickName(),
            userId:self.m_playerScript.getUserId(),
            gold:self.m_playerScript.getGold(),
            diamond:self.m_playerScript.getDiamonds(),
            roomCard:self.m_playerScript.getRoomCards(),
        }
        playerInfoScript.show(data)
    },

    outCardButtonCallBack(event,customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        if(self.isSelf()){
            var cards = self.m_playerScript.getHandCardNode().getTouchNode().getSelectedServerCards()
            console.log(TAG,'outCardButtonCallBack',cards)
            G.globalSocket.sendMsg(Constants.SOCKET_EVENT_c2s.DOPLAY_CARDS,cards.join())
        }
    },

    tipButtonCallBack(event,customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
    },

    ybqButtonCallBack(event,customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        G.globalSocket.sendMsg(Constants.SOCKET_EVENT_c2s.NO_CARDS,"nocards")
    },

    buchuButtonCallBack(event,customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        G.globalSocket.sendMsg(Constants.SOCKET_EVENT_c2s.NO_CARDS,"nocards")
    },

    bjButtonCallBack(event,customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        G.globalSocket.sendMsg(Constants.SOCKET_EVENT_c2s.GIVE_UP,'giveup')
    },

    bqButtonCallBack(event,customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        G.globalSocket.sendMsg(Constants.SOCKET_EVENT_c2s.GIVE_UP,'giveup')
    },

    jdzButtonCallBack(event,customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        G.globalSocket.sendMsg(Constants.SOCKET_EVENT_c2s.DO_CATCH,'docatch')
    },

    qdzButtonCallBack(event,customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        G.globalSocket.sendMsg(Constants.SOCKET_EVENT_c2s.DO_CATCH,'docatch')
    },

    oneButtonCallBack(event,customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
    },

    twoButtonCallBack(event,customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
    },

    threeButtonCallBack(event,customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
    },

    onDestroy(){
        var self = this
        
    }
})
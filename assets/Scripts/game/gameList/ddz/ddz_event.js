var TAG = 'ddz_event.js'
var config = require('./config')
var Constants = require('./../../../config/Constants')
cc.Class({
    extends: cc.Component,

    properties: {
        morePrefab:cc.Prefab,
        invitePrefab:cc.Prefab,
        buttonNode:cc.Node,
    },

    onLoad () {
        console.log(TAG,'onLoad')
        var self = this
        self.m_bg = cc.find('Canvas/bg')
        self.m_handler = self.node.getComponent('ddz')
        self.buttonNode.zIndex = config.sceneZOrder.buttonNode
        self.setStartButtonVisible(false)
        self.setReadyButtonVisible(false)
        self.setOpendealButtonVisible(false)
        self.setInviteButtonVisible(true)
    },

    setReadyButtonVisible(visible){
        var self = this
        visible = visible || false
        var readyButton = cc.find('readyButton',self.buttonNode)
        if(readyButton){
            readyButton.active = visible
        }
    },

    setOpendealButtonVisible(visible){
        var self = this
        visible = visible || false
        var opendealButton = cc.find('opendealButton',self.buttonNode)
        if(opendealButton){
            opendealButton.active = visible
        }
    },

    setStartButtonVisible(visible,flag){
        var self = this
        visible = visible || false
        flag = flag || false
        var startButton = cc.find('startButton',self.buttonNode)
        if(startButton){
            startButton.active = visible
            if(visible){
                var continueSprite = cc.find('Background/continue',startButton)
                var startSprite = cc.find('Background/describle',startButton)
                continueSprite.active = flag
                startSprite.active = !flag
            }
        }
    },

    setInviteButtonVisible(visible){
        var self = this
        visible = visible || false
        var inviteButton = cc.find('inviteButton',self.buttonNode)
        if(inviteButton){
            inviteButton.active = visible
        }
    },

    getInviteButtonVisible(){
        var self = this
        var inviteButton = cc.find('inviteButton',self.buttonNode)
        if(inviteButton){
            return inviteButton.active
        }
        return false
    },

    onChatClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        self.m_handler.dealPoker()
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
        var moreNode = self.m_bg.getChildByName('moreNode')
        if(!moreNode){
            moreNode = cc.instantiate(self.morePrefab);
            moreNode.pointScene = self
            self.m_bg.addChild(moreNode);
            moreNode.zIndex = config.sceneZOrder.moreNode
        }
        moreNode.active = true
    },

    onInviteClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        var wxInviteNode = self.m_bg.getChildByName('wxInviteNode')
        if(!wxInviteNode){
            wxInviteNode = cc.instantiate(self.invitePrefab);
            self.m_bg.addChild(wxInviteNode);
            wxInviteNode.zIndex = config.sceneZOrder.wxInviteNode
        }
        wxInviteNode.active = true
    },

    onStartClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        var msg = 'false'
        if(customEventData == 1){
            msg = 'true'
        }
        G.globalSocket.sendMsg(Constants.SOCKET_EVENT_c2s.START_GAME,msg)
    },

    readyButtonCallBack(event,customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
    },
});

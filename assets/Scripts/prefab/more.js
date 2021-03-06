var Constants = require('./../config/Constants')
cc.Class({
    extends: cc.Component,

    properties: {
        setNodePrefab:cc.Prefab
    },

    onLoad () {
        var self = this
        self.node.active = false
        self.pointScene = self.node.pointScene || self;
        self.node.on('touchend',self.hide,self)
    },

    hide(){
        var self = this
        if(self.node.active){
            self.node.active = false
        }
    },

    onDissolveClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        if(G.gameInfo.isGamePlay){
            G.msgBoxMgr.showMsgBox({
                content:'游戏已经开始，是否确认解散房间？',
                sureClickEventCallBack:function(){
                    G.globalSocket.send(Constants.SOCKET_EVENT_c2s.DISSOLVE_REQUEST)
                }
            })
        }
    },

    onListClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        
    },

    onSetClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        self.node.active = false
        var setNode = self.pointScene.node.getChildByName('setNode')
        if(!setNode){
            setNode = cc.instantiate(self.setNodePrefab);
            setNode.pointScene = self
            self.pointScene.node.addChild(setNode);
        }
        setNode.active = true;
    },

    onBackClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        if(G.gameInfo.isGamePlay){
            G.msgBoxMgr.showMsgBox({content:'游戏已经开始了，无法退出'})
        }else{
            G.globalSocket.send(Constants.SOCKET_EVENT_c2s.EXIT_GAME)
        }
        G.globalSocket.send(Constants.SOCKET_EVENT_c2s.EXIT_GAME)
    },

    onDestroy(){
        var self = this
        self.node.off('touchend',self.hide,self)
    }
})
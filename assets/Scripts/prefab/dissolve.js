var Constants = require('./../config/Constants')
cc.Class({
    extends: cc.Component,

    properties: {
        agreeButton:cc.Button,
        rejectButton:cc.Button,
        dissolveItemNode:cc.Prefab,
        stateNode:cc.Node,
        ramaingTime:cc.Sprite,
        title:cc.Label
    },

    onLoad () {
        var self = this
        self.node.zIndex = 999
    },

    show(info){
        var self = this
        self.hide()
        self.node.active = true
        var time = info.time
        var originator = info.originator
        var playerInfo = info.playerInfo
        var hasChose = info.hasChose
        if(hasChose){
            self.agreeButton.node.active = false
            self.rejectButton.node.active = false
        }
        self.title.string = originator + '发起了解散请求'
        var startPos = cc.v2(-370,100)
        for(var i = 0; i < playerInfo.lengeh; i++){
            var state = playerInfo[i].state
            var name = playerInfo[i].name
            var item = cc.instantiate(self.dissolveItemNode)
            self.stateNode.addChild(item)
            item.x = startPos.x
            item.y = startPos.y - i*40
            item.getComponent('dissolveItem').init(name,state)
        }
        var describle = self.ramaingTime.node.getChildByName('describle')
        if(!describle)return;
        var label = describle.getComponent(cc.Label)
        if(label){
            label.string = time
        }
        self.ramaingTime.scheduleId = setInterval(function(){
            if(cc.isValid(label)){
                label.string = label.string - 1
                if(label.string <= 3){
                    self.ramaingTime.node.runAction(cc.blink(1,3))
                }
                if(label.string <= 0){
                    clearInterval(self.clock.scheduleId);
                    self.clock.scheduleId = null
                    self.clock.node.active = false
                }
            }
        }, 1000)
    },

    hide(){
        var self = this
        self.node.active = false
        if(self.ramaingTime.scheduleId){
            clearInterval(self.ramaingTime.scheduleId);
            self.ramaingTime.scheduleId = null
        }
        self.stateNode.removeAllChildren()
    },

    agreeDissolve(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        G.globalSocket.send(Constants.SOCKET_EVENT_c2s.DISSOLVE_AGREE)
    },

    rejectDissolve(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        G.globalSocket.send(Constants.SOCKET_EVENT_c2s.DISSOLVE_REJECT)
    },
});

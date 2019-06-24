var Constants = require('./../config/Constants')
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        var self = this
        
    },

    closeButtonCallBack(event,customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        if(!self.node.active)return;
        self.node.active = false
    },

    onDestroy(){
        var self = this
        
    }
})
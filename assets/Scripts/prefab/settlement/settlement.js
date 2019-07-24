var TAG = 'settlement.js'
cc.Class({
    extends: cc.Component,

    properties: {
        smallNode:cc.Node,
        totalNode:cc.Node,
    },

    init (pokerAtlas,pokerPrefab,logic) {
        console.log(TAG,'init')
        var self = this
        self.m_smallScript = self.smallNode.getComponent('smallNode')
        self.m_smallScript.init(pokerAtlas,pokerPrefab,logic)
        self.m_totalScript = self.totalNode.getComponent('totalNode')
        self.m_totalScript.init()
        self.m_finished = false
        self.m_gameRoomOver = false
        self.m_settlementInfo = null
        self.hide()
    },

    show(finished,gameRoomOver){
        var self = this
        self.hide()
        if(!self.node.active){
            self.node.active = true
        }
        self.m_finished = finished
        self.m_gameRoomOver = gameRoomOver
    },

    showSmall(info){
        var self = this
        self.m_smallScript.hide()
        self.m_smallScript.show(info)
        self.m_settlementInfo = info
    },

    showTotal(info){
        var self = this
        if(!info || info.length <= 0){
            info = self.m_settlementInfo
        }
        self.m_totalScript.hide()
        self.m_totalScript.show(info)
    },

    hide(){
        var self = this
        if(self.node.active){
            self.node.active = false
        }
        self.hideSmall()
        self.hideTotal()
    },

    hideSmall(){
        var self = this
        self.m_smallScript.hide()
    },

    hideTotal(){
        var self = this
        self.m_totalScript.hide()
    },

    onBackClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        if(self.m_gameRoomOver){
            self.showTotal()
        }else{
            self.hide()
        }
    },

    onShareClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        
    },

    onCloseClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        self.hide()
    },

    onContinueClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        self.hide()
    },
});

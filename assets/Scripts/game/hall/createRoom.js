cc.Class({
    extends: cc.Component,

    properties: {
        gameScrollView:cc.ScrollView,
        descPageView:cc.PageView,
    },

    onLoad () {
        var self = this
        self.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.node.active = false
        }, self)
    },

    init(info){//name,describle,state(0开放、1维护),rule
        var self = this
        self.gameScrollView.getComponent('createRoomScrollView').init(info,self.notifyPageTurn.bind(self))
        self.descPageView.getComponent('createRoomPageView').init(info)
    },

    notifyPageTurn(index){
        var self = this
        self.descPageView.scrollToPage(index,0)
    },

    closeCallBack(event,customEventData){
        var self = this
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        self.node.active = false
    }
});

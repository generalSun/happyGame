cc.Class({
    extends: cc.Component,

    properties: {
        describle:cc.Label,
        selectedSprite:cc.Sprite
    },

    onLoad () {
        var self = this
        self.m_index = null
        self.m_notifyCallBack = null
        self.selectedSprite.node.active = false
    },

    init(info,index,callBack){
        var self = this
        self.m_index = index
        self.describle.string = info.name
        self.m_notifyCallBack = callBack
    },

    updateItem(selected){
        selected = selected || false
        var self = this
        self.selectedSprite.node.active = selected
    },

    clickButtonCallBack(event,customEventData){
        var self = this
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        if(self.m_notifyCallBack){
            self.m_notifyCallBack(self.m_index)
        }
    }
});

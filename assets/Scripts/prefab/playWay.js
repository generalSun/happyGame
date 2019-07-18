var TAG = 'playWay.js'
var Constants = require('./../config/Constants')
cc.Class({
    extends: cc.Component,

    properties: {
        title:cc.Sprite,
        onlineUsersNum:cc.Label,
        playWayFrame:[cc.SpriteFrame]
    },

    init (info) {
        console.log(TAG,'init',info)
        if(!info)return
        var self = this
        var m_playWayFrame = {
            dizhu:2,
            majiang:1
        }
        self.m_info = info
        self.m_playWayFrame = self.playWayFrame[m_playWayFrame[info.code]]
        self.title.node.getComponent(cc.Sprite).spriteFrame = self.m_playWayFrame
        self.onlineUsersNum.string = '在线人数:' + info.onlineusers
    },

    playWayCallBack(event,customEventData){
        var self = this
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        var info = {
            playWayInfo:self.m_info,
            spriteFrame:self.m_playWayFrame
        }
        G.eventManager.emitEvent(Constants.LOCALEVENT.SHOW_CREATE_ROOM_VIEW,info)
    },
});

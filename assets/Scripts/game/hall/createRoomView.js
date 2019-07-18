var TAG = 'createRoomView.js'
var Constants = require('./../../config/Constants')
cc.Class({
    extends: cc.Component,

    properties: {
        nameSprite:cc.Sprite,
        activeNode:cc.Node,
        createRoomButton:cc.Button,
        playWayScroll:cc.ScrollView,
        isAutoMatching:cc.Toggle
    },

    init (handler) {
        console.log(TAG,'init')
        var self = this
        self.m_handler = handler
        self.m_playWayScrollViewScript = self.playWayScroll.getComponent('playWayScrollView')
        self.m_playWayScrollViewScript.init()
        G.eventManager.listenEvent(Constants.LOCALEVENT.SHOW_CREATE_ROOM_VIEW,self.show,self)
        self.hide()
    },

    show(info){
        console.log(TAG,'show',info)
        var self = this
        self.node.active = true
        if(!info)return
        self.m_createRoomInfo = {}

        var name = cc.find('gameSprite/name',self.nameSprite.node)
        var briefIntroduction = cc.find('briefIntroduction',self.nameSprite.node)
        var describle = cc.find('briefIntroduction/describle',self.nameSprite.node)
        if(!name || !briefIntroduction || !describle){
            return
        }
        name.getComponent(cc.Sprite).spriteFrame = info.spriteFrame
        var playWayInfo = info.playWayInfo
        describle.getComponent(cc.Label).string = playWayInfo.memo
        describle.getComponent(cc.Label)._updateRenderData(true)//由于高度不能及时更新，需要调用此方法
        briefIntroduction.y = (describle.height + briefIntroduction.height/2 + 30) - self.nameSprite.node.height/2
        if(playWayInfo.free){
            self.activeNode.active = true
            self.createRoomButton.node.active = false
        }else{
            self.activeNode.active = false
            self.createRoomButton.node.active = true
        }
        var groups = playWayInfo.groups
        var items = playWayInfo.items
        self.m_playWayScrollViewScript.show(groups,items)
        self.m_createRoomInfo.gametype = playWayInfo.code
        self.m_createRoomInfo.playway = playWayInfo.id
        var hallInfo = G.selfUserData.getUserHallInfo()
        self.m_createRoomInfo.gamemodel = hallInfo.gametype
    },

    collectInfo(){
        var self = this
        var infos = self.m_playWayScrollViewScript.collectInfo()
        for(var i = 0; i < infos.length; i++){
            var info = infos[i]
            var code = info.code
            var value = info.value
            self.m_createRoomInfo[code] = value
        }
    },

    getCreateRoomInfo(){
        var self = this
        return self.m_createRoomInfo
    },

    setCreateRoomInfo(info){
        var self = this
        self.m_createRoomInfo = info
    },

    createRoomButtonCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        self.collectInfo()
        if(!self.m_createRoomInfo)return
        var gametype = self.m_createRoomInfo.gametype
        var type = null
        if(gametype == 'dizhu'){
            type = 'ddz'
        }
        self.m_createRoomInfo.automatch = self.isAutoMatching.isChecked
        G.selfUserData.setUserRoomInfo(self.m_createRoomInfo)
        self.m_handler.changeScene(type)
    },

    hide(){
        var self = this
        self.node.active = false
        self.m_playWayScrollViewScript.hide()
    },

    closeButtonCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        self.hide()
    },

    onDestroy(){
        var self = this
        G.eventManager.cancelEvent(Constants.LOCALEVENT.SHOW_CREATE_ROOM_VIEW,self.show,self)
    }
});

var TAG = 'createRoom.js'
cc.Class({
    extends: cc.Component,

    properties: {
        gameScrollView:cc.ScrollView,
        playway:cc.Prefab
    },

    init(){
        console.log(TAG,'init')
        var self = this
        self.m_scrollViewScript = self.gameScrollView.getComponent('createRoomScrollView')
        self.m_scrollViewScript.init()
        self.hide()
    },

    show(){
        var self = this
        self.node.active = true
        self.node.x = cc.winSize.width/2
        self.node.runAction(cc.moveTo(0.5,cc.v2(180,0)))
        self.m_scrollViewScript.show()
    },

    hide(){
        var self = this
        self.node.active = false
        self.node.x = cc.winSize.width/2
        self.node.stopAllActions()
        self.m_scrollViewScript.hide()
    },

    onDestroy(){
        var self = this
    }
});

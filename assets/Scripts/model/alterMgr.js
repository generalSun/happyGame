cc.Class({
    extends: cc.Component,

    properties: {
        m_describle: cc.Label,
        m_bgSprite:cc.Sprite
    },

    init(){
        var self = this;
        cc.game.addPersistRootNode(self.node)
        self.node.on(cc.Node.EventType.TOUCH_START, function (event) {}, self);
        self.node.active = false;
    },

    //显示提示框
    /*
        @content: {String}显示的内容
    */
    showMsgBox (param) {
        var self = this;
        self.close()
        var content = param.content || "";
        self.m_describle.string = content;
        var width = self.m_describle.width
        self.m_bgSprite.width = width*3/2
        self.node.active = true;
        self.node.opacity = 255
        self.node.runAction(cc.fadeOut(3))
    },

    close(){
        var self = this
        self.node.stopAllActions()
    },

    onDestroy(){
        var self = this
        self.close()
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa   常驻节点alterMgr has destory')
    }
});

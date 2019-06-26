cc.Class({
    extends: cc.Component,

    properties: {
        animLoadingPrefab: cc.Prefab,
        bg:cc.Node,
        describle:cc.Label
    },

    onLoad () {
        var self = this;
        cc.game.addPersistRootNode(self.node)
        self.initAnimLoading();
        self.initTouchEvent();
        self.node.active = false;
    },

    initTouchEvent () {
        var self = this;
        self.node.on(cc.Node.EventType.TOUCH_START, function (event) {}, self);
    },

    initAnimLoading () {
        var self = this
        self.m_animLoading = cc.instantiate(self.animLoadingPrefab);
        self.bg.addChild(self.m_animLoading);
        self.m_animLoading.setPosition(0, 0);
    },

    setLoadingVisible (visible,desc) {
        var self = this;
        visible = visible || false;
        self.node.active = visible;
        self.describle.node.active = false
        if (visible) {
            self.m_animLoading.getComponent('animationOperate').playAnim();
            if(desc){
                self.describle.node.active = true
                self.describle.string = desc
            }
        } else {
            self.m_animLoading.getComponent('animationOperate').stopAnim();
        }
    },
});

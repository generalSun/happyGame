cc.Class({
    extends: cc.Component,

    properties: {
        gameScrollView:cc.ScrollView,
        descPageView:cc.PageView,
    },

    onLoad () {
        var self = this
        self.m_gameList = self.gameScrollView.content
        self.m_gameDescList = self.descPageView.content
    },
});

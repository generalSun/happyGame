var TAG = 'hall_player.js'
cc.Class({
    extends: cc.Component,

    properties: {
        gold:cc.Label,
        nickName:cc.Label
    },

    onLoad () {
        console.log(TAG,'onLoad')
        var self = this
        self.gold.string = G.selfUserData.getUserCoins()
        self.nickName.string = G.tools.interceptName(G.selfUserData.getUserName())
    },
});

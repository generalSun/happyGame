cc.Class({
    extends: cc.Component,

    properties: {
        agreeButton:cc.Button,
        rejectButton:cc.Button,
        dissolveItemNode:cc.Prefab,
        stateNode:cc.Node,
        ramaingTime:cc.Sprite
    },

    onLoad () {

    },

    show(info){
        var self = this
        self.node.active = true
        var time = info.time
        var originator = info.originator
        var playerInfo = info.playerInfo
        for(var i = 0; i < playerInfo.lengeh; i++){

        }
    },

    hide(){
        var self = this
        self.node.active = false
    }
});

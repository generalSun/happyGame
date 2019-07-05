cc.Class({
    extends: cc.Component,

    properties: {
        player:cc.Label,
        state:cc.Label
    },

    onLoad () {

    },

    init(name,state){
        var self = this
        self.player.string = '['+name+']'
        if(state == 0){
            self.state.string = '正在选择中...'
        }else if(state == 1){
            self.state.string = '同意解散房间'
        }
    }
});

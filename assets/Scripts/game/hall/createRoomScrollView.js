var TAG = 'createRoomScrollView.js'
cc.Class({
    extends: cc.Component,

    properties: {
        view:cc.Node,
        content:cc.Node,
        item_prefab:cc.Prefab,
    },

    init(){
        console.log(TAG,'init')
        var self = this
        self.m_items = new cc.NodePool()
        self.m_playWay = new Array()
    },

    show(){
        var self = this
        self.hide()
        self.node.active = true
        var gameListInfo = G.gameListInfo || {}
        console.log(TAG,'show',gameListInfo)
        for(var i = 0; i < gameListInfo.length; i++){
            var gameModel = gameListInfo[i]
            for(var j = 0; j < gameModel.types.length; j++){
                var type = gameModel.types[j] 
                if(type.code == 'createroom'){
                    for(var inx = 0; inx < type.playways.length; inx++){
                        if(self.m_items.size() <= 0){
                            var item = cc.instantiate(self.item_prefab);
                            self.m_items.put(item); 
                        }
                        var playway = self.m_items.get();
                        var script = playway.getComponent("playWay");
                        script.init(type.playways[inx]);
                        playway.parent = self.content
                        self.m_playWay.push(playway)
                    }
                }
            }
        }
    },

    hide(){
        var self = this
        for(var i = 0; i < self.m_playWay.length; i++){
            var item = self.m_playWay[i]
            self.m_items.put(item)
        }
        self.content.removeAllChildren()
        self.m_playWay.splice(0,self.m_playWay.length)
        self.node.active = false
    },

    clear(){
        var self = this
        self.m_items.clear();
        if(cc.isValid(self.content)){
            self.content.removeAllChildren()
        }
        self.m_playWay.splice(0,self.m_playWay.length)
    },

    onDestroy(){
        var self = this
        self.clear()
    }
});

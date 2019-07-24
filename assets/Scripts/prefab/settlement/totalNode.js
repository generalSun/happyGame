var TAG = 'totalNode.js'
cc.Class({
    extends: cc.Component,

    properties: {
        infoItem:cc.Prefab,
        playerInfo:cc.Node,
        title:cc.Sprite
    },

    init () {
        console.log(TAG,'init')
        var self = this
        self.m_infoPool = new cc.NodePool()
        self.m_infoItem = new Array()
        self.hide()
    },

    show(infos){
        console.log(TAG,'show',infos)
        var self = this
        if(!infos || infos.length <= 0){
            self.hide()
            return
        }
        self.node.active = true
        var space = 310
        var startX = 135
        for(var i = 0; i < infos.length; i++){
            var info = infos[i]
            if(self.m_infoPool.size() <= 0){
                var item = cc.instantiate(self.infoItem);
                self.m_infoPool.put(item); 
            }
            var item = self.m_infoPool.get(); 
            item.parent = self.playerInfo
            var script = item.getComponent("totalSettlementItem");
            script.init();
            script.show(info);
            self.m_infoItem.push(item)
            item.x = startX + i*space
        }
    },

    hide(){
        var self = this
        for(var i = 0; i < self.m_infoItem.length; i++){
            var item = self.m_infoItem[i]
            var script = item.getComponent("totalSettlementItem");
            script.hide()
            self.m_infoPool.put(item)
        }
        self.playerInfo.removeAllChildren()
        self.node.active = false
        self.m_infoItem.splice(0,self.m_infoItem.length)
    },

    clear(){
        var self = this
        self.m_infoPool.clear();
        self.m_infoItem.splice(0,self.m_infoItem.length)
        if(cc.isValid(self.playerInfo)){
            self.playerInfo.removeAllChildren()
        }
    },

    onDestroy(){
        var self = this
        self.clear()
    }
});

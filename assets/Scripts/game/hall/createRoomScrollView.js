cc.Class({
    extends: cc.Component,

    properties: {
        view:cc.Node,
        content:cc.Node,
        item_prefab:cc.Prefab,
    },

    init(infos,callBack){
        var self = this
        infos = infos || []
        self.m_items.splice(0,self.m_items.length)
        self.content.removeAllChildren()
        for(var i = 0; i < infos.length; i++){
            var info = infos[i]
            if(info){
                var item = cc.instantiate(self.item_prefab);
                self.content.addChild(item);
                self.m_items.push(item);
                item.getComponent('scrollViewItem').init(info,i,self.notifyItemClicked.bind(self))
                if(i == 0){
                    item.getComponent('scrollViewItem').updateItem(true)
                }
            }
        }
        self.m_notifyCallBack = callBack
    },

    onLoad () {
        var self = this
        self.m_items = new Array();
        self.m_notifyCallBack = null
    },

    notifyItemClicked(index){
        var self = this
        for(var i = 0; i < self.m_items.length; i++){
            var item = self.m_items[i]
            item.getComponent('scrollViewItem').updateItem(index == i)
        }
        if(self.m_notifyCallBack){
            self.m_notifyCallBack(index)
        }
    }
});

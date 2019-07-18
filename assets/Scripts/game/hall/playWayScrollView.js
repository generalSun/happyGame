var TAG = 'playWayScrollView.js'
cc.Class({
    extends: cc.Component,

    properties: {
        view:cc.Node,
        content:cc.Node,
        item_prefab:cc.Prefab
    },

    init () {
        console.log(TAG,'init')
        var self = this
        self.m_items = new cc.NodePool()
        self.m_itemArray = new Array()
    },

    show(groups,items){
        console.log(TAG,'init',groups,items)
        var self = this
        self.hide()
        self.node.active = true
        for(var i = 0; i < groups.length; i++){
            var group = groups[i]
            var itemInfo = new Array()
            for(var j = 0; j < items.length; j++){
                var item = items[j]
                if(group.id == item.groupid){
                    itemInfo.push(item)
                }
            }
            if(self.m_items.size() <= 0){
                var item = cc.instantiate(self.item_prefab);
                self.m_items.put(item); 
            }
            var item = self.m_items.get(); 
            item.parent = self.content
            var script = item.getComponent("playWayItem");
            script.show(group,itemInfo);
            self.m_itemArray.push(item)
        }
    },

    collectInfo(){
        var self = this
        var itemsInfo = new Array()
        for(var i = 0; i <self.m_itemArray.length; i++){
            var item = self.m_itemArray[i]
            var script = item.getComponent("playWayItem");
            var info = script.collectInfo()
            itemsInfo.push(info)
        }
        return itemsInfo
    },

    hide(){
        var self = this
        for(var i = 0; i < self.m_itemArray.length; i++){
            var item = self.m_itemArray[i]
            self.m_items.put(item)
        }
        self.content.removeAllChildren()
        self.node.active = false
        self.m_itemArray.splice(0,self.m_itemArray.length)
    },

    clear(){
        var self = this
        self.m_items.clear();
        self.m_itemArray.splice(0,self.m_itemArray.length)
        if(cc.isValid(self.content)){
            self.content.removeAllChildren()
        }
    },

    onDestroy(){
        var self = this
        self.clear()
    }
});

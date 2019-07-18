var TAG = 'playWayItem.js'
var Constants = require('../config/Constants')
cc.Class({
    extends: cc.Component,

    properties: {
        modelName:cc.Label,
        toggleContainer:cc.ToggleContainer,
        toggle_prefab:cc.Prefab
    },

    onLoad () {
        console.log(TAG,'onLoad')
        var self = this
        self.m_items = new cc.NodePool()
        self.m_itemArray = new Array()
        self.m_groupInfo = null
    },

    show (group,itemInfo) {
        console.log(TAG,'init',group,itemInfo)
        if(!group || !itemInfo)return
        var self = this
        self.hide()
        self.m_groupInfo = group
        self.modelName.string = group.name + ':'
        self.modelName._updateRenderData(true)
        var width = 0
        for(var i = 0; i < itemInfo.length; i++){
            var info = itemInfo[i]
            if(self.m_items.size() <= 0){
                var item = cc.instantiate(self.toggle_prefab);
                self.m_items.put(item); 
            }
            var item = self.m_items.get(); 
            item.parent = self.toggleContainer.node
            var describle = cc.find('describle',item)
            describle.getComponent(cc.Label).string = info.name
            describle.getComponent(cc.Label)._updateRenderData(true)
            width = width + describle.width + item.width
            item.itemInfo = info
            self.m_itemArray.push(item)
        }
        var offest = self.toggleContainer.node.width/2 - Math.abs(self.modelName.node.x) + self.modelName.node.width + 50
        var space = self.getSpace(offest,width)
        var w = 0
        for(var i = 0; i <self.toggleContainer.toggleItems.length; i++){
            var item = self.toggleContainer.toggleItems[i]
            item.node.x = offest + w 
            var describle = cc.find('describle',item.node)
            w = w + describle.width + item.node.width + space
        }
    },

    collectInfo(){
        var self = this
        if(!self.m_groupInfo)return
        var info = {
            code:self.m_groupInfo.code,
        }
        for(var i = 0; i <self.m_itemArray.length; i++){
            var item = self.m_itemArray[i]
            if(item.getComponent(cc.Toggle).isChecked){
                info.value = item.itemInfo.value
                break
            }
        }
        return info
    },

    getSpace(offest,totalWidth){
        var self = this
        var width = self.toggleContainer.node.width
        var itemNum = self.toggleContainer.toggleItems.length
        var space = 50
        var currSpace = space
        if(itemNum > 0){
            var w = (itemNum - 1)*space + totalWidth
            var maxw = width - offest
            if(w > maxw){
                currSpace = (maxw - totalWidth)/((itemNum - 1) == 0?1:(itemNum - 1))
            }
        }
        return currSpace
    },

    hide(){
        var self = this
        for(var i = 0; i < self.m_itemArray.length; i++){
            var item = self.m_itemArray[i]
            self.m_items.put(item)
        }
        self.toggleContainer.node.removeAllChildren()
        self.m_itemArray.splice(0,self.m_itemArray.length)
        self.m_groupInfo = null
    },

    clear(){
        var self = this
        self.m_items.clear();
        self.m_itemArray.splice(0,self.m_itemArray.length)
        self.m_groupInfo = null
        if(cc.isValid(self.toggleContainer)){
            self.toggleContainer.node.removeAllChildren()
        }
    },

    onDestroy(){
        var self = this
        self.clear()
    }
});

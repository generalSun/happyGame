var config = require('./config')
cc.Class({
    ctor(){
        var self = this
        self.m_chair = 0
        self.m_cardNode = null
        self.m_object = null
        self.m_pokerAtlas = null
    },

    initWidget(disCardNode,chair,atlas,object){
        var self = this
        self.m_chair = chair
        self.m_cardNode = disCardNode
        self.m_pokerAtlas = atlas
        self.m_object = object
        var winWidth = cc.winSize.width
        var height = 100
        var y = 0
        if(self.m_chair == 0){
            self.m_cardNode.width = winWidth/3
            self.m_cardNode.height = height
            self.m_cardNode.x = -1*self.m_object.node.x
            self.m_cardNode.y = y + 100
        }else if(self.m_chair == 1){
            var width = self.m_object.node.x - config.playerOffset
            self.m_cardNode.width = width
            self.m_cardNode.height = height
            self.m_cardNode.x = -1*(config.playerOffset + width/2)
            self.m_cardNode.y = y
        }else if(self.m_chair == 2){
            var width = -1*self.m_object.node.x - config.playerOffset + winWidth/3
            self.m_cardNode.width = width
            self.m_cardNode.height = height
            self.m_cardNode.x = config.playerOffset + width/2
            self.m_cardNode.y = y
        }else if(self.m_chair == 3){
            var width = -1*self.m_object.node.x - config.playerOffset
            self.m_cardNode.width = width
            self.m_cardNode.height = height
            self.m_cardNode.x = config.playerOffset + width/2
            self.m_cardNode.y = y
        }
    }
})
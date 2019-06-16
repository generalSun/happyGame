var config = require('./config')
cc.Class({
    ctor(){
        var self = this
        self.m_chair = 0
        self.m_cardNode = null
        self.m_object = null
        self.m_pokerAtlas = null
        self.m_cards = new Array()
    },

    initWidget(disCardNode,chair,atlas,object){
        var self = this
        self.m_chair = chair
        self.m_cardNode = disCardNode
        self.m_pokerAtlas = atlas
        self.m_object = object
        var disNodeSize = config.disNodeSize[self.m_chair]
        self.m_cardNode.width = disNodeSize.width
        self.m_cardNode.height = disNodeSize.height
        var nodeOffest = config.disNodeOffset[self.m_chair]
        if(self.m_chair == 0){
            self.m_cardNode.x = nodeOffest.x + (-1 * self.m_object.node.x)
        }else if(self.m_chair == 1){
            self.m_cardNode.x = -1 * (nodeOffest.x + self.m_cardNode.width/2)
        }else if(self.m_chair == 2){
            self.m_cardNode.x = nodeOffest.x + self.m_cardNode.width/2
        }else if(self.m_chair == 3){
            self.m_cardNode.x = nodeOffest.x + self.m_cardNode.width/2
        }
        self.m_cardNode.y = nodeOffest.y
    },

    addCard(info,ani){
        var self = this
        info = info || {}
        var ps = new Array()
        for(var i = 0; i < info.length; i++){
            var p = G.tools.loadResPromise('prefabs/cardNode', cc.Prefab,info[i])
            ps.push(p)
        }
        Promise.all(ps).then(function(args){
            for(var i = 0; i < args.length; i++){
                var arg = args[i]
                var prefab = arg.resource
                var value = arg.parameter
                var node = cc.instantiate(prefab);
                node.active = true;
                var scale = config.disCardScale[self.m_chair]
                node.scale = scale
                self.m_cardNode.addChild(node);

                var cardScript = node.getComponent('poker')
                self.m_cards.push(cardScript)
                cardScript.setAtlas(self.m_pokerAtlas)
                cardScript.setCard(value)
            }
            self.refreshCardsPos(ani)
        })
        .catch(function(err){
            cc.log(err.message || err);
        })
    },

    refreshCardsPos(ani){
        ani = ani || false
        var self = this
        var space = self.getSpace()
        var startPos = self.getStartPos(space)
        var delay = 0.1
        var duation = 0.5
        for(var i = 0; i < self.m_cards.length; i++){
            var card = self.m_cards[i]
            card.setPokerPos({x:startPos.x + i*space,y:startPos.y})
            if(ani){
                card.node.runAction(cc.sequence(cc.delayTime(i*delay),cc.moveTo(duation,startPos.x + i*space,startPos.y)))
            }else{
                card.node.x = startPos.x + i*space
                card.node.y = startPos.y
            }
        }
    },

    getStartPos(space){
        var self = this
        var width = self.m_cardNode.width
        var space = space || config.disCardSpace[self.m_chair]
        var cardOffest = config.disCardOffset[self.m_chair]
        var cardMinOffest = config.disCardMinOffset[self.m_chair]
        var scale = config.disCardScale[self.m_chair]
        var cardsNum = self.m_cards.length
        var pos = {x:0,y:0}
        if(cardsNum > 0){
            var cardsWidth = (cardsNum - 1)*space + config.normalPokerSize.width*scale
            var minx = cardMinOffest.x - width/2
            var x = cardOffest.x - cardsWidth/2
            pos.x = x < minx?(minx + config.normalPokerSize.width*scale/2):(x + config.normalPokerSize.width*scale/2)
        }
        if(self.m_chair == 0){
            var height = self.m_cardNode.height
            pos.y = -1 * height/2 + config.normalPokerSize.height*scale/2
        }
        return pos
    },

    getSpace(){
        var self = this
        var width = self.m_cardNode.width
        var space = config.disCardSpace[self.m_chair]
        var cardOffest = config.disCardOffset[self.m_chair]
        var cardMinOffest = config.disCardMinOffset[self.m_chair]
        var scale = config.disCardScale[self.m_chair]
        var cardsNum = self.m_cards.length
        var currSpace = space
        if(cardsNum > 0){
            var cardsWidth = (cardsNum - 1)*space + config.normalPokerSize.width*scale
            var maxw = width - cardMinOffest.x 
            var w = cardsWidth + cardOffest.x
            if(w > maxw){
                currSpace = (maxw - config.normalPokerSize.width*scale)/((cardsNum - 1) == 0?1:(cardsNum - 1))
            }
        }
        return currSpace
    },

    clear(){
        var self = this
        for(var i = self.m_cards.length - 1; i >= 0; i--){
            var poker = self.m_cards[i]
            if(poker && poker.onDestroy){
                poker.onDestroy()
            }
            self.m_cards.splice(i,1);
        }
        self.m_cardNode.removeAllChildren()
    },

    onDestroy(){
        var self = this
        for(var i = self.m_cards.length - 1; i >= 0; i--){
            var poker = self.m_cards[i]
            if(poker && poker.onDestroy){
                poker.onDestroy()
            }
            self.m_cards.splice(i,1);
        }
        self.m_cardNode.removeAllChildren()
    }
})
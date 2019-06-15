var config = require('./config')
var handCardTouch = require('./handCardTouch')
var Constants = require('./../../../config/Constants')
cc.Class({
    ctor(){
        var self = this
        self.m_chair = 0
        self.m_cardNode = null
        self.m_object = null
        self.m_cards = new Array()
        self.m_pokerAtlas = null
    },

    initWidget(handCardNode,chair,atlas,object){
        var self = this
        self.m_chair = chair
        self.m_cardNode = handCardNode
        self.m_pokerAtlas = atlas
        self.m_object = object
        var winWidth = cc.winSize.width
        var height = config.handNodeHeight[self.m_chair]
        var nodeOffest = config.handNodeOffset[self.m_chair]
        if(self.m_chair == 0){
            self.m_cardNode.width = winWidth
            nodeOffest.y = -1*self.m_object.node.y
            self.m_cardNode.x = nodeOffest.x + (-1 * self.m_object.node.x)
        }else if(self.m_chair == 1){
            var width = self.m_object.node.x - nodeOffest.x
            self.m_cardNode.width = width
            self.m_cardNode.x = -1*(nodeOffest.x + width/2)
        }else if(self.m_chair == 2){
            var width = -1*self.m_object.node.x - nodeOffest.x + winWidth/3
            self.m_cardNode.width = width
            self.m_cardNode.x = nodeOffest.x + width/2
        }else if(self.m_chair == 3){
            var width = -1*self.m_object.node.x - nodeOffest.x
            self.m_cardNode.width = width
            self.m_cardNode.x = nodeOffest.x + width/2
        }
        self.m_cardNode.height = height
        self.m_cardNode.y = nodeOffest.y
        self.initEvent()
    },

    initEvent(){
        var self = this
        if(self.m_chair != 0)return
        self.m_handCardTouch = new handCardTouch(self.m_cardNode,self)
    },

    getTouchedCardInfo(pos){
        var self = this
        for(var i = self.m_cards.length - 1; i >= 0; i--){
            var card = self.m_cards[i]
            if(card.isClicked(pos)){
                return {index:i,card:card}
            }
        }
        return null;
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
                var scale = config.handCardScale[self.m_chair]
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
        var space = space || config.handCardSpace[self.m_chair]
        var cardOffest = config.handCardOffset[self.m_chair]
        var cardMinOffest = config.handCardMinOffset[self.m_chair]
        var scale = config.handCardScale[self.m_chair]
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
        var space = config.handCardSpace[self.m_chair]
        var cardOffest = config.handCardOffset[self.m_chair]
        var cardMinOffest = config.handCardMinOffset[self.m_chair]
        var scale = config.handCardScale[self.m_chair]
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
        if(self.m_handCardTouch){
            self.m_handCardTouch.clear()
        }
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
        if(self.m_handCardTouch){
            self.m_handCardTouch.onDestory()
        }
    }
})
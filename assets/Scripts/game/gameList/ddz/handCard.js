var config = require('./config')
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
        self.addCard([1,2,3,4,5,6,7,8,9,10,11,12,13,1,2,3,4,1,2,3,4],false)
        self.initEvent()
    },

    initEvent(){
        var self = this
        if(self.m_chair != 0)return
        self.m_touchCardsInfo = new Array()
        self.m_cardNode.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.log("TOUCH_START event=", event.type);
            var cardInfo = self.updateCardInfoInTouch(event)
            self.updateCardsInfoInTouch(event,cardInfo)
            self.updateCardsColorInTouch(event,cardInfo)
        },self);

        self.m_cardNode.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            cc.log("TOUCH_MOVE event=", event.type);
            var cardInfo = self.updateCardInfoInTouch(event)
            self.updateCardsInfoInTouch(event,cardInfo)
            self.updateCardsColorInTouch(event,cardInfo)
        },self);

        self.m_cardNode.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.log("TOUCH_END event=", event.type);
            var cardInfo = self.updateCardInfoInTouch(event)
            self.updateCardsInfoInTouch(event,cardInfo)
            self.updateCardsColorInTouch(event,cardInfo)
            self.updateTouchCardsInfo(event)
        },self);

        self.m_cardNode.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            cc.log("TOUCH_CANCEL event=", event.type);
            self.updateCardsInfoInTouch(event)
            self.updateCardsColorInTouch()
            self.updateCardsPosInTouch()
            self.updateTouchCardsInfo(event)
        },self);
    },

    updateTouchCardsInfo(event){
        var self = this
        if(event.type == 'touchend'){
            for(var i = self.m_touchCardsInfo.length - 1; i >= 0; i--){
                var cardInfo = self.m_touchCardsInfo[i]
                var card = cardInfo.card
                var status = card.getStatus()
                if(status == Constants.CARD_STATUS.STATUS_NORMAL){
                    self.m_touchCardsInfo.splice(i,1)
                }
            }
        }else if(event.type == 'touchcancel'){
            self.m_touchCardsInfo.splice(0,self.m_touchCardsInfo.length-1)
        }
    },

    updateCardsInfoInTouch(event,cardInfo){
        var self = this
        if(event.type == 'touchmove'){
            if(cardInfo){
                var index = cardInfo.index
                for(var i = 0; i < self.m_touchCardsInfo.length; i++){
                    var info = self.m_touchCardsInfo[i]
                    var currentIndex = info.index
                    var card = info.card
                    var status = card.getStatus()
                    if(!G.tools.isInBothNumber(currentIndex,index,)){
                        if(status == Constants.CARD_STATUS.STATUS_NORMAL_SELECT){
                            card.setStatus(Constants.CARD_STATUS.STATUS_NORMAL)
                        }else if(status == Constants.CARD_STATUS.STATUS_POP_SELECT){
                            card.setStatus(Constants.CARD_STATUS.STATUS_POP)
                        }
                    }
                }
            }
        }else if(event.type == 'touchend'){
            for(var i = 0; i < self.m_touchCardsInfo.length; i++){
                var cardInfo = self.m_touchCardsInfo[i]
                var card = cardInfo.card
                var status = card.getStatus()
                if(status == Constants.CARD_STATUS.STATUS_NORMAL_SELECT){
                    card.setStatus(Constants.CARD_STATUS.STATUS_POP)
                }else if(status == Constants.CARD_STATUS.STATUS_POP_SELECT){
                    card.setStatus(Constants.CARD_STATUS.STATUS_NORMAL)
                }
            }
        }else if(event.type == 'touchcancel'){
            for(var i = 0; i < self.m_touchCardsInfo.length; i++){
                var cardInfo = self.m_touchCardsInfo[i]
                var card = cardInfo.card
                card.setStatus(Constants.CARD_STATUS.STATUS_NORMAL)
            }
        }
    },

    updateCardsColorInTouch(event,cardInfo){
        var self = this
        if(event.type == 'touchstart' || event.type == 'touchmove'){
            if(cardInfo){
                var index = cardInfo.index
                for(var i = 0; i < self.m_touchCardsInfo.length; i++){
                    var info = self.m_touchCardsInfo[i]
                    var card = info.card
                    var status = card.getStatus()
                    if(i <= index && (status == Constants.CARD_STATUS.STATUS_NORMAL_SELECT || 
                        status == Constants.CARD_STATUS.STATUS_POP_SELECT)
                    ){
                        card.setColor(cc.color(158, 198, 228))
                    } else{
                        card.setColor(cc.color(255, 255, 255))
                    }
                }
            }
        }else if(event.type == 'touchend' || event.type == 'touchcancel'){
            for(var i = 0; i < self.m_touchCardsInfo.length; i++){
                var info = self.m_touchCardsInfo[i]
                var card = info.card
                card.setColor(cc.color(255, 255, 255))
            }
        }
    },

    updateCardsPosInTouch(){
        var self = this
        for(var i = 0; i < self.m_touchCardsInfo.length; i++){
            var cardInfo = self.m_touchCardsInfo[i]
            var card = cardInfo.card
            if(card.getStatus() == Constants.CARD_STATUS.STATUS_NORMAL){
                card.node.y = card.node.y + config.cardPopHeight
            }else{
                card.setColor(cc.color(255, 255, 255))
            } 
        }
    },

    updateCardInfoInTouch(event){
        var self = this
        var cardInfo = self.getTouchedCardInfo(event.getLocation())
        if(cardInfo){
            var info = self.getTouchCardInfoByIndex(cardInfo.index)
            if(!info){
                self.m_touchCardsInfo.push(cardInfo)
            }
            var card = cardInfo.card
            var status = card.getStatus()
            if(event.type == 'touchstart' || event.type == 'touchmove'){
                if(status == Constants.CARD_STATUS.STATUS_NORMAL){
                    card.setStatus(Constants.CARD_STATUS.STATUS_NORMAL_SELECT)
                }else if(status == Constants.CARD_STATUS.STATUS_POP){
                    card.setStatus(Constants.CARD_STATUS.STATUS_POP_SELECT)
                }
            }
            return cardInfo
        }
        return null
    },

    getTouchCardInfoByIndex(index){
        var self = this
        for(var i = 0; i < self.m_touchCardsInfo.length; i++){
            var data = self.m_touchCardsInfo[i]
            if(data.index == index){
                return data
            }
        }
        return null
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
            if(ani){
                card.node.runAction(cc.sequence(
                    cc.delayTime(i*delay),
                    cc.moveTo(duation,cc.Vec2(startPos.x + i*space,startPos.y))
                ))
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

    onDestroy(){
        var self = this
        for(var i = 0; i < self.m_cards.length; i++){
            var poker = self.m_cards[i]
            if(poker && poker.onDestroy){
                poker.onDestroy()
            }
            self.m_cards.splice(i,1);
        }
        self.m_cardNode.removeAllChildren()
    }
})
var config = require('./config')
var handCardTouch = require('./handCardTouch')
var Constants = require('./../../../config/Constants')
var ddz_logic = require('./ddz_logic')
var TAG = 'handCard.js'
cc.Class({
    ctor(){
        var self = this
        self.m_chair = 0
        self.m_cardNode = null
        self.m_object = null
        self.m_objectEvent = null
        self.m_cards = new Array()
        self.m_cardsPool = new cc.NodePool()
        self.m_pokerAtlas = null
        self.m_cardPrefab = null
    },

    getNode(){
        var self = this
        return self.m_cardNode
    },

    initWidget(handCardNode,chair,atlas,cardPrefab,objectEvent,object){
        var self = this
        self.m_cardPrefab = cardPrefab
        self.m_chair = chair
        self.m_cardNode = handCardNode
        self.m_pokerAtlas = atlas
        self.m_objectEvent = objectEvent
        self.m_object = object
        var nodeOffest = config.handNodeOffset[self.m_chair]
        var handNodeSize = config.handNodeSize[self.m_chair]
        self.m_cardNode.width = handNodeSize.width || cc.winSize.width
        self.m_cardNode.height = handNodeSize.height || cc.winSize.height
        if(self.m_chair == config.chair.home){
            self.m_cardNode.x = nodeOffest.x + (-1 * self.m_object.node.x)
            self.m_cardNode.y = nodeOffest.x + (-1 * self.m_object.node.y)
        }else if(self.m_chair == config.chair.nextDoor){
            self.m_cardNode.x = -1 * (nodeOffest.x + self.m_cardNode.width/2)
            self.m_cardNode.y = -1 * nodeOffest.y
        }else if(self.m_chair == config.chair.rightHome){
            self.m_cardNode.x = nodeOffest.x + self.m_cardNode.width/2
            self.m_cardNode.y = -1 * nodeOffest.y
        }else if(self.m_chair == config.chair.upperHouse){
            self.m_cardNode.x = nodeOffest.x + self.m_cardNode.width/2
            self.m_cardNode.y = -1 * nodeOffest.y
        }
        self.initEvent()
    },

    initEvent(){
        var self = this
        if(self.m_chair != config.chair.home)return
        self.m_handCardTouch = new handCardTouch(self.m_cardNode,self)
    },

    getTouchNode(){
        var self = this
        return self.m_handCardTouch
    },

    getTouchedCardInfo(pos){
        var self = this
        for(var i = self.m_cards.length - 1; i >= 0; i--){
            var card = self.m_cards[i]
            if(cc.isValid(card)){
                card = card.getComponent('poker')
                if(card.isClicked(pos)){
                    return {index:i,card:card}
                }
            }
        }
        return null;
    },

    show(){
        var self = this
        self.hide()
        if(!self.m_cardNode.active){
            self.m_cardNode.active = true
        }
    },

    dealCards(ani){
        ani = ani || false
        var self = this
        for(var i = 0; i < self.m_cards.length; i++){
            var card = self.m_cards[i]
            var cardScript = card.getComponent('poker')
            var scale = config.handCardScale[self.m_chair]
            if(self.m_chair == config.chair.home){
                cardScript.setPokerCurrentPosition(
                    cc.v2(self.m_cardNode.width/2 - config.normalHandPokerSize[self.m_chair].width*scale.x/2,
                        -1 * self.m_cardNode.height/2 + config.normalHandPokerSize[self.m_chair].height*scale.y/2)
                )
            }else if(self.m_chair == config.chair.nextDoor){
                cardScript.setPokerCurrentPosition(cc.v2(config.normalHandPokerSize[self.m_chair].width*scale.x/2 - self.m_cardNode.width/2,0))
            }else{
                cardScript.setPokerCurrentPosition(cc.v2(self.m_cardNode.width/2 - config.normalHandPokerSize[self.m_chair].width*scale.x/2,0))
            }
        }
        if(self.m_handCardTouch){
            self.m_handCardTouch.canTouched(false)
        }
        
        if(self.m_chair == config.chair.home){
            self.m_object.setCardNumSprite(false,0)
            self.addCardTypeOne(ani)
        }else{
            self.m_object.setCardNumSprite(true,0)
            self.addCardTypeTwo(ani)
        }
    },

    addCards(info){
        console.log(TAG,'addCards',info)
        if(!info || info.length <= 0){
            return
        }
        info = info || []
        var self = this
        for(var i = 0; i < info.length; i++){
            var value = info[i]
            if(self.m_cardsPool.size() <= 0){
                var card = cc.instantiate(self.m_cardPrefab);
                self.m_cardsPool.put(card); 
            }
            var node = self.m_cardsPool.get();
            node.active = true;
            self.m_cardNode.addChild(node);
            self.m_cards.push(node)
            var cardScript = node.getComponent('poker')
            
            var scale = config.handCardScale[self.m_chair]
            cardScript.setPokerScale(scale)
            cardScript.setLogic(ddz_logic)
            cardScript.setAtlas(self.m_pokerAtlas)
            cardScript.setPokerType(0)
            if(self.m_chair != config.chair.home){
                cardScript.setPokerType(1)
            }
            cardScript.setCard(value)
        }
    },

    getCardsInfo(info){
        console.log(TAG,'getCardsInfo',info)
        if(!info || info.length <= 0){
            return
        }
        info = info || []
        var self = this
        var cards = ddz_logic.sortCardsByType(info)
        var cards_info = new Array()
        for(var i = 0; i < self.m_cards.length; i++){
            var card = self.m_cards[i]
            if(cc.isValid(card)){
                var poker = card.getComponent('poker')
                for(var j = 0; j < cards.length; j++){
                    var value = cards[j]
                    if(value == poker.getValue() || poker.getValue() == 0){
                        poker.setCard(value)
                        var data = {
                            index:i,
                            card:card
                        }
                        cards_info.push(data)
                        cards.splice(j,1)
                        break
                    }
                }
                if(cards.length <= 0){
                    break
                }
            }
        }
        return cards_info
    },

    outCards(info,callBack){
        console.log(TAG,'outCards',info)
        if(!info || info.length <= 0){
            if(callBack){
                callBack()
            }
            return
        }
        info = info || []
        var self = this
        var cards_info = self.getCardsInfo(info)
        var outCardsInfo = new Array()

        var call = function(target,data){
            var card_node = data.card_node
            var card_index = data.card_index
            var index = data.index
            var value = data.value
            var pos = data.pos
            outCardsInfo.push({value:value,pos:pos})
            self.m_cards.splice(card_index,1)
            self.getTouchNode()?self.getTouchNode().removeSelectedCard(card_index):null
            self.m_cardsPool.put(card_node)
            self.m_cardNode.removeChild(card_node)
            if(index <= 0){
                if(self.m_chair == config.chair.home){
                    self.m_object.setCardNumSprite(false,self.m_cards.length)
                    self.refreshCardsOne(true)
                }else{
                    self.m_object.setCardNumSprite(true,self.m_cards.length)
                    self.refreshCardsTwo(true)
                }
                if(callBack){
                    callBack(outCardsInfo)
                }
            }
        }
        for(var i = cards_info.length - 1; i >= 0; i--){
            var card_info = cards_info[i]
            var card_node = card_info.card
            var card_index = card_info.index
            if(cc.isValid(card_node)){
                card_node.active = true
                var card = card_node.getComponent('poker')
                call(card_node,{
                    card_node:card_node,
                    card_index:card_index,
                    index:i,
                    value:card.getValue(),
                    pos:card.getPokerCurrentPosition()
                })
            }
        }
    },

    addLastCards(info,ani){
        if(!info || info.length <= 0){
            return
        }
        info = info || []
        var self = this
        if(!self.m_cardNode.active){
            throw '添加牌时，手牌节点处于隐藏状态'
        }
        console.log(TAG,'addLastCards',info)
        self.addCards(info)
        if(self.m_chair == config.chair.home){
            self.m_object.setCardNumSprite(false)
            self.sortCards()
            self.refreshCardsOne(ani)
        }else{
            self.m_object.setCardNumSprite(true)
            self.refreshCardsTwo(ani)
        }
    },

    addCardTypeOne(ani){
        ani = ani || false
        var self = this
        var space = self.getSpace()
        var startPos = self.getStartPos(space)
        var delay = 0.05
        var duation = 0.2
        var scale = config.handCardScale[self.m_chair]
        for(var i = 0; i < self.m_cards.length; i++){
            var card = self.m_cards[i]
            if(cc.isValid(card)){
                card = card.getComponent('poker')
                card.setPokerNormalPosition({x:startPos.x + i*space,y:startPos.y})
                card.setPokerCurrentPosition({x:self.m_cardNode.width/2 - config.normalHandPokerSize[self.m_chair].width*scale.x/2,y:startPos.y})
                if(ani){
                    G.audioManager.playSFX('deal.mp3')
                    if(i + 1 == self.m_cards.length){
                        card.node.runAction(
                            cc.sequence(
                                cc.delayTime(i*delay),
                                cc.moveTo(duation,startPos.x + i*space,startPos.y),
                                cc.delayTime(0.5),
                                cc.callFunc(self.dealPokerEnd,self,{ani:ani})
                            )
                        )
                    }else{
                        card.node.runAction(
                            cc.sequence(
                                cc.delayTime(i*delay),
                                cc.moveTo(duation,startPos.x + i*space,startPos.y)
                            )
                        )
                    }
                }else{
                    card.setPokerCurrentPosition(startPos.x + i*space)
                }
            }
        }
        if(!ani){
            self.dealPokerEnd(self,{ani:ani})
        }
    },

    addCardTypeTwo(ani){
        ani = ani || false
        var self = this
        var delay = 0.05
        var duation = 0.2
        var scale = config.handCardScale[self.m_chair]
        var cardObject = self.m_object.getCardNum()
        var worldPos = cardObject.object.node.convertToWorldSpace(cc.v2(0,0))
        var endPos = self.m_cardNode.convertToNodeSpaceAR(worldPos)

        var callBack = function(target,data){
            var index = data.index
            self.m_object.setCardNumSprite(true,index+1)
            target.active = false
            if(index + 1 >= self.m_cards.length){
                self.refreshCardsTwo(false)
            }
        }
        for(var i = 0; i < self.m_cards.length; i++){
            var card = self.m_cards[i]
            if(cc.isValid(card)){
                card = card.getComponent('poker')
                card.setPokerNormalPosition({x:endPos.x,y:endPos.y})
                if(self.m_chair == config.chair.nextDoor){
                    card.setPokerCurrentPosition({x:config.normalHandPokerSize[self.m_chair].width*scale.x/2 - self.m_cardNode.width/2,y:endPos.y})
                }else{
                    card.setPokerCurrentPosition({x:self.m_cardNode.width/2 - config.normalHandPokerSize[self.m_chair].width*scale.x/2,y:endPos.y})
                }
                if(ani){
                    G.audioManager.playSFX('deal.mp3')
                    card.node.runAction(
                        cc.sequence(
                            cc.delayTime(i*delay),
                            cc.moveTo(duation,endPos.x,endPos.y),
                            cc.callFunc(callBack,card.node,{index:i})
                        )
                    )
                }else{
                    card.setPokerCurrentPosition(endPos.x)
                    callBack(card.node,{index:i})
                }
            }
        }
    },

    sortCards(){
        var self = this
        if(self.m_cards.length <= 0)return;
        var valueArray = new Array()
        for(var i = 0; i < self.m_cards.length; i++){
            var poker = self.m_cards[i]
            if(cc.isValid(poker)){
                poker = poker.getComponent('poker')
                valueArray.push(poker.getValue())
            }
        }
        valueArray.sort(function(a,b){
            var value_a = ddz_logic.getcardlogicvalue(a)
            var value_b = ddz_logic.getcardlogicvalue(b)
            return value_a - value_b
        })
        for(var i = 0; i < self.m_cards.length; i++){
            var poker = self.m_cards[i]
            if(cc.isValid(poker)){
                poker = poker.getComponent('poker')
                poker.setValue(valueArray[i])
            }
        }
    },

    //自己发牌结束
    dealPokerEnd(target,args){
        if(!args)return
        args = args || {}
        var self = this
        var ani = args.ani || false
        self.sortCards()
        for(var i = 0; i < self.m_cards.length; i++){
            var poker = self.m_cards[i]
            if(cc.isValid(poker)){
                poker = poker.getComponent('poker')
                if(ani){
                    poker.playAnimationFilp()
                    var data = [
                        {frame:0,value:new cc.Vec2(poker.getPokerScaleX(),poker.getPokerScaleY())},
                        {frame:0.25,value:new cc.Vec2(0,poker.getPokerScaleY())},
                        {frame:0.5,value:new cc.Vec2(poker.getPokerScaleX(),poker.getPokerScaleY())},
                    ]
                    poker.setAnimationCurveData('scale',data)
                    poker.setAnimationWrapMode(cc.WrapMode.Normal)
                    poker.speedUpAnimation(5)
                }else{
                    poker.setCard()
                }
            }
        }
        if(ani){
            G.eventManager.listenEventOnce(Constants.FRAMEEVENT.POKERFLIPEND,self.pokerFilpEnd,self)
        }else{
            self.pokerFilpEnd()
        }
    },

    pokerFilpEnd(){
        console.log(TAG,'pokerFilpEnd')
        var self = this
        self.refreshCardsOne(false)
        if(self.m_handCardTouch){
            self.m_handCardTouch.canTouched(true)
        }
        G.eventManager.emitEvent(Constants.LOCALEVENT.POKER_FILP_END)
    },

    refreshCardsTwo(ani){
        ani = ani || false
        var self = this
        console.log(TAG,'refreshCardsTwo',self.m_cards.length)
        var cardObject = self.m_object.getCardNum()
        var worldPos = cardObject.object.node.convertToWorldSpace(cc.v2(0,0))
        var endPos = self.m_cardNode.convertToNodeSpaceAR(worldPos)
        var scale = config.handCardScale[self.m_chair]
        var duation = 0.05
        var delay = 0.01

        var callBack = function(target,data){
            var index = data.index
            self.m_object.setCardNumSprite(true,index+1)
            target.active = false
            if(index + 1 >= self.m_cards.length){
                self.m_object.setCardNumSprite(true,self.m_cards.length)
            }
        }

        for(var i = 0; i < self.m_cards.length; i++){
            var card = self.m_cards[i]
            if(cc.isValid(card)){
                card.stopAllActions()
                card = card.getComponent('poker')
                card.setPokerScale(scale)
                card.setCard()
                card.setPokerNormalPosition({x:endPos.x,y:endPos.y})
                if(ani){
                    G.audioManager.playSFX('deal.mp3')
                    card.node.runAction(
                        cc.sequence(
                            cc.delayTime(i*delay),
                            cc.moveTo(duation,endPos.x,endPos.y),
                            cc.callFunc(callBack,card.node,{index:i})
                        )
                    )
                }else{
                    card.setPokerCurrentPosition({x:endPos.x,y:endPos.y})
                    callBack(card.node,{index:i})
                }
            }
        }
    },

    refreshCardsOne(ani){
        ani = ani || false
        var self = this
        console.log(TAG,'refreshCardsOne',self.m_cards.length)
        var space = self.getSpace()
        var startPos = self.getStartPos(space)
        var scale = config.handCardScale[self.m_chair]
        var duation = 0.05
        var delay = 0.01

        var callBack = function(target,data){
            var index = data.index
            self.m_object.setCardNumSprite(false,index+1)
            target.active = true
            if(index + 1 >= self.m_cards.length){
                self.m_object.setCardNumSprite(false,self.m_cards.length)
            }
        }

        for(var i = 0; i < self.m_cards.length; i++){
            var card = self.m_cards[i]
            if(cc.isValid(card)){
                card.stopAllActions()
                card = card.getComponent('poker')
                card.setPokerScale(scale)
                card.setCard()
                card.setPokerNormalPosition({x:startPos.x + i*space,y:startPos.y})
                // card.setPokerCurrentPosition({x:startPos.x + i*space,y:startPos.y + 50})
                if(ani){
                    G.audioManager.playSFX('deal.mp3')
                    card.node.runAction(
                        cc.sequence(
                            cc.delayTime(i*delay),
                            cc.moveTo(duation,startPos.x + i*space,startPos.y),
                            cc.callFunc(callBack,card.node,{index:i})
                        )
                    )
                }else{
                    card.setPokerCurrentPosition({x:startPos.x + i*space,y:startPos.y})
                    callBack(card.node,{index:i})
                }
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
        var pos = cc.v2(0,0)
        if(cardsNum > 0){
            var cardsWidth = (cardsNum - 1)*space + config.normalHandPokerSize[self.m_chair].width*scale.x
            var minx = cardMinOffest.x - width/2
            var x = cardOffest.x - cardsWidth/2
            pos.x = x < minx?(minx + config.normalHandPokerSize[self.m_chair].width*scale.x/2):(x + config.normalHandPokerSize[self.m_chair].width*scale.x/2)
        }
        if(self.m_chair == config.chair.home){
            pos.y = -1 * self.m_cardNode.height/2 + config.normalHandPokerSize[self.m_chair].height*scale.x/2
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
            var cardsWidth = (cardsNum - 1)*space + config.normalHandPokerSize[self.m_chair].width*scale.x
            var maxw = width - cardMinOffest.x 
            var w = cardsWidth + cardOffest.x
            if(w > maxw){
                currSpace = (maxw - config.normalHandPokerSize[self.m_chair].width*scale.x)/((cardsNum - 1) == 0?1:(cardsNum - 1))
            }
        }
        return currSpace
    },

    hide(){
        var self = this
        for(var i = 0; i < self.m_cards.length; i++){
            var item = self.m_cards[i]
            self.m_cardsPool.put(item)
        }
        self.m_cards.splice(0,self.m_cards.length)
        self.m_cardNode.removeAllChildren()
        self.m_cardNode.active = false
        if(self.m_handCardTouch){
            self.m_handCardTouch.clear()
        }
    },

    clear(){
        var self = this
        self.m_cardsPool.clear();
        self.m_cards.splice(0,self.m_cards.length)
        if(cc.isValid(self.m_cardNode)){
            self.m_cardNode.removeAllChildren()
        }
        if(self.m_handCardTouch){
            self.m_handCardTouch.clear()
        }
        G.eventManager.cancelEvent(Constants.FRAMEEVENT.POKERFLIPEND,self.pokerFilpEnd,self)
    },

    onDestroy(){
        var self = this
        self.clear()
    },
})
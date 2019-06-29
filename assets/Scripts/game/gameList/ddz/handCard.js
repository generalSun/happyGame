var config = require('./config')
var handCardTouch = require('./handCardTouch')
var Constants = require('./../../../config/Constants')
var count = 0
cc.Class({
    ctor(){
        var self = this
        self.m_chair = 0
        self.m_cardNode = null
        self.m_object = null
        self.m_objectEvent = null
        self.m_cards = new Array()
        self.m_pokerAtlas = null
    },

    initWidget(handCardNode,chair,atlas,objectEvent,object){
        var self = this
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

    getTouchedCardInfo(pos){
        var self = this
        for(var i = self.m_cards.length - 1; i >= 0; i--){
            var card = self.m_cards[i]
            if(cc.isValid(card) && card.isClicked(pos)){
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
                self.m_cardNode.addChild(node);
                var cardScript = node.getComponent('poker')
                self.m_cards.push(cardScript)
                var scale = config.handCardScale[self.m_chair]
                cardScript.setPokerScale(scale)
                cardScript.setAtlas(self.m_pokerAtlas)
                cardScript.setCard(value)
                if(self.m_chair == config.chair.home){
                    cardScript.setPokerCurrentPosition(
                        cc.v2(self.m_cardNode.width/2 - config.normalPokerSize.width*scale.x/2,
                            -1 * self.m_cardNode.height/2 + config.normalPokerSize.height*scale.y/2)
                    )
                }else if(self.m_chair == config.chair.nextDoor){
                    cardScript.setPokerCurrentPosition(cc.v2(config.normalPokerSize.width*scale.x/2 - self.m_cardNode.width/2,0))
                }else{
                    cardScript.setPokerCurrentPosition(cc.v2(self.m_cardNode.width/2 - config.normalPokerSize.width*scale.x/2,0))
                }
            }
            if(self.m_handCardTouch){
                self.m_handCardTouch.canTouched(false)
            }
            if(self.m_chair == config.chair.home){
                self.addCardTypeOne(ani)
            }else{
                self.m_object.setCardNumSprite(true)
                self.addCardTypeTwo(ani)
            }
        })
        .catch(function(err){
            cc.log(err.message || err);
        })
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
                card.setPokerNormalPosition({x:startPos.x + i*space,y:startPos.y})
                card.setPokerCurrentPosition({x:self.m_cardNode.width/2 - config.normalPokerSize.width*scale.x/2,y:startPos.y})
                if(ani){
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
        }

        for(var i = 0; i < self.m_cards.length; i++){
            var card = self.m_cards[i]
            if(cc.isValid(card)){
                card.setPokerNormalPosition({x:endPos.x,y:endPos.y})
                if(self.m_chair == config.chair.nextDoor){
                    card.setPokerCurrentPosition({x:config.normalPokerSize.width*scale.x/2 - self.m_cardNode.width/2,y:endPos.y})
                }else{
                    card.setPokerCurrentPosition({x:self.m_cardNode.width/2 - config.normalPokerSize.width*scale.x/2,y:endPos.y})
                }
                if(ani){
                    card.node.runAction(cc.sequence(cc.delayTime(i*delay),cc.moveTo(duation,endPos.x,endPos.y),cc.callFunc(callBack,card,{index:i})))
                }else{
                    card.setPokerCurrentPosition(endPos.x)
                    callBack(card,{index:i})
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
                valueArray.push(poker.getValue())
            }
        }
        valueArray.sort(function(a,b){
            return a - b
        })
        for(var i = 0; i < self.m_cards.length; i++){
            var poker = self.m_cards[i]
            if(cc.isValid(poker)){
                poker.setValue(valueArray[i])
            }
        }
    },

    //自己发牌结束
    dealPokerEnd(target,args){
        args = args || {}
        var self = this
        if(self.m_chair != config.chair.home)return
        var ani = args.ani || false
        self.sortCards()
        if(ani){
            for(var i = 0; i < self.m_cards.length; i++){
                var poker = self.m_cards[i]
                if(cc.isValid(poker)){
                    poker.playAnimationFilp()
                    var data = [
                        {frame:0,value:new cc.Vec2(poker.getPokerScaleX(),poker.getPokerScaleY())},
                        {frame:0.25,value:new cc.Vec2(0,poker.getPokerScaleY())},
                        {frame:0.5,value:new cc.Vec2(poker.getPokerScaleX(),poker.getPokerScaleY())},
                    ]
                    poker.setAnimationCurveData('scale',data)
                    poker.setAnimationWrapMode(cc.WrapMode.Normal)
                    poker.speedUpAnimation(5)
                }
            }
            G.eventManager.listenEventOnce(Constants.FRAMEEVENT.POKERFLIPEND,self.pokerFilpEnd,self)
        }else{
            if(self.m_handCardTouch){
                self.m_handCardTouch.canTouched(true)
            }
        }
    },

    pokerFilpEnd(){
        console.log('pokerFilpEnd')
        var self = this
        if(self.m_chair != config.chair.home)return
        self.refreshCards()
        if(self.m_handCardTouch){
            self.m_handCardTouch.canTouched(true)
        }
        self.m_object.setOperateNode(true)
        self.m_objectEvent.showOperateByIndex(0,[
            {name:'outCardButton',visible:true},
            {name:'tipButton',visible:true},
            {name:'ybqButton',visible:true},
            {name:'buchuButton',visible:true},
        ])
    },

    refreshCards(){
        var self = this
        var space = self.getSpace()
        var startPos = self.getStartPos(space)
        var scale = config.handCardScale[self.m_chair]
        for(var i = 0; i < self.m_cards.length; i++){
            var card = self.m_cards[i]
            if(cc.isValid(card)){
                card.setPokerScale(scale)
                card.setPokerNormalPosition({x:startPos.x + i*space,y:startPos.y})
                card.setPokerCurrentPosition({x:startPos.x + i*space,y:startPos.y})
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
            var cardsWidth = (cardsNum - 1)*space + config.normalPokerSize.width*scale.x
            var minx = cardMinOffest.x - width/2
            var x = cardOffest.x - cardsWidth/2
            pos.x = x < minx?(minx + config.normalPokerSize.width*scale.x/2):(x + config.normalPokerSize.width*scale.x/2)
        }
        if(self.m_chair == config.chair.home){
            pos.y = -1 * self.m_cardNode.height/2 + config.normalPokerSize.height*scale.x/2
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
            var cardsWidth = (cardsNum - 1)*space + config.normalPokerSize.width*scale.x
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
            if(cc.isValid(poker) && poker.clear){
                poker.clear()
            }
            self.m_cards.splice(i,1);
        }
        self.m_cardNode.removeAllChildren()
        if(self.m_handCardTouch){
            self.m_handCardTouch.clear()
        }
        G.eventManager.cancelEvent(Constants.FRAMEEVENT.POKERFLIPEND,self.pokerFilpEnd,self)
    },

    onDestroy(){
        var self = this
        G.eventManager.cancelEvent(Constants.FRAMEEVENT.POKERFLIPEND,self.pokerFilpEnd,self)
        for(var i = self.m_cards.length - 1; i >= 0; i--){
            var poker = self.m_cards[i]
            if(cc.isValid(poker) && poker.clear){
                poker.clear()
            }
            self.m_cards.splice(i,1);
        }
        self.m_cardNode.removeAllChildren()
        if(self.m_handCardTouch){
            self.m_handCardTouch.onDestory()
        }
    },
})
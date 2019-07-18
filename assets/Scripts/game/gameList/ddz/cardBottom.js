var config = require('./config')
var Constants = require('../../../config/Constants')
var ddz_logic = require('./ddz_logic')
cc.Class({
    extends: cc.Component,

    properties: {
        smallPokerPrefab:cc.Prefab,
        cardBottomSprite:cc.Sprite,
        ratioSprite:cc.Sprite
    },

    init(atlas){
        var self = this
        self.m_cardsPool = new cc.NodePool()
        self.m_cards = new Array()
        self.m_pokerAtlas = atlas
        self.m_ratio = cc.find('ratio/describle',self.ratioSprite.node)
        self.hide()
    },

    show(){
        var self = this
        self.hide()
        self.node.active = true
        self.cardBottomSprite.node.active = false
        self.ratioSprite.node.active = false
    },

    showRatio(){
        var self = this
        if(!self.ratioSprite.node.active){
            self.ratioSprite.node.active = true
            self.m_ratio.getComponent(cc.Label).string = 0
        }
    },

    setRatio(ratio){
        var self = this
        self.m_ratio.getComponent(cc.Label).string = ratio
    },

    showYuCards(){
        var self = this
        if(!self.cardBottomSprite.node.active){
            self.cardBottomSprite.node.active = true
            for(var i = 0; i < self.m_cards.length; i++){
                var item = self.m_cards[i]
                self.m_cardsPool.put(item)
            }
            self.m_cards.splice(0,self.m_cards.length)
            self.cardBottomSprite.node.removeAllChildren()
        }
    },

    addYuCards(info,ani){
        var self = this
        if(!info){
            self.cardBottomSprite.node.active = false
            return
        }
        ani = ani || false
        var flip = true
        if(typeof(info) == 'number'){
            flip = false
            if(info == 0){
                self.cardBottomSprite.node.active = false
                return
            }
            info = new Array(info).fill(0) 
        }
        if(self.m_cards.length > 0){
            for(var i = 0; i < self.m_cards.length; i++){
                var card = self.m_cards[i].getComponent('poker')
                card.setValue(info[i])
            }
            self.showCards(ani)
            return
        }
        for(var i = 0; i < info.length; i++){
            var value = info[i]
            if(self.m_cardsPool.size() <= 0){
                var card = cc.instantiate(self.smallPokerPrefab);
                self.m_cardsPool.put(card); 
            }
            var node = self.m_cardsPool.get();
            node.active = true;
            self.cardBottomSprite.node.addChild(node);
            self.m_cards.push(node)
            var cardScript = node.getComponent('poker')
            
            var scale = config.yuCardsScale
            cardScript.setPokerScale(scale)
            cardScript.setLogic(ddz_logic)
            cardScript.setAtlas(self.m_pokerAtlas)
            cardScript.setPokerType(2)
            cardScript.setCard(-1)
            cardScript.setValue(value)
            cardScript.setPokerCurrentPosition(cc.v2(config.normalBottomPokerSize.width*scale.x/2 - self.node.width/2,0))
        }
        self.addCardTypeOne(ani,flip)
    },

    addCardTypeOne(ani,flip){
        ani = ani || false
        var self = this
        var space = self.getSpace()
        var startPos = self.getStartPos(space)
        var delay = 0.05
        var duation = 0.2
        var scale = config.yuCardsScale
        for(var i = 0; i < self.m_cards.length; i++){
            var card = self.m_cards[i]
            if(cc.isValid(card)){
                card = card.getComponent('poker')
                card.setPokerNormalPosition({x:startPos.x + i*space,y:startPos.y})
                card.setPokerCurrentPosition({x:self.node.width/2 - config.normalBottomPokerSize.width*scale.x/2,y:startPos.y})
                if(ani){
                    if(i + 1 == self.m_cards.length){
                        card.node.runAction(
                            cc.sequence(
                                cc.delayTime(i*delay),
                                cc.moveTo(duation,startPos.x + i*space,startPos.y),
                                cc.delayTime(0.1),
                                cc.callFunc(self.dealPokerEnd,self,{ani:flip})
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
            self.dealPokerEnd(self,{ani:flip})
        }
    },

    //自己发牌结束
    dealPokerEnd(target,args){
        args = args || {}
        var self = this
        var ani = args.ani || false
        self.showCards(ani)
    },

    showCards(ani){
        ani = ani || false
        var self = this
        if(self.node.active == false){
            return
        }
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
    },

    getStartPos(space){
        var self = this
        var width = self.cardBottomSprite.node.width
        var space = space || config.yuCardsSpace
        var cardOffest = config.yuCardsOffset
        var cardMinOffest = config.yuCardsMinOffset
        var scale = config.yuCardsScale
        var cardsNum = self.m_cards.length
        var pos = cc.v2(0,0)
        if(cardsNum > 0){
            var cardsWidth = (cardsNum - 1)*space + config.normalBottomPokerSize.width*scale.x
            var minx = cardMinOffest.x - width/2
            var x = cardOffest.x - cardsWidth/2
            pos.x = x < minx?(minx + config.normalBottomPokerSize.width*scale.x/2):(x + config.normalBottomPokerSize.width*scale.x/2)
        }
        return pos
    },

    getSpace(){
        var self = this
        var width = self.cardBottomSprite.node.width
        var space = config.yuCardsSpace
        var cardOffest = config.yuCardsOffset
        var cardMinOffest = config.yuCardsMinOffset
        var scale = config.yuCardsScale
        var cardsNum = self.m_cards.length
        var currSpace = space
        if(cardsNum > 0){
            var cardsWidth = (cardsNum - 1)*space + config.normalBottomPokerSize.width*scale.x
            var maxw = width - cardMinOffest.x 
            var w = cardsWidth + cardOffest.x
            if(w > maxw){
                currSpace = (maxw - config.normalBottomPokerSize.width*scale.x)/((cardsNum - 1) == 0?1:(cardsNum - 1))
            }
        }
        return currSpace
    },

    hide(){
        var self = this
        self.node.active = false
    },

    clear(){
        var self = this
        self.m_cardsPool.clear();
        self.m_cards.splice(0,self.m_cards.length)
        if(cc.isValid(self.node)){
            self.node.removeAllChildren()
        }
    },

    onDestroy(){
        var self = this
        self.clear()
    },
});

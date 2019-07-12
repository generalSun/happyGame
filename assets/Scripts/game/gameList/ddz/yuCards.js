var config = require('./config')
var Constants = require('./../../../config/Constants')
var ddz_logic = require('./ddz_logic')
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        var self = this
        self.m_cards = new Array()
        self.m_pokerAtlas = null
    },

    init(atlas){
        var self = this
        self.m_pokerAtlas = atlas
    },

    addCards(info,ani){
        ani = ani || false
        info = info || []
        var self = this
        var ps = new Array()
        for(var i = 0; i < info.length; i++){
            var p = G.tools.loadResPromise('prefabs/smallPoker', cc.Prefab,info[i])
            ps.push(p)
        }
        Promise.all(ps).then(function(args){
            for(var i = 0; i < args.length; i++){
                var arg = args[i]
                var prefab = arg.resource
                var value = arg.parameter
                var node = cc.instantiate(prefab);
                node.active = true;
                self.node.addChild(node);
                var cardScript = node.getComponent('poker')
                self.m_cards.push(cardScript)
                var scale = config.yuCardsScale
                cardScript.setPokerScale(scale)
                cardScript.setLogic(ddz_logic)
                cardScript.setAtlas(self.m_pokerAtlas)
                cardScript.setPokerType(2)
                cardScript.setCard(0)
                cardScript.setValue(value)
                cardScript.setPokerCurrentPosition(cc.v2(config.normalBottomPokerSize.width*scale.x/2 - self.node.width/2,0))
            }
            self.addCardTypeOne(ani)
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
        var scale = config.yuCardsScale
        for(var i = 0; i < self.m_cards.length; i++){
            var card = self.m_cards[i]
            if(cc.isValid(card)){
                card.setPokerNormalPosition({x:startPos.x + i*space,y:startPos.y})
                card.setPokerCurrentPosition({x:self.node.width/2 - config.normalBottomPokerSize.width*scale.x/2,y:startPos.y})
                if(ani){
                    card.node.runAction(
                        cc.sequence(
                            cc.delayTime(i*delay),
                            cc.moveTo(duation,startPos.x + i*space,startPos.y)
                        )
                    )
                }else{
                    card.setPokerCurrentPosition(startPos.x + i*space)
                }
            }
        }
    },

    showCards(ani){
        ani = ani || false
        var self = this
        for(var i = 0; i < self.m_cards.length; i++){
            var poker = self.m_cards[i]
            if(cc.isValid(poker)){
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
        var width = self.node.width
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
        var width = self.node.width
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

    clear(){
        var self = this
        for(var i = self.m_cards.length - 1; i >= 0; i--){
            var poker = self.m_cards[i]
            if(cc.isValid(poker) && poker.clear){
                poker.clear()
            }
            self.m_cards.splice(i,1);
        }
        self.node.removeAllChildren()
    },

    onDestroy(){
        var self = this
        for(var i = self.m_cards.length - 1; i >= 0; i--){
            var poker = self.m_cards[i]
            if(cc.isValid(poker) && poker.clear){
                poker.clear()
            }
            self.m_cards.splice(i,1);
        }
        self.node.removeAllChildren()
    },
});

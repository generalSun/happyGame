var config = require('./config')
var Constants = require('./../../../config/Constants')
var ddz_logic = require('./ddz_logic')
var TAG = 'disCard.js'
cc.Class({
    ctor(){
        var self = this
        self.m_chair = 0
        self.m_cardNode = null
        self.m_object = null
        self.m_pokerAtlas = null
        self.m_cards = new Array()
        self.m_cardsPool = new cc.NodePool()
        self.m_effects = new Array()
        self.m_cardPrefab = null
    },

    initWidget(disCardNode,chair,atlas,cardPrefab,object){
        var self = this
        self.m_cardPrefab = cardPrefab
        self.m_chair = chair
        self.m_cardNode = disCardNode
        self.m_pokerAtlas = atlas
        self.m_object = object
        var disNodeSize = config.disNodeSize[self.m_chair]
        self.m_cardNode.width = disNodeSize.width
        self.m_cardNode.height = disNodeSize.height
        var nodeOffest = config.disNodeOffset[self.m_chair]
        if(self.m_chair == config.chair.home){
            self.m_cardNode.x = nodeOffest.x + (-1 * self.m_object.node.x)
        }else if(self.m_chair == config.chair.nextDoor){
            self.m_cardNode.x = -1 * (nodeOffest.x + self.m_cardNode.width/2)
        }else if(self.m_chair == config.chair.rightHome){
            self.m_cardNode.x = nodeOffest.x + self.m_cardNode.width/2
        }else if(self.m_chair == config.chair.upperHouse){
            self.m_cardNode.x = nodeOffest.x + self.m_cardNode.width/2
        }
        self.m_cardNode.y = nodeOffest.y
    },

    showEffect(name){
        console.log(TAG,'showEffect',name)
        var self = this
        if(!self.m_cardNode.active){
            self.m_cardNode.active = true
        }
        var path = 'image/ddzEffects/'+ name
        cc.loader.loadRes(path, cc.SpriteFrame, (err, spriteFrame) => {
            if (err) {
                throw(err)
            } else {
                var effect = new cc.Node()
                var effectSprite = effect.addComponent(cc.Sprite);
                effectSprite.spriteFrame = spriteFrame
                self.m_cardNode.addChild(effect);
                self.m_effects.push(effect)
            }
        })
    },

    showCards(info,ani){
        var self = this
        info = info || []
        if(info.length <= 0){
            self.showEffect('pass'+Math.floor(Math.random()*4+1))
            return
        }
        if(!self.m_cardNode.active){
            self.m_cardNode.active = true
        }
        console.log(TAG,'showCards',info)
        var handNode = self.m_object.getHandCardNode().getNode()
        for(var i = 0; i < info.length; i++){
            var value = info[i].value
            if(self.m_cardsPool.size() <= 0){
                var card = cc.instantiate(self.m_cardPrefab);
                self.m_cardsPool.put(card); 
            }
            var node = self.m_cardsPool.get();
            node.active = true;
            self.m_cardNode.addChild(node);
            self.m_cards.push(node)
            var cardScript = node.getComponent('poker')
            
            var scale = config.disCardScale[self.m_chair]
            cardScript.setPokerScale(scale)
            cardScript.setAtlas(self.m_pokerAtlas)
            cardScript.setLogic(ddz_logic)
            cardScript.setPokerType(1)
            cardScript.setCard(value)
            var pos = info[i].pos
            if(!pos){
                if(self.m_chair == config.chair.home){
                    pos = cc.v2(self.m_cardNode.width/2 - config.normalDisPokerSize[self.m_chair].width*scale.x/2,
                            -1 * self.m_cardNode.height/2 + config.normalDisPokerSize[self.m_chair].height*scale.y/2)
                }else if(self.m_chair == config.chair.nextDoor){
                    pos = cc.v2(config.normalDisPokerSize[self.m_chair].width*scale.x/2 - self.m_cardNode.width/2,0)
                }else{
                    pos = cc.v2(self.m_cardNode.width/2 - config.normalDisPokerSize[self.m_chair].width*scale.x/2,0)
                }
            }else{
                var worldPos = handNode.convertToWorldSpace(pos)
                pos = self.m_cardNode.convertToNodeSpace(worldPos)
            }
            cardScript.setPokerCurrentPosition(pos)
        }
        if(self.m_chair == config.chair.home){
            self.addCardTypeOne(ani)
        }else{
            self.addCardTypeTwo(ani)
        }
    },

    addCardTypeOne(ani){
        ani = ani || false
        var self = this
        var space = self.getSpace()
        var startPos = self.getStartPos(space)
        var delay = 0.05
        var duation = 0.1
        var scale = config.disCardScale[self.m_chair]
        for(var i = 0; i < self.m_cards.length; i++){
            var card = self.m_cards[i]
            if(cc.isValid(card)){
                card = card.getComponent('poker')
                card.setPokerNormalPosition({x:startPos.x + i*space,y:startPos.y})
                if(ani){
                    card.node.runAction(
                        cc.sequence(
                            cc.delayTime(i*delay),
                            cc.moveTo(duation,startPos.x + i*space,startPos.y)
                        )
                    )
                }else{
                    card.setPokerCurrentPosition({x:startPos.x + i*space,y:startPos.y})
                }
            }
        }
    },

    addCardTypeTwo(ani){
        ani = ani || false
        var self = this
        var space = self.getSpace()
        var startPos = self.getStartPos(space)
        var delay = 0.05
        var duation = 0.1
        var scale = config.disCardScale[self.m_chair]
        var call = function(target,data){
            var numInfo = self.m_object.getCardNum()
            self.m_object.setCardNumSprite(true,numInfo.describle - 1)
        }
        for(var i = 0; i < self.m_cards.length; i++){
            var card = self.m_cards[i]
            if(cc.isValid(card)){
                card = card.getComponent('poker')
                card.setPokerNormalPosition({x:startPos.x + i*space,y:startPos.y})
                if(ani){
                    card.node.runAction(
                        cc.sequence(
                            cc.delayTime(i*delay),
                            cc.moveTo(duation,startPos.x + i*space,startPos.y),
                            cc.callFunc(call,card.node)
                        )
                    )
                }else{
                    card.setPokerCurrentPosition({x:startPos.x + i*space,y:startPos.y})
                    call(card.node)
                }
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
        var pos = cc.v2(0,0)
        if(cardsNum > 0){
            var cardsWidth = (cardsNum - 1)*space + config.normalDisPokerSize[self.m_chair].width*scale.x
            var minx = cardMinOffest.x - width/2
            var x = cardOffest.x - cardsWidth/2
            pos.x = x < minx?(minx + config.normalDisPokerSize[self.m_chair].width*scale.x/2):(x + config.normalDisPokerSize[self.m_chair].width*scale.x/2)
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
            var cardsWidth = (cardsNum - 1)*space + config.normalDisPokerSize[self.m_chair].width*scale.x
            var maxw = width - cardMinOffest.x 
            var w = cardsWidth + cardOffest.x
            if(w > maxw){
                currSpace = (maxw - config.normalDisPokerSize[self.m_chair].width*scale.x)/((cardsNum - 1) == 0?1:(cardsNum - 1))
            }
        }
        return currSpace
    },

    hideCards(){
        var self = this
        for(var i = 0; i < self.m_cards.length; i++){
            var item = self.m_cards[i]
            self.m_cardsPool.put(item)
            self.m_cardNode.removeChild(item)
        }
        self.m_cards.splice(0,self.m_cards.length)
    },

    hideEffects(){
        var self = this
        for(var i = 0; i < self.m_effects.length; i++){
            var item = self.m_effects[i]
            self.m_cardNode.removeChild(item)
        }
        self.m_effects.splice(0,self.m_effects.length)
    },

    hide(){
        var self = this
        self.m_cardNode.active = false
        self.hideCards()
        self.hideEffects()
    },

    clear(){
        var self = this
        self.m_cardsPool.clear();
        self.m_cards.splice(0,self.m_cards.length)
        self.m_effects.splice(0,self.m_effects.length)
        if(cc.isValid(self.m_cardNode)){
            self.m_cardNode.removeAllChildren()
        }
    },

    onDestroy(){
        var self = this
        self.clear()
    }
})
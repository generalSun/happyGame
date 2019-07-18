var config = require('./config')
var Constants = require('./../../../config/Constants')
var ddz_logic = require('./ddz_logic')
var touch = class{
    constructor(cardNode,bindObject){
        var self = this
        self.m_bindObject = bindObject
        self.m_cardNode = cardNode
        self.m_touchCardsInfo = new Array()
        self.m_touchBeginIndex = null
        self.m_canTouch = false
        self.m_cardNode.on(cc.Node.EventType.TOUCH_START,self.touchBegin,self);
 
        self.m_cardNode.on(cc.Node.EventType.TOUCH_MOVE,self.touchMove,self);

        self.m_cardNode.on(cc.Node.EventType.TOUCH_END,self.touchEnd,self);

        self.m_cardNode.on(cc.Node.EventType.TOUCH_CANCEL,self.touchCanael,self);
    }

    canTouched(flag){
        var self = this
        self.m_canTouch = flag
    }

    getSelectedServerCards(){
        var self = this
        var selectedCards = new Array()
        for(var i = 0; i < self.m_touchCardsInfo.length; i++){
            var cardInfo = self.m_touchCardsInfo[i]
            var card = cardInfo.card
            var value = card.getValue()
            selectedCards.push(ddz_logic.restoreServerPoker(value))
        }
        return selectedCards
    }

    getSelectedClientCards(){
        var self = this
        var selectedCards = new Array()
        for(var i = 0; i < self.m_touchCardsInfo.length; i++){
            var cardInfo = self.m_touchCardsInfo[i]
            var card = cardInfo.card
            var value = card.getValue()
            selectedCards.push(value)
        }
        return selectedCards
    }

    touchBegin(event){
        cc.log("TOUCH_START event=", event.type);
        var self = this
        if(!self.m_canTouch){
            return;
        }
        var cardInfo = self.updateCardInfoInTouch(event)
        if(cardInfo){
            self.m_touchBeginIndex = cardInfo.index
        }
        self.updateCardsInfoInTouch(event,cardInfo)
        self.updateCardsColorInTouch(event,cardInfo)
    }

    touchMove(event){
        cc.log("TOUCH_MOVE event=", event.type);
        var self = this
        var cardInfo = self.updateCardInfoInTouch(event)
        self.updateCardsInfoInTouch(event,cardInfo)
        self.updateCardsColorInTouch(event,cardInfo)
    }

    touchEnd(event){
        cc.log("TOUCH_END event=", event.type);
        var self = this
        var cardInfo = self.updateCardInfoInTouch(event)
        self.updateCardsInfoInTouch(event,cardInfo)
        self.updateCardsColorInTouch(event,cardInfo)
        self.updateCardsPosInTouch()
        self.updateTouchCardsInfo(event)
        self.m_touchBeginIndex = null
    }

    touchCanael(event){
        cc.log("TOUCH_CANCEL event=", event.type);
        var self = this
        self.updateCardsInfoInTouch(event)
        self.updateCardsColorInTouch(event)
        self.updateCardsPosInTouch()
        self.updateTouchCardsInfo(event)
        self.m_touchBeginIndex = null
    }
    
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
    }

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
                    if(self.m_touchBeginIndex != null && !G.tools.isInBothNumber(currentIndex,index,self.m_touchBeginIndex)){
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
                var info = self.m_touchCardsInfo[i]
                var card = info.card
                var status = card.getStatus()
                if(self.m_touchBeginIndex != null && cardInfo){
                    if(status == Constants.CARD_STATUS.STATUS_NORMAL_SELECT){
                        card.setStatus(Constants.CARD_STATUS.STATUS_POP)
                    }else if(status == Constants.CARD_STATUS.STATUS_POP_SELECT){
                        card.setStatus(Constants.CARD_STATUS.STATUS_NORMAL)
                    }
                }else if(self.m_touchBeginIndex == null || !cardInfo){
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
    }

    updateCardsColorInTouch(event,cardInfo){
        var self = this
        if(event.type == 'touchstart' || event.type == 'touchmove'){
            if(cardInfo){
                var index = cardInfo.index
                for(var i = 0; i < self.m_touchCardsInfo.length; i++){
                    var info = self.m_touchCardsInfo[i]
                    var currentIndex = info.index
                    var card = info.card
                    var status = card.getStatus()
                    if(G.tools.isInBothNumber(currentIndex,index,self.m_touchBeginIndex) && (status == Constants.CARD_STATUS.STATUS_NORMAL_SELECT || 
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
    }

    updateCardsPosInTouch(){
        var self = this
        for(var i = 0; i < self.m_touchCardsInfo.length; i++){
            var info = self.m_touchCardsInfo[i]
            var card = info.card
            var status = card.getStatus()
            if(status == Constants.CARD_STATUS.STATUS_POP){
                card.node.y = card.getPokerNormalPosition().y + config.cardPopHeight
            } else{
                card.node.y = card.getPokerNormalPosition().y
            }
        }
    }

    updateCardInfoInTouch(event){
        var self = this
        var cardInfo = self.m_bindObject.getTouchedCardInfo(event.getLocation())
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
                    G.audioManager.playSFX('ui_click.mp3')
                }else if(status == Constants.CARD_STATUS.STATUS_POP){
                    card.setStatus(Constants.CARD_STATUS.STATUS_POP_SELECT)
                    G.audioManager.playSFX('ui_click.mp3')
                }
            }
            return cardInfo
        }
        return null
    }

    getTouchCardInfoByIndex(index){
        var self = this
        for(var i = 0; i < self.m_touchCardsInfo.length; i++){
            var data = self.m_touchCardsInfo[i]
            if(data.index == index){
                return data
            }
        }
        return null
    }

    clear(){
        var self = this
        self.m_touchBeginIndex = null
        self.m_touchCardsInfo.splice(0,self.m_touchCardsInfo.length-1)
    }

    onDestory(){
        var self = this
        self.m_touchBeginIndex = null
        self.m_cardNode.off(cc.Node.EventType.TOUCH_START,self.touchBegin,self);
 
        self.m_cardNode.off(cc.Node.EventType.TOUCH_MOVE,self.touchMove,self);

        self.m_cardNode.off(cc.Node.EventType.TOUCH_END,self.touchEnd,self);

        self.m_cardNode.off(cc.Node.EventType.TOUCH_CANCEL,self.touchCanael,self);
    }
}

module.exports = touch
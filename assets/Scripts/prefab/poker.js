var Constants = require('./../config/Constants')
var pokerAtlas = {
    back:['big_back','mid_back','small_back'],
    bottom:['big_bottom','mid_bottom','small_bottom'],
    king:['big_king','mid_king','small_king'],
    xiaoWang:['big_xiaoWang','mid_xiaoWang','small_xiaoWang'],
    black:['1','2','3','4','5','6','7','8','9','10','11','12','13'],
    red:['r1','r2','r3','r4','r5','r6','r7','r8','r9','r10','r11','r12','r13'],
    flowerColor:['spade','plumBlossom','heart','block']
}
cc.Class({
    extends: cc.Component,

    properties: {
        backSprite:cc.Sprite,
        back:cc.Sprite,
        signSprite:cc.Sprite,
        kingSprite:cc.Sprite,
        numNode:cc.Node,
        numSprite:[cc.Sprite],
        colorSprite:[cc.Sprite]
    },

    onLoad () {
        var self = this
        self.m_status = Constants.CARD_STATUS.STATUS_NORMAL
        self.m_value = 0
        self.m_pokerAtlas = null
        self.m_noramlPos = cc.v2(0,0)
        self.m_pokerType = 0 //0big 1mid 2small
        self.m_logic = null
        self.backSprite.node.active = false
        self.signSprite.node.active = false
        self.back.node.active = true
        G.eventManager.listenEvent(Constants.FRAMEEVENT.POKERFLIP,self.pokerFilp,self)
    },

    frameEvent(eventName){
        var self = this
        G.eventManager.emitEvent(Constants.FRAMEEVENT[eventName],{})
    },

    pokerFilp(){
        var self = this
        self.setCard()
    },

    setLogic(logic){
        var self = this
        self.m_logic = logic
    },

    setPokerType(type){
        type = type || 0
        var self = this
        self.m_pokerType = type
    },

    getPokerType(){
        var self = this
        return self.m_pokerType
    },

    setPokerScale(scale){
        scale = scale || 1
        var self = this
        if(typeof(pos) == 'number'){
            self.node.scale = scale
        }else{
            self.node.scaleX = scale.x
            self.node.scaleY = scale.y
            if(scale.x === scale.y){
                self.node.scale = scale
            }
        }
    },

    getPokerScale(){
        var self = this
        return self.node.scale
    },

    getPokerScaleX(){
        var self = this
        return self.node.scaleX
    },

    getPokerScaleY(){
        var self = this
        return self.node.scaleY
    },

    setPokerCurrentPosition(pos){
        var self = this
        if(typeof(pos) == 'number'){
            self.node.x = pos
        }else{
            self.node.x = pos.x
            self.node.y = pos.y
        }
    },

    getPokerCurrentPosition(){
        var self = this
        return cc.v2(self.node.x,self.node.y)
    },

    setPokerNormalPosition(pos){
        var self = this
        if(typeof(pos) == 'number'){
            self.m_noramlPos.x = pos
        }else{
            self.m_noramlPos.x = pos.x
            self.m_noramlPos.y = pos.y
        }
    },

    getPokerNormalPosition(){
        var self = this
        return self.m_noramlPos
    },

    setAtlas(pokerAtlas){
        var self = this
        self.m_pokerAtlas = pokerAtlas
    },

    setValue(cbCard){
        var self = this
        self.m_value = cbCard
    },

    getValue(){
        var self = this
        return self.m_value
    },

    setCard(cbCard){
        var self = this
        cbCard = cbCard || self.m_value
        self.m_value = cbCard
        var cardType = G.ioUtil.get(Constants.LOCALLSTORAGEKEY.CARDTYPE) || 1
        var atlas = self.m_pokerAtlas[0]
        if(!cbCard || cbCard <= 0 || cbCard >= 80){
            self.backSprite.node.active = false
            self.back.node.active = true 
            var backFrame = atlas.getSpriteFrame(pokerAtlas.back[self.m_pokerType]);
            self.back.spriteFrame = backFrame;
        }else {
            self.backSprite.node.active = true
            self.back.node.active = false
            self.kingSprite.node.active = false 
            self.numNode.active = false
            var backFrame = atlas.getSpriteFrame(pokerAtlas.bottom[self.m_pokerType]);
            self.backSprite.spriteFrame = backFrame;
            var kingFrame = null
            var numFrame = null
            var colorFrame = null
            if(cbCard == 65){//小王
                kingFrame = atlas.getSpriteFrame(pokerAtlas.xiaoWang[self.m_pokerType]);
            }else if(cbCard == 66){//大王
                kingFrame = atlas.getSpriteFrame(pokerAtlas.king[self.m_pokerType]);
            }else{
                var color = self.m_logic.getcardcolor(cbCard)
                var value = self.m_logic.getcardvalue(cbCard)
                colorFrame = atlas.getSpriteFrame(pokerAtlas.flowerColor[color]);
                if(color == 2 || color == 3){
                    numFrame = atlas.getSpriteFrame(pokerAtlas.red[value-1]);
                }else{
                    numFrame = atlas.getSpriteFrame(pokerAtlas.black[value-1]);
                }
            }
            if(kingFrame){
                self.kingSprite.spriteFrame = kingFrame;
                self.kingSprite.node.active = true 
            }
            if(numFrame && colorFrame){
                self.numNode.active = true
                for(var i = 0; i < self.numSprite.length; i++){
                    var card = self.numSprite[i]
                    var color = self.colorSprite[i]
                    card.spriteFrame = numFrame;
                    color.spriteFrame = colorFrame;
                }
            }
        }
    },

    isClicked(pos){
        var self = this
        if (self.node.getBoundingBoxToWorld().contains(pos)) {
            return true
        }
        return false
    },

    setStatus(status){
        var self = this
        self.m_status = status
    },

    getStatus(){
        var self = this
        return self.m_status
    },

    setColor(color){
        var self = this
        self.backSprite.node.color = color
    },

    getAnimationComponent(){
        var self = this
        return self.node.getComponent('animationOperate')
    },

    setAnimationState(name){
        var self = this
        var animationComponent = self.getAnimationComponent()
        animationComponent.setAnimationState(name)
    },

    playAnimationFilp () {
        var self = this
        var animationComponent = self.getAnimationComponent()
        animationComponent.playAnim()
    },

    speedUpAnimation (speed) {
        var self = this
        var animationComponent = self.getAnimationComponent()
        animationComponent.getAnimationState().speed = speed
    },

    setAnimationWrapMode(wrapMode,repeatCount) {//cc.WrapMode.Normal  cc.WrapMode.Loop
        var self = this
        var animationComponent = self.getAnimationComponent()
        animationComponent.getAnimationState().wrapMode = wrapMode
        if(wrapMode == cc.WrapMode.Loop){
            animationComponent.getAnimationState().repeatCount  = repeatCount//Infinity 循环次数为无限次
        }
    },

    setAnimationCurveData(name,args) {
        var self = this
        var animationComponent = self.getAnimationComponent()
        animationComponent.setAnimationCurveData(name,args)
    },

    clear(){
        var self = this
        self.node.getComponent('animationOperate').stopAnim()
    },

    onDestroy(){
        var self = this
        self.node.getComponent('animationOperate').stopAnim()
        G.eventManager.cancelEvent(Constants.FRAMEEVENT.POKERFLIP,self.pokerFilp,self)
    }
})
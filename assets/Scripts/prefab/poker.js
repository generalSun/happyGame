var Constants = require('./../config/Constants')
cc.Class({
    extends: cc.Component,

    properties: {
        cardSprite:cc.Sprite,
        signSprite:cc.Sprite
    },

    onLoad () {
        var self = this
        self.m_status = Constants.CARD_STATUS.STATUS_NORMAL
        self.m_value = 0
        self.m_pokerAtlas = null
        self.m_noramlPos = cc.v2(0,0)
        self.signSprite.node.active = false
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

    pokerFilpEnd(){

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
        var cardTyp = G.ioUtil.get(Constants.LOCALLSTORAGEKEY.CARDTYPE) || 1
        var atlas = self.m_pokerAtlas[cardTyp]
        var path = null
        if(!cbCard || cbCard <= 0 || cbCard >= 80){
            path = 'ddz_cards_{0}-poker_{1}'.format((''+(cardTyp+1)).padStart(2,'0'),0)
        }else {
            path = 'ddz_cards_{0}-poker_{1}'.format((''+(cardTyp+1)).padStart(2,'0'),cbCard)
        }
        var frame = atlas.getSpriteFrame(path);
        self.cardSprite.spriteFrame = frame;
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
        self.cardSprite.node.color = color
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
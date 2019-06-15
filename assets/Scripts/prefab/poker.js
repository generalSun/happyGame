var Constants = require('./../config/Constants')
cc.Class({
    extends: cc.Component,

    properties: {
        cardSprite:cc.Sprite,
        signSprite:cc.Sprite,
    },

    onLoad () {
        var self = this
        self.m_status = Constants.CARD_STATUS.STATUS_NORMAL
        self.m_value = 0
        self.m_pokerAtlas = null
        self.m_noramlPos = cc.Vec2(0,0)
        self.signSprite.node.active = false
    },

    setPokerPos(pos){
        var self = this
        self.m_noramlPos = pos
    },

    getPokerPos(){
        var self = this
        return self.m_noramlPos
    },

    setAtlas(pokerAtlas){
        var self = this
        self.m_pokerAtlas = pokerAtlas
    },

    setCard(cbCard){
        var self = this
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
    }
})
cc.Class({
    extends: cc.Component,

    properties: {
        seatNode:cc.Node,
        seatSprite:cc.Sprite,
        headSprite:cc.Sprite,
        offLineSprite:cc.Sprite,
        jiabeiSprite:cc.Sprite,
        resultSprite:cc.Sprite,
        signSprite:cc.Sprite,
        baodanSprite:cc.Sprite,
        readySprite:cc.Sprite,
        ownerSprite:cc.Sprite,
        clock:cc.Sprite,
        cardNumSprite:cc.Sprite,
        goldDescrible:cc.Label,
        handCardNode:cc.Node,
        disCardNode:cc.Node,
    },

    onLoad () {
        var self = this
        self.m_chair = 0
        self.m_config = null
        self.seatUp()
    },

    onDestroy(){
        var self = this
        var handInstance = self.getHandCardNode()
        if(handInstance && handInstance.onDestroy){
            handInstance.onDestroy()
        }
        var disInstance = self.getDisCardNode()
        if(disInstance && disInstance.onDestroy){
            disInstance.onDestroy()
        }
        self.unscheduleAllCallbacks()
    },

    setChair (chair) {
        var self = this
        self.m_chair = chair
    },

    getChair () {
        var self = this
        return self.m_chair
    },

    seatUp () {
        var self = this
        self.seatNode.active = false
        self.seatSprite.node.active = true
    },

    seatDown (args) {
        args = args || {}
        var self = this
        self.seatNode.active = true
        self.seatSprite.node.active = false
        self.m_config = args.config
        self.node.zIndex = self.m_config.sceneZOrder.player[self.m_chair]
        self.init(args)
    },

    init (args) {
        var self = this
        self.setHeadSprite(true,args.headUrl)
        self.setOffLineSprite(false)
        self.setResultSprite(false)
        self.setSignSprite(false)
        self.setBaodanSprite(false)
        self.setReadySprite(true)
        self.setOwnerSprite(args.isOwner)
        self.setClock(false,30)
        self.setGoldDescrible(true,args.gold)
        self.setCardNumSprite(false,16)
        self.setJiabeiSprite(false)
        if(self.m_chair == 1){
            self.signSprite.node.x = -1*self.signSprite.node.x;
            self.baodanSprite.node.x = -1*self.baodanSprite.node.x;
            self.readySprite.node.x = -1*self.readySprite.node.x;
            self.ownerSprite.node.x = -1*self.ownerSprite.node.x;
            self.clock.node.x = -1*self.clock.node.x;
            self.cardNumSprite.node.x = -1*self.cardNumSprite.node.x;
        }
    },

    isSeat () {
        var self = this
        return self.seatNode && self.seatNode.active && !self.seatSprite.node.active
    },

    setHeadSprite (visible,url) {
        var self = this
        if(!self.isSeat())return;
        visible = visible || false
        self.headSprite.node.active = visible
    },

    getHeadSprite () {
        var self = this
        if(!self.isSeat())return;
        return self.headSprite
    },

    setOffLineSprite (visible) {
        var self = this
        if(!self.isSeat())return;
        visible = visible || false
        self.offLineSprite.node.active = visible
    },

    isOnLine() {
        var self = this
        if(!self.isSeat())return false;
        return !self.offLineSprite.node.active
    },

    setJiabeiSprite (visible) {
        var self = this
        if(!self.isSeat())return;
        visible = visible || false
        self.jiabeiSprite.node.active = visible
    },

    isJiabei () {
        var self = thiss
        if(!self.isSeat())return false;
        return self.jiabeiSprite.node.active
    },

    setResultSprite (visible,win) {
        var self = this
        if(!self.isSeat())return;
        visible = visible || false
        self.resultSprite.node.active = visible
        if(!visible)return;
        if(!self.resultSprite.result || (self.resultSprite.result && self.resultSprite.result != win)){
            var imgPath = 'image/playerRes01'
            cc.loader.loadRes(imgPath, cc.SpriteAtlas, function (err, atlas) {
                if(err){
                    cc.log(err.message || err);
                    return;
                }
                if(!cc.isValid(self.resultSprite))return;
                var frame = atlas.getSpriteFrame(win);
                var sprite = self.resultSprite.node.getComponent(cc.Sprite)
                if(sprite){
                    sprite.spriteFrame = frame;
                }
            });
        }
        self.resultSprite.result = win
    },

    isWin () {
        var self = this
        if(!self.isSeat())return false;
        return self.resultSprite.node.active && self.resultSprite.result
    },

    setSignSprite (visible) {
        var self = this
        if(!self.isSeat())return;
        visible = visible || false
        self.signSprite.node.active = visible
    },

    isLandlord () {
        var self = this
        if(!self.isSeat())return false;
        return self.signSprite.node.active
    },

    setBaodanSprite (visible) {
        var self = this
        if(!self.isSeat())return;
        visible = visible || false
        self.baodanSprite.node.active = visible
    },

    isBaodan () {
        var self = this
        if(!self.isSeat())return false;
        return self.baodanSprite.node.active
    },

    setReadySprite (visible) {
        var self = this
        if(!self.isSeat())return;
        visible = visible || false
        self.readySprite.node.active = visible
    },

    isReady () {
        var self = this
        if(!self.isSeat())return false;
        return self.readySprite.node.active
    },

    setOwnerSprite (visible) {
        var self = this
        if(!self.isSeat())return;
        visible = visible || false
        self.ownerSprite.node.active = visible
    },

    isOwner () {
        var self = this
        if(!self.isSeat())return false;
        return self.ownerSprite.node.active
    },

    setClock (visible,num) {
        var self = this
        if(!self.isSeat())return;
        visible = visible || false
        self.clock.node.active = visible
        if(!visible){

            return;
        }
        var describle = self.clock.node.getChildByName('describle')
        if(!describle)return;
        var label = describle.getComponent(cc.Label)
        if(label){
            label.string = num
        }
        self.schedule(function(){
            if(cc.isValid(label)){
                label.string = label.string - 1
                if(label.string <= 3){

                }
            }
        }, 1)
    },

    getClock () {
        var self = this
        if(!self.isSeat())return;
        var describle = self.clock.node.getChildByName('describle')
        if(!describle)return;
        var label = describle.getComponent(cc.Label)
        if(label){
            return {object:self.clock,describle:label.string}
        }
    },

    setCardNumSprite (visible,num) {
        var self = this
        if(!self.isSeat())return;
        visible = visible || false
        self.cardNumSprite.node.active = visible
        if(!num)return;
        var describle = self.cardNumSprite.node.getChildByName('describle')
        if(!describle)return;
        var label = describle.getComponent(cc.Label)
        if(label){
            label.string = num
        }
    },

    getCardNum () {
        var self = this
        if(!self.isSeat())return;
        var describle = self.cardNumSprite.node.getChildByName('describle')
        if(!describle)return;
        var label = describle.getComponent(cc.Label)
        if(label){
            return {object:self.cardNumSprite,describle:label.string}
        }
    },

    setGoldDescrible (visible,num) {
        var self = this
        if(!self.isSeat())return;
        visible = visible || false
        self.goldDescrible.node.active = visible
        if(!visible)return;
        var label = self.goldDescrible.node.getComponent(cc.Label)
        if(label){
            label.string = num
        }
    },

    getGold () {
        var self = this
        if(!self.isSeat())return false;
        var label = self.goldDescrible.node.getComponent(cc.Label)
        if(label){
            return label.string
        }
    },

    setHandCardNode (visible,instance,atlas) {
        var self = this
        if(!self.isSeat())return;
        visible = visible || false
        self.handCardNode.active = visible
        if(!instance)return;
        if(instance.initWidget){
            instance.initWidget(self.handCardNode,self.m_chair,atlas,self)
        }
        self.handCardNode.bindInstance = instance
    },

    getHandCardNode () {
        var self = this
        if(!self.isSeat())return false;
        return self.handCardNode.bindInstance
    },

    setDisCardNode (visible,instance,atlas) {
        var self = this
        if(!self.isSeat())return;
        visible = visible || false
        self.disCardNode.active = visible
        if(!instance)return;
        if(instance.initWidget){
            instance.initWidget(self.disCardNode,self.m_chair,atlas,self)
        }
        self.disCardNode.bindInstance = instance
    },

    getDisCardNode () {
        var self = this
        if(!self.isSeat())return false;
        return self.disCardNode.bindInstance
    },
})
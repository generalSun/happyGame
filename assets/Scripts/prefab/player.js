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
        operateNode:cc.Node,
    },

    onLoad () {
        var self = this
        self.m_chair = 0
        self.m_nickname = null
        self.m_config = null
        self.m_ip = null
        self.m_userId = null
        self.m_playerEventScript = self.node.getComponent('playerEvent')
        self.seatUp()
    },

    isSelf(){
        var self = this
        var userId = G.selfUserData.getUserId()
        if(self.m_userId == userId){
            return true
        }
        return false
    },

    setUserId(id){
        var self = this
        self.m_userId = id
    },

    getUserId(){
        var self = this
        return self.m_userId
    },

    setIP(ip){
        var self = this
        self.m_ip = ip
    },

    getIP(){
        var self = this
        return self.m_ip
    },

    setNickName(name){
        var self = this
        self.m_nickname = name
    },

    getNickName(){
        var self = this
        return self.m_nickname
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
        self.setOffLineSprite(args.isOffLine)
        self.setResultSprite(false)
        self.setSignSprite(false)
        self.setBaodanSprite(false)
        self.setReadySprite(args.isReady)
        self.setOwnerSprite(args.isOwner)
        self.setClock(false,30)
        self.setGoldDescrible(true,args.gold)
        self.setCardNumSprite(false,16)
        self.setJiabeiSprite(false)
        self.setOperateNode(false)
        self.setNickName(args.name)
        self.setIP(args.ip)
        self.setUserId(args.userId)
        self.m_playerEventScript.setChair(self.m_chair)
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
        if(!cc.isValid(self) || !cc.isValid(self.seatNode) || !cc.isValid(self.seatSprite)){
            return false
        }
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

    setSignSprite (visible) {//地主
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

    setOwnerSprite (visible) {//房主
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
            if(self.clock.scheduleId){
                clearInterval(self.clock.scheduleId);
                self.clock.scheduleId = null
            }
            return;
        }
        var describle = self.clock.node.getChildByName('describle')
        if(!describle)return;
        var label = describle.getComponent(cc.Label)
        if(label){
            label.string = num
        }
        self.clock.scheduleId = setInterval(function(){
            if(cc.isValid(label)){
                label.string = label.string - 1
                if(label.string <= 3){
                    self.clock.node.runAction(cc.blink(1,3))
                }
                if(label.string <= 0){
                    clearInterval(self.clock.scheduleId);
                    self.clock.scheduleId = null
                    self.clock.node.active = false
                }
            }
        }, 1000)
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
            instance.initWidget(self.handCardNode,self.m_chair,atlas,self.m_playerEventScript,self)
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

    setOperateNode(visible){
        var self = this
        if(!self.isSeat())return;
        visible = visible || false
        self.operateNode.active = visible
    },

    getOperateNode(){
        var self = this
        if(!self.isSeat())return;
        return self.operateNode
    }
})
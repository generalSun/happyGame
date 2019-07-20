var TAG = 'player.js'
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
        self.m_city = null
        self.m_province = null
        self.m_userId = null
        self.m_diamonds = 0
        self.m_experience = 0
        self.m_fans = 0
        self.m_follows = 0
        self.m_goldcoins = 0
        self.m_roomCards = 0//房卡数量
        self.m_opendeal = false
        self.m_isOperater = false
        self.m_serverIndex = 0
        self.m_sex = 0
        self.m_playerEventScript = self.node.getComponent('playerEvent')
        self.seatUp()
    },

    setSex(sex){
        var self = this
        self.m_sex = sex
    },

    getSex(){
        var self = this
        return self.m_sex
    },

    setServerIndex(index){
        var self = this
        self.m_serverIndex = index
    },

    getServerIndex(){
        var self = this
        return self.m_serverIndex
    },

    setOpendeal(opendeal){
        var self = this
        self.m_opendeal = opendeal
    },

    getOpendeal(){
        var self = this
        return self.m_opendeal
    },

    setRoomCards(cards){
        var self = this
        self.m_roomCards = cards
    },

    getRoomCards(){
        var self = this
        return self.m_roomCards
    },

    setGoldCoins(coins){
        var self = this
        self.m_goldcoins = coins
    },

    getGoldCoins(){
        var self = this
        return self.m_goldcoins
    },

    setFollows(follows){
        var self = this
        self.m_follows = follows
    },

    getFollows(){
        var self = this
        return self.m_follows
    },

    setFans(fans){
        var self = this
        self.m_fans = fans
    },

    getFans(){
        var self = this
        return self.m_fans
    },

    setExperience(experience){
        var self = this
        self.m_experience = experience
    },

    getExperience(){
        var self = this
        return self.m_experience
    },

    setDiamonds(diamonds){
        var self = this
        self.m_diamonds = diamonds
    },

    getDiamonds(){
        var self = this
        return self.m_diamonds
    },

    setIsOperater(isOperate){
        var self = this
        self.m_isOperater = isOperate
    },

    isOperater(){
        var self = this
        return self.m_isOperater
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

    setCity(ip){
        var self = this
        self.m_city = ip
    },

    getCity(){
        var self = this
        return self.m_city
    },

    setProvince(ip){
        var self = this
        self.m_province = ip
    },

    getProvince(){
        var self = this
        return self.m_province
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

    seatDown () {
        var self = this
        self.seatNode.active = true
        self.seatSprite.node.active = false
    },

    init (args) {
        var self = this
        self.m_config = args.config
        self.node.zIndex = self.m_config.sceneZOrder.player[self.m_chair]

        self.setDiamonds(args.diamonds)
        self.setExperience(args.experience)
        self.setFans(args.fans)
        self.setFollows(args.follows)
        self.setGoldCoins(args.goldcoins)
        self.setRoomCards(args.roomCards)
        self.setOpendeal(args.opendeal)
        self.setServerIndex(args.playerindex)


        self.setHeadSprite(true,args.headimg)
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
        self.setCity(args.city)
        self.setProvince(args.province)
        self.setUserId(args.userId)
        self.setIsOperater(false)
        self.setSex(args.sex)
        self.m_playerEventScript.setChair(self.m_chair)
        self.m_playerEventScript.setConfig(self.m_config)
        if(self.m_chair == self.m_config.chair.nextDoor){
            self.signSprite.node.x = -1*self.signSprite.node.x;
            self.baodanSprite.node.x = -1*self.baodanSprite.node.x;
            self.readySprite.node.x = -1*self.readySprite.node.x;
            self.ownerSprite.node.x = -1*self.ownerSprite.node.x;
            self.clock.node.x = -1*self.clock.node.x;
            self.cardNumSprite.node.x = -1*self.cardNumSprite.node.x;
        }else if(self.m_chair == self.m_config.chair.home){
            self.clock.node.y = 150
        }
    },

    updateSeat(args){
        args = args || {}
        var self = this
        self.setDiamonds(args.diamonds)
        self.setExperience(args.experience)
        self.setFans(args.fans)
        self.setFollows(args.follows)
        self.setGoldCoins(args.goldcoins)
        self.setRoomCards(args.roomCards)
        self.setOpendeal(args.opendeal)

        self.setHeadSprite(true,args.headimg)
        self.setOffLineSprite(args.isOffLine)
        self.setReadySprite(args.isReady)
        self.setOwnerSprite(args.isOwner)
        self.setGoldDescrible(true,args.gold)
        self.setNickName(args.name)
        self.setCity(args.city)
        self.setProvince(args.province)
        self.setUserId(args.userId)
        self.setServerIndex(args.playerindex)
        self.setSex(args.sex)
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
        var self = this
        if(!self.isSeat())return false;
        return self.jiabeiSprite.node.active
    },

    setResultSprite (visible,win) {
        var self = this
        if(!self.isSeat())return;
        visible = visible || false
        self.resultSprite.node.active = visible
        if(!visible)return;
        win = win || false
        if(self.resultSprite.result == null || self.resultSprite.result != win){
            var imgPath = 'image/playerRes'
            cc.loader.loadRes(imgPath, cc.SpriteAtlas, function (err, atlas) {
                if(err){
                    cc.log(err.message || err);
                    return;
                }
                if(!cc.isValid(self.resultSprite))return;
                var frame = atlas.getSpriteFrame((win == true)?'win':'lose');
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

    setClock (visible,num,callBack) {
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
        self.clock.node.stopAllActions()
        var describle = self.clock.node.getChildByName('describle')
        if(!cc.isValid(describle))return;
        num = num || 0
        var label = describle.getComponent(cc.Label)
        if(label){
            label.string = num
        }
        var alarm = false
        self.clock.scheduleId = setInterval(function(){
            if(cc.isValid(label)){
                label.string = label.string - 1
                if(label.string <= 3){
                    self.clock.node.runAction(cc.blink(1,2))
                    if(!alarm){
                        G.audioManager.playSFX('timeup_alarm.mp3')
                        alarm = true
                    }
                }
                if(label.string <= 0){
                    clearInterval(self.clock.scheduleId);
                    self.clock.scheduleId = null
                    self.clock.node.active = false
                    if(callBack){
                        callBack()
                    }
                }
            }else{
                clearInterval(self.clock.scheduleId);
                self.clock.scheduleId = null
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
        if(num == null)return;
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
        num = num || 0
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

    getPlayerEvent () {
        var self = this
        if(!self.isSeat())return false;
        return self.m_playerEventScript
    },

    setHandCardNode (visible,instance,atlas,pokerPrefab) {
        var self = this
        if(!self.isSeat())return;
        visible = visible || false
        self.handCardNode.active = visible
        if(!instance)return;
        if(instance.initWidget){
            instance.initWidget(self.handCardNode,self.m_chair,atlas,pokerPrefab,self.m_playerEventScript,self)
        }
        self.handCardNode.bindInstance = instance
    },

    getHandCardNode () {
        var self = this
        if(!self.isSeat())return false;
        return self.handCardNode.bindInstance
    },

    setDisCardNode (visible,instance,atlas,pokerPrefab) {
        var self = this
        if(!self.isSeat())return;
        visible = visible || false
        self.disCardNode.active = visible
        if(!instance)return;
        if(instance.initWidget){
            instance.initWidget(self.disCardNode,self.m_chair,atlas,pokerPrefab,self)
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
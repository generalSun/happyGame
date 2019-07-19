var config = require('./config')
var handCard = require('./handCard')
var disCard = require('./disCard')
var Constants = require('./../../../config/Constants')
var TAG = 'ddz.js'
cc.Class({
    extends: cc.Component,

    properties: {
        desktopInfo:cc.Node,
        playerPrefab: cc.Prefab,
        ruleInfo:cc.Node,
        pokerAtlas:[cc.SpriteAtlas],
        cardBottomNode:cc.Node,
    },

    onDestroy(){
        var self = this
        G.eventManager.cancelEvent(Constants.LOCALEVENT.POKER_FILP_END,self.pokerFilpEnd,self)
    },

    onLoad () {
        G.audioManager.playBGM('bgFight.mp3')
        var self = this
        self.m_bg = cc.find('Canvas/bg')
        self.m_socketProcess = self.node.getComponent('ddz_socketProcess')
        self.m_deskScript = self.desktopInfo.getComponent('desktopInfo');
        self.m_ruleScript = self.ruleInfo.getComponent('ruleInfo');
        self.m_cardBottomScript = self.cardBottomNode.getComponent('cardBottom');
        self.m_player = new Array();
        self.m_playerPool = new cc.NodePool()
        self.m_meChairID = config.INVALID_CHAIR;
        self.m_creator = null
        // self.m_gameState = 
        self.init()
    },

    getDeskScript(){
        var self = this
        return self.m_deskScript
    },

    getRuleScript(){
        var self = this
        return self.m_ruleScript
    },

    getCardBottomScript(){
        var self = this
        return self.m_cardBottomScript
    },

    init(){
        var self = this
        self.m_cardBottomScript.init(self.pokerAtlas)
        var info = G.selfUserData.getUserRoomInfo()
        var data = {
            playway:info.playway,
            extparams:info,
            data:G.selfUserData.getUserRoomID()
        }
        console.log(TAG,'init',info)
        G.globalSocket.send(Constants.SOCKET_EVENT_c2s.JOIN_ROOM,data)
        if(G.gameInfo.isGamePlay){
            G.globalLoading.setLoadingVisible(true,'正在恢复数据中...')
        }
        G.eventManager.listenEvent(Constants.LOCALEVENT.POKER_FILP_END,self.pokerFilpEnd,self)
    },

    setMyServerID(id){
        var self = this
        self.m_meChairID = id
    },

    setRoomCreator(creator){
        var self = this
        self.m_creator = creator
    },

    clearSeats(){
        console.log(TAG,'clearSeats')
        var self = this
        for(var key in self.m_player){
            var player = self.m_player[key]
            var playerScript = player.getComponent('player')
            playerScript.setUserId(null)
            playerScript.seatUp()
            self.m_playerPool.put(player)
            self.m_bg.removeChild(player)
        }
        self.m_player.splice(0,self.m_player.length)
    },

    createSeats(){
        console.log(TAG,'createSeats')
        var self = this
        for(var i = self.m_meChairID; i < self.m_meChairID + config.maxPlayerNum; i++){
            var j = i%config.maxPlayerNum
            var localtionID = self.convertServerIDtoLocalID(j)
            var pos = config.playerPos[config.maxPlayerNum][localtionID]
            if(self.m_playerPool.size() <= 0){
                var seat = cc.instantiate(self.playerPrefab);
                self.m_playerPool.put(seat); 
            }
            var player = self.m_playerPool.get();
            player.setPosition(pos.x,pos.y)
            self.m_bg.addChild(player);
            self.m_player.push(player)
            var playerScript = player.getComponent('player')
            playerScript.setChair(localtionID)
            playerScript.setUserId(null)
            playerScript.seatUp()
        }
    },

    playerSeatDown(player){
        if(!player)return
        var self = this
        var updatePlayer = self.getPlayerByUserId(player.id)
        console.log(TAG,'playerSeatDown updatePlayer',updatePlayer)
        if(updatePlayer == null){
            var seatPlayer = self.getPlayerByServerChair(player.serverIndex)
            if(seatPlayer != null){
                seatPlayer.seatDown()
                seatPlayer.init({
                    config:config,
                    headimg:player.headimg,//是否上传头像
                    isOwner:player.id == (self.m_creator?self.m_creator:-1),
                    gold:player.integral,
                    isOffLine:!player.online,
                    isReady:player.roomready,
                    name:player.username,
                    city:player.city,
                    province:player.province,
                    userId:player.id,
                    diamonds:player.diamonds,
                    experience:player.experience,
                    fans:player.fans,
                    follows:player.follows,
                    goldcoins:player.goldcoins,
                    opendeal:player.opendeal,
                    roomCards:player.cards,
                    playerindex:player.playerindex,
                })
                seatPlayer.setHandCardNode(true,new handCard(),self.pokerAtlas)
                seatPlayer.setDisCardNode(true,new disCard(),self.pokerAtlas)
            }
        }else{
            updatePlayer.updateSeat({
                headimg:player.headimg,//是否上传头像
                isOwner:player.id == (self.m_creator?self.m_creator:-1),
                gold:player.integral,
                isOffLine:!player.online,
                isReady:player.roomready,
                name:player.username,
                city:player.city,
                province:player.province,
                userId:player.id,
                diamonds:player.diamonds,
                experience:player.experience,
                fans:player.fans,
                follows:player.follows,
                goldcoins:player.goldcoins,
                opendeal:player.opendeal,
                roomCards:player.cards,
                playerindex:player.playerindex,
            })
        }
    },

    dealPoker(pokerInfo,ani){
        ani = ani || false
        pokerInfo = pokerInfo || [
            {
                pokers:[1,52,3,44,5,6,33,8,9,10,11,12,13,17,18]
            },
            {
                pokers:[1,2,3,4,5,0,0,0,0,0]
            },
            {
                pokers:[1,3,4,1,3,0,0,0,0,0]
            },
            {
                pokers:[0,2,3,2,13,0,0,0,0,0]
            },
        ]
        var self = this
        for(var i = 0; i < self.m_player.length; i++){
            var player = self.m_player[i]
            if(cc.isValid(player)){
                var playerScript = player.getComponent('player')
                var chair = playerScript.getChair()
                var pokers = pokerInfo[chair].pokers
                var dis = playerScript.getDisCardNode()
                if(dis){
                    dis.hide()
                }
                
                var hand = playerScript.getHandCardNode()
                if(hand){
                    hand.hide()
                    hand.show(pokers,ani)
                }
            }
        }
        G.globalSocket.setMsgBlock(true)
    },

    pokerFilpEnd(){
        var self = this
        G.globalSocket.setMsgBlock(false)
    },

    //更换场景
    changeScene(){
        var self = this
        G.gameInfo.isLogined = true
        G.gameInfo.isInGame = false
        G.gameInfo.isGamePlay = false
        G.selfUserData.setUserRoomID(null)
        if(cc.director.getScene().name != 'HallScene'){
            cc.director.loadScene('HallScene')
        }
    },

    //服务器id转换为本地椅子号
    convertServerIDtoLocalID(wChairId){
        if(wChairId >= config.maxPlayerNum){
            return config.INVALID_CHAIR;
        }
        var self = this
        var localtionID = wChairId;
        if(self.m_meChairID != config.INVALID_CHAIR){
            var wViewChairID = wChairId + config.maxPlayerNum - self.m_meChairID
            localtionID = wViewChairID % config.maxPlayerNum
        }
        if(config.maxPlayerNum == 3){
            if(localtionID == 2){
                localtionID = 3
            }
        }
        console.log('玩家数量：' + config.maxPlayerNum + ',服务端位置：' + wChairId+',对应本地位置：' + localtionID)
        return localtionID
    },

    getPlayerByUserId(userId){
        var self = this
        for(var key in self.m_player){
            var player = self.m_player[key]
            if(cc.isValid(player)){
                var playerScript = player.getComponent('player')
                var id = playerScript.getUserId()
                if(id == userId){
                    return playerScript
                }
            }
        }
    },
    
    getPlayerByLocalChair(localChair){
        var self = this
        for(var key in self.m_player){
            var player = self.m_player[key]
            if(cc.isValid(player)){
                var playerScript = player.getComponent('player')
                var chair = playerScript.getChair()
                if(chair == localChair){
                    return playerScript
                }
            }
        }
    },

    getPlayerByServerChair(serverChair){
        var self = this
        var localChair = self.convertServerIDtoLocalID(serverChair)
        return self.getPlayerByLocalChair(localChair)
    },

    clearOperate(){
        var self = this
        for(var key in self.m_player){
            var player = self.m_player[key]
            if(cc.isValid(player)){
                var playerScript = player.getComponent('player') 
                playerScript.setOperateNode(false)
            }
        }
    },

    clearClock(){
        var self = this
        for(var key in self.m_player){
            var player = self.m_player[key]
            if(cc.isValid(player)){
                var playerScript = player.getComponent('player') 
                playerScript.setClock(false)
            }
        }
    },

    clearDis(){
        var self = this
        for(var key in self.m_player){
            var player = self.m_player[key]
            if(cc.isValid(player)){
                var playerScript = player.getComponent('player') 
                var dis = playerScript.getDisCardNode()
                if(dis){
                    dis.hide()
                }
            }
        }
    },

    clearReady(){
        var self = this
        for(var key in self.m_player){
            var player = self.m_player[key]
            if(cc.isValid(player)){
                var playerScript = player.getComponent('player') 
                playerScript.setReadySprite(false)
            }
        }
    },

    clearHands(){
        var self = this
        for(var key in self.m_player){
            var player = self.m_player[key]
            if(cc.isValid(player)){
                var playerScript = player.getComponent('player') 
                var hand = playerScript.getHandCardNode()
                if(hand){
                    hand.hide()
                }
            }
        }
    },

    clearPlayersCards(){
        var self = this
        for(var key in self.m_player){
            var player = self.m_player[key]
            if(cc.isValid(player)){
                var playerScript = player.getComponent('player') 
                playerScript.setCardNumSprite(false)
            }
        }
    },
});

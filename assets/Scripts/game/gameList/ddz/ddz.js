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

    loadPrefab (seat,index,creator) {
        var self = this
        if(creator){
            self.m_creator = creator
        }
        console.log('我自己的服务器位置：'+self.m_meChairID)
        for(var i = 0; i < config.maxPlayerNum; i++){
            var user = (i == index)?seat:null
            var localtionID = self.convertServerIDtoLocalID(i)
            var pos = config.playerPos[config.maxPlayerNum][localtionID]
            var player = cc.instantiate(self.playerPrefab);
            player.setPosition(pos.x,pos.y)
            var playerScript = player.getComponent('player')
            self.m_player.push(playerScript)
            self.m_bg.addChild(player);

            playerScript.setChair(localtionID)

            if(user){
                playerScript.seatDown({
                    config:config,
                    headimg:user.headimg,//是否上传头像
                    isOwner:user.id == (creator?creator:-1),
                    gold:user.integral,
                    isOffLine:!user.online,
                    isReady:user.roomready,
                    name:user.username,
                    city:user.city,
                    province:user.province,
                    userId:user.id,
                    diamonds:user.diamonds,
                    experience:user.experience,
                    fans:user.fans,
                    follows:user.follows,
                    goldcoins:user.goldcoins,
                    opendeal:user.opendeal,
                    roomCards:user.cards,
                })
                playerScript.setHandCardNode(true,new handCard(),self.pokerAtlas)
                playerScript.setDisCardNode(true,new disCard(),self.pokerAtlas)
            }
        }
    },

    playerSeatDown(player){
        if(!player)return
        var self = this
        if(self.getPlayerByUserId(player.id) == null){
            for(var i = 0; i < self.m_player.length; i++){
                var seat = self.m_player[i]
                var id = seat.getUserId()
                if(id == null){
                    seat.seatDown({
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
                    })
                    seat.setHandCardNode(true,new handCard(),self.pokerAtlas)
                    seat.setDisCardNode(true,new disCard(),self.pokerAtlas)
                    return
                }
            }
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
            var chair = player.getChair()
            var pokers = pokerInfo[chair].pokers
            var dis = player.getDisCardNode()
            if(dis){
                dis.hide()
            }
            
            var hand = player.getHandCardNode()
            if(hand){
                hand.hide()
                hand.show(pokers,ani)
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
            var id = self.m_player[key].getUserId()
            if(id == userId){
                return self.m_player[key]
            }
        }
    },
    
    getPlayerByLocalChair(localChair){
        var self = this
        for(var key in self.m_player){
            var chair = self.m_player[key].getChair()
            if(chair == localChair){
                return self.m_player[key]
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
            if(player){
                player.setOperateNode(false)
            }
        }
    },

    clearClock(){
        var self = this
        for(var key in self.m_player){
            var player = self.m_player[key]
            if(player){
                player.setClock(false)
            }
        }
    },

    clearDis(){
        var self = this
        for(var key in self.m_player){
            var player = self.m_player[key]
            if(player){
                var dis = player.getDisCardNode()
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
            if(player){
                player.setReadySprite(false)
            }
        }
    },
});

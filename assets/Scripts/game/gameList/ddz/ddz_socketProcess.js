var Constants = require('../../../config/Constants')
var config = require('./config')
var handCard = require('./handCard')
var disCard = require('./disCard')
var TAG = 'ddz_socketProcess.js'
var Base64 = require("./../../../utils/Base64");
var ddz_logic = require('./ddz_logic')
cc.Class({
    extends: cc.Component,

    onLoad(){
        console.log(TAG,'onLoad')
        var self = this
        self.m_handler = self.node.getComponent('ddz')
        self.m_event = self.node.getComponent('ddz_event')
        self.m_eventsInfo = {
            [Constants.SOCKET_EVENT_s2c.JOIN_ROOM]:self.createRoom,
            [Constants.SOCKET_EVENT_s2c.PLAYER_JOIN]:self.playerJoin,
            [Constants.SOCKET_EVENT_s2c.ROOM_READY]:self.roomReady,
            [Constants.SOCKET_EVENT_s2c.PLAYER_READY]:self.playerReady,
            [Constants.SOCKET_EVENT_s2c.BANKER]:self.banker,
            [Constants.SOCKET_EVENT_s2c.PLAYING_GAME]:self.gameBegin,
            [Constants.SOCKET_EVENT_s2c.CATCH_SIGN]:self.catchSign,
            [Constants.SOCKET_EVENT_s2c.CATCHRESULT]:self.catchResult,
            [Constants.SOCKET_EVENT_s2c.LAST_HANDS]:self.showYuCards,
            [Constants.SOCKET_EVENT_s2c.CATCH_FAIL]:self.flowBureau,
            [Constants.SOCKET_EVENT_s2c.TAKE_CARDS]:self.takeCards,
            [Constants.SOCKET_EVENT_s2c.RECOVERY]:self.recovery,
            [Constants.SOCKET_EVENT_s2c.ALLCARDS]:self.smallSettlement,//小结算
        }
        for(var key in self.m_eventsInfo){
            G.eventManager.listenEvent(key,self.m_eventsInfo[key],self)
        }
        self.m_clearDisTimeId = null
        self.m_settlementTimeId = null
    },

    closeClearDisTime(){
        var self = this
        if(self.m_clearDisTimeId){
            clearTimeout(self.m_clearDisTimeId)
            self.m_clearDisTimeId = null
            self.m_handler.clearDis()
        }
    },

    closeSettlementTime(){
        var self = this
        if(self.m_settlementTimeId){
            clearTimeout(self.m_settlementTimeId)
            self.m_settlementTimeId = null
            self.m_handler.getSettlementScript().hide()
        }
    },

    smallSettlement:function(msg){
        console.log(TAG,'smallSettlement',msg)
        if(!msg)return;
        var ratio = msg.ratio
        var score = msg.score
        var players = msg.players
        var gameRoomOver = msg.gameRoomOver
        var game = msg.game
        var finished = msg.finished
        var self = this
        self.closeClearDisTime()
        self.m_handler.clearDis()
        self.m_handler.getCardBottomScript().setRatio(ratio)
        if(gameRoomOver){

        }else{
            /**
            balance: 5030
            cards: ""
            dizhu: false
            gameover: false
            ratio: 15
            score: 30
            userid: "50ee8ad8f8a24f42b25f5ca253969598"
            username: "Guest_1h1EM0"
            win
             */
            for(var i = 0; i < players.length; i++){
                var playerInfo = players[i]
                var player = self.m_handler.getPlayerByUserId(playerInfo.userid)
                if(cc.isValid(player)){
                    var cards = ddz_logic.analysisServerPokers(Base64.decode(playerInfo.cards))
                    var win = playerInfo.win
                    var score = playerInfo.score
                    var balance = playerInfo.balance
                    playerInfo.chair = player.getChair()
                    playerInfo.single = player.isLandlord()
                    playerInfo.jiabei = player.isJiabei()
                    var hand = player.getHandCardNode()
                    if(hand){
                        hand.hide()
                        hand.addCards(cards)
                        hand.sortCards()
                        hand.refreshCards(false)
                    }
                    player.setResultSprite(true,win)
                    player.setGoldDescrible(true,score)
                    player.setGoldCoins(true,balance)
                    if(player.isSelf()){
                        G.selfUserData.setUserCoins(balance)
                    }
                }
            }
            self.m_event.setStartButtonVisible(true)
            self.m_event.setOpendealButtonVisible(true)
            self.m_settlementTimeId = setTimeout(()=>{
                self.m_settlementTimeId = null;
                self.m_handler.getSettlementScript().show()
                self.m_handler.getSettlementScript().showSmall(players)
             }, 1000*0.5)
        }
    },

    banker:function(msg){
        console.log(TAG,'banker',msg)
        if(!msg)return;
        var userid = msg.userid
        var self = this
        var player = self.m_handler.getPlayerByUserId(userid)
        if(player){
            player.setOwnerSprite(true)
        }
    },

    recovery:function(msg){
        console.log(TAG,'recovery',msg)
        if(!msg)return;
        var self = thie
        self.m_handler.clearOperate()
        self.m_handler.clearClock()
        self.m_handler.clearDis()
        self.m_handler.clearHands()
        self.m_handler.clearPlayersCards()
        self.m_handler.clearPlayerResult()
        self.m_handler.getCardBottomScript().hide()
        var banker = msg.banker
        var automic = msg.automic
        var cardsnum = msg.cardsnum
        var data = msg.data
        var hiscards = msg.hiscards
        var last = msg.last
        var lasthands = ddz_logic.analysisServerPokers(Base64.decode(msg.lasthands || []))
        var nextplayer = msg.nextplayer
        var player = msg.player
        var ratio = msg.ratio
        var selectcolor = msg.selectcolor
        var userboard = msg.userboard
        if(userboard){
            self.gameBegin(userboard)
        }

        if(ratio){
            self.m_handler.getCardBottomScript().show()
            self.m_handler.getCardBottomScript().showYuCards()
            self.m_handler.getCardBottomScript().showRatio()
            self.m_handler.getCardBottomScript().setRatio(ratio)
            self.m_handler.getCardBottomScript().addYuCards(lasthands,true)
        }

        var bankerPlayer = self.m_handler.getPlayerByUserId(banker.userid)
        if(bankerPlayer){
            bankerPlayer.setSignSprite(true)
        }
        
        if(last){
            self.takeCards(last)
        }
        
    },

    takeCards:function(msg){
        console.log(TAG,'takeCards',msg)
        if(!msg)return;
        var allow = msg.allow//符合出牌规则
        var newTurn = msg.newTurn//是否新的一轮
        var bomb = msg.bomb//炸
        var card = msg.card//麻将
        var cardType = msg.cardType//出牌的牌型
        var cards = ddz_logic.analysisServerPokers(msg.cards?Base64.decode(msg.cards):[])
        var cardsnum = msg.cardsnum//当前出牌的人 剩下多少张 牌
        var donot = msg.donot//出 OR 不出
        var nextplayer = msg.nextplayer
        var nextplayercard = msg.nextplayercard//下一个玩家翻到的新牌
        var over = msg.over//已结束
        var sameside = msg.sameside//同伙
        var time = msg.time
        var type = msg.type//出牌类型 ： 1:单张 | 2:对子 | 3:三张 | 4:四张（炸） | 5:单张连 | 6:连对 | 7:飞机 : 8:4带2 | 9:王炸
        var userid = msg.userid
        var self = this
        self.closeClearDisTime()
        if(allow){
            self.m_handler.clearOperate()
            self.m_handler.clearClock()
            if(!over){
                if(newTurn){
                     self.m_clearDisTimeId = setTimeout(()=>{
                        self.m_clearDisTimeId = null;
                        self.m_handler.clearDis()
                     }, 1000*0.5);
                }
                var currentPlayer = self.m_handler.getPlayerByUserId(userid)
                if(currentPlayer){
                    var dis = currentPlayer.getDisCardNode()
                    var hand = currentPlayer.getHandCardNode()
                    if(dis && hand){
                        dis.hide()
                        hand.outCards(cards,function(outCardsInfo){
                            dis.showCards(outCardsInfo,true)
                            dis.showOutCardEffect(cardType,true)
                        })
                    }
                }
                var next_player = self.m_handler.getPlayerByUserId(nextplayer)
                if(next_player){
                    next_player.setClock(true,30)
                    if(next_player.isSelf()){
                        next_player.setOperateNode(true)
                        next_player.getPlayerEvent().showOperateByIndex(0,[
                            {name:'outCardButton',visible:true},
                            {name:'tipButton',visible:true},
                            {name:'ybqButton',visible:false},
                            {name:'buchuButton',visible:true},
                        ])
                    }
                    var dis = next_player.getDisCardNode()
                    if(dis){
                        dis.hide()
                    }
                }
            }else{

            }
        }else{
            G.alterMgr.showMsgBox({content:'出牌不符规则！'})
        }
    },

    flowBureau:function(msg){
        console.log(TAG,'flowBureau',msg)
        var self = this
        self.m_handler.clearOperate()
        self.m_handler.clearClock()
        self.m_handler.clearDis()
        self.m_handler.clearHands()
        self.m_handler.clearPlayersCards()
        self.m_handler.getCardBottomScript().hide()
        self.m_handler.clearReady()
        self.m_handler.clearPlayerResult()
    },

    showYuCards:function(msg){
        console.log(TAG,'showYuCards',msg)
        if(!msg)return;
        var userid = msg.userid
        var ratio = msg.ratio//当前是处在抢庄还是叫庄中
        var docatch = msg.docatch
        var grab = msg.grab//当前玩家有没有操作过
        var lasthands = ddz_logic.analysisServerPokers(Base64.decode(msg.lasthands))
        console.log(TAG,'showYuCards lasthands',lasthands)
        var self = this
        self.m_handler.getCardBottomScript().showYuCards()
        self.m_handler.getCardBottomScript().setRatio(ratio)
        self.m_handler.getCardBottomScript().addYuCards(lasthands,true)
        self.m_handler.clearOperate()
        self.m_handler.clearClock()
        self.m_handler.clearDis()
        var player = self.m_handler.getPlayerByUserId(userid)
        if(player){
            player.setClock(true,30)
            var hand = player.getHandCardNode()
            if(hand){
                hand.addLastCards(lasthands,true)
            }
            if(player.isSelf()){
                player.setOperateNode(true)
                player.getPlayerEvent().showOperateByIndex(0,[
                    {name:'outCardButton',visible:true},
                    {name:'tipButton',visible:true},
                    {name:'ybqButton',visible:false},
                    {name:'buchuButton',visible:true},
                ])
            }
        }
    },

    catchResult:function(msg){
        console.log(TAG,'catchResult',msg)
        if(!msg)return;
        var userid = msg.userid
        var ratio = msg.ratio//倍率
        var docatch = msg.docatch//当前有没有人操作过
        var grab = msg.grab//当前玩家叫地主（抢地主）或不叫（不抢）
        var self = this
        self.m_handler.getCardBottomScript().setRatio(ratio)
        self.m_handler.clearOperate()
        self.m_handler.clearClock()
        var player = self.m_handler.getPlayerByUserId(userid)
        if(player){
            var dis = player.getDisCardNode()
            if(dis){
                var name = ''
                if(grab){
                    if(docatch){
                        name = 'imgq_2'
                    }else{
                        name = 'imgj_1'
                    }
                }else{
                    if(docatch){
                        name = 'imgq_0'
                    }else{
                        name = 'imgj_0'
                    }
                }
                dis.hideEffects()
                dis.showCatchEffect(name)
            }
        }
    },

    catchSign:function(msg){
        console.log(TAG,'catchSign',msg)
        if(!msg)return;
        var userid = msg.userid
        var ratio = msg.ratio//倍率
        var docatch = msg.docatch
        var grab = msg.grab
        var self = this
        self.m_handler.clearOperate()
        self.m_handler.clearClock()
        self.m_handler.getCardBottomScript().showRatio()
        self.m_handler.getCardBottomScript().setRatio(ratio)
        var player = self.m_handler.getPlayerByUserId(userid)
        if(player){
            player.getDisCardNode().hide()
            player.setClock(true,15)
            if(player.isSelf()){
                player.setOperateNode(true)
                if(docatch){
                    player.getPlayerEvent().showOperateByIndex(1,[
                        {name:'bjButton',visible:false},
                        {name:'bqButton',visible:true},
                        {name:'jdzButton',visible:false},
                        {name:'qdzButton',visible:true},
                    ])
                }else{
                    player.getPlayerEvent().showOperateByIndex(1,[
                        {name:'bjButton',visible:true},
                        {name:'bqButton',visible:false},
                        {name:'jdzButton',visible:true},
                        {name:'qdzButton',visible:false},
                    ])
                }
            }
        }
    },

    createRoom:function(msg){
        console.log(TAG,'createRoom',msg)
        G.globalLoading.setLoadingVisible(false)
        if(!msg)return;
        var self = this;
        self.m_handler.getCardBottomScript().hide()
        self.m_handler.clearSeats()

        var index = msg.index
        var maxplayers = msg.maxplayers
        var player = msg.player
        var gameRoom = msg.gameRoom
        G.selfUserData.setUserRoomID(gameRoom.roomid)
        config.maxPlayerNum = maxplayers
        var selfId = G.selfUserData.getUserId()
        if(player.id == selfId){
            self.m_handler.setMyServerID(index)
        }
        G.selfUserData.setUserRoomInfo(gameRoom.extparams)
        var creater = gameRoom.creater
        var numofgames = gameRoom.numofgames
        var currentnum = gameRoom.currentnum
        self.m_handler.setRoomCreator(creater)
        self.m_handler.createSeats()
        self.m_handler.playerSeatDown(player)
        self.m_handler.getDeskScript().setRoomNum(gameRoom.roomid)
        self.m_handler.getDeskScript().setGameRoundNum(currentnum,numofgames)
        self.m_handler.getRuleScript().analysisRule(gameRoom.extparams)
        self.m_handler.getRuleScript().setAdditional(maxplayers,2)
        self.m_handler.getCardBottomScript().hide()
    },
    
    gameBegin:function(msg){
        console.log(TAG,'gameBegin',msg)
        if(!msg)return;
        G.gameInfo.isGamePlay = true
        var self = this
        var yuCardsNum = msg.deskcards
        var numofgames = msg.numofgames
        var player = msg.player
        var players = msg.players
        var pokerInfo = {}
        self.m_handler.clearReady()
        self.m_handler.clearOperate()
        self.m_handler.clearClock()
        self.m_handler.clearDis()
        self.m_handler.clearHands()
        self.m_handler.clearPlayersCards()
        self.m_handler.clearPlayerResult()

        self.m_handler.getDeskScript().setGameRoundNum(numofgames)
        self.m_handler.getCardBottomScript().show()
        self.m_handler.getCardBottomScript().showYuCards()
        self.m_handler.getCardBottomScript().addYuCards(yuCardsNum,true)
        var seat = self.m_handler.getPlayerByUserId(player.playuser)
        if(seat){
            var info = {}
            info.pokers = ddz_logic.analysisServerPokers(Base64.decode(player.cards))
            pokerInfo[seat.getChair()] = info
        }
        
        for(var i = 0; i < players.length; i++){
            var seatInfo = players[i]
            var player = self.m_handler.getPlayerByUserId(seatInfo.playuser)
            if(player){
                var info = {}
                if(seatInfo.cards){
                    info.pokers = ddz_logic.analysisServerPokers(Base64.decode(seatInfo.cards))
                }else{
                    info.pokers = new Array(seatInfo.deskcards).fill(0)
                }
                pokerInfo[player.getChair()] = info
            }
        } 
        self.m_handler.dealPoker(pokerInfo,true)
    },
    
    playerJoin:function(msg){
        console.log(TAG,'playerJoin',msg)
        if(!msg)return;
        var self = this
        var players = msg.player
        for(var i = 0; i < players.length; i++){
            var player = players[i]
            self.m_handler.playerSeatDown(player)
        }
    },

    playerReady:function(msg){
        console.log(TAG,'playerReady',msg)
        if(!msg)return;
        var self = this
        var userid = msg.userid
        var player = self.m_handler.getPlayerByUserId(userid)
        if(player){
            player.setReadySprite(true)
            if(player.isSelf()){
                self.m_event.setStartButtonVisible(false)
                self.m_event.setOpendealButtonVisible(false)
                self.m_event.setReadyButtonVisible(false)
                self.m_event.setInviteButtonVisible(false)
            }
        }
    },

    roomReady:function(msg){
        console.log(TAG,'roomReady',msg)
        if(!msg)return;
        var self = this
        if(self.m_event.getInviteButtonVisible()){
            self.m_event.setStartButtonVisible(true)
            self.m_event.setOpendealButtonVisible(true)
            self.m_event.setReadyButtonVisible(false)
            self.m_event.setInviteButtonVisible(false)
        }
    },

    onDestroy(){
        var self = this
        for(var key in self.m_eventsInfo){
            G.eventManager.cancelEvent(key,self.m_eventsInfo[key],self)
        }
    }
})

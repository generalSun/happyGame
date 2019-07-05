var Constants = require('../../../config/Constants')
var config = require('./config')
var handCard = require('./handCard')
var disCard = require('./disCard')
cc.Class({
    init:function(handler){
        var self = this
        self.m_handler = handler

        G.eventManager.listenEvent(Constants.SOCKET_EVENT_s2c.GAME_BEGIN_PUSH,self.gameBegin,self)
        G.eventManager.listenEvent(Constants.SOCKET_EVENT_s2c.NEW_USER_COMES_PUSH,self.playerJoin,self)
        G.eventManager.listenEvent(Constants.SOCKET_EVENT_s2c.GAME_SYNC_PUSH,self.gameReconnect,self)
        G.eventManager.listenEvent(Constants.SOCKET_EVENT_s2c.USER_STATE_PUSH,self.playerStateChange,self)
        G.eventManager.listenEvent(Constants.SOCKET_EVENT_s2c.EXIT_RESULT,self.exitRoom,self)
        G.eventManager.listenEvent(Constants.SOCKET_EVENT_s2c.EXIT_NOTIFY_PUSH,self.exitRoomPush,self)
        G.eventManager.listenEvent(Constants.SOCKET_EVENT_s2c.DISSOLVE_NOTICE_PUSH,self.dissolveNoticePush,self)
        G.eventManager.listenEvent(Constants.SOCKET_EVENT_s2c.DISSOLVE_CANCEL_PUSH,self.dissolveCancelPush,self)
        G.eventManager.listenEvent(Constants.SOCKET_EVENT_s2c.GAME_OVER_PUSH,self.gameOverPush,self)
    },
    
    gameBegin:function(event){
        G.gameInfo.isGamePlay = true
        var self = this
        var num_of_turns = event.num_of_turns
        var yuCards = event.yuCards
        var currentPlayingIndex = event.currentPlayingIndex
        var seatsInfo = event.seatsInfo
        self.m_handler.m_deskScript.setGameRoundNum(num_of_turns)
        var pokerInfo = {}
        for(var i = 0; i < seatsInfo.length; i++){
            var seatInfo = seatsInfo[i]
            var player = self.m_handler.getPlayerByUserId(seatInfo.userId)
            if(player){
                var info = {}
                if(seatInfo.holds){
                    info.pokers = seatInfo.holds
                }else{
                    info.pokers = new Array(seatInfo.holdsNum).fill(0)
                }
                pokerInfo[player.getChair()] = info
            }
        }    
        self.m_handler.dealPoker(pokerInfo,true)
        self.m_handler.addYuCards(yuCards,true)
    },
    
    playerJoin:function(event){
        var self = this
        var player = self.m_handler.getPlayerByServerChair(event.seatindex)
        if(player){
            var info = G.selfUserData.getUserRoomInfo()
            player.seatDown({
                config:config,
                headUrl:event.headUrl,
                isOwner:event.userId == info.conf.creator,
                gold:event.score,
                isOffLine:!event.online,
                isReady:event.ready,
                name:event.name,
                ip:event.ip,
                userId:event.userId
            })
            player.setHandCardNode(true,new handCard(),self.m_handler.pokerAtlas)
            player.setDisCardNode(true,new disCard(),self.m_handler.pokerAtlas)
        }
    },
    
    gameReconnect:function(event){
        var self = this
        
    },
    
    playerStateChange:function(event){
        var self = this
        var player = self.m_handler.getPlayerByUserId(event.userId)
        if(player){
            player.setOffLineSprite(!event.online)
        }
    },

    exitRoom:function(event){
        var self = this
        self.m_handler.changeScene()
    },

    exitRoomPush:function(event){
        var self = this
        var userId = event.userId
        var player = self.m_handler.getPlayerByUserId(userId)
        if(player){
            player.seatUp()
        }
    },

    dissolveNoticePush:function(event){
        var self = this
        var time = Math.ceil(event.time)
        var states = event.states
        var originator = event.originator
        var player = self.m_handler.getPlayerByUserId(originator)
        if(!player){
            return
        }
        var info = {
            time:time,
            originator:player.getNickName(),
            playerInfo:[],
            hasChose:false
        }
        for(var i = 0; i < self.m_handler.m_player.length; i++){
            var state = states[i]
            var player = self.m_handler.getPlayerByServerChair(i)
            var seatInfo = {
                state:state,
                name:player.getNickName()
            } 
            info.playerInfo.push(seatInfo)
            if(state != 0 && player.isSelf()){
                info.hasChose = true
            }
        }
        var dissolveNode = self.m_handler.parentNode.node.getChildByName('dissolveNode')
        if(dissolveNode){
            dissolveNode.getComponent('dissolve').show(info)
            return;
        }
        console.log('thert is not the node set')
        cc.loader.loadRes('prefabs/dissolveNode', cc.Prefab, function(err, prefab) {
            if (err) {
                cc.log(err.message || err);
                return;
            }
            var node = cc.instantiate(prefab);
            node.getComponent('dissolve').show(info)
            self.m_handler.parentNode.node.addChild(node);
        });
    },

    dissolveCancelPush(){
        var self = this
        var dissolveNode = self.m_handler.parentNode.node.getChildByName('dissolveNode')
        if(dissolveNode){
            dissolveNode.getComponent('dissolve').hide()
        }
    },

    gameOverPush(){
        var self = this
        self.m_handler.changeScene()
    },

    onDestroy(){
        var self = this
        G.eventManager.cancelEvent(Constants.SOCKET_EVENT_s2c.GAME_BEGIN_PUSH,self.gameBegin,self)
        G.eventManager.cancelEvent(Constants.SOCKET_EVENT_s2c.NEW_USER_COMES_PUSH,self.playerJoin,self)
        G.eventManager.cancelEvent(Constants.SOCKET_EVENT_s2c.GAME_SYNC_PUSH,self.gameReconnect,self)
        G.eventManager.cancelEvent(Constants.SOCKET_EVENT_s2c.USER_STATE_PUSH,self.playerStateChange,self)
        G.eventManager.cancelEvent(Constants.SOCKET_EVENT_s2c.EXIT_RESULT,self.exitRoom,self)
        G.eventManager.cancelEvent(Constants.SOCKET_EVENT_s2c.EXIT_NOTIFY_PUSH,self.exitRoomPush,self)
        G.eventManager.cancelEvent(Constants.SOCKET_EVENT_s2c.DISSOLVE_NOTICE_PUSH,self.dissolveNoticePush,self)
        G.eventManager.cancelEvent(Constants.SOCKET_EVENT_s2c.DISSOLVE_CANCEL_PUSH,self.dissolveCancelPush,self)
        G.eventManager.cancelEvent(Constants.SOCKET_EVENT_s2c.GAME_OVER_PUSH,self.gameOverPush,self)
    }
})

var Constants = require('../../../config/Constants')
var config = require('./config')
cc.Class({
    init:function(handler){
        var self = this
        self.m_handler = handler
        G.globalSocket.listenMsg(Constants.SOCKET_EVENT_s2c.GAME_BEGIN_PUSH)
        G.globalSocket.listenMsg(Constants.SOCKET_EVENT_s2c.NEW_USER_COMES_PUSH)
        G.globalSocket.listenMsg(Constants.SOCKET_EVENT_s2c.GAME_SYNC_PUSH)
        G.globalSocket.listenMsg(Constants.SOCKET_EVENT_s2c.USER_STATE_PUSH)

        G.eventManager.listenEvent(Constants.SOCKET_EVENT_s2c.GAME_BEGIN_PUSH,self.gameBegin,self)
        G.eventManager.listenEvent(Constants.SOCKET_EVENT_s2c.NEW_USER_COMES_PUSH,self.playerJoin,self)
        G.eventManager.listenEvent(Constants.SOCKET_EVENT_s2c.GAME_SYNC_PUSH,self.gameReconnect,self)
        G.eventManager.listenEvent(Constants.SOCKET_EVENT_s2c.USER_STATE_PUSH,self.playerStateChange,self)
    },
    
    gameBegin:function(event){
        var self = this
        /**
        num_of_turns:roomInfo.num_of_turns,
        yuCards:game.yuCards,
        currentPlayingIndex:game.currentPlayingIndex,
        seatsInfo:new Array()
        */
       self.m_handler.m_deskScript.setGameRoundNum(event.num_of_turns)
    
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

    onDestroy(){
        G.eventManager.cancelEvent(Constants.SOCKET_EVENT_s2c.GAME_BEGIN_PUSH,self.gameBegin,self)
        G.eventManager.cancelEvent(Constants.SOCKET_EVENT_s2c.NEW_USER_COMES_PUSH,self.playerJoin,self)
        G.eventManager.cancelEvent(Constants.SOCKET_EVENT_s2c.GAME_SYNC_PUSH,self.gameReconnect,self)
        G.eventManager.cancelEvent(Constants.SOCKET_EVENT_s2c.USER_STATE_PUSH,self.playerStateChange,self)
    }
})

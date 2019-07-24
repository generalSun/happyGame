var Constants = require('./../../config/Constants')
var TAG = 'hall_socketProcess.js'
cc.Class({
    extends: cc.Component,

    onLoad(){
        console.log(TAG,'onLoad')
        var self = this
        self.m_handler = self.node.getComponent('hall')
        G.eventManager.listenEvent(Constants.SOCKET_EVENT_s2c.GAME_STATUS,self.gameStatus,self)
        G.eventManager.listenEvent(Constants.SOCKET_EVENT_s2c.SEARCH_ROOM,self.joinRoom,self)
    },

    gameStatus:function(msg){
        if(!msg)return;
        var gameStatus = msg.gamestatus
        var gametype = msg.gametype
        var playway = msg.playway
        var cardroom = msg.cardroom || false
        if(gameStatus == 'playing' && gametype != null){
            var info = {
                gametype:gametype,
                playway:playway,
                gamemodel:cardroom == true?'room':'hall'
            }
            G.selfUserData.setUserRoomInfo(info)
            var type = null
            if(gametype == 'dizhu'){
                type = 'ddz'
            }
            self.m_handler.changeScene(type)
            G.gameInfo.isGamePlay = true
        }else if(gameStatus == 'timeout'){
            G.selfUserData.setUserRoomID(null)
            G.msgBoxMgr.showMsgBox({
                content:'登录已过期，请重新登录！',
                sureClickEventCallBack:function(){
                    if(cc.director.getScene().name != 'LoginScene'){
                        cc.director.loadScene('LoginScene')
                    }
                },
                cancelClickEventCallBack:function(){
                    cc.game.end();//退出游戏
                }
            })
        }
    },

    requestUserBaseInfo:function(userId){
        if(!userId)return
        var self = this
        G.httpManage.sendRequest(Constants.HTTP_NET_EVENT.BASE_INFO,{userId:userId},function(event){
            if(event.errcode == 0){
                G.selfUserData.setUserName(event.name)
                G.selfUserData.setUserSex(event.sex)
                console.log(event)
                if(event.headimgurl && event.headimgurl != ''){
                    var url = G.httpManage.accountServerUrl + '/image?url=' + encodeURIComponent(event.headimgurl) + ".jpg";
                    cc.loader.load(url,function (err,tex) {
                        if(err){
                            console.log(err)
                            return
                        }
                        var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
                        self.m_handler.head.node.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    });
                }
            }
        },null,G.httpManage.accountServerUrl);
    },

    joinRoom:function(msg){
        if(!msg)return;
        var self = this;
        var result = msg.result
        if(result == "ok"){
            var hallInfo = G.selfUserData.getUserHallInfo()
            var info = {
                gametype : msg.code,
                playway :  msg.id,
                gamemodel : hallInfo.gametype,
                automatch : false
            } ;
            G.selfUserData.setUserRoomInfo(info)
            var type = null
            if(info.gametype == 'dizhu'){
                type = 'ddz'
            }
            self.m_handler.changeScene(type)
            G.selfUserData.setUserRoomID(msg.roomid)
            return
        }
        if(result == "notexist"){
            G.alterMgr.showMsgBox({content:'输入的房间号不存在'})
        }else if(result == "full"){
            G.alterMgr.showMsgBox({content:'输入的房间号已满员'})
        }
        G.selfUserData.setUserRoomID(null)
        self.m_handler.getEnterRoom().deleteLabel(false)
    },

    onDestroy(){
        var self = this
        G.eventManager.cancelEvent(Constants.LOCALEVENT.GAME_STATUS,self.gameStatus,self)
        G.eventManager.cancelEvent(Constants.SOCKET_EVENT_s2c.SEARCH_ROOM,self.joinRoom,self)
    }
})


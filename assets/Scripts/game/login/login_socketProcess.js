var Constants = require('../../../config/Constants')
cc.Class({
    extends: cc.Component,

    onLoad(){
        var self = this
        self.m_handler = self.node.getComponent('login')
        G.eventManager.listenEvent(Constants.LOCALEVENT.CONNECT_SUCCES,self.connect_succes,self)
    },

    connect_succes:function(data){
        var self = this
        self.m_handler.changeScene()
    },

    guestLogin(){
        var self = this
        G.httpManage.sendRequest(Constants.HTTP_NET_EVENT.GUEST_LOGIN,{},function(event){
            if(event != null && event.token != null && event.data != null){
                G.selfUserData.setUserHallInfo(event)
                G.selfUserData.setUserIP(event.token.ip)
                G.selfUserData.setUserToken(event.token.id)

                G.selfUserData.setUserId(event.data.id)
                G.selfUserData.setUserName(event.data.username)
                G.selfUserData.setUserSign(event.data.sign)
                G.selfUserData.setUserRoomID(event.data.roomid)
                G.selfUserData.setUserLV(event.data.playerlevel)
                G.selfUserData.setUserCoins(event.data.goldcoins)
                G.selfUserData.setUserExp(event.data.experience)
                G.selfUserData.setUserDiamond(event.data.diamonds)
                G.selfUserData.setUserGems(event.data.cards)
                G.selfUserData.setUserOrgi(event.data.orgi)
                G.selfUserData.setUserHeadImage(event.data.headimg)
                G.selfUserData.setUserIntegral(event.data.integral)
                G.selfUserData.setUserFollows(event.data.follows)
                G.selfUserData.setUserFans(event.data.fans)
                G.selfUserData.setUserCity(event.data.city)
                G.selfUserData.setUserProvince(event.data.province)
                G.gameListInfo = event.games
                
                var userInfo = G.ioUtil.get(Constants.LOCALLSTORAGEKEY.USERINFO) || {}
                userInfo.token = event.token.id
                G.ioUtil.set(Constants.LOCALLSTORAGEKEY.USERINFO,userInfo)
                
                G.globalSocket.connectSocket()
            }
        },function(){
            G.alterMgr.showMsgBox({content:'网络异常，服务访问失败'})
        },null,'游客登陆...')  
    },

    onDestroy(){
        var self = this
        G.eventManager.cancelEvent(Constants.LOCALEVENT.CONNECT_SUCCES,self.connect_succes,self)
    }
})

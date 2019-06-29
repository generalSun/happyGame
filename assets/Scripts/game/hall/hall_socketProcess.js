var Constants = require('../../../config/Constants')
cc.Class({
    
    init:function(handler){
        var self = this
        self.m_handler = handler

        G.eventManager.listenEvent(Constants.SOCKET_EVENT_s2c.LOGIN_RESULT,self.login_result,self)
        G.eventManager.listenEvent(Constants.SOCKET_EVENT_s2c.LOGIN_FINISHED,self.login_finished,self)
    },
    
    login_result:function(data){
        var self = this
        if(data.errcode === 0){
            var data = data.data;
            G.selfUserData.setUserRoomID(data.roomId)
            G.selfUserData.setUserRoomInfo(data)
        }else{
            console.log(data.errmsg);   
        }
    },
            
    login_finished:function(data){
        var self = this
        if(self.m_handler.changeScene){
            self.m_handler.changeScene()
        }
    },

    onDestroy(){
        G.eventManager.cancelEvent(Constants.SOCKET_EVENT_s2c.LOGIN_RESULT,self.login_result,self)
        G.eventManager.cancelEvent(Constants.SOCKET_EVENT_s2c.LOGIN_FINISHED,self.login_finished,self)
    }
})


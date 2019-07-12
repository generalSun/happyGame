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

    requestEnterRoom:function(roomId,callBack){
        var self = this;
        var data = {
            account: G.selfUserData.getUserAccount(),
            sign: G.selfUserData.getUserSign(),
            roomId: roomId
        }
        G.httpManage.sendRequest(Constants.HTTP_NET_EVENT.ENTER_PRIVATE_ROOM,data,function(event){
            console.log('ENTER_PRIVATE_ROOM :',event)
            if (event.errcode !== 0) {
                if(event.errcode == -1){
                    G.globalLoading.setLoadingVisible(true,'正在进入房间...')
                    setTimeout(function(){
                        self.requestEnterRoom(roomId,callBack);
                    },5000);
                }else{
                    var content = "房间["+ roomId +"]不存在，请重新输入!";
                    if(event.errcode == 1){
                        content = "房间["+ roomId + "]已满!";
                    }else if(event.errcode == 2){
                        content = "已在房间中!";
                    }
                    G.msgBoxMgr.showMsgBox({content:content})
                    if(callBack){
                        callBack(event)
                    }
                }
            }else {
                G.selfUserData.setUserRoomID(event.roomId)
                G.globalSocket.setIp(event.ip)
                G.globalSocket.setPort(event.port)
                G.globalSocket.connectSocket(event)
            }
        },function(msg){
            console.log('ENTER_PRIVATE_ROOM :'+msg.errmsg)
        },G.httpManage.hallServerUrl,'正在进入房间...');
    },

    requestCreatorRoom:function(conf,message){
        var self = this;
        var data = {
            account: G.selfUserData.getUserAccount(),
            sign: G.selfUserData.getUserSign(),
            conf: JSON.stringify(conf)
        }
        G.httpManage.sendRequest(Constants.HTTP_NET_EVENT.CREATE_PRIVATE_ROOM, data, function(event){
            console.log('CREATE_PRIVATE_ROOM :',event)
            if (event.errcode !== 0) {
                if (event.errcode == 2222) {
                    G.msgBoxMgr.showMsgBox({content:'钻石不足，创建房间失败!'})
                }else {
                    G.msgBoxMgr.showMsgBox({content:'创建房间失败,错误码:'+ event.errcode})
                }
            }else {
                G.selfUserData.setUserRoomID(event.roomId)
                G.globalSocket.setIp(event.ip)
                G.globalSocket.setPort(event.port)
                G.globalSocket.connectSocket(event)
            }
        },function(msg){
            console.log('CREATE_PRIVATE_ROOM :'+msg.errmsg)
        },G.httpManage.hallServerUrl,message || '正在创建房间...');
    },

    onDestroy(){
        var self = this
        G.eventManager.cancelEvent(Constants.SOCKET_EVENT_s2c.LOGIN_RESULT,self.login_result,self)
        G.eventManager.cancelEvent(Constants.SOCKET_EVENT_s2c.LOGIN_FINISHED,self.login_finished,self)
    }
})


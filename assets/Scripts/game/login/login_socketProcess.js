var Constants = require('../../../config/Constants')
cc.Class({
    init:function(handler){
        var self = this
        self.m_handler = handler
    },
    
    requestLogin:function(){
        var self = this;
        var onLogin = function(ret){
            if(!ret.userId){
                //jump to register user info.
                self.m_handler.displayInterface('fillName')
            }else{
                console.log(ret);
                G.selfUserData.setUserAccount(ret.account)
                G.selfUserData.setUserId(ret.userId)
                G.selfUserData.setUserName(ret.name)
                G.selfUserData.setUserLV(ret.lv)
                G.selfUserData.setUserExp(ret.exp)
                G.selfUserData.setUserCoins(ret.coins)
                G.selfUserData.setUserGems(ret.gems)
                G.selfUserData.setUserSex(ret.sex)
                G.selfUserData.setUserIP(ret.ip)
                G.selfUserData.setUserRoomID(ret.roomId)
                G.gameInfo.isLogined = true
                G.gameInfo.isInGame = false
                G.httpManage.sendRequest(Constants.HTTP_NET_EVENT.GET_GAMELIST,
                    {account:ret.account,sign:G.selfUserData.getUserSign()},function(event){
                        if(event.errcode == 0){
                            console.log('请求游戏列表！')
                            console.log(event)
                            G.gameListInfo = event.data
                            self.m_handler.changeScene()
                        }
                    })
            }
        };
        var account =  G.selfUserData.getUserAccount()
        var sign = G.selfUserData.getUserSign()
        G.httpManage.sendRequest(Constants.HTTP_NET_EVENT.HALLLOGIN,{account:account,sign:sign},onLogin);
    },

    createAvater(data){
        var self = this
        G.httpManage.sendRequest(Constants.HTTP_NET_EVENT.CREATE_USER,data,function(event){
            if(event.errcode == 0){
                console.log('角色创建成功！')
                self.requestLogin()
            }
        },null,null,'准备进入游戏...')
    },

    guestLogin(){
        var self = this
        G.httpManage.sendRequest(Constants.HTTP_NET_EVENT.GUEST_LOGIN,{account:G.tools.getUdid()},function(event){
            if(event.errcode == 0){
                console.log('游客登陆成功！')
                G.httpManage.HTTPROOTURL = "http://" + event.halladdr
                G.selfUserData.setUserSign(event.sign)
                G.selfUserData.setUserPassword(event.sign)
                G.selfUserData.setUserAccount(event.account)
                self.requestLogin()
            }
        },null,null,'游客登陆...')  
    },

    register(account,password){
        var self = this
        G.httpManage.sendRequest(Constants.HTTP_NET_EVENT.REGISTER,{account:account,password:password},function(event){
            if(event.errcode == 0){
                console.log('注册成功！')
                G.httpManage.sendRequest(Constants.HTTP_NET_EVENT.LOGIN,{account:account,password:password},function(event){
                    if(event.errcode == 0){
                        console.log('登陆成功！')
                        G.httpManage.HTTPROOTURL = "http://" + event.halladdr
                        G.selfUserData.setUserSign(event.sign)
                        G.selfUserData.setUserPassword(password)
                        G.selfUserData.setUserAccount(event.account)
                        self.requestLogin()
                    }else{
                        G.msgBoxMgr.showMsgBox({content:event.errmsg})
                    }
                }) 
            }else{
                G.msgBoxMgr.showMsgBox({content:event.errmsg})
            }
        },null,null,'账号注册...')  
    },

    login(account,password){
        var self = this
        G.httpManage.sendRequest(Constants.HTTP_NET_EVENT.LOGIN,{account:account,password:password},function(event){
            if(event.errcode == 0){
                console.log('登陆成功！')
                G.httpManage.HTTPROOTURL = "http://" + event.halladdr
                G.selfUserData.setUserSign(event.sign)
                G.selfUserData.setUserPassword(password)
                G.selfUserData.setUserAccount(event.account)
                self.requestLogin()
            }else{
                G.msgBoxMgr.showMsgBox({content:event.errmsg})
            }
        },null,null,'账号登陆...')  
    },

    onDestroy(){
        
    }
})

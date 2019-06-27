
var constants = require('./../../config/Constants')
cc.Class({
    extends: cc.Component,

    properties: {
        fillNameNode:{
            type:cc.Node,
            default:null
        },
        loginNode:{
            type:cc.Node,
            default:null
        },
        interfaceNode:{
            type:cc.Node,
            default:null
        },
    },

    onLoad(){
        this.isAgress = true
        this.fillNameNode.active = false
        this.interfaceNode.active = false
    },

    onDestroy(){
        var self = this
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa   login has destory')
    },

    //更换场景
    changeScene(){
        G.gameInfo.isLogined = true
        G.gameInfo.isInGame = false
        if(cc.director.getScene().name != 'HallScene'){
            cc.director.loadScene('HallScene')
        }
    },

    //微信登陆成功回调
    wxLoginSuccessCallBack (msg) {
        var data = {
            code:msg.code
        }
        
    },

    //微信登陆失败回调
    wxLoginFailCallBack (msg) {
        
    },

    //显示界面
    displayInterface : function(name,identifier){
        var self = this
        if(name=='fillName'){
            self.fillNameNode.active = true
            self.interfaceNode.active = false
            self.loginNode.active = false
        }else if(name=='interface'){
            self.fillNameNode.active = false
            self.interfaceNode.active = true
            self.loginNode.active = true
        }else if(name=='login'){
            self.fillNameNode.active = false
            self.interfaceNode.active = false
            self.loginNode.active = true
        }
        
        if(!identifier)return;
        var title = cc.find('bg/title',self.interfaceNode)
        if(!title)return;
        var label = title.getComponent(cc.Label)
        if(!label)return;
        var buttonDesc = cc.find('bg/intoGameButton/Background/Label',self.interfaceNode)
        if(!buttonDesc)return;
        var desc = buttonDesc.getComponent(cc.Label)
        if(!desc)return;
        if(identifier == 'login'){
            label.string = '登陆界面'
            desc.string = '登陆游戏'
            desc.customData = 1
        }else if(identifier == 'register'){
            label.string = '注册界面'
            desc.string = '注册游戏'
            desc.customData = 0
        }
        var phone = cc.find('bg/accountName/nameEditBox',self.interfaceNode)
        if(!phone)return;
        var code = cc.find('bg/authenticationCode/codeEditBox',self.interfaceNode)
        if(!code)return;
        phone.getComponent(cc.EditBox).string = ''
        code.getComponent(cc.EditBox).string = ''
    },
    /*
    ---------------------------------------------------------------------------------------------------------

                                            点击回调

    ----------------------------------------------------------------------------------------------------------
    */
    //创建角色
    createAvatar(event,customEventData){
        var self = this
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        var nameEditBox = self.fillNameNode.getChildByName('nameEditBox')
        if(!nameEditBox){
            console.log('no nameEditBox')
            return
        }
        var editBox = nameEditBox.getComponent(cc.EditBox)
        if(!editBox){
            console.log('no editBox')
            return
        }
        var str = editBox.string
        if(str.length < 2 || str.length > 12){
            console.log('角色名长度为2~12')
            return
        }
        var data = {
            account:G.selfUserData.getUserAccount(),
            sign:G.selfUserData.getUserSign(),
            name:str
        };
        G.httpManage.sendRequest(constants.HTTP_NET_EVENT.CREATE_USER,data,function(event){
            if(event.errcode == 0){
                console.log('角色创建成功！')
                self.login()
            }
        },null,null,'准备进入游戏...')
    },

    //检查是否同意用户使用协议
    check(event, customEventData){
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        this.isAgress = false
        if(event.isChecked){
            this.isAgress = true
        }
    },

    //关闭按钮
    close(event, customEventData){
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        var face = cc.find('Canvas/'+customEventData)
        if(face){
            face.active = false
        }
    },

    //设置按钮
    set(event, customEventData){
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        var self = this;
        var setNode = this.node.getChildByName('setNode')
        if(setNode){
            setNode.active = true;
            return;
        }
        console.log('thert is not the node set')
        cc.loader.loadRes('prefabs/setNode', cc.Prefab, function(err, prefab) {
            if (err) {
                cc.log(err.message || err);
                return;
            }
            var node = cc.instantiate(prefab);
            node.active = true;
            self.node.addChild(node);
        });
    },

    //随机取名
    randName(event,customEventData){
        var self = this
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        var nameEditBox = self.fillNameNode.getChildByName('nameEditBox')
        if(!nameEditBox){
            console.log('no nameEditBox')
            return
        }
        var editBox = nameEditBox.getComponent(cc.EditBox)
        if(!editBox){
            console.log('no editBox')
            return
        }
        var name = G.tools.getRandName()
        editBox.string = name
    },

    //进入登陆界面
    loginInterface (event, customEventData) {
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        if(!this.isAgress){
            console.log('请先同意用户使用协议！')
            return;
        }
        this.displayInterface('interface','login')
    },

    //游客登陆
    guestLogin (event, customEventData) {
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        if(!self.isAgress){
            console.log('请先同意用户使用协议！')
            return;
        }
        
        G.httpManage.sendRequest(constants.HTTP_NET_EVENT.GUEST_LOGIN,{account:G.tools.getUdid()},function(event){
            if(event.errcode == 0){
                console.log('游客登陆成功！')
                G.httpManage.HTTPROOTURL = "http://" + event.halladdr
                G.selfUserData.setUserSign(event.sign)
                G.selfUserData.setUserPassword(event.sign)
                G.selfUserData.setUserAccount(event.account)
                self.login()
            }
        },null,null,'游客登陆...')  
    },

    login:function(){
        var self = this;
        var onLogin = function(ret){
            if(!ret.userId){
                //jump to register user info.
                self.displayInterface('fillName')
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
                G.httpManage.sendRequest(constants.HTTP_NET_EVENT.GET_GAMELIST,
                    {account:ret.account,sign:G.selfUserData.getUserSign()},function(event){
                        if(event.errcode == 0){
                            console.log('请求游戏列表！')
                            console.log(event)
                            G.gameListInfo = event.data
                            self.changeScene()
                        }
                    })
            }
        };
        var account =  G.selfUserData.getUserAccount()
        var sign = G.selfUserData.getUserSign()
        G.httpManage.sendRequest(constants.HTTP_NET_EVENT.HALLLOGIN,{account:account,sign:sign},onLogin);
    },

    //进入注册界面
    registerInterface (event, customEventData) {
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        if(!this.isAgress){
            console.log('请先同意用户使用协议！')
            return;
        }
        this.displayInterface('interface','register')
    },

    //注册、登陆
    operate (event, customEventData) {
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        var buttonDesc = cc.find('Background/Label',node)
        if(!buttonDesc)return;
        var phone = cc.find('bg/accountName/nameEditBox',self.interfaceNode)
        if(!phone)return;
        var code = cc.find('bg/authenticationCode/codeEditBox',self.interfaceNode)
        if(!code)return;
        var customData = buttonDesc.getComponent(cc.Label).customData
        var phoneNum = phone.getComponent(cc.EditBox).string
        var codeNum = code.getComponent(cc.EditBox).string
        if(!G.tools.isPoneAvailable(phoneNum)){
            G.msgBoxMgr.showMsgBox({content:'手机号码输入有误，请检查手机号码！'})
            return;
        }
        var account = phoneNum
        var password = codeNum
        if(customData == 0){//0注册  1登陆
            G.httpManage.sendRequest(constants.HTTP_NET_EVENT.REGISTER,{account:account,password:password},function(event){
                if(event.errcode == 0){
                    console.log('注册成功！')
                    G.httpManage.sendRequest(constants.HTTP_NET_EVENT.LOGIN,{account:account,password:password},function(event){
                        if(event.errcode == 0){
                            console.log('登陆成功！')
                            G.httpManage.HTTPROOTURL = "http://" + event.halladdr
                            G.selfUserData.setUserSign(event.sign)
                            G.selfUserData.setUserPassword(password)
                            G.selfUserData.setUserAccount(event.account)
                            self.login()
                        }else{
                            G.msgBoxMgr.showMsgBox({content:'无效的账号!'})
                        }
                    }) 
                }else{
                    G.msgBoxMgr.showMsgBox({content:'账号已经被使用!'})
                }
            },null,null,'账号注册...')       
        }else if(customData == 1){
            G.httpManage.sendRequest(constants.HTTP_NET_EVENT.LOGIN,{account:account,password:password},function(event){
                if(event.errcode == 0){
                    console.log('登陆成功！')
                    G.httpManage.HTTPROOTURL = "http://" + event.halladdr
                    G.selfUserData.setUserSign(event.sign)
                    G.selfUserData.setUserPassword(password)
                    G.selfUserData.setUserAccount(event.account)
                    self.login()
                }else{
                    G.msgBoxMgr.showMsgBox({content:'账号错误，登陆失败！'})
                }
            },null,null,'账号登陆...')    
        }
    },

    //获取验证码
    getAuthenticationCode(event, customEventData){
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        var phone = cc.find('bg/accountName/nameEditBox',this.interfaceNode)
        if(!phone)return;
        var phoneNum = phone.getComponent(cc.EditBox).string
        if(!G.tools.isPoneAvailable(phoneNum))return;
        G.globalSocket.send(G.SocketCmd.GETSMS,{mobile:phoneNum});   
    },

    //第三方登陆
    thirtyLogin (event, customEventData) {
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        if(!this.isAgress){
            console.log('请先同意用户使用协议！')
            return;
        }
        G.javaManage.WxLogin()
    },
});

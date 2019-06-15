
var constants = require('./config/Constants')
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
        this.registerEvents()
    },

    //注册事件
    registerEvents(){
        var self = this
        self.node.on(constants.EVENTNAME.Login,self.connectSuccess.bind(self))
        self.msgProcessor = {
            [G.SocketCmd.LOGIN]:self.responseLogin.bind(self)
        }
    },

    onDestroy(){
        this.node.off(constants.EVENTNAME.Login)
    },

    connectSuccess(){
        var self = this
        G.globalSocket.setMsgHandler(self)
        var userInfo = G.ioUtil.get(constants.LOCALLSTORAGEKEY.USERINFO)
        if(userInfo){
            G.globalSocket.login({
                loginType:'account',
                token:userInfo.token,
                username:userInfo.username,
                password:userInfo.password
            });   
        }
    },

    //更换场景
    changeScene(){
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
        if(name=='fillName'){
            this.fillNameNode.active = true
            this.interfaceNode.active = false
            this.loginNode.active = false
        }else if(name=='interface'){
            this.fillNameNode.active = false
            this.interfaceNode.active = true
            this.loginNode.active = true
        }else if(name=='login'){
            this.fillNameNode.active = false
            this.interfaceNode.active = false
            this.loginNode.active = true
        }
        
        if(!identifier)return;
        var title = cc.find('bg/title',this.interfaceNode)
        if(!title)return;
        var label = title.getComponent(cc.Label)
        if(!label)return;
        var buttonDesc = cc.find('bg/intoGameButton/Background/Label',this.interfaceNode)
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
    },

     /*
    ---------------------------------------------------------------------------------------------------------

                                            服务器回调

    ----------------------------------------------------------------------------------------------------------
    */
    responseLogin(event){
        var self = this
    },
    /*
    ---------------------------------------------------------------------------------------------------------

                                            点击回调

    ----------------------------------------------------------------------------------------------------------
    */
    //创建角色
    createAvatar(event,customEventData){
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        var nameEditBox = this.fillNameNode.getChildByName('nameEditBox')
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
        if(str.length < 3 || str.length > 12){
            console.log('角色名长度为3~12')
            return
        }
        G.globalSocket.getPlayer().reqCreateAvatar(1, str);
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

    //创建角色
    randName(event,customEventData){
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        var nameEditBox = this.fillNameNode.getChildByName('nameEditBox')
        if(!nameEditBox){
            console.log('no nameEditBox')
            return
        }
        var editBox = nameEditBox.getComponent(cc.EditBox)
        if(!editBox){
            console.log('no editBox')
            return
        }
        var name = this.getRandName()
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
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        if(!this.isAgress){
            console.log('请先同意用户使用协议！')
            return;
        }
        G.globalSocket.login({});    
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
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        var buttonDesc = cc.find('Background/Label',node)
        if(!buttonDesc)return;
        var phone = cc.find('bg/accountName/nameEditBox',this.interfaceNode)
        if(!phone)return;
        var code = cc.find('bg/authenticationCode/codeEditBox',this.interfaceNode)
        if(!code)return;
        var customData = buttonDesc.getComponent(cc.Label).customData
        var phoneNum = phone.getComponent(cc.EditBox).string
        var codeNum = code.getComponent(cc.EditBox).string
        if(!G.tools.isPoneAvailable(phoneNum))return;
        if(customData == 0){//0注册  1登陆
            G.globalSocket.register({mobile:phoneNum,password:codeNum});         
        }else if(customData == 1){
            G.globalSocket.login({mobile:phoneNum,password:codeNum});      
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

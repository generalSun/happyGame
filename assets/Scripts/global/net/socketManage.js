var constants = require('./../../config/Constants')
var words = require('./../../config/words')
cc.Class({
    extends:cc.Component,

    properties:{
        maxReConnectTime:4
    },

    onLoad:function(){
        cc.game.addPersistRootNode(this.node)
        this.m_connectFlag = false                          //socket连接是否成功
        this.m_reConnectTime = 0                            //重连次数
        this.m_loginUserIndex = null;                       //当前登录的玩家index
        this.m_msgHandler = this;                           //消息处理句柄                    
        this.m_msgList = {};                                //消息列表
    	this.m_serverConfig = {};                           //服务器配置
        this.registerEvents()
        this.listenEvents()
    },

    setMsgHandler(handler){
        this.m_msgHandler = handler
    },

    //拉取服务端配置
    requestServerConfig (success,error) {
    	var self = this;
        var gameConfig = G.ioUtil.get(constants.LOCALLSTORAGEKEY.GAMECONFIG)
        if(!gameConfig){
            gameConfig = {
                serverType:"dev"
            }
        }
        G.httpManage.httpGet(constants.SERVERCONFIGURL[gameConfig.serverType], function (serverConfig) {
    		self.m_serverConfig = serverConfig[gameConfig.serverType];
            console.log("拉取服务端配置成功");
            G.tools._debug(self.m_serverConfig);
            self.m_serverConfig.serverType = gameConfig.serverType
            G.ioUtil.set(constants.LOCALLSTORAGEKEY.GAMECONFIG,self.m_serverConfig)
            if(success){
                success()
            }
        },function(){
            console.log("拉取服务端配置失败");
            if(error){
                error()
            }
        });
    },

    connectSocket () {
        var self = this;
        console.log("开始连接socket");
        if(self.m_serverConfig.length <= 0){
            console.log("没有服务器配置");
            return
        }
        G.globalLoading.setLoadingVisible(true)
        var self = this;
        pomelo.init({
            host: self.m_serverConfig.Server.host,
            port: self.m_serverConfig.Server.port,
            log: true
        }, function () {
            pomelo.request('gate.gateHandler.queryEntry', {}, function (data) {
                console.log("获取分配的服务端ip和port");
                G.tools._debug(data);
                self.m_connectFlag = true
                self.activeDisconnect()
                if (data.code !== G.Code.OK) {
                    cc.log(data.msg);
                    return
                }
                console.log("开始连接目标服务器");
                pomelo.init({
                    host: data.host,
                    port: data.port,
                    log: true
                }, function () {
                    console.log("连接目标服务器成功");
                    G.globalLoading.setLoadingVisible(false)
                    self.socketConnected();
                })
            })
        });
    },

    //socket连接成功
    socketConnected () {
        this.m_connectFlag = true
        this.m_reConnectTime = 0;
        if(this.m_msgHandler && this.m_msgHandler.socketConnected){
            this.m_msgHandler.socketConnected()
        }
    },

    listenEvents(){
        this.listen('onSocketMsg')
        this.listen('heartbeat timeout')
        this.listen('io-error')
        this.listen('close')
    },

    registerEvents(){
        var self = this
        this.msgProcessor = {
            ['onSocketMsg']:self.onSocketMsg.bind(self),
            ['heartbeat timeout']:self.heartbeatTimeout.bind(self),
            ['io-error']:self.io_error.bind(self),
            ['close']:self.close.bind(self),
        }
    },

    //收到推送消息
    onSocketMsg(data){
        var self = this;
        console.log("SSSSSSSSSSSSSSSSSSSSSSS socketMgr 收到推送消息");
        console.log(JSON.stringify(data.res));
        var groupName = data.groupName;
        switch (groupName) {
            case G.MsgGroupName.HALL:
                var curScene = cc.director.getScene();
                if (curScene.getName() == G.SceneNameMap.SNM_HALL) {
                    if(self.m_msgHandler && self.m_msgHandler.onSocketMsg){
                        self.m_msgHandler.onSocketMsg(data)
                    }
                }
                break;
            default:
                if (G.Room) {
                    G.Room.socketMsgGet(data);
                } else {
                    self.m_msgList[groupName] = self.m_msgList[groupName] || [];
                    self.m_msgList[groupName].push(data);
                }
        }
    },

    //socket连接心跳超时
    heartbeatTimeout(event){
        // G.tools._debug(event);
        console.log('连接超时！')
        var self = this
        self.m_connectFlag = false
        G.globalLoading.setLoadingVisible(true);
        console.log("SSSSSSSSSSSSSSSSSSSSSSS 网络连接超时，开始重连");
        self.connectSocket();
    },

    //socket连接失败
    io_error(event){
        // G.tools._debug(event);
        console.log('连接出错！')
        var self = this;
        self.m_connectFlag = false
        self.m_reConnectTime++;
        console.log("SSSSSSSSSSSSSSSSSSSSSSS 重连第%d次失败", self.m_reConnectTime);
        if (self.m_reConnectTime >= self.maxReConnectTime) {
            console.log("SSSSSSSSSSSSSSSSSSSSSSS 网络断开，稍后再试");
            self.m_reConnectTime = 0;
            G.globalLoading.setLoadingVisible(false);
            G.msgBoxMgr.showMsgBox({content: words.SocketRecFaildMsg, clickEventCallBack: function () {
                G.globalLoading.setLoadingVisible(true);
                self.connectSocket();
            }});
        } else {
            self.connectSocket();
        }
    },

    close(event){
        // G.tools._debug(event);
        console.log('连接关闭！')
        var self = this
        self.m_connectFlag = false
    },

    activeDisconnect(){
        if(this.connectFlag){
            pomelo.disconnect()
        }
    },

    send(cmd,params){
        var self = this
        if(!self.m_connectFlag)return
        console.log('send(cmd,params):'+cmd)
        params = params || {};
        params.socketCmd = cmd;
        var msg = params//JSON.stringify(params)
        var hand = self.m_msgHandler
        pomelo.request('connector.entryHandler.socketMsg', msg, function(data){
            if(hand && hand.msgProcessor){
                if(hand.msgProcessor[cmd]){
                    hand.msgProcessor[cmd](data)
                }
            }
        })
    },

    listen(route){
        var self = this
        var hand = self.m_msgHandler
        pomelo.on(route, function(data){
            if(hand && hand.msgProcessor){
                if(hand.msgProcessor[route]){
                    hand.msgProcessor[route](data)
                }
            }
        })
    },

    notify(route,msg){
        var self = this
        if(!self.m_connectFlag)return
        pomelo.notify(route, msg)
    },

    //根据groupName获取消息
    getMsgDataByGroup (groupName) {
        var self = this
        var resultMsgList = self.m_msgList[groupName] || [];
        self.m_msgList[groupName] = [];
        
        return resultMsgList;
    },

    //删除groupName的所有消息
    delMsgDataByGroup (groupName) {
        var self = this
        delete(self.m_msgList[groupName]);
    },

    //登录
    login (args) {
        var self = this
        var params = {
            mobile:args.mobile || '',
            password:args.password || '',
            device:cc.sys.platform
        }
        G.tools._debug(params);
        self.send(G.SocketCmd.LOGIN, params);
    },
});
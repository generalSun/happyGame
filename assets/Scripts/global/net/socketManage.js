var constants = require('./../../config/Constants')
var words = require('./../../config/words')
cc.Class({
    extends:cc.Component,

    properties:{
        maxReConnectTime:4,
        ip: {
            default: '',
            type: cc.String
        },

        port: {
            default: 0,
            type: cc.Integer
        }
    },

    onLoad:function(){
        var self = this
        cc.game.addPersistRootNode(self.node)
        self.m_connectFlag = false                          //socket连接是否成功
        self.m_msgHandler = new Array();                           //消息处理句柄                    
        self.m_msgList = {};                                //消息列表
        self.m_socket = null
    },

    addMsgHandler(handler){
        var self = this
        self.m_msgHandler.push(handler)
    },

    removeMsgHandlerByName(name){
        var self = this
        for(var i = self.m_msgHandler.length - 1; i >= 0; i--){
            var handler = self.m_msgHandler[i]
            if(handler.name == name){
                self.m_msgHandler.splice(i,1)
                return
            }
        }
    },

    removeAllMsgHandlerByNames(names){
        var self = this
        for(var i = 0; i < names.length; i++){
            var name = names[i]
            self.removeMsgHandlerByName(name)
        }
    },

    removeAllMsgHandler(){
        var self = this
        for(var i = self.m_msgHandler.length - 1; i >= 0; i--){
            self.m_msgHandler.splice(i,1)
        }
    },

    msgHandlerDealMsg(key,value){
        if(!key)return;
        var self = this
        for(var i = 0; i < self.m_msgHandler.length; i++){
            var handler = self.m_msgHandler[i]
            if(handler[key]){
                handler[key](value)
            }
        }
    },

    setIp(ip){
        var self = this
        self.ip = ip
    },

    setPort(port){
        var self = this
        self.port = port
    },

    connectSocket (data) {
        var self = this;
        var opts = {
            'force new connection': true,
            'transports':['websocket', 'polling'],
            'reconnection':true,
            'reconnectionDelay':1000,
            'reconnectionDelayMax':3000,
            'timeout':2000
        }
        var url = 'http://' + self.ip + ':' + self.port
        self.m_socket = io.connect(url,opts);
        G.globalLoading.setLoadingVisible(true,'正在进入房间...')
        self.m_socket.on('connect',function(){
            console.log('connect');
            G.globalLoading.setLoadingVisible(false)
            self.m_connectFlag = true
            if(self.socketConnected){
                self.socketConnected()
            }
            self.msgHandlerDealMsg('connectSuccess',data)
        });

        self.m_socket.on('reconnecting',function(num){
            console.log('reconnecting');
            if(num > self.maxReConnectTime){
                G.globalLoading.setLoadingVisible(false)
                self.close()
                G.msgBoxMgr.showMsgBox({
                    content:'网络连接超时，请检查网络是否断开！点击确认将重新连接，取消将退出游戏！',
                    sureClickEventCallBack:function(){
                        self.connectSocket()
                    },
                    cancelClickEventCallBack:function(){
                        cc.game.end();//退出游戏
                    }
                })
            }
        });
        
        self.m_socket.on('reconnect',function(num){
            console.log("reconnect");
            G.globalLoading.setLoadingVisible(false)
            self.m_connectFlag = true
            if(self.socketReconnected){
                self.socketReconnected()
            }
            self.msgHandlerDealMsg('connectSuccess')
        });
        
        self.m_socket.on('connect_error',function (object){
            console.log('connect_error');
        });

        self.m_socket.on('connect_timeout',function (){
            console.log('connect_timeout');
        });

        self.m_socket.on('reconnect_attempt',function (){
            console.log('reconnect_attempt');
        });

        self.m_socket.on('reconnect_error',function (object){
            console.log('reconnect_error');
        });

        self.m_socket.on('reconnect_failed',function (){
            console.log('reconnect_failed');
        });
    },

    listenMsg(event){
        var self = this
        if(self.m_socket){
            self.m_socket.on(event,function(data){
                self.msgHandlerDealMsg(event,data)
            })
        }
    },
    
    send: function (event,data) {
        var self = this
        if(!self.m_connectFlag || !self.m_socket){
            console.log('未连接成功')
            return
        }
        if(data != null && (typeof(data) == "object")){
            data = JSON.stringify(data);
            //console.log(data);              
        }
        if(data == null){
            data = '';
        }
        self.m_socket.emit(event,data);  
    },

    close:function(){
        var self = this
        console.log('close');
        if(self.m_socket){
            self.m_socket.disconnect();
        }
        self.m_socket = null;
        self.m_connectFlag = false
    },

    onDestroy(){
        var self = this
        self.removeAllMsgHandler()
        self.unscheduleAllCallbacks()
        self.close()
    }
});
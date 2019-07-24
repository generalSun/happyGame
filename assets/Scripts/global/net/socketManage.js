var Constants = require('./../../config/Constants')
const TAG = "socketManage.js";
cc.Class({
    extends:cc.Component,

    properties:{
        maxReConnectTime:4,
        heartbeatSpace:3
    },

    init(){
        var self = this
        cc.game.addPersistRootNode(self.node)
        self.m_socket = null
        self.m_heartbeatTimeId = null
        self.m_closeTimeId = null
        self.m_heartbeatTime = 0
        self.m_heartbeatTimes = 0
        self.m_dispatchMsgTimeId = null
        self.m_msgList = new Array()
        self.m_msgBlock = false
        self.m_serverUrl = "ws://192.168.0.102:9081"
    },

    setUrl(url){
        var self = this
        self.m_serverUrl = url
    },

    connectSocket (describle,reconnect) {
        describle = describle || '正在进入房间...'
        reconnect = reconnect || false
        var self = this;
        var url = self.m_serverUrl + "?userid=" + G.selfUserData.getUserId()
        var m_socket = new WebSocket(url);
        G.globalLoading.setLoadingVisible(true,describle)
        m_socket.onopen = function(){
            console.log(TAG,'connect success!');
            self.m_socket = m_socket
            self.m_heartbeatTimes = 0
            G.globalLoading.setLoadingVisible(false)
            // self.m_heartbeatTimeId = setInterval(()=>{
            //     self.ping();
            // }, self.heartbeatSpace*1000);
            self.m_dispatchMsgTimeId = setInterval(()=>{
                if(self.m_msgList.length > 0 && self.m_msgBlock == false){
                    var msg = self.m_msgList[0]
                    var name = msg.name
                    var data = msg.data
                    G.eventManager.emitEvent(name,data)
                    self.m_msgList.splice(0,1)
                }
            }, 100);
            if(reconnect){
                var info = G.selfUserData.getUserRoomInfo()
                if(info.playway){
                    var data = {
                        playway:info.playway,
                        extparams:info
                    }
                    console.log(TAG,'发送 reconnect',info)
                    G.globalSocket.send(Constants.SOCKET_EVENT_c2s.RECOVERY,data)
                }
            }
            G.eventManager.emitEvent(Constants.LOCALEVENT.CONNECT_SUCCES)
        };

        m_socket.onmessage = function(event){
            var data = JSON.parse(event.data)
            if(data != null && data.event != null){
                var info = {
                    name:data.event == 'command'?data.command:data.event,
                    data:data
                }
                console.log(TAG,'收到socket事件',info)
                if(info.name == Constants.SOCKET_EVENT_s2c.HEARTBEAT){
                    if (info.data.time == self.m_heartbeatTime && self.m_closeTimeId){
                        clearTimeout(self.m_closeTimeId);
                        self.m_closeTimeId = null;
                    }
                }else{
                    self.m_msgList.push(info)
                }
            }
        }

        m_socket.onclose = function(){
            G.globalLoading.setLoadingVisible(false)
            console.log(TAG,"onclose 准备重新连接！！！");
            self.close();
            self.m_heartbeatTimes = self.m_heartbeatTimes + 1
            if(self.m_heartbeatTimes <= self.maxReConnectTime){
                self.connectSocket('正在重连...',true)
            }else{
                G.msgBoxMgr.showMsgBox({
                    content:'网络连接关闭，请检查网络是否断开！点击确认将重新连接，取消将退出游戏！',
                    sureClickEventCallBack:function(){
                        self.connectSocket('正在重连...',true)
                    },
                    cancelClickEventCallBack:function(){
                        cc.game.end();//退出游戏
                    }
                })
            }
        }

        // m_socket.onerror = function(event){
        //     G.globalLoading.setLoadingVisible(false)
        //     console.log(TAG,"onerror", JSON.stringify(event));
        //     G.alterMgr.showMsgBox({content:'网络连接发生错误，请退出游戏重进!'})
        //     self.close();
        //     throw event;
        // }
    },

    setMsgBlock(block){
        var self = this
        self.m_msgBlock = block
    },
    
    send: function (command,data) {
        var self = this
        if(!self.m_socket){
            console.log(TAG,'send','未连接成功')
            return
        }
        if(data == null){
            data = {};
        }
        data.command = command
        data.userid = G.selfUserData.getUserId()
        data.orgi = G.selfUserData.getUserOrgi()
        data.token = G.selfUserData.getUserToken()
        console.log(TAG,'发送事件:',data);   
        self.m_socket.send(JSON.stringify(data));  
    },

    sendMsg: function (command,data) {
        var self = this
        if(data == null){
            data = {};
        }
        var msg = {
            data:data,
        } 
        self.send(command,msg);  
    },

    ping:function(){
        var self = this;
        if(!self.m_socket){
            console.log(TAG,'send','未连接成功')
            return
        }
        var data = {
            command:Constants.SOCKET_EVENT_c2s.HEARTBEAT
        }
        self.m_socket.send(JSON.stringify(data)); 

        // self.m_heartbeatTime = Date.now();
        // self.send(Constants.SOCKET_EVENT_c2s.HEARTBEAT, {time: self.m_heartbeatTime});
        // self.m_closeTimeId = setTimeout(()=>{
        //     self.m_closeTimeId = null;
        //     self.close();
        //     self.m_heartbeatTimes = self.m_heartbeatTimes + 1
        //     if(self.m_heartbeatTimes <= self.maxReConnectTime){
        //         self.connectSocket()
        //     }
        // }, self.heartbeatSpace*1000/2);
    },

    close:function(){
        var self = this
        console.log(TAG,'close');
        if(self.m_socket){
            self.m_socket.close();
        }
        if (self.m_heartbeatTimeId){
            clearInterval(self.m_heartbeatTimeId);
            self.m_heartbeatTimeId = null;
        }
        if (self.m_dispatchMsgTimeId){
            clearInterval(self.m_dispatchMsgTimeId);
            self.m_dispatchMsgTimeId = null;
        }
        if (self.m_closeTimeId){
            clearTimeout(self.m_closeTimeId);
            self.m_closeTimeId = null;
        }
        self.m_msgList.splice(0,self.m_msgList.length)
        self.m_socket = null;
        self.m_msgBlock = false
    },

    onDestroy(){
        var self = this
        self.unscheduleAllCallbacks()
        self.close()
    },
});
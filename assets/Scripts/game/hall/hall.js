var constants = require('./../../config/Constants')
cc.Class({
    extends: cc.Component,

    properties: {
        head:cc.Sprite,
        nickName:cc.Label,
        gold:cc.Label,
        creatRoomNode:cc.Node,
    },

    onLoad () {
        var self = this
        self.m_checkHasGame = false
        G.globalSocket.removeAllMsgHandler()
        G.globalSocket.addMsgHandler(self)

        self.creatRoomNode.active = false
        self.nickName.string = G.selfUserData.getUserName()
        self.gold.string = G.selfUserData.getUserCoins()
        var userid = G.selfUserData.getUserId()
        if(userid){
            G.httpManage.sendRequest(constants.NET_EVENT.BASE_INFO,{userid:userid},function(event){
                if(event.errcode == 0){
                    G.selfUserData.setUserName(event.name)
                    G.selfUserData.setUserSex(event.sex)
                    console.log(event)
                    if(event.headimgurl){
                        var url = G.httpManage.accountServerUrl + '/image?url=' + encodeURIComponent(event.headimgurl) + ".jpg";
                        cc.loader.load(url,function (err,tex) {
                            if(err){
                                console.log(err)
                                return
                            }
                            var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
                            self.head.node.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        });
                    }
                }
            },null,G.httpManage.accountServerUrl);
        }
    },

    onCreateRoomClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        self.creatRoomNode.active = true
        self.creatRoomNode.getComponent('createRoom').init(G.gameListInfo)
    },

    onJoinRoomClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
    },

    enterRoom:function(roomId,callback){
        var self = this;
        var data = {
            account: G.selfUserData.getUserAccount(),
            sign: G.selfUserData.getUserSign(),
            roomid: roomId
        }
        G.httpManage.sendRequest(constants.NET_EVENT.ENTER_PRIVATE_ROOM,data,function(event){
            console.log('ENTER_PRIVATE_ROOM :'+event)
            if (event.errcode !== 0) {
                if(event.errcode == -1){
                    G.globalLoading.setLoadingVisible(true,'正在进入房间...')
                    setTimeout(function(){
                        self.enterRoom(roomId,callback);
                    },5000);
                }else{
                    if(callback != null){
                        callback(event);
                    }
                }
            }else {
                if(callback != null){
                    callback(event);
                }
                G.globalSocket.setIp(event.ip)
                G.globalSocket.setPort(event.port)
                G.globalSocket.connectSocket(event)
            }
        },function(msg){
            console.log('ENTER_PRIVATE_ROOM :'+msg.errmsg)
        },null,'正在进入房间...');
    },

    connectSuccess(data){
        console.log('connectSuccess')
        var sd = {
            token:data.token,
            roomid:data.roomid,
            time:data.time,
            sign:data.sign,
        };
        G.globalSocket.send("login",sd)
        G.globalSocket.listenMsg("login_result")
        G.globalSocket.listenMsg("login_finished")
    },

    login_result(data){
        console.log('login_result')
        console.log(data);
        if(data.errcode === 0){
            var data = data.data;
            G.selfUserData.setUserRoomID(data.roomid)
            G.selfUserData.setUserRoomInfo(data)
        }
        else{
            console.log(data.errmsg);   
        }
    },
            
    login_finished(data){
        console.log('login_finished');
        var self = this
        self.changeScene()
    },

    //更换场景
    changeScene(){
        var info = G.selfUserData.getUserRoomInfo()
        if(!info)return;
        var type = info.conf.type
        var gameScene = type+'GameScene'
        if(cc.director.getScene().name != gameScene){
            cc.director.loadScene(gameScene)
        }
    },

    update(dt){
        var self = this
        var roomID = G.selfUserData.getUserRoomID()
        if(roomID && !self.m_checkHasGame){
            self.enterRoom(roomID);
            self.m_checkHasGame = true
        }else{
            self.m_checkHasGame = true
        }
    }
});
